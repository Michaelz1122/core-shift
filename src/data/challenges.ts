import type { ChallengeId } from '@/types';

export interface Challenge {
  id: ChallengeId;
  emoji: string;
  label: { en: string; ar: string };
  description: { en: string; ar: string };
  color: string;
}

export const ALL_CHALLENGES: Challenge[] = [
  {
    id: 'procrastination',
    emoji: '⏳',
    label: { en: 'Procrastination', ar: 'التسويف' },
    description: { en: 'Putting things off constantly', ar: 'تأجيل المهام باستمرار' },
    color: '#FF9500',
  },
  {
    id: 'porn-addiction',
    emoji: '🔒',
    label: { en: 'Porn Addiction', ar: 'إدمان الإباحية' },
    description: { en: 'Struggling to quit or reduce', ar: 'صعوبة الإقلاع أو التخفيف' },
    color: '#FF3B30',
  },
  {
    id: 'social-media-addiction',
    emoji: '📱',
    label: { en: 'Social Media Addiction', ar: 'إدمان السوشيال ميديا' },
    description: { en: 'Endless scrolling & distraction', ar: 'تمرير لانهائي وتشتت' },
    color: '#5856D6',
  },
  {
    id: 'lack-of-discipline',
    emoji: '⚡',
    label: { en: 'Lack of Discipline', ar: 'ضعف الانضباط' },
    description: { en: 'Start strong, stop too soon', ar: 'تبدأ قوي وتوقف بسرعة' },
    color: '#FF6B35',
  },
  {
    id: 'lack-of-focus',
    emoji: '🌀',
    label: { en: 'Lack of Focus', ar: 'ضعف التركيز' },
    description: { en: "Mind wanders, can't concentrate", ar: 'عقلك يشرد ومش قادر تركز' },
    color: '#2D7FF9',
  },
  {
    id: 'poor-sleep',
    emoji: '😴',
    label: { en: 'Poor Sleep', ar: 'اضطراب النوم' },
    description: { en: 'Late nights, exhausted mornings', ar: 'سهر وصحيان تعبان' },
    color: '#34C759',
  },
  {
    id: 'anxiety',
    emoji: '🌪️',
    label: { en: 'Anxiety', ar: 'القلق' },
    description: { en: 'Worry, overthinking, tension', ar: 'قلق وتفكير زيادة وتوتر' },
    color: '#AF52DE',
  },
  {
    id: 'general-improvement',
    emoji: '🌱',
    label: { en: 'General Improvement', ar: 'تطوير عام' },
    description: { en: 'Build a stronger version of me', ar: 'أبني نسخة أقوى من نفسي' },
    color: '#30B0C7',
  },
];
