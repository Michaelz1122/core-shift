import type { ChallengeId } from '@/types';

export interface QuizOption {
  id: string;
  label: { en: string; ar: string };
  /** Tags used by action plan engine to score action relevance */
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  /** 'universal' = shown for all challenges, otherwise challenge-specific */
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
        tags: ['beginner'],
      },
      {
        id: 'small',
        label: { en: 'Small, steady steps', ar: 'خطوات صغيرة ومستمرة' },
        tags: ['beginner', 'gradual'],
      },
      {
        id: 'medium',
        label: { en: 'Medium-sized changes', ar: 'تغييرات متوسطة' },
        tags: ['intermediate'],
      },
      {
        id: 'big',
        label: { en: 'Big transformation', ar: 'تحول كبير' },
        tags: ['intermediate', 'advanced'],
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
        tags: ['beginner', 'gradual'],
      },
      {
        id: 'forgot',
        label: { en: 'I simply forgot', ar: 'نسيت بكل بساطة' },
        tags: ['reminder', 'habit-cue'],
      },
      {
        id: 'lost-motivation',
        label: { en: 'I lost motivation', ar: 'فقدت الحماس' },
        tags: ['accountability', 'reward'],
      },
      {
        id: 'bad-day',
        label: { en: 'One bad day ruined everything', ar: 'يوم واحد وحش خرب كل حاجة' },
        tags: ['resilience', 'restart'],
      },
    ],
  },
];

// ─── Challenge-specific questions ────────────────────────────────────────────

