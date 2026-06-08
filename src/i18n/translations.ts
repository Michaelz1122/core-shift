import type { Language } from '@/types';

// ─── Translation shape ────────────────────────────────────────────────────────

interface T {
  // Common
  continue: string;
  back: string;
  save: string;
  cancel: string;
  done: string;
  skip: string;
  of: string;
  select: string;
  selected: string;
  loading: string;

  // Onboarding — Welcome
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeFeature1Title: string;
  welcomeFeature1Desc: string;
  welcomeFeature2Title: string;
  welcomeFeature2Desc: string;
  welcomeFeature3Title: string;
  welcomeFeature3Desc: string;
  welcomeButton: string;

  // Onboarding — Language screen
  languageTitle: string;
  languageSubtitle: string;

  // Onboarding — Challenge screen
  challengeTitle: string;
  challengeSubtitle: string;
  challengeMax: string;

  // Onboarding — Vision screen
  visionTitle: string;
  visionSubtitle: string;

  // Onboarding — Quiz screen
  quizStep: string;
  quizQuestion: string;
  quizNext: string;

  // Onboarding — Plan screen
  planGenerating: string;
  planGeneratingSubtitle: string;
  planTitle: string;
  planSubtitle: string;
  planHint: string;
  planCommit: string;
  planXpBonus: string;
  planBeginner: string;
  planIntermediate: string;
  planAdvanced: string;
  planDaily: string;
  planWeekly: string;
  planWelcomeBonusTitle: string;
  planWelcomeBonusDesc: string;

  // Today tab
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  todayProgressTitle: string;
  todayActionsTitle: string;
  todayActionsRemaining: string;
  todayAllDone: string;
  todayNoActions: string;
  todayCheckInTitle: string;
  todayCheckInSub: string;
  todayCheckInButton: string;
  todayCheckInDone: string;
  todayShiftNowTitle: string;
  todayShiftNowSub: string;

  // Shift Now tab (Rescue)
  shiftNowHeader: string;
  shiftNowTitle: string;
  shiftNowSubtitle: string;

  // Settings
  settingsHeader: string;
  settingsLanguage: string;
  settingsManageActions: string;
  settingsEditChallenges: string;
  settingsReminders: string;
  settingsWeeklyReview: string;
  settingsDarkMode: string;
  settingsLogout: string;
  settingsReset: string;
}

// ─── English strings ──────────────────────────────────────────────────────────

const en: T = {
  // Common
  continue: 'Continue',
  back: 'Back',
  save: 'Save',
  cancel: 'Cancel',
  done: 'Done',
  skip: 'Skip',
  of: 'of',
  select: 'Select',
  selected: 'selected',
  loading: 'Loading...',

  // Welcome
  welcomeTitle: 'Your transformation\nstarts here.',
  welcomeSubtitle: 'Real solutions for real problems.\nNo fluff, no generic advice.',
  welcomeFeature1Title: 'Built Around You',
  welcomeFeature1Desc: 'We start with your challenges, not generic goals.',
  welcomeFeature2Title: 'Shift Now Mode',
  welcomeFeature2Desc: 'Immediate help when you feel like giving up.',
  welcomeFeature3Title: 'Progress You Feel',
  welcomeFeature3Desc: 'See your consistency grow day by day.',
  welcomeButton: 'Start Your Shift',

  // Language
  languageTitle: 'Choose your language',
  languageSubtitle: 'You can change this anytime in settings',

  // Challenge
  challengeTitle: "What's your biggest\nchallenge right now?",
  challengeSubtitle: 'Be honest. This shapes everything we build for you.',
  challengeMax: 'Select up to 2',

  // Vision
  visionTitle: 'What do you want your life\nto look like in 90 days?',
  visionSubtitle: "Pick all that feel true. We'll build your plan around them.",

  // Quiz
  quizStep: 'Step',
  quizQuestion: 'Question',
  quizNext: 'Next',

  // Plan
  planGenerating: 'Building your plan...',
  planGeneratingSubtitle: 'Analysing your answers',
  planTitle: 'Your Personal Action Plan',
  planSubtitle: 'These are designed specifically for your challenges. Select 3–5 to start.',
  planHint: 'active actions selected',
  planCommit: 'Begin My Transformation',
  planXpBonus: '+50 XP Welcome Bonus',
  planBeginner: 'easy',
  planIntermediate: 'medium',
  planAdvanced: 'hard',
  planDaily: 'daily',
  planWeekly: 'weekly',
  planWelcomeBonusTitle: 'Welcome Reward Unlocked!',
  planWelcomeBonusDesc: 'Starting your plan awards +50 XP to kick off Level 1.',

  // Today
  greetingMorning: 'Good morning',
  greetingAfternoon: 'Good afternoon',
  greetingEvening: 'Good evening',
  todayProgressTitle: "Today's Progress",
  todayActionsTitle: "Today's Actions",
  todayActionsRemaining: 'action(s) remaining',
  todayAllDone: 'All done for today! 🎉',
  todayNoActions: 'No actions yet. Complete onboarding first.',
  todayCheckInTitle: 'How are you feeling today?',
  todayCheckInSub: 'Mood · Energy · Focus',
  todayCheckInButton: 'Start Check-in',
  todayCheckInDone: 'Check-in complete',
  todayShiftNowTitle: 'Struggling right now?',
  todayShiftNowSub: 'Open Shift Now for immediate help.',

  // Shift Now
  shiftNowHeader: 'SHIFT NOW',
  shiftNowTitle: 'What are you feeling right now?',
  shiftNowSubtitle: "It's okay. Pick what fits and we'll handle it together.",

  // Settings
  settingsHeader: 'Settings',
  settingsLanguage: 'Language',
  settingsManageActions: 'Manage Actions',
  settingsEditChallenges: 'Edit Challenges',
  settingsReminders: 'Reminder Settings',
  settingsWeeklyReview: 'Weekly Review',
  settingsDarkMode: 'Dark Mode',
  settingsLogout: 'Log Out',
  settingsReset: 'Reset Local Data',
};

