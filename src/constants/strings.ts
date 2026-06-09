const en = {
  // Onboarding
  welcome: 'CoreShift',
  welcomeSub: 'Complete one meaningful action today.',
  struggleTitle: "What's your biggest struggle?",
  goalTitle: 'What do you want most?',
  start: 'Start',
  next: 'Next',

  struggles: {
    procrastination: 'Procrastination',
    phone_addiction: 'Phone Addiction',
    focus: 'Focus',
    discipline: 'Discipline',
    consistency: 'Consistency',
  },
  goals: {
    work: 'Work',
    study: 'Study',
    health: 'Health',
    life_balance: 'Life Balance',
  },

  // Today
  todayTitle: "Today's Plan",
  completed: 'completed',
  shiftNow: 'Shift Now',

  // Shift Now
  shiftTitle: 'What are you feeling?',
  feelings: {
    distracted: 'Distracted',
    no_energy: 'No Energy',
    urge: 'Urge',
    stressed: 'Stressed',
  },
  shiftDone: 'I feel better',
  shiftTip: {
    distracted: 'Put your phone in another room. Set a 5-minute timer. Do one task.',
    no_energy: 'Stand up. Drink cold water. Take 10 deep breaths.',
    urge: 'Wait 90 seconds. The urge will pass. Breathe slowly.',
    stressed: 'Close your eyes. Breathe in 4 seconds. Out 6 seconds. Repeat 3 times.',
  },

  // Progress
  progressTitle: 'Progress',
  completionRate: 'Completion Rate',
  currentStreak: 'Current Streak',
  days: 'days',
  last14: 'Last 14 Days',
  totalXp: 'Total XP',
  level: 'Level',

  // Settings
  settingsTitle: 'Settings',
  languageLabel: 'Language',
  themeLabel: 'Theme',
  dark: 'Dark',
  light: 'Light',
  reminders: 'Reminders',
  resetData: 'Reset All Data',
  resetConfirm: 'Are you sure? This cannot be undone.',
};

const ar: typeof en = {
  welcome: 'CoreShift',
  welcomeSub: 'أنجز فعل واحد ذو معنى اليوم.',
  struggleTitle: 'إيه أكبر تحدي عندك؟',
  goalTitle: 'إيه أكتر حاجة عايزها؟',
  start: 'ابدأ',
  next: 'التالي',

  struggles: {
    procrastination: 'تسويف',
    phone_addiction: 'إدمان الموبايل',
    focus: 'تركيز',
    discipline: 'انضباط',
    consistency: 'استمرارية',
  },
  goals: {
    work: 'شغل',
    study: 'دراسة',
    health: 'صحة',
    life_balance: 'توازن حياة',
  },

  todayTitle: 'خطة اليوم',
  completed: 'مكتمل',
  shiftNow: 'غيّر الآن',

  shiftTitle: 'إيه اللي حاسس بيه؟',
  feelings: {
    distracted: 'مشتت',
    no_energy: 'كسلان',
    urge: 'عندي رغبة',
    stressed: 'متوتر',
  },
  shiftDone: 'حاسس إني أحسن',
  shiftTip: {
    distracted: 'حط الموبايل في أوضة تانية. حط تايمر ٥ دقايق. اعمل حاجة واحدة.',
    no_energy: 'قوم وقف. اشرب ميه ساقعة. خد ١٠ أنفاس عميقة.',
    urge: 'استنى ٩٠ ثانية. الرغبة هتعدي. اتنفس ببطء.',
    stressed: 'غمض عينك. شهيق ٤ ثواني. زفير ٦ ثواني. كرر ٣ مرات.',
  },

  progressTitle: 'التقدم',
  completionRate: 'معدل الإنجاز',
  currentStreak: 'الاستمرارية',
  days: 'يوم',
  last14: 'آخر ١٤ يوم',
  totalXp: 'إجمالي النقاط',
  level: 'المستوى',

  settingsTitle: 'الإعدادات',
  languageLabel: 'اللغة',
  themeLabel: 'المظهر',
  dark: 'داكن',
  light: 'فاتح',
  reminders: 'التذكيرات',
  resetData: 'حذف كل البيانات',
  resetConfirm: 'متأكد؟ مش هتقدر ترجعها.',
};

export const strings = { en, ar };
export type Strings = typeof en;
