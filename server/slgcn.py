"""
SL-GCN (Decoupled GCN) network used by the OpenHands INCLUDE checkpoint.

Adapted from AI4Bharat OpenHands (Apache-2.0):
  openhands/models/encoder/graph/decoupled_gcn.py
  openhands/models/encoder/graph/graph_utils.py
  openhands/models/decoder/fc.py
which in turn follow https://github.com/jackyjsy/CVPR21Chal-SLR.

Only the inference path is kept: DropGraph is a no-op in eval mode, so it is
dropped, and the graph config is a plain dict instead of an OmegaConf node.
Module and parameter names are unchanged so the released state_dict loads strictly.
"""

import numpy as np
import torch
import torch.nn as nn

# Graph over the 27 "mediapipe_holistic_minimal_27" points (from the checkpoint config).
INWARD_EDGES = [
    [2, 0], [1, 0], [0, 3], [0, 4], [3, 5], [4, 6], [5, 7], [6, 17],
    [7, 8], [7, 9], [9, 10], [7, 11], [11, 12], [7, 13], [13, 14], [7, 15], [15, 16],
    [17, 18], [17, 19], [19, 20], [17, 21], [21, 22], [17, 23], [23, 24], [17, 25], [25, 26],
]


def _edge2mat(link, num_node):
    A = np.zeros((num_node, num_node))
    for i, j in link:
        A[j, i] = 1
    return A


def _normalize_digraph(A):
    Dl = np.sum(A, 0)
    Dn = np.zeros_like(A)
    for i in range(A.shape[0]):
        if Dl[i] > 0:
            Dn[i, i] = Dl[i] ** (-1)
    return np.dot(A, Dn)


def spatial_graph(num_nodes, inward_edges):
    self_edges = [(i, i) for i in range(num_nodes)]
    outward_edges = [(j, i) for (i, j) in inward_edges]
    return np.stack((
        _edge2mat(self_edges, num_nodes),
        _normalize_digraph(_edge2mat(inward_edges, num_nodes)),
        _normalize_digraph(_edge2mat(outward_edges, num_nodes)),
    ))


class TCNUnit(nn.Module):
    def __init__(self, in_channels, out_channels, kernel_size=9, stride=1):
        super().__init__()
        pad = (kernel_size - 1) // 2
        self.conv = nn.Conv2d(in_channels, out_channels, kernel_size=(kernel_size, 1),
                              padding=(pad, 0), stride=(stride, 1))
        self.bn = nn.BatchNorm2d(out_channels)

    def forward(self, x):
        return self.bn(self.conv(x))


