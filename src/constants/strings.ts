const en = {
  // Navigation
  navHome: 'Home',
  navGoals: 'Goals',
  navProgress: 'Progress',
  navMore: 'More',

  // Intro & Onboarding Welcome
  welcomeTitle: 'CoreShift',
  welcomeSub: 'An intervention system for when you are procrastinating, overwhelmed, or avoiding work.',
  getStarted: 'Continue',

  // Steps
  stepGoal: 'Step 1 of 3',
  stepStruggle: 'Step 2 of 3',
  stepPlan: 'Step 3 of 3',

  // Struggle Screen
  struggleTitle: 'What is your primary starting friction?',
  struggleSub: 'Select the state that most frequently prevents you from executing.',

  // Plan Screen
  planTitle: 'Initial Execution Blocks',
  planSub: 'We have generated your baseline execution blocks based on your friction. You can edit these later.',
  planStart: 'Enter CoreShift',
  planBuilderSuggestions: 'Suggestions for you',
  planBuilderCustomPlaceholder: 'e.g. Inbox Zero 10m',
  planBuilderEmptyAlert: 'Please add at least one execution block.',
  addTask: 'Add Block',
  maxTasksWarning: 'Limit yourself to 4 execution blocks to minimize cognitive load.',

  // Struggles (Friction)
  struggles: {
    procrastination: {
      title: 'Procrastination',
      desc: 'Delaying tasks until the anxiety forces action.',
    },
    distraction: {
      title: 'Distraction',
      desc: 'Defaulting to doomscrolling and context switching.',
    },
    overwhelm: {
      title: 'Overwhelm',
      desc: 'Paralysis caused by the volume of work.',
    },
    low_energy: {
      title: 'Low Energy',
      desc: 'Unable to physically activate to start work.',
    },
  },

  // Today
  todayTitle: 'Execution Blocks',
  dailyExecution: 'Daily Stats',
  scholar: '',
  nextLevel: '',
  xpToday: '',
  xp: 'XP',
  completed: 'completed',
  shiftNow: 'Shift Now',
  cancelShift: 'Cancel',
  allDoneTitle: 'Complete',
  allDoneSub: 'All scheduled blocks executed.',

  // Shift Now
  shiftTitle: 'Intervention Required',
  shiftSub: 'Select your current state to begin an immediate execution protocol.',
  feelings: {
    distracted: {
      title: 'Distracted',
      action: 'Start 5m Focus Sprint',
    },
    no_energy: {
      title: 'No Energy',
      action: 'Start 2m Activation',
    },
    urge: {
      title: 'Urge to scroll',
      action: 'Start 90s Delay Exercise',
    },
    stressed: {
      title: 'Overwhelmed',
      action: 'Start 1m Breathing',
    },
  },
  shiftDone: 'Close',
  shiftTip: {
    distracted: '',
    no_energy: '',
    urge: '',
    stressed: '',
  },

  // Progress
  progressTitle: 'Progress',
  progressSub: 'Your execution history.',
  completionRate: 'Completion',
  currentStreak: 'Streak',
  totalXp: 'Total XP',
  recentActivity: 'Calendar',
  last14: '',

  // Settings
  settingsTitle: 'Settings',
  preferences: 'Preferences',
  languageLabel: 'Language',
  themeLabel: 'Dark Mode',
  reminders: 'Reminders',
  resetData: 'Factory Reset',
  resetConfirm: 'Are you sure? This will wipe your execution history.',
  cancel: 'Cancel',
  reset: 'Reset',

  // Support
  supportTitle: 'Support',
  rateApp: 'Rate App',
  reportBug: 'Report Bug',
  suggestFeature: 'Suggest Feature',
  contactSupport: 'Contact Support',
  privacyPolicy: 'Privacy Policy',
  termsOfUse: 'Terms of Use',
  appVersion: 'App Version',
};

