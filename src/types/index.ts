// ── Language ──────────────────────────────────────────────────────────────────
export type Language = 'ar' | 'en';

// ── Challenge (replaces Goal + Struggle) ─────────────────────────────────────
export type ChallengeId =
  | 'procrastination'
  | 'porn-addiction'
  | 'social-media-addiction'
  | 'lack-of-discipline'
  | 'lack-of-focus'
  | 'poor-sleep'
  | 'anxiety'
  | 'other';

// ── Vision ────────────────────────────────────────────────────────────────────
export type VisionId =
  | 'more-disciplined'
  | 'more-focused'
  | 'quit-addiction'
  | 'study-consistently'
  | 'build-business'
  | 'better-mental-health'
  | 'better-sleep'
  | 'more-productive';

// ── Action (replaces Habit) ───────────────────────────────────────────────────
export interface Action {
  id: string;
  title: string;
  emoji: string;
  challengeId: ChallengeId;
  frequency: 'daily' | 'weekly';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isCustom?: boolean;
}

// ── Mood / Check-in ───────────────────────────────────────────────────────────
export type MoodType = 'calm' | 'tired' | 'focused' | 'stressed' | 'low' | 'motivated';

export interface CheckIn {
  date: string; // YYYY-MM-DD
  mood: MoodType;
  energy: number; // 1-5
  focus: number;  // 1-5
  note?: string;
}

// ── Notes ─────────────────────────────────────────────────────────────────────
export interface Note {
  id: string;
  date: string;      // YYYY-MM-DD
  content: string;
  createdAt: string; // ISO timestamp
}

// ── Rescue / Shift Now ────────────────────────────────────────────────────────
export type RescueFeeling =
  | 'laziness'
  | 'distraction'
  | 'low-motivation'
  | 'harmful-urge'
  | 'relapse'
  | 'sadness'
  | 'anxiety'
  | 'loneliness'
  | 'feeling-lost';

/** Maps a ChallengeId to the closest RescueFeeling for Shift Now prioritisation */
export const CHALLENGE_TO_RESCUE: Partial<Record<ChallengeId, RescueFeeling>> = {
  procrastination:           'laziness',
  'porn-addiction':          'harmful-urge',
  'social-media-addiction':  'distraction',
  'lack-of-discipline':      'relapse',
  'lack-of-focus':           'distraction',
  'poor-sleep':              'low-motivation',
  anxiety:                   'anxiety',
  other:                     'feeling-lost',
};