class DecoupledGCNUnit(nn.Module):
    def __init__(self, in_channels, out_channels, A, groups, num_points, num_subset=3):
        super().__init__()
        self.num_points = num_points
        self.out_channels = out_channels
        self.groups = groups
        self.num_subset = num_subset

        self.decoupled_A = nn.Parameter(
            torch.tensor(np.reshape(A, [3, 1, num_points, num_points]), dtype=torch.float32)
            .repeat(1, groups, 1, 1)
        )
        if in_channels != out_channels:
            self.down = nn.Sequential(nn.Conv2d(in_channels, out_channels, 1),
                                      nn.BatchNorm2d(out_channels))
        else:
            self.down = lambda x: x

        self.bn0 = nn.BatchNorm2d(out_channels * num_subset)
        self.bn = nn.BatchNorm2d(out_channels)
        self.relu = nn.ReLU()
        self.linear_weight = nn.Parameter(torch.zeros(in_channels, out_channels * num_subset))
        self.linear_bias = nn.Parameter(torch.zeros(1, out_channels * num_subset, 1, 1))
        self.eye_list = nn.Parameter(
            torch.stack([torch.eye(num_points) for _ in range(out_channels)]), requires_grad=False
        )

    def norm(self, A):
        b, c, h, w = A.size()
        A = A.view(c, self.num_points, self.num_points)
        D_list = torch.sum(A, 1).view(c, 1, self.num_points)
        D_12 = self.eye_list * (D_list + 0.001) ** (-1)
        return torch.bmm(A, D_12).view(b, c, h, w)

    def forward(self, x0):
        learn_adj = self.decoupled_A.repeat(1, self.out_channels // self.groups, 1, 1)
        normed_adj = torch.cat([self.norm(learn_adj[i:i + 1, ...]) for i in range(3)], 0)

        x = torch.einsum("nctw,cd->ndtw", (x0, self.linear_weight)).contiguous()
        x = self.bn0(x + self.linear_bias)
        n, kc, t, v = x.size()
        x = x.view(n, self.num_subset, kc // self.num_subset, t, v)
        x = torch.einsum("nkctv,kcvw->nctw", (x, normed_adj))

        x = self.bn(x)
        x += self.down(x0)
        return self.relu(x)


class DecoupledGCN_TCN_unit(nn.Module):
    def __init__(self, in_channels, out_channels, A, groups, num_points, stride=1, residual=True):
        super().__init__()
        num_joints = A.shape[-1]
        self.gcn1 = DecoupledGCNUnit(in_channels, out_channels, A, groups, num_points)
        self.tcn1 = TCNUnit(out_channels, out_channels, stride=stride)
        self.relu = nn.ReLU()
        self.A = nn.Parameter(
            torch.tensor(np.sum(np.reshape(A.astype(np.float32), [3, num_points, num_points]), axis=0)),
            requires_grad=False,
        )

        if not residual:
            self.residual = lambda x: 0
        elif in_channels == out_channels and stride == 1:
            self.residual = lambda x: x
        else:
            self.residual = TCNUnit(in_channels, out_channels, kernel_size=1, stride=stride)

        self.sigmoid = nn.Sigmoid()
        self.conv_ta = nn.Conv1d(out_channels, 1, 9, padding=4)
        ker_jpt = num_joints - 1 if not num_joints % 2 else num_joints
        self.conv_sa = nn.Conv1d(out_channels, 1, ker_jpt, padding=(ker_jpt - 1) // 2)
        self.fc1c = nn.Linear(out_channels, out_channels // 2)
        self.fc2c = nn.Linear(out_channels // 2, out_channels)

    def forward(self, x):
        y = self.gcn1(x)
        # spatial, temporal and channel attention
        y = y * self.sigmoid(self.conv_sa(y.mean(-2))).unsqueeze(-2) + y
        y = y * self.sigmoid(self.conv_ta(y.mean(-1))).unsqueeze(-1) + y
        se = self.sigmoid(self.fc2c(self.relu(self.fc1c(y.mean(-1).mean(-1)))))
        y = y * se.unsqueeze(-1).unsqueeze(-1) + y

        y = self.tcn1(y)
        return self.relu(y + self.residual(x))


class DecoupledGCN(nn.Module):
    def __init__(self, in_channels=2, num_points=27, inward_edges=INWARD_EDGES, groups=8,
                 n_out_features=256):
        super().__init__()
        A = spatial_graph(num_points, inward_edges)
        self.data_bn = nn.BatchNorm1d(in_channels * num_points)

        self.l1 = DecoupledGCN_TCN_unit(in_channels, 64, A, groups, num_points, residual=False)
        self.l2 = DecoupledGCN_TCN_unit(64, 64, A, groups, num_points)
        self.l3 = DecoupledGCN_TCN_unit(64, 64, A, groups, num_points)
        self.l4 = DecoupledGCN_TCN_unit(64, 64, A, groups, num_points)
        self.l5 = DecoupledGCN_TCN_unit(64, 128, A, groups, num_points, stride=2)
        self.l6 = DecoupledGCN_TCN_unit(128, 128, A, groups, num_points)
        self.l7 = DecoupledGCN_TCN_unit(128, 128, A, groups, num_points)
        self.l8 = DecoupledGCN_TCN_unit(128, 256, A, groups, num_points, stride=2)
        self.l9 = DecoupledGCN_TCN_unit(256, 256, A, groups, num_points)
        self.l10 = DecoupledGCN_TCN_unit(256, n_out_features, A, groups, num_points)

    def forward(self, x):
        N, C, T, V = x.size()
        x = x.permute(0, 3, 1, 2).contiguous().view(N, V * C, T)
        x = self.data_bn(x)
        x = x.view(N, V, C, T).permute(0, 2, 3, 1).contiguous()  # NVCT -> NCTV
        for layer in (self.l1, self.l2, self.l3, self.l4, self.l5,
                      self.l6, self.l7, self.l8, self.l9, self.l10):
            x = layer(x)
        return x.reshape(N, x.size(1), -1).mean(2)


class FC(nn.Module):
    def __init__(self, n_features, num_class):
        super().__init__()
        self.classifier = nn.Linear(n_features, num_class)

    def forward(self, x):
        return self.classifier(x)


class SLGCN(nn.Module):
    """OpenHands `decoupled-gcn` encoder + `fc` decoder."""

    def __init__(self, num_class, in_channels=2, num_points=27):
        super().__init__()
        self.encoder = DecoupledGCN(in_channels, num_points)
        self.decoder = FC(self.encoder.l10.tcn1.bn.num_features, num_class)

    def forward(self, x):
        return self.decoder(self.encoder(x))