// ─── Arabic strings (Egyptian dialect) ────────────────────────────────────────

const ar: T = {
  // Common
  continue: 'متابعة',
  back: 'رجوع',
  save: 'حفظ',
  cancel: 'إلغاء',
  done: 'تم',
  skip: 'تخطي',
  of: 'من',
  select: 'اختر',
  selected: 'محدد',
  loading: 'جاري التحميل...',

  // Welcome
  welcomeTitle: 'التحول الحقيقي\nيبدأ من هنا.',
  welcomeSubtitle: 'حلول حقيقية لمشاكل حقيقية.\nمن غير كلام فاضي.',
  welcomeFeature1Title: 'مبني عليك إنت',
  welcomeFeature1Desc: 'بنبدأ بتحدياتك، مش بأهداف عامة.',
  welcomeFeature2Title: 'وضع Shift Now',
  welcomeFeature2Desc: 'مساعدة فورية لما تحس إنك هتستسلم.',
  welcomeFeature3Title: 'تقدم حقيقي',
  welcomeFeature3Desc: 'شوف ثباتك وهو بيكبر يوم بعد يوم.',
  welcomeButton: 'ابدأ رحلتك',

  // Language
  languageTitle: 'اختر لغتك',
  languageSubtitle: 'تقدر تغيرها في أي وقت من الإعدادات',

  // Challenge
  challengeTitle: 'إيه أكبر تحدي\nبتواجهه دلوقتي؟',
  challengeSubtitle: 'كن صريح. ده هيبني كل حاجة إنت محتاجها.',
  challengeMax: 'اختر لحد اتنين',

  // Vision
  visionTitle: 'عايز حياتك تبقى إزاي\nبعد ٩٠ يوم؟',
  visionSubtitle: 'اختر كل اللي تحس بيه. هنبني خطتك حواليهم.',

  // Quiz
  quizStep: 'خطوة',
  quizQuestion: 'سؤال',
  quizNext: 'التالي',

  // Plan
  planGenerating: 'بنبني خطتك...',
  planGeneratingSubtitle: 'بنحلل إجاباتك',
  planTitle: 'خطة التحول الخاصة بيك',
  planSubtitle: 'متصممة خصيصاً لتحدياتك. اختر ٣–٥ عشان تبدأ.',
  planHint: 'إجراء نشط محدد',
  planCommit: 'ابدأ تحولي',
  planXpBonus: '+٥٠ XP مكافأة الترحيب',
  planBeginner: 'سهل',
  planIntermediate: 'متوسط',
  planAdvanced: 'صعب',
  planDaily: 'يومي',
  planWeekly: 'أسبوعي',
  planWelcomeBonusTitle: '!مكافأة الترحيب انفتحت',
  planWelcomeBonusDesc: 'بدء خطتك بيديك +٥٠ XP عشان تنطلق في المستوى الأول.',

  // Today
  greetingMorning: 'صباح الخير',
  greetingAfternoon: 'مساء الخير',
  greetingEvening: 'مساء النور',
  todayProgressTitle: 'تقدم اليوم',
  todayActionsTitle: 'إجراءات اليوم',
  todayActionsRemaining: 'إجراء متبقي',
  todayAllDone: '!خلصت كل حاجة النهارده 🎉',
  todayNoActions: 'مفيش إجراءات لسه. أكمل الإعداد الأول.',
  todayCheckInTitle: 'إزيك النهارده؟',
  todayCheckInSub: 'المزاج · الطاقة · التركيز',
  todayCheckInButton: 'ابدأ Check-in',
  todayCheckInDone: 'تم Check-in',
  todayShiftNowTitle: 'بتعاني دلوقتي؟',
  todayShiftNowSub: '.افتح Shift Now عشان مساعدة فورية',

  // Shift Now
  shiftNowHeader: 'SHIFT NOW',
  shiftNowTitle: 'إيه اللي بتحس بيه دلوقتي؟',
  shiftNowSubtitle: '.مش مشكلة. اختار اللي بينطبق عليك وهنتعامل معاه سوا',

  // Settings
  settingsHeader: 'الإعدادات',
  settingsLanguage: 'اللغة',
  settingsManageActions: 'إدارة الإجراءات',
  settingsEditChallenges: 'تعديل التحديات',
  settingsReminders: 'إعدادات التذكير',
  settingsWeeklyReview: 'المراجعة الأسبوعية',
  settingsDarkMode: 'الوضع الداكن',
  settingsLogout: 'تسجيل الخروج',
  settingsReset: 'إعادة تعيين البيانات',
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const TRANSLATIONS: Record<Language, T> = { en, ar };
export type { T as TranslationSet };
