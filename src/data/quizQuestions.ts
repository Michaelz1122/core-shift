import type { ChallengeId } from '@/types';

export interface QuizOption {
  id: string;
  label: { en: string; ar: string };
  /**
   * Tags read by the action plan engine to score template relevance.
   * Every tag listed here MUST be referenced by at least one ActionTemplate.tags entry.
   */
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  /** 'universal' = shown for every user; otherwise challenge-specific */
  challengeId: ChallengeId | 'universal';
  text: { en: string; ar: string };
  options: QuizOption[];
}

// ─── Universal questions (shown for every user) ───────────────────────────────

const UNIVERSAL: QuizQuestion[] = [
  {
    id: 'change-size',
    challengeId: 'universal',
    text: {
      en: 'How much change feels realistic right now?',
      ar: 'قد أي تغيير تحس إنه ممكن دلوقتي؟',
    },
    options: [
      {
        id: 'very-small',
        label: { en: 'Very small steps', ar: 'خطوات صغيرة جداً' },
        tags: ['quick-win', 'micro-action'],
      },
      {
        id: 'small',
        label: { en: 'Small, steady steps', ar: 'خطوات صغيرة ومستمرة' },
        tags: ['gradual', 'small-wins'],
      },
      {
        id: 'medium',
        label: { en: 'Medium-sized changes', ar: 'تغييرات متوسطة' },
        tags: ['moderate-effort'],
      },
      {
        id: 'big',
        label: { en: 'Big transformation', ar: 'تحول كبير' },
        tags: ['high-effort', 'commitment'],
      },
    ],
  },
  {
    id: 'past-failure',
    challengeId: 'universal',
    text: {
      en: 'If you tried before and stopped, why did it happen?',
      ar: 'لو جربت قبل كده ووقفت، ليه حصل ده؟',
    },
    options: [
      {
        id: 'too-hard',
        label: { en: 'The plan was too hard', ar: 'الخطة كانت صعبة أوي' },
        tags: ['too-hard', 'gradual', 'small-wins'],
      },
      {
        id: 'forgot',
        label: { en: 'I simply forgot', ar: 'نسيت بكل بساطة' },
        tags: ['reminder', 'visible-cue', 'habit-cue'],
      },
      {
        id: 'lost-motivation',
        label: { en: 'I lost motivation', ar: 'فقدت الحماس' },
        tags: ['accountability', 'reward', 'tracking'],
      },
      {
        id: 'bad-day',
        label: { en: 'One bad day ruined everything', ar: 'يوم واحد وحش خرب كل حاجة' },
        tags: ['resilience', 'restart', 'identity'],
      },
    ],
  },
];

// ─── Challenge-specific questions ────────────────────────────────────────────

