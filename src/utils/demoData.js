/**
 * Predefined sample signs and phrases for Learnable Demo Mode & Sign Library.
 * Prioritizes Indian Sign Language (ISL) across realistic daily, medical,
 * civic, educational, and numerical categories.
 * Includes localStorage persistence for user-created custom signs.
 */

export const DEMO_DOMAINS = [
  { id: 'all', name: 'All Scenarios', badge: 'Complete' },
  { id: 'alphabet_numbers', name: 'Alphabet & Numbers', badge: 'Basics' },
  { id: 'greetings', name: 'Greetings & Basics', badge: 'ISL Daily' },
  { id: 'healthcare', name: 'Hospital & Healthcare', badge: 'Triage' },
  { id: 'banking', name: 'Banking & Counters', badge: 'Public Desk' },
  { id: 'travel_daily', name: 'Travel & Daily Living', badge: 'Everyday' },
  { id: 'education', name: 'Classroom & School', badge: 'Learning' },
  { id: 'emergency', name: 'Emergency & Help', badge: 'Urgent' },
  { id: 'custom', name: 'Custom User Signs', badge: 'Created by You' },
];

export const INITIAL_DEMO_PHRASES = [
  // --- 1. ALPHABET & NUMBERS ---
  {
    id: 'num-1',
    domain: 'alphabet_numbers',
    text: 'Number 1 (One)',
    hindiText: 'संख्या १ (एक)',
    islGloss: 'NUMBER-ONE',
    simulatedConfidence: 0.98,
    durationMs: 1200,
    gestureDescription: 'Single index finger extended upright, other fingers curled into palm.',
    tags: ['Number', 'Basic'],
    isRecommended: false,
  },
  {
    id: 'num-2',
    domain: 'alphabet_numbers',
    text: 'Number 2 (Two)',
    hindiText: 'संख्या २ (दो)',
    islGloss: 'NUMBER-TWO',
    simulatedConfidence: 0.97,
    durationMs: 1200,
    gestureDescription: 'Index and middle fingers extended upward forming a V.',
    tags: ['Number', 'Basic'],
    isRecommended: false,
  },
  {
    id: 'num-3',
    domain: 'alphabet_numbers',
    text: 'Number 3 (Three)',
    hindiText: 'संख्या ३ (तीन)',
    islGloss: 'NUMBER-THREE',
    simulatedConfidence: 0.96,
    durationMs: 1200,
    gestureDescription: 'Thumb, index, and middle fingers extended simultaneously.',
    tags: ['Number', 'Basic'],
    isRecommended: false,
  },
  {
    id: 'num-4',
    domain: 'alphabet_numbers',
    text: 'Number 4 (Four)',
    hindiText: 'संख्या ४ (चार)',
    islGloss: 'NUMBER-FOUR',
    simulatedConfidence: 0.96,
    durationMs: 1200,
    gestureDescription: 'Four fingers upright with thumb folded across palm.',
    tags: ['Number', 'Basic'],
    isRecommended: false,
  },
  {
    id: 'num-5',
    domain: 'alphabet_numbers',
    text: 'Number 5 (Five)',
    hindiText: 'संख्या ५ (पांच)',
    islGloss: 'NUMBER-FIVE',
    simulatedConfidence: 0.99,
    durationMs: 1200,
    gestureDescription: 'All five fingers spread wide facing forward.',
    tags: ['Number', 'Basic'],
    isRecommended: false,
  },
  {
    id: 'alpha-ok',
    domain: 'alphabet_numbers',
    text: 'OK / All Good / Perfect',
    hindiText: 'ठीक है / सब बढ़िया',
    islGloss: 'OK / PERFECT / ALL-GOOD',
    simulatedConfidence: 0.97,
    durationMs: 1300,
    gestureDescription: 'Thumb and index fingertips touch forming an O circle; middle, ring, pinky upright.',
    tags: ['Symbol', 'Affirmative'],
    isRecommended: true,
  },
  {
    id: 'alpha-ily',
    domain: 'alphabet_numbers',
    text: 'I Love You / Respect',
    hindiText: 'सप्रेम / आदर',
    islGloss: 'LOVE / RESPECT / BLESSINGS',
    simulatedConfidence: 0.98,
    durationMs: 1400,
    gestureDescription: 'Thumb, index, and pinky extended; middle and ring fingers folded down.',
    tags: ['Symbol', 'Universal'],
    isRecommended: true,
  },

  // --- 2. GREETINGS & BASICS ---
  {
    id: 'g-1',
    domain: 'greetings',
    text: 'Hello, welcome to Learnable!',
    hindiText: 'नमस्ते, लर्नेबल में आपका स्वागत है!',
    islGloss: 'NAMASTE / WELCOME / HERE',
    simulatedConfidence: 0.96,
    durationMs: 1400,
    gestureDescription: 'Open palm facing forward raised to chest level with gentle nod.',
    tags: ['Greeting', 'Common'],
    isRecommended: true,
  },
  {
    id: 'g-2',
    domain: 'greetings',
    text: 'How are you doing today?',
    hindiText: 'आज आप कैसे हैं?',
    islGloss: 'YOU / TODAY / HOW / FEEL',
    simulatedConfidence: 0.93,
    durationMs: 1600,
    gestureDescription: 'Both palms cupped upward moving slightly forward with questioning expression.',
    tags: ['Question', 'Conversation'],
    isRecommended: false,
  },
  {
    id: 'g-3',
    domain: 'greetings',
    text: 'Thank you very much for your help.',
    hindiText: 'आपकी मदद के लिए बहुत-बहुत धन्यवाद।',
    islGloss: 'THANK-YOU / BIG / HELP / RECEIVED',
    simulatedConfidence: 0.97,
    durationMs: 1800,
    gestureDescription: 'Flat hand touching chin and extending forward towards the recipient.',
    tags: ['Courteous', 'Essential'],
    isRecommended: true,
  },
  {
    id: 'g-4',
    domain: 'greetings',
    text: 'Nice to meet you.',
    hindiText: 'आपसे मिलकर बहुत खुशी हुई।',
    islGloss: 'MEET / YOU / HAPPY',
    simulatedConfidence: 0.91,
    durationMs: 1500,
    gestureDescription: 'Index fingers from both hands brought together in front of the chest.',
    tags: ['Introduction'],
    isRecommended: false,
  },
  {
    id: 'g-5',
    domain: 'greetings',
    text: 'Good morning, have a wonderful day.',
    hindiText: 'सुप्रभात, आपका दिन शुभ हो।',
    islGloss: 'GOOD / MORNING / SUN-RISE / BLESSINGS',
    simulatedConfidence: 0.94,
    durationMs: 1600,
    gestureDescription: 'Hand rising upward in sunrise arc combined with gentle smile.',
    tags: ['Greeting', 'Morning'],
    isRecommended: false,
  },
  {
    id: 'g-6',
    domain: 'greetings',
    text: 'Yes, I understand completely.',
    hindiText: 'हाँ, मैं पूरी तरह समझ गया।',
    islGloss: 'YES / UNDERSTAND / CLEAR',
    simulatedConfidence: 0.95,
    durationMs: 1400,
    gestureDescription: 'Closed fist bobbing up and down in agreement motion.',
    tags: ['Affirmation'],
    isRecommended: false,
  },
  {
    id: 'g-7',
    domain: 'greetings',
    text: 'No, that is incorrect.',
    hindiText: 'नहीं, यह सही नहीं है।',
    islGloss: 'NO / NOT / WRONG',
    simulatedConfidence: 0.92,
    durationMs: 1400,
    gestureDescription: 'Index and middle fingers snapping against thumb in horizontal negative motion.',
    tags: ['Negation'],
    isRecommended: false,
  },

  // --- 3. HEALTHCARE & HOSPITALS ---
  {
    id: 'h-1',
    domain: 'healthcare',
    text: 'I need to see a doctor immediately.',
    hindiText: 'मुझे तुरंत डॉक्टर से मिलना है।',
    islGloss: 'DOCTOR / MEET / NEED / URGENT',
    simulatedConfidence: 0.95,
    durationMs: 1900,
    gestureDescription: 'Tapping wrist with two fingers (pulse sign) followed by forward urgent gesture.',
    tags: ['Hospital', 'Urgent'],
    isRecommended: true,
  },
  {
    id: 'h-2',
    domain: 'healthcare',
    text: 'Where is the pharmacy to buy these medicines?',
    hindiText: 'दवाइयां खरीदने के लिए फार्मेसी कहाँ है?',
    islGloss: 'MEDICINE / BUY / SHOP / WHERE',
    simulatedConfidence: 0.92,
    durationMs: 2100,
    gestureDescription: 'Grinding motion with fist in palm (mortar/pestle) followed by pointing inquiry.',
    tags: ['Pharmacy', 'Directions'],
    isRecommended: false,
  },
  {
    id: 'h-3',
    domain: 'healthcare',
    text: 'I have severe chest pain and dizziness.',
    hindiText: 'मुझे छाती में तेज़ दर्द और चक्कर आ रहे हैं।',
    islGloss: 'CHEST / PAIN / HEAVY / HEAD-SPIN',
    simulatedConfidence: 0.94,
    durationMs: 2200,
    gestureDescription: 'Clutched hand over chest with tense facial expression and circular head gesture.',
    tags: ['Triage', 'Symptom'],
    isRecommended: true,
  },
  {
    id: 'h-4',
    domain: 'healthcare',
    text: 'Do you have an Indian Sign Language interpreter here?',
    hindiText: 'क्या यहाँ कोई भारतीय सांकेतिक भाषा का दुभाषिया है?',
    islGloss: 'ISL / SIGN-TRANSLATOR / HERE / HAVE?',
    simulatedConfidence: 0.90,
    durationMs: 2300,
    gestureDescription: 'Hands alternating sign flutter followed by questioning point to room.',
    tags: ['Accessibility', 'Service'],
    isRecommended: false,
  },
  {
    id: 'h-5',
    domain: 'healthcare',
    text: 'I have diabetes and need insulin.',
    hindiText: 'मुझे मधुमेह है और इंसुलिन की आवश्यकता है।',
    islGloss: 'SUGAR / HIGH / INJECTION / NEED',
    simulatedConfidence: 0.93,
    durationMs: 1900,
    gestureDescription: 'Tapping upper arm with thumb plunger gesture (injection sign).',
    tags: ['Chronic', 'Medication'],
    isRecommended: false,
  },
  {
    id: 'h-6',
    domain: 'healthcare',
    text: 'Where is the wheelchair or stretcher?',
    hindiText: 'व्हीलचेयर या स्ट्रेचर कहाँ है?',
    islGloss: 'WHEELCHAIR / PATIENT-SEAT / WHERE',
    simulatedConfidence: 0.91,
    durationMs: 1800,
    gestureDescription: 'Circular hand rolling motion mimicking wheels followed by pointing inquiry.',
    tags: ['Mobility', 'Urgent'],
    isRecommended: false,
  },

  // --- 4. BANKING & PUBLIC SERVICES ---
  {
    id: 'b-1',
    domain: 'banking',
    text: 'I want to open a new savings bank account.',
    hindiText: 'मुझे एक नया बचत बैंक खाता खोलना है।',
    islGloss: 'BANK / NEW / ACCOUNT / OPEN / WANT',
    simulatedConfidence: 0.95,
    durationMs: 2000,
    gestureDescription: 'Counting bills thumb-to-fingers motion followed by book-opening gesture.',
    tags: ['Account', 'Desk'],
    isRecommended: true,
  },
  {
    id: 'b-2',
    domain: 'banking',
    text: 'Where is the cash deposit and withdrawal counter?',
    hindiText: 'नकद जमा और निकासी काउंटर कहाँ है?',
    islGloss: 'CASH / DEPOSIT / WITHDRAW / COUNTER / WHERE',
    simulatedConfidence: 0.93,
    durationMs: 2200,
    gestureDescription: 'Money sign followed by placing envelope motion and pointing towards counter line.',
    tags: ['Counter', 'Transaction'],
    isRecommended: false,
  },
  {
    id: 'b-3',
    domain: 'banking',
    text: 'Please help me update my passbook.',
    hindiText: 'कृपया मेरी पासबुक अपडेट करने में मदद करें।',
    islGloss: 'PASSBOOK / MACHINE / PRINT / UPDATE / PLEASE',
    simulatedConfidence: 0.91,
    durationMs: 1800,
    gestureDescription: 'Hands forming flat rectangle booklet followed by downward stamp gesture.',
    tags: ['Passbook', 'Help'],
    isRecommended: false,
  },
  {
    id: 'b-4',
    domain: 'banking',
    text: 'My ATM card is blocked or expired.',
    hindiText: 'मेरा एटीएम कार्ड ब्लॉक या समाप्त हो गया है।',
    islGloss: 'ATM-CARD / STOP / NOT-WORKING / EXPIRED',
    simulatedConfidence: 0.92,
    durationMs: 1900,
    gestureDescription: 'Swiping card motion through hand followed by flat cross-hand stop sign.',
    tags: ['ATM', 'Card'],
    isRecommended: false,
  },
  {
    id: 'b-5',
    domain: 'banking',
    text: 'What documents are required for KYC verification?',
    hindiText: 'केवाईसी सत्यापन के लिए कौन से दस्तावेज चाहिए?',
    islGloss: 'AADHAAR / PAN / DOCUMENT / VERIFY / WHAT-NEED',
    simulatedConfidence: 0.90,
    durationMs: 2100,
    gestureDescription: 'Laying paper sheet motion followed by signature in air and questioning gaze.',
    tags: ['KYC', 'Verification'],
    isRecommended: false,
  },

  // --- 5. TRAVEL & DAILY LIVING ---
  {
    id: 't-1',
    domain: 'travel_daily',
    text: 'Where is the restroom / washroom?',
    hindiText: 'शौचालय / वॉशरुम कहाँ है?',
    islGloss: 'TOILET / WASHROOM / WHERE',
    simulatedConfidence: 0.96,
    durationMs: 1500,
    gestureDescription: 'W-hand shape shaking gently or touching chest towards direction.',
    tags: ['Daily', 'Essential'],
    isRecommended: true,
  },
  {
    id: 't-2',
    domain: 'travel_daily',
    text: 'I am hungry, where can I get food and water?',
    hindiText: 'मुझे भूख लगी है, भोजन और पानी कहाँ मिलेगा?',
    islGloss: 'HUNGRY / FOOD / WATER / WHERE-SHOP',
    simulatedConfidence: 0.94,
    durationMs: 1800,
    gestureDescription: 'Cupped hand to mouth (eating) followed by drinking cup tilt.',
    tags: ['Food', 'Daily'],
    isRecommended: true,
  },
  {
    id: 't-3',
    domain: 'travel_daily',
    text: 'Which train platform goes to New Delhi?',
    hindiText: 'नई दिल्ली के लिए कौन सा ट्रेन प्लेटफार्म है?',
    islGloss: 'TRAIN / DELHI / PLATFORM-NUMBER / WHICH',
    simulatedConfidence: 0.91,
    durationMs: 2000,
    gestureDescription: 'Two fingers chugging along horizontal arm (train) with pointing query.',
    tags: ['Railway', 'Travel'],
    isRecommended: false,
  },
  {
    id: 't-4',
    domain: 'travel_daily',
    text: 'How much does this cost?',
    hindiText: 'इसकी कीमत कितनी है?',
    islGloss: 'THIS / PRICE / MONEY / HOW-MUCH',
    simulatedConfidence: 0.93,
    durationMs: 1600,
    gestureDescription: 'Rubbing thumb across fingertips (money) with raised eyebrows.',
    tags: ['Shopping', 'Money'],
    isRecommended: false,
  },
  {
    id: 't-5',
    domain: 'travel_daily',
    text: 'Please call me on phone / video call.',
    hindiText: 'कृपया मुझे फोन या वीडियो कॉल करें।',
    islGloss: 'PHONE-CALL / VIDEO-CALL / PLEASE',
    simulatedConfidence: 0.97,
    durationMs: 1600,
    gestureDescription: 'Thumb and pinky extended to ear (phone gesture).',
    tags: ['Communication'],
    isRecommended: true,
  },

  // --- 6. EDUCATION & CLASSROOM ---
  {
    id: 'ed-1',
    domain: 'education',
    text: 'I have a question about the lecture.',
    hindiText: 'लेक्चर के बारे में मेरा एक प्रश्न है।',
    islGloss: 'STUDY / TEACHER / QUESTION / HAVE',
    simulatedConfidence: 0.94,
    durationMs: 1700,
    gestureDescription: 'Raised index finger with slight tilt seeking permission.',
    tags: ['Classroom', 'Study'],
    isRecommended: true,
  },
  {
    id: 'ed-2',
    domain: 'education',
    text: 'Please repeat the last sentence or slide.',
    hindiText: 'कृपया पिछला वाक्य या स्लाइड दोहराएं।',
    islGloss: 'AGAIN / REPEAT / SLIDE / PLEASE',
    simulatedConfidence: 0.92,
    durationMs: 1800,
    gestureDescription: 'Curved hand sweeping back into open palm (again/repeat motion).',
    tags: ['Lecture', 'Repeat'],
    isRecommended: false,
  },
  {
    id: 'ed-3',
    domain: 'education',
    text: 'When is the project submission deadline?',
    hindiText: 'प्रोजेक्ट जमा करने की अंतिम तिथि कब है?',
    islGloss: 'ASSIGNMENT / SUBMIT / DATE / WHEN',
    simulatedConfidence: 0.91,
    durationMs: 1900,
    gestureDescription: 'Hands forming calendar grid followed by tap on wrist watch.',
    tags: ['Deadline', 'Exam'],
    isRecommended: false,
  },

  // --- 7. EMERGENCY & ASSISTANCE ---
  {
    id: 'e-1',
    domain: 'emergency',
    text: 'Please call an emergency ambulance right now!',
    hindiText: 'कृपया अभी एक आपातकालीन एम्बुलेंस बुलाएं!',
    islGloss: 'AMBULANCE / EMERGENCY / CALL / FAST',
    simulatedConfidence: 0.98,
    durationMs: 1900,
    gestureDescription: 'Flashing light revolving circular gesture above head with urgent open hand wave.',
    tags: ['Critical', 'Ambulance'],
    isRecommended: true,
  },
  {
    id: 'e-2',
    domain: 'emergency',
    text: 'I am deaf. Please communicate by text or signing.',
    hindiText: 'मैं बधिर हूँ। कृपया लिखकर या इशारों से बात करें।',
    islGloss: 'ME / DEAF / WRITE / OR / SIGN / PLEASE',
    simulatedConfidence: 0.96,
    durationMs: 2000,
    gestureDescription: 'Index finger touches ear then lips, followed by pen-writing in air motion.',
    tags: ['Accessibility', 'Critical'],
    isRecommended: true,
  },
  {
    id: 'e-3',
    domain: 'emergency',
    text: 'I am lost. Can you help me find the main gate?',
    hindiText: 'मैं रास्ता भटक गया हूँ। क्या आप मुख्य द्वार खोजने में मदद कर सकते हैं?',
    islGloss: 'WAY / LOST / MAIN-GATE / FIND / HELP?',
    simulatedConfidence: 0.92,
    durationMs: 1900,
    gestureDescription: 'Wandering index fingers in crossroads motion followed by open prayer hands.',
    tags: ['Assistance'],
    isRecommended: false,
  },
  {
    id: 'e-4',
    domain: 'emergency',
    text: 'Stop! Danger ahead, please be careful.',
    hindiText: 'रुको! आगे खतरा है, कृपया सावधान रहें।',
    islGloss: 'STOP / DANGER / CAREFUL / LOOK',
    simulatedConfidence: 0.97,
    durationMs: 1600,
    gestureDescription: 'Both palms pushed forward flat in firm halt motion.',
    tags: ['Safety', 'Urgent'],
    isRecommended: false,
  },
];

