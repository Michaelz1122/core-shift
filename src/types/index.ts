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

export interface Goal {
  id: GoalId;
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

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export type MoodType = 'calm' | 'tired' | 'focused' | 'stressed' | 'low' | 'motivated';

export interface CheckIn {
  date: string; // YYYY-MM-DD
  mood: MoodType;
  energy: number; // 1-5
  focus: number; // 1-5
  note?: string;
}

export interface Note {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  createdAt: string; // ISO timestamp
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

export interface WeeklyReview {
  weekStart: string; // YYYY-MM-DD
  completedHabits: number;
  missedHabits: number;
  completionRate: number;
  wentWell?: string;
  wasDifficult?: string;
  improveNext?: string;
}

export interface AppState {
  // Onboarding
  hasCompletedOnboarding: boolean;
  selectedGoalIds: GoalId[];
  selectedHabitIds: string[];

  // Today
  todayCompletions: HabitCompletion[];
  todayCheckIn: CheckIn | null;

  // Notes
  notes: Note[];

  // Settings
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
}