const CHALLENGE_SPECIFIC: QuizQuestion[] = [
  // ── PROCRASTINATION ──────────────────────────────────────────────────────
  {
    id: 'procrastination-when',
    challengeId: 'procrastination',
    text: {
      en: 'When does procrastination usually hit you?',
      ar: 'التسويف بيجيلك امتى عادةً؟',
    },
    options: [
      { id: 'studying',  label: { en: 'While studying', ar: 'وقت المذاكرة' },  tags: ['study', 'focus', 'deep-work'] },
      { id: 'work',      label: { en: 'During work',    ar: 'وقت الشغل' },     tags: ['work', 'productivity', 'deep-work'] },
      { id: 'night',     label: { en: 'At night',       ar: 'بالليل' },        tags: ['night', 'night-routine', 'evening'] },
      { id: 'all-day',   label: { en: 'All day long',   ar: 'طول اليوم' },     tags: ['structure', 'schedule', 'time-block'] },
    ],
  },
  {
    id: 'procrastination-distraction',
    challengeId: 'procrastination',
    text: {
      en: 'What distracts you most?',
      ar: 'إيه اللي بيشتتك أكتر؟',
    },
    options: [
      { id: 'phone',         label: { en: 'My phone',        ar: 'موبايلي' },           tags: ['phone', 'phone-away', 'phone-distance'] },
      { id: 'social-media',  label: { en: 'Social media',    ar: 'السوشيال ميديا' },     tags: ['social-media', 'app-limit', 'phone-away'] },
      { id: 'no-plan',       label: { en: 'No clear plan',   ar: 'مفيش خطة واضحة' },     tags: ['planning', 'structure', 'task-clarity', 'no-plan'] },
      { id: 'fear-failure',  label: { en: 'Fear of failure', ar: 'خوف من الفشل' },      tags: ['fear-failure', 'mindset', 'small-wins'] },
    ],
  },

  // ── SOCIAL MEDIA ADDICTION ───────────────────────────────────────────────
  {
    id: 'social-media-trigger',
    challengeId: 'social-media-addiction',
    text: {
      en: 'When do you reach for your phone most?',
      ar: 'امتى بتشيل موبايلك أكتر؟',
    },
    options: [
      { id: 'boredom',    label: { en: 'When bored',                  ar: 'لما بتتملل' },        tags: ['boredom', 'replace-habit', 'activity'] },
      { id: 'stress',     label: { en: 'When stressed',               ar: 'لما بتتوتر' },         tags: ['stress', 'coping', 'breathing'] },
      { id: 'morning',    label: { en: 'First thing in the morning',  ar: 'أول ما أصحى' },       tags: ['morning', 'phone-delay', 'morning-routine'] },
      { id: 'automatic',  label: { en: 'Without even thinking',       ar: 'تلقائياً من غير ما أفكر' }, tags: ['awareness', 'cue-interrupt', 'visible-cue', 'automatic'] },
    ],
  },
  {
    id: 'social-media-daily-use',
    challengeId: 'social-media-addiction',
    text: {
      en: 'Roughly how many hours per day on social media?',
      ar: 'تقريباً كام ساعة في اليوم على السوشيال ميديا؟',
    },
    options: [
      { id: '1-2h',   label: { en: '1–2 hours',     ar: 'ساعة لساعتين' }, tags: ['moderate-use', 'scheduled-use'] },
      { id: '3-4h',   label: { en: '3–4 hours',     ar: '٣–٤ ساعات' },    tags: ['heavy-use', 'app-limit'] },
      { id: '5h-plus',label: { en: '5+ hours',      ar: '٥ ساعات أو أكتر' }, tags: ['heavy-use', 'digital-detox', 'app-limit'] },
    ],
  },

  // ── PORN ADDICTION ───────────────────────────────────────────────────────
  {
    id: 'porn-frequency',
    challengeId: 'porn-addiction',
    text: {
      en: 'How often does it happen?',
      ar: 'بيحصل ده بأي تكرار؟',
    },
    options: [
      { id: 'daily',     label: { en: 'Daily',                   ar: 'يومياً' },              tags: ['daily-urge', 'urgent', 'blocker'] },
      { id: 'few-week',  label: { en: 'A few times a week',      ar: 'كذا مرة في الأسبوع' },  tags: ['moderate-urge', 'tracking'] },
      { id: 'weekly',    label: { en: 'Once a week or less',     ar: 'مرة في الأسبوع أو أقل' }, tags: ['light-urge', 'review'] },
    ],
  },
  {
    id: 'porn-trigger',
    challengeId: 'porn-addiction',
    text: {
      en: 'What usually triggers the urge?',
      ar: 'إيه اللي عادةً بيحفز الرغبة؟',
    },
    options: [
      { id: 'loneliness',  label: { en: 'Loneliness',            ar: 'الوحدة' },            tags: ['loneliness', 'connection', 'social'] },
      { id: 'stress',      label: { en: 'Stress or pressure',    ar: 'الضغط والتوتر' },     tags: ['stress', 'coping', 'breathing'] },
      { id: 'boredom',     label: { en: 'Boredom',               ar: 'الملل' },             tags: ['boredom', 'activity', 'replace-habit'] },
      { id: 'night-alone', label: { en: 'At night when alone',   ar: 'الليل لما أكون لوحدي' }, tags: ['night-alone', 'phone-away', 'night-routine'] },
    ],
  },

  // ── LACK OF DISCIPLINE ───────────────────────────────────────────────────
  {
    id: 'discipline-area',
    challengeId: 'lack-of-discipline',
    text: {
      en: 'Where do you struggle most with discipline?',
      ar: 'في أنهي مجال بتحس إن انضباطك أضعف؟',
    },
    options: [
      { id: 'morning',      label: { en: 'Mornings',                ar: 'الصباح' },          tags: ['morning', 'morning-routine', 'wake-discipline'] },
      { id: 'screen-time',  label: { en: 'Screen time',             ar: 'وقت الشاشة' },      tags: ['screen-time', 'digital-detox', 'phone-away'] },
      { id: 'exercise',     label: { en: 'Exercise',                ar: 'الرياضة' },         tags: ['exercise', 'movement', 'physical'] },
      { id: 'commitments',  label: { en: 'Keeping my commitments',  ar: 'الالتزام بوعودي' }, tags: ['commitment', 'accountability', 'identity'] },
    ],
  },
  {
    id: 'discipline-style',
    challengeId: 'lack-of-discipline',
    text: {
      en: 'How do you usually start a new habit?',
      ar: 'بتبدأ عادتك الجديدة إزاي عادةً؟',
    },
    options: [
      { id: 'all-in',         label: { en: 'Go all-in and burn out',   ar: 'ببدأ بكل قوتي وأخلص بسرعة' }, tags: ['gradual', 'consistency', 'small-wins'] },
      { id: 'slow-build',     label: { en: 'Start tiny and grow',      ar: 'ببدأ صغير وأكبر' },           tags: ['gradual', 'small-wins', 'quick-win'] },
      { id: 'need-tracking',  label: { en: 'I need to see progress',   ar: 'محتاج أشوف تقدمي' },          tags: ['tracking', 'visible-cue', 'streak'] },
      { id: 'need-partner',   label: { en: 'I need someone with me',   ar: 'محتاج حد معايا' },             tags: ['accountability', 'social', 'connection'] },
    ],
  },

  // ── ANXIETY ───────────────────────────────────────────────────────────────
  {
    id: 'anxiety-type',
    challengeId: 'anxiety',
    text: {
      en: 'What does your anxiety feel like most?',
      ar: 'القلق عندك بيكون إزاي أكتر؟',
    },
    options: [
      { id: 'overthinking',     label: { en: 'Overthinking everything',          ar: 'تفكير زيادة في كل حاجة' }, tags: ['overthinking', 'mindfulness', 'journaling'] },
      { id: 'physical-tension', label: { en: 'Physical tension or racing heart', ar: 'توتر جسدي أو قلب بيدق' },  tags: ['physical-tension', 'breathing', 'movement'] },
      { id: 'future-worry',     label: { en: 'Constant worry about the future',  ar: 'خوف مستمر من المستقبل' }, tags: ['future-worry', 'present', 'grounding'] },
      { id: 'social',           label: { en: 'Social situations',                ar: 'المواقف الاجتماعية' },    tags: ['social-anxiety', 'confidence', 'exposure'] },
    ],
  },
  {
    id: 'anxiety-relief',
    challengeId: 'anxiety',
    text: {
      en: 'What helps you feel calmer?',
      ar: 'إيه اللي بيساعدك تهدى؟',
    },
    options: [
      { id: 'nature',     label: { en: 'Being outdoors',     ar: 'في الطبيعة برة' },         tags: ['nature', 'movement', 'outdoor'] },
      { id: 'movement',   label: { en: 'Moving my body',     ar: 'لما أحرك جسمي' },          tags: ['movement', 'exercise', 'physical'] },
      { id: 'quiet',      label: { en: 'Quiet and stillness',ar: 'الهدوء والسكون' },         tags: ['mindfulness', 'breathing', 'meditation'] },
      { id: 'connection', label: { en: 'Talking to someone', ar: 'لما أتكلم مع حد' },        tags: ['connection', 'social', 'accountability'] },
    ],
  },

  // ── POOR SLEEP ────────────────────────────────────────────────────────────
  {
    id: 'sleep-issue',
    challengeId: 'poor-sleep',
    text: {
      en: "What's your biggest sleep problem?",
      ar: 'إيه أكبر مشكلة في نومك؟',
    },
    options: [
      { id: 'cant-sleep',  label: { en: "Can't fall asleep",       ar: 'مش قادر أنام' },               tags: ['sleep-onset', 'wind-down', 'routine'] },
      { id: 'late-night',  label: { en: 'Sleeping too late',       ar: 'بنام متأخر جداً' },             tags: ['late-night', 'screen-off', 'fixed-bedtime'] },
      { id: 'wake-tired',  label: { en: 'Waking up exhausted',     ar: 'بصحى تعبان' },                 tags: ['sleep-quality', 'morning', 'sunlight', 'wake-tired'] },
      { id: 'inconsistent',label: { en: 'Very inconsistent schedule', ar: 'مواعيد نوم مش منتظمة خالص' }, tags: ['consistency', 'schedule', 'fixed-bedtime', 'inconsistent'] },
    ],
  },
  {
    id: 'sleep-evening',
    challengeId: 'poor-sleep',
    text: {
      en: 'What does your evening usually look like?',
      ar: 'مساءك بيكون شكله إيه عادةً؟',
    },
    options: [
      { id: 'on-phone',    label: { en: 'On my phone in bed',     ar: 'على الموبايل في السرير' },     tags: ['screen-off', 'phone-away', 'bed-rule'] },
      { id: 'late-eating', label: { en: 'Eating late',            ar: 'بآكل متأخر' },                  tags: ['late-eating', 'sleep-quality', 'routine'] },
      { id: 'caffeine',    label: { en: 'Coffee or energy drinks',ar: 'قهوة أو مشروبات طاقة' },        tags: ['caffeine', 'sleep-quality'] },
      { id: 'no-routine',  label: { en: 'No real routine',        ar: 'مفيش روتين خالص' },             tags: ['routine', 'wind-down', 'consistency', 'no-routine'] },
    ],
  },

  // ── LACK OF FOCUS ─────────────────────────────────────────────────────────
  {
    id: 'focus-context',
    challengeId: 'lack-of-focus',
    text: {
      en: 'When do you struggle most to focus?',
      ar: 'امتى بتواجه صعوبة في التركيز أكتر؟',
    },
    options: [
      { id: 'studying',   label: { en: 'While studying',       ar: 'وقت المذاكرة' },     tags: ['study', 'deep-work', 'focus'] },
      { id: 'working',    label: { en: 'While working',        ar: 'وقت الشغل' },         tags: ['work', 'deep-work', 'focus'] },
      { id: 'reading',    label: { en: 'While reading',        ar: 'وقت القراءة' },       tags: ['reading', 'focus', 'attention'] },
      { id: 'all-tasks',  label: { en: 'With almost everything', ar: 'مع تقريباً كل حاجة' }, tags: ['general-focus', 'attention', 'mindfulness'] },
    ],
  },
  {
    id: 'focus-environment',
    challengeId: 'lack-of-focus',
    text: {
      en: "What's your focus environment like?",
      ar: 'بيئة شغلك عاملة إزاي؟',
    },
    options: [
      { id: 'noisy',       label: { en: 'Noisy or crowded',     ar: 'دوشة أو زحمة' },     tags: ['noise', 'headphones', 'environment'] },
      { id: 'phone-near',  label: { en: 'Phone always near',    ar: 'الموبايل قريب' },    tags: ['phone-away', 'phone-distance', 'environment'] },
      { id: 'cluttered',   label: { en: 'Cluttered workspace',  ar: 'مكان شغل مبعثر' },   tags: ['environment', 'clear-desk', 'visible-cue'] },
      { id: 'multi-tab',   label: { en: 'Too many tabs open',   ar: 'تابات كتير مفتوحة' }, tags: ['environment', 'single-tab', 'deep-work'] },
    ],
  },

  // ── GENERAL IMPROVEMENT ───────────────────────────────────────────────────
  {
    id: 'general-area',
    challengeId: 'general-improvement',
    text: {
      en: 'Which area do you want to grow most?',
      ar: 'في أنهي مجال عايز تكبر أكتر؟',
    },
    options: [
      { id: 'body',          label: { en: 'My body & health',        ar: 'جسمي وصحتي' },           tags: ['physical', 'movement', 'health', 'body'] },
      { id: 'mind',          label: { en: 'My mind & calm',          ar: 'عقلي وراحتي' },          tags: ['mindfulness', 'mind', 'learning'] },
      { id: 'productivity',  label: { en: 'Productivity & output',   ar: 'إنتاجيتي' },             tags: ['productivity', 'deep-work', 'time-block'] },
      { id: 'relationships', label: { en: 'Relationships & people',  ar: 'علاقاتي والناس' },       tags: ['connection', 'social', 'relationships'] },
    ],
  },
  {
    id: 'general-rhythm',
    challengeId: 'general-improvement',
    text: {
      en: 'What rhythm do you want to build?',
      ar: 'عايز تبني روتين شكله إيه؟',
    },
    options: [
      { id: 'morning-builder',label: { en: 'Strong morning routine', ar: 'روتين صباحي قوي' },     tags: ['morning', 'morning-routine', 'wake-discipline'] },
      { id: 'evening-builder',label: { en: 'Calm evening routine',   ar: 'روتين مسائي هادي' },    tags: ['evening', 'wind-down', 'night-routine'] },
      { id: 'weekly-rhythm',  label: { en: 'Weekly anchor habits',   ar: 'عادات أسبوعية ثابتة' }, tags: ['weekly', 'review', 'tracking'] },
      { id: 'flexible',       label: { en: 'Flexible daily wins',    ar: 'انتصارات يومية مرنة' },  tags: ['quick-win', 'small-wins', 'micro-action'] },
    ],
  },
];

// ─── Export ───────────────────────────────────────────────────────────────────

export const ALL_QUIZ_QUESTIONS: QuizQuestion[] = [
  ...CHALLENGE_SPECIFIC,
  ...UNIVERSAL,
];

/** Build ordered question list for given challenges (max ~6 questions total) */
export function buildQuizQuestions(
  challengeIds: ChallengeId[]
): QuizQuestion[] {
  const perChallengeMax = 2;
  const challengeCount: Partial<Record<ChallengeId, number>> = {};
  const result: QuizQuestion[] = [];

  // Challenge-specific questions first (max perChallengeMax per challenge)
  for (const q of CHALLENGE_SPECIFIC) {
    const cid = q.challengeId as ChallengeId;
    if (!challengeIds.includes(cid)) continue;
    challengeCount[cid] = (challengeCount[cid] ?? 0) + 1;
    if (challengeCount[cid]! <= perChallengeMax) {
      result.push(q);
    }
  }

  // Universal questions always appended at the end
  result.push(...UNIVERSAL);

  return result;
}
