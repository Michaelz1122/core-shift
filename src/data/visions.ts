import type { VisionId } from '@/types';

export interface Vision {
  id: VisionId;
  emoji: string;
  label: { en: string; ar: string };
}

export const ALL_VISIONS: Vision[] = [
  {
    id: 'more-disciplined',
    emoji: '🏋️',
    label: { en: 'More disciplined', ar: 'أكثر انضباطاً' },
  },
  {
    id: 'more-focused',
    emoji: '🎯',
    label: { en: 'More focused', ar: 'أكثر تركيزاً' },
  },
  {
    id: 'quit-addiction',
    emoji: '🔓',
    label: { en: 'Quit my addiction', ar: 'أتخلص من الإدمان' },
  },
  {
    id: 'study-consistently',
    emoji: '📚',
    label: { en: 'Study consistently', ar: 'أذاكر بانتظام' },
  },
  {
    id: 'build-business',
    emoji: '🚀',
    label: { en: 'Build my business', ar: 'أبني مشروعي' },
  },
  {
    id: 'better-mental-health',
    emoji: '🧠',
    label: { en: 'Better mental health', ar: 'صحة نفسية أفضل' },
  },
  {
    id: 'better-sleep',
    emoji: '🌙',
    label: { en: 'Better sleep schedule', ar: 'نوم أفضل ومنظم' },
  },
  {
    id: 'more-productive',
    emoji: '⚡',
    label: { en: 'More productive every day', ar: 'أكثر إنتاجية كل يوم' },
  },
];