/**
 * Storage key for custom user signs.
 */
const STORAGE_KEY = 'learnable_custom_phrases_v1';
const LEGACY_STORAGE_KEY = 'signspeak_custom_phrases_v1';

/**
 * Loads custom signs from localStorage
 */
export function getCustomPhrases() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Could not read custom phrases:', err);
    return [];
  }
}

/**
 * Saves a new custom sign to localStorage
 */
export function saveCustomPhrase(newPhrase) {
  if (typeof window === 'undefined') return null;
  try {
    const existing = getCustomPhrases();
    const phraseObj = {
      id: 'custom-' + Date.now(),
      domain: newPhrase.domain || 'custom',
      text: newPhrase.text.trim(),
      hindiText: (newPhrase.hindiText || '').trim(),
      islGloss: (newPhrase.islGloss || '').toUpperCase().trim(),
      simulatedConfidence: parseFloat(newPhrase.simulatedConfidence) || 0.95,
      durationMs: 1600,
      gestureDescription: (newPhrase.gestureDescription || 'Custom user sign gesture.').trim(),
      tags: ['Custom', 'User Defined'],
      isRecommended: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [phraseObj, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return phraseObj;
  } catch (err) {
    console.error('Failed to save custom phrase:', err);
    return null;
  }
}

/**
 * Deletes a custom sign from localStorage
 */
export function deleteCustomPhrase(id) {
  if (typeof window === 'undefined') return false;
  try {
    const existing = getCustomPhrases();
    const filtered = existing.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete custom phrase:', err);
    return false;
  }
}

/**
 * Returns merged list of built-in + user-created signs.
 */
export function getAllPhrases() {
  const custom = getCustomPhrases();
  return [...custom, ...INITIAL_DEMO_PHRASES];
}

/**
 * Recommended guided demo sequence for hackathon presenter.
 * Steps through 4 essential conversational beats.
 */
export const GUIDED_DEMO_SEQUENCE = [
  'g-1', // Hello, welcome
  'e-2', // I am deaf, communicate by text/signing
  'h-1', // I need to see a doctor
  'g-3', // Thank you very much
];