const CHALLENGE_SPECIFIC: QuizQuestion[] = [
  // Procrastination
  {
    id: 'procrastination-when',
    challengeId: 'procrastination',
    text: {
      en: 'When does procrastination usually hit you?',
      ar: 'التسويف بيجيلك امتى عادةً؟',
    },
    options: [
      {
        id: 'studying',
        label: { en: 'While studying', ar: 'وقت المذاكرة' },
        tags: ['study', 'focus'],
      },
      {
        id: 'work',
        label: { en: 'During work', ar: 'وقت الشغل' },
        tags: ['work', 'productivity'],
      },
      {
        id: 'night',
        label: { en: 'At night', ar: 'بالليل' },
        tags: ['night', 'night-routine'],
      },
      {
        id: 'all-day',
        label: { en: 'All day long', ar: 'طول اليوم' },
        tags: ['structure', 'schedule'],
      },
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
      {
        id: 'phone',
        label: { en: 'My phone', ar: 'موبايلي' },
        tags: ['phone', 'phone-away'],
      },
      {
        id: 'social-media',
        label: { en: 'Social media', ar: 'السوشيال ميديا' },
        tags: ['social-media', 'app-limit'],
      },
      {
        id: 'no-plan',
        label: { en: 'No clear plan', ar: 'مفيش خطة واضحة' },
        tags: ['planning', 'structure'],
      },
      {
        id: 'fear-failure',
        label: { en: 'Fear of failure', ar: 'خوف من الفشل' },
        tags: ['mindset', 'small-wins'],
      },
    ],
  },

  // Social Media Addiction
  {
    id: 'social-media-trigger',
    challengeId: 'social-media-addiction',
    text: {
      en: 'When do you reach for your phone most?',
      ar: 'امتى بتشيل موبايلك أكتر؟',
    },
    options: [
      {
        id: 'boredom',
        label: { en: 'When bored', ar: 'لما بتتملل' },
        tags: ['boredom', 'replace-habit'],
      },
      {
        id: 'stress',
        label: { en: 'When stressed', ar: 'لما بتتوتر' },
        tags: ['stress', 'coping'],
      },
      {
        id: 'morning',
        label: { en: 'First thing in the morning', ar: 'أول ما أصحى' },
        tags: ['morning', 'phone-delay'],
      },
      {
        id: 'automatic',
        label: { en: 'Without even thinking', ar: 'تلقائياً من غير ما أفكر' },
        tags: ['awareness', 'cue-interrupt'],
      },
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
      {
        id: '1-2h',
        label: { en: '1–2 hours', ar: 'ساعة لساعتين' },
        tags: ['moderate-use', 'scheduled-use'],
      },
      {
        id: '3-4h',
        label: { en: '3–4 hours', ar: '٣–٤ ساعات' },
        tags: ['heavy-use', 'app-limit'],
      },
      {
        id: '5h-plus',
        label: { en: '5+ hours', ar: '٥ ساعات أو أكتر' },
        tags: ['heavy-use', 'digital-detox'],
      },
    ],
  },

  // Porn Addiction
  {
    id: 'porn-frequency',
    challengeId: 'porn-addiction',
    text: {
      en: 'How often does it happen?',
      ar: 'بيحصل ده بأي تكرار؟',
    },
    options: [
      {
        id: 'daily',
        label: { en: 'Daily', ar: 'يومياً' },
        tags: ['daily-urge', 'urgent'],
      },
      {
        id: 'few-week',
        label: { en: 'A few times a week', ar: 'كذا مرة في الأسبوع' },
        tags: ['moderate-urge'],
      },
      {
        id: 'weekly',
        label: { en: 'Once a week or less', ar: 'مرة في الأسبوع أو أقل' },
        tags: ['light-urge'],
      },
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
      {
        id: 'loneliness',
        label: { en: 'Loneliness', ar: 'الوحدة' },
        tags: ['loneliness', 'connection'],
      },
      {
        id: 'stress',
        label: { en: 'Stress or pressure', ar: 'الضغط والتوتر' },
        tags: ['stress', 'coping'],
      },
      {
        id: 'boredom',
        label: { en: 'Boredom', ar: 'الملل' },
        tags: ['boredom', 'activity'],
      },
      {
        id: 'night-alone',
        label: { en: 'At night when alone', ar: 'الليل لما أكون لوحدي' },
        tags: ['night-alone', 'phone-away'],
      },
    ],
  },

  // Lack of Discipline
  {
    id: 'discipline-area',
    challengeId: 'lack-of-discipline',
    text: {
      en: 'Where do you struggle most with discipline?',
      ar: 'في أنهي مجال بتحس إن انضباطك أضعف؟',
    },
    options: [
      {
        id: 'morning',
        label: { en: 'Mornings', ar: 'الصباح' },
        tags: ['morning', 'morning-routine'],
      },
      {
        id: 'screen-time',
        label: { en: 'Screen time', ar: 'وقت الشاشة' },
        tags: ['digital-detox', 'screen-time'],
      },
      {
        id: 'exercise',
        label: { en: 'Exercise', ar: 'الرياضة' },
        tags: ['movement', 'exercise'],
      },
      {
        id: 'commitments',
        label: { en: 'Keeping my commitments', ar: 'الالتزام بوعودي' },
        tags: ['commitment', 'accountability'],
      },
    ],
  },

  // Anxiety
  {
    id: 'anxiety-type',
    challengeId: 'anxiety',
    text: {
      en: 'What does your anxiety feel like most?',
      ar: 'القلق عندك بيكون إزاي أكتر؟',
    },
    options: [
      {
        id: 'overthinking',
        label: { en: 'Overthinking everything', ar: 'تفكير زيادة في كل حاجة' },
        tags: ['overthinking', 'mindfulness'],
      },
      {
        id: 'physical-tension',
        label: { en: 'Physical tension or racing heart', ar: 'توتر جسدي أو قلب بيدق' },
        tags: ['breathing', 'movement'],
      },
      {
        id: 'future-worry',
        label: { en: 'Constant worry about the future', ar: 'خوف مستمر من المستقبل' },
        tags: ['present', 'grounding'],
      },
      {
        id: 'social',
        label: { en: 'Social situations', ar: 'المواقف الاجتماعية' },
        tags: ['social', 'confidence'],
      },
    ],
  },

  // Poor Sleep
  {
    id: 'sleep-issue',
    challengeId: 'poor-sleep',
    text: {
      en: "What's your biggest sleep problem?",
      ar: 'إيه أكبر مشكلة في نومك؟',
    },
    options: [
      {
        id: 'cant-sleep',
        label: { en: "Can't fall asleep", ar: 'مش قادر أنام' },
        tags: ['sleep-onset', 'routine'],
      },
      {
        id: 'late-night',
        label: { en: 'Sleeping too late', ar: 'بنام متأخر جداً' },
        tags: ['late-night', 'screen-off'],
      },
      {
        id: 'wake-tired',
        label: { en: 'Waking up exhausted', ar: 'بصحى تعبان' },
        tags: ['sleep-quality', 'morning'],
      },
      {
        id: 'inconsistent',
        label: { en: 'Very inconsistent schedule', ar: 'مواعيد نوم مش منتظمة خالص' },
        tags: ['consistency', 'schedule'],
      },
    ],
  },

  // Lack of Focus
  {
    id: 'focus-context',
    challengeId: 'lack-of-focus',
    text: {
      en: 'When do you struggle most to focus?',
      ar: 'امتى بتواجه صعوبة في التركيز أكتر؟',
    },
    options: [
      {
        id: 'studying',
        label: { en: 'While studying', ar: 'وقت المذاكرة' },
        tags: ['study', 'deep-work'],
      },
      {
        id: 'working',
        label: { en: 'While working', ar: 'وقت الشغل' },
        tags: ['work', 'deep-work'],
      },
      {
        id: 'reading',
        label: { en: 'While reading', ar: 'وقت القراءة' },
        tags: ['reading', 'focus'],
      },
      {
        id: 'all-tasks',
        label: { en: 'With almost everything', ar: 'مع تقريباً كل حاجة' },
        tags: ['general-focus'],
      },
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
