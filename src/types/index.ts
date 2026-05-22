export type GoalId =
  | 'health'
  | 'fitness'
  | 'productivity'
  | 'career'
  | 'learning'
  | 'reading'
  | 'digital-discipline'
  | 'social-life'
  | 'emotional-balance'
  | 'spiritual-growth'
  | 'custom';

export type StruggleId =
  | 'laziness'
  | 'distraction'
  | 'low-motivation'
  | 'overthinking'
  | 'inconsistency'
  | 'harmful-urges'
  | 'low-energy'
  | 'feeling-lost'
  | 'isolation'
  | 'procrastination';

export interface Goal {
  id: GoalId;
  label: string;
  emoji: string;
}

export interface Struggle {
  id: StruggleId;
  label: string;
  emoji: string;
}

export interface Habit {
  id: string;
  title: string;
  goalId: GoalId;
  frequency: 'daily' | 'weekly';
  reminderTime?: string;
  isCustom?: boolean;
}

export type MoodType = 'calm' | 'tired' | 'focused' | 'stressed' | 'low' | 'motivated';

export interface CheckIn {
  date: string; // YYYY-MM-DD
  mood: MoodType;
  energy: number; // 1-5
  focus: number;  // 1-5
  note?: string;
}

export interface Note {
  id: string;
  date: string;       // YYYY-MM-DD
  content: string;
  createdAt: string;  // ISO timestamp
}

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

/** Maps a StruggleId to the closest RescueFeeling for prioritisation */
export const STRUGGLE_TO_RESCUE: Partial<Record<StruggleId, RescueFeeling>> = {
  laziness: 'laziness',
  distraction: 'distraction',
  'low-motivation': 'low-motivation',
  overthinking: 'anxiety',
  inconsistency: 'relapse',
  'harmful-urges': 'harmful-urge',
  'feeling-lost': 'feeling-lost',
  isolation: 'loneliness',
  procrastination: 'laziness',
};

export interface WeeklyReview {
  weekStart: string;
  completedHabits: number;
  missedHabits: number;
  completionRate: number;
  wentWell?: string;
  wasDifficult?: string;
  improveNext?: string;
}