const ar: typeof en = {
  // Navigation
  navHome: 'الرئيسية',
  navGoals: 'أهدافي',
  navProgress: 'التقدم',
  navMore: 'المزيد',

  // Intro & Onboarding Welcome
  welcomeTitle: 'CoreShift',
  welcomeSub: 'نظام تدخل سريع يهدف لمساعدتك عندما تماطل أو تشعر بالتشتت.',
  getStarted: 'متابعة',

  // Steps
  stepGoal: 'الخطوة ١ من ٣',
  stepStruggle: 'الخطوة ٢ من ٣',
  stepPlan: 'الخطوة ٣ من ٣',

  // Struggle Screen
  struggleTitle: 'ما هو العائق الرئيسي الذي يمنعك من البدء؟',
  struggleSub: 'اختر الحالة التي تمنعك من التنفيذ بشكل متكرر.',

  // Plan Screen
  planTitle: 'كتل التنفيذ الأولية',
  planSub: 'قمنا بتجهيز كتل التنفيذ بناءً على التحدي الخاص بك. يمكنك تعديلها لاحقاً.',
  planStart: 'دخول النظام',
  planBuilderSuggestions: 'اقتراحات',
  planBuilderCustomPlaceholder: 'مثال: تصفية الإيميل ١٠د',
  planBuilderEmptyAlert: 'يجب إضافة كتلة تنفيذ واحدة على الأقل.',
  addTask: 'إضافة كتلة',
  maxTasksWarning: 'اكتفِ بـ ٤ كتل فقط لتقليل التشتت والعبء الذهني.',

  // Struggles
  struggles: {
    procrastination: {
      title: 'التسويف',
      desc: 'تأجيل العمل حتى تضطر للبدء بسبب الضغط.',
    },
    distraction: {
      title: 'التشتت',
      desc: 'الانشغال السريع بالهاتف ومواقع التواصل.',
    },
    overwhelm: {
      title: 'العبء الذهني',
      desc: 'الشلل عن البدء بسبب كثرة المهام.',
    },
    low_energy: {
      title: 'انعدام الطاقة',
      desc: 'صعوبة جسدية ونفسية في بدء العمل.',
    },
  },

  // Today
  todayTitle: 'كتل التنفيذ',
  dailyExecution: 'إحصائيات اليوم',
  scholar: '',
  nextLevel: '',
  xpToday: '',
  xp: 'نقاط',
  completed: 'مكتمل',
  shiftNow: 'تدخل فوري',
  cancelShift: 'إلغاء',
  allDoneTitle: 'تم بنجاح',
  allDoneSub: 'تم تنفيذ جميع الكتل المجدولة.',

  // Shift Now
  shiftTitle: 'تدخل فوري',
  shiftSub: 'اختر حالتك الحالية لبدء بروتوكول التنفيذ الفوري.',
  feelings: {
    distracted: {
      title: 'مشتت',
      action: 'بدء ٥ دقائق تركيز مكثف',
    },
    no_energy: {
      title: 'بدون طاقة',
      action: 'بدء دقيقتين تنشيط',
    },
    urge: {
      title: 'رغبة في التصفح',
      action: 'بدء ٩٠ ثانية تأخير',
    },
    stressed: {
      title: 'مضغوط',
      action: 'بدء دقيقة تنفس',
    },
  },
  shiftDone: 'إغلاق',
  shiftTip: {
    distracted: '',
    no_energy: '',
    urge: '',
    stressed: '',
  },

  // Progress
  progressTitle: 'التقدم',
  progressSub: 'سجل التنفيذ الخاص بك.',
  completionRate: 'الإنجاز',
  currentStreak: 'الاستمرارية',
  totalXp: 'مجموع النقاط',
  recentActivity: 'التقويم',
  last14: '',

  // Settings
  settingsTitle: 'الإعدادات',
  preferences: 'التفضيلات',
  languageLabel: 'اللغة',
  themeLabel: 'الوضع الداكن',
  reminders: 'التنبيهات',
  resetData: 'إعادة ضبط المصنع',
  resetConfirm: 'هل أنت متأكد؟ سيتم مسح سجل التنفيذ الخاص بك بالكامل.',
  cancel: 'إلغاء',
  reset: 'مسح',

  // Support
  supportTitle: 'الدعم والمساعدة',
  rateApp: 'تقييم التطبيق',
  reportBug: 'الإبلاغ عن مشكلة',
  suggestFeature: 'اقتراح ميزة',
  contactSupport: 'تواصل معنا',
  privacyPolicy: 'سياسة الخصوصية',
  termsOfUse: 'شروط الاستخدام',
  appVersion: 'إصدار التطبيق',
};

export const strings = { en, ar };
export type Strings = typeof en;
