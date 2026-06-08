import type { ChallengeId } from '@/types';

export type ActionDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ActionTemplate {
  id: string;
  challengeIds: ChallengeId[];
  label: { en: string; ar: string };
  description: { en: string; ar: string };
  difficulty: ActionDifficulty;
  frequency: 'daily' | 'weekly';
  /** Tags must overlap with quiz option tags for scoring */
  tags: string[];
  emoji: string;
  duration: { en: string; ar: string };
}

export const ACTION_TEMPLATES: ActionTemplate[] = [

  // ═══ PROCRASTINATION ══════════════════════════════════════════════════════

  {
    id: 'two-minute-start',
    challengeIds: ['procrastination', 'lack-of-discipline'],
    label: { en: 'Start for just 2 minutes', ar: 'ابدأ لمدة دقيقتين بس' },
    description: {
      en: "Tell yourself you'll do it for just 2 minutes. You'll almost always keep going.",
      ar: 'قول لنفسك هتعمله دقيقتين بس. غالباً هتكمل بعدها.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['fear-failure', 'too-hard', 'small-wins', 'beginner', 'gradual'],
    emoji: '⏱️',
    duration: { en: '2 min', ar: 'دقيقتين' },
  },
  {
    id: 'write-3-tasks',
    challengeIds: ['procrastination', 'lack-of-discipline', 'lack-of-focus'],
    label: { en: 'Write 3 things to finish today', ar: 'اكتب ٣ حاجات عايز تخلصها النهارده' },
    description: {
      en: 'Every morning, write the 3 most important things you must finish today. Then start with the hardest.',
      ar: 'كل صبح اكتب أهم ٣ حاجات لازم تخلصها اليوم. وابدأ بالأصعب.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['no-plan', 'planning', 'structure', 'beginner'],
    emoji: '📝',
    duration: { en: '5 min', ar: '٥ دقايق' },
  },
  {
    id: 'phone-away-work',
    challengeIds: ['procrastination', 'social-media-addiction', 'lack-of-focus'],
    label: { en: 'Phone in another room for 30 min', ar: 'حط موبايلك في أوضة تانية ٣٠ دقيقة' },
    description: {
      en: "Put your phone in another room while you work or study. Out of sight, out of mind.",
      ar: 'حط موبايلك في أوضة تانية وانت بتشتغل أو بتذاكر. بعيد عن عينيك بعيد عن دماغك.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['phone', 'social-media', 'phone-away', 'beginner'],
    emoji: '📵',
    duration: { en: '30 min', ar: '٣٠ دقيقة' },
  },
  {
    id: 'focus-block-20',
    challengeIds: ['procrastination', 'lack-of-focus'],
    label: { en: 'Study 20 min without social media', ar: 'ذاكر ٢٠ دقيقة من غير سوشيال ميديا' },
    description: {
      en: 'Set a timer for 20 minutes. No social media, no phone. Just focus on the task.',
      ar: 'اضبط تايمر ٢٠ دقيقة. بدون سوشيال ميديا ولا موبايل. تركيز بس.',
    },
    difficulty: 'intermediate',
    frequency: 'daily',
    tags: ['studying', 'work', 'focus', 'study', 'deep-work', 'intermediate'],
    emoji: '🎯',
    duration: { en: '20 min', ar: '٢٠ دقيقة' },
  },
  {
    id: 'night-plan',
    challengeIds: ['procrastination', 'lack-of-discipline'],
    label: { en: 'Plan tomorrow before you sleep', ar: 'خطط لبكره قبل ما تنام' },
    description: {
      en: 'Every night, spend 5 minutes writing what you will do tomorrow.',
      ar: 'كل ليلة قضي ٥ دقايق تكتب فيها هتعمل إيه بكره.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['night', 'planning', 'night-routine', 'beginner'],
    emoji: '🌙',
    duration: { en: '5 min', ar: '٥ دقايق' },
  },
  {
    id: 'pomodoro-25',
    challengeIds: ['lack-of-focus', 'procrastination'],
    label: { en: '25 min focus → 5 min break', ar: '٢٥ دقيقة تركيز ← ٥ دقايق راحة' },
    description: {
      en: 'Work for exactly 25 minutes with zero interruptions, then reward yourself with a 5-minute break.',
      ar: 'اشتغل ٢٥ دقيقة بالظبط من غير أي مقاطعات، بعدين كافئ نفسك بـ٥ دقايق راحة.',
    },
    difficulty: 'intermediate',
    frequency: 'daily',
    tags: ['studying', 'working', 'all-tasks', 'deep-work', 'focus', 'intermediate'],
    emoji: '🍅',
    duration: { en: '30 min/session', ar: '٣٠ دقيقة/جلسة' },
  },

  // ═══ SOCIAL MEDIA ADDICTION ═══════════════════════════════════════════════

  {
    id: 'no-phone-morning',
    challengeIds: ['social-media-addiction', 'procrastination', 'poor-sleep'],
    label: { en: 'No phone for first 30 min after waking', ar: 'ماتمسكش موبايلك أول ٣٠ دقيقة بعد ما تصحى' },
    description: {
      en: "Don't touch your phone for the first 30 minutes after waking. Start your day intentionally.",
      ar: 'ماتمسكش موبايلك ٣٠ دقيقة بعد ما تصحى. ابدأ يومك بوعي.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['morning', 'phone-delay', 'boredom', 'automatic', 'beginner'],
    emoji: '🌅',
    duration: { en: '30 min', ar: '٣٠ دقيقة' },
  },
  {
    id: 'app-time-limit',
    challengeIds: ['social-media-addiction'],
    label: { en: 'Set a 1-hour daily limit on social apps', ar: 'اعمل حد ساعة في اليوم على تطبيقات السوشيال' },
    description: {
      en: 'Use your phone settings to set a daily time limit of 1 hour on social media apps.',
      ar: 'استخدم إعدادات موبايلك وخلي السوشيال ميديا ساعة في اليوم بس.',
    },
    difficulty: 'intermediate',
    frequency: 'daily',
    tags: ['app-limit', 'heavy-use', '5h-plus', '3-4h', 'intermediate'],
    emoji: '⏰',
    duration: { en: 'Setup once', ar: 'إعداد مرة واحدة' },
  },
  {
    id: 'phone-free-meal',
    challengeIds: ['social-media-addiction', 'lack-of-focus'],
    label: { en: 'One meal per day without phone', ar: 'وجبة واحدة في اليوم من غير موبايل' },
    description: {
      en: 'Choose one meal to eat completely phone-free. Be present with your food.',
      ar: 'اختار وجبة واحدة تاكلها من غير موبايل خالص. كن حاضراً.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['awareness', 'cue-interrupt', 'boredom', 'beginner'],
    emoji: '🍽️',
    duration: { en: '15–20 min', ar: '١٥–٢٠ دقيقة' },
  },
  {
    id: 'social-detox-day',
    challengeIds: ['social-media-addiction'],
    label: { en: 'One social media-free day per week', ar: 'يوم واحد في الأسبوع بدون سوشيال ميديا' },
    description: {
      en: 'Pick one day per week to stay completely off all social media.',
      ar: 'اختار يوم في الأسبوع تكون بعيد عن السوشيال ميديا خالص.',
    },
    difficulty: 'advanced',
    frequency: 'weekly',
    tags: ['digital-detox', 'heavy-use', 'advanced'],
    emoji: '🏝️',
    duration: { en: 'Full day', ar: 'يوم كامل' },
  },

  // ═══ PORN ADDICTION ═══════════════════════════════════════════════════════

  {
    id: 'urge-surfing',
    challengeIds: ['porn-addiction'],
    label: { en: 'Ride the urge for 10 minutes', ar: 'قاوم الرغبة لمدة ١٠ دقايق' },
    description: {
      en: "When the urge hits, set a 10-minute timer and do something else. Urges always pass.",
      ar: 'لما تيجيلك الرغبة، اضبط تايمر ١٠ دقايق واعمل حاجة تانية. الرغبة دايماً بتعدي.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['daily-urge', 'moderate-urge', 'light-urge', 'beginner'],
    emoji: '🌊',
    duration: { en: '10 min', ar: '١٠ دقايق' },
  },
  {
    id: 'phone-out-bedroom',
    challengeIds: ['porn-addiction', 'poor-sleep'],
    label: { en: 'Phone stays outside the bedroom at night', ar: 'الموبايل يبقى برة أوضة النوم بالليل' },
    description: {
      en: "Don't take your phone to bed. Charge it in another room every night.",
      ar: 'ماتاخدش موبايلك للسرير. شحنه في أوضة تانية كل ليلة.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['night-alone', 'phone-away', 'night-routine', 'beginner', 'late-night'],
    emoji: '🚪',
    duration: { en: 'Every night', ar: 'كل ليلة' },
  },
  {
    id: 'urge-replace-movement',
    challengeIds: ['porn-addiction', 'social-media-addiction'],
    label: { en: 'Replace urge with 15 min of movement', ar: 'استبدل الرغبة بـ١٥ دقيقة حركة' },
    description: {
      en: 'When you feel the urge, immediately go for a walk or do push-ups for 15 minutes.',
      ar: 'لما تحس بالرغبة، روح على طول امشي أو اعمل push-ups ١٥ دقيقة.',
    },
    difficulty: 'intermediate',
    frequency: 'daily',
    tags: ['boredom', 'loneliness', 'activity', 'intermediate'],
    emoji: '🏃',
    duration: { en: '15 min', ar: '١٥ دقيقة' },
  },
  {
    id: 'daily-clean-checkin',
    challengeIds: ['porn-addiction', 'lack-of-discipline'],
    label: { en: 'Daily check: was today clean?', ar: 'Check يومي: هل اليوم كان نظيف؟' },
    description: {
      en: 'Every night, mark whether you stayed clean today. Streaks build real momentum.',
      ar: 'كل ليلة سجّل إذا كنت محتفظت بنفسك النهارده. التسلسل بيبني زخم حقيقي.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['accountability', 'daily-urge', 'beginner'],
    emoji: '✅',
    duration: { en: '1 min', ar: 'دقيقة' },
  },

  // ═══ LACK OF DISCIPLINE ═══════════════════════════════════════════════════

  {
    id: 'wake-same-time',
    challengeIds: ['lack-of-discipline', 'poor-sleep'],
    label: { en: 'Wake up at the same time every day', ar: 'صحى في نفس الوقت كل يوم' },
    description: {
      en: 'Set one wake-up time and stick to it — even on weekends. This alone changes everything.',
      ar: 'حدد وقت صحيان واحد والتزم بيه حتى في الإجازات. ده وحده بيغير كل حاجة.',
    },
    difficulty: 'intermediate',
    frequency: 'daily',
    tags: ['morning', 'morning-routine', 'consistency', 'schedule', 'intermediate'],
    emoji: '⏰',
    duration: { en: 'Daily', ar: 'يومياً' },
  },
  {
    id: 'cold-shower',
    challengeIds: ['lack-of-discipline', 'procrastination'],
    label: { en: 'End shower with 30 sec of cold water', ar: 'اختم دشك بـ٣٠ ثانية ماء بارد' },
    description: {
      en: 'After your regular shower, switch to cold water for 30 seconds. Builds discipline fast.',
      ar: 'بعد دشك العادي، حول على مية تلجة ٣٠ ثانية. بيبني انضباط بسرعة.',
    },
    difficulty: 'intermediate',
    frequency: 'daily',
    tags: ['discipline', 'morning', 'intermediate', 'commitment'],
    emoji: '🚿',
    duration: { en: '30 sec', ar: '٣٠ ثانية' },
  },
  {
    id: 'one-promise-7days',
    challengeIds: ['lack-of-discipline'],
    label: { en: 'Keep one promise for 7 days', ar: 'اوفي بوعد واحد لمدة ٧ أيام' },
    description: {
      en: 'Choose one small commitment (no phone at night, walk daily, etc.) and keep it for 7 days straight.',
      ar: 'اختار التزام صغير واحد (مثلاً: بدون موبايل في السرير، مشي يومي) والتزم بيه ٧ أيام متتالية.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['commitment', 'accountability', 'gradual', 'beginner'],
    emoji: '🤝',
    duration: { en: '7-day challenge', ar: 'تحدي ٧ أيام' },
  },

  // ═══ ANXIETY ══════════════════════════════════════════════════════════════

  {
    id: 'breathing-4-7-8',
    challengeIds: ['anxiety', 'procrastination'],
    label: { en: '4-7-8 breathing when anxious', ar: 'تنفس ٤-٧-٨ لما تتوتر' },
    description: {
      en: 'Inhale 4 seconds, hold 7, exhale 8. Do this 3 times when feeling anxious.',
      ar: 'استنشق ٤ ثواني، احبس ٧، اخرج ٨. اعمل ده ٣ مرات لما تتوتر.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['overthinking', 'physical-tension', 'breathing', 'beginner'],
    emoji: '🌬️',
    duration: { en: '2 min', ar: 'دقيقتين' },
  },
  {
    id: 'worry-dump',
    challengeIds: ['anxiety'],
    label: { en: 'Write worries down for 5 minutes', ar: 'اكتب قلقك لمدة ٥ دقايق' },
    description: {
      en: 'Write your worries on paper freely. Gets them out of your head and makes them feel smaller.',
      ar: 'اكتب قلقك على ورق بحرية. بيطلعها من دماغك وبيخليها تبدو أصغر.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['overthinking', 'future-worry', 'mindfulness', 'beginner'],
    emoji: '📔',
    duration: { en: '5 min', ar: '٥ دقايق' },
  },
  {
    id: 'grounding-54321',
    challengeIds: ['anxiety'],
    label: { en: '5-4-3-2-1 grounding exercise', ar: 'تمرين ٥-٤-٣-٢-١ للتأريض' },
    description: {
      en: 'Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste. Brings you back to now.',
      ar: 'سمّي ٥ حاجات تشوفها، ٤ تسمعها، ٣ تحس بيها، ٢ تشمها، ١ تتذوقها. بيرجعك للحاضر.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['physical-tension', 'future-worry', 'social', 'grounding', 'beginner'],
    emoji: '🌿',
    duration: { en: '2 min', ar: 'دقيقتين' },
  },

  // ═══ POOR SLEEP ═══════════════════════════════════════════════════════════

  {
    id: 'screen-off-30',
    challengeIds: ['poor-sleep', 'social-media-addiction'],
    label: { en: 'No screens 30 min before bed', ar: 'لا شاشات ٣٠ دقيقة قبل النوم' },
    description: {
      en: 'Put your phone and laptop away 30 minutes before your target sleep time.',
      ar: 'حط موبايلك ولاب توبك جنب ٣٠ دقيقة قبل وقت نومك.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['cant-sleep', 'late-night', 'screen-off', 'beginner'],
    emoji: '📵',
    duration: { en: '30 min', ar: '٣٠ دقيقة' },
  },
  {
    id: 'fixed-bedtime',
    challengeIds: ['poor-sleep'],
    label: { en: 'Pick a bedtime and stick to it', ar: 'حدد وقت نوم وخليه ثابت' },
    description: {
      en: "Choose a bedtime (e.g., 11pm) and be in bed by then every night — even if you can't sleep.",
      ar: 'اختار وقت نوم (مثلاً ١١ بالليل) وكن في السرير في الوقت ده كل ليلة حتى لو مش قادر تنام.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['late-night', 'inconsistent', 'schedule', 'consistency', 'beginner'],
    emoji: '🌙',
    duration: { en: 'Every night', ar: 'كل ليلة' },
  },

  // ═══ LACK OF FOCUS ════════════════════════════════════════════════════════

  {
    id: 'single-tab-rule',
    challengeIds: ['lack-of-focus', 'social-media-addiction'],
    label: { en: 'One browser tab only while working', ar: 'تاب واحد بس في البراوزر وانت بتشتغل' },
    description: {
      en: 'When working or studying, keep only one browser tab open at a time.',
      ar: 'لما بتشتغل أو بتذاكر، خلي تاب واحد بس مفتوح في البراوزر.',
    },
    difficulty: 'beginner',
    frequency: 'daily',
    tags: ['working', 'studying', 'reading', 'focus', 'phone-away', 'beginner'],
    emoji: '💻',
    duration: { en: 'While working', ar: 'وقت الشغل' },
  },
];
