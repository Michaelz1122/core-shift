export type Language = 'en' | 'ar';

export type Friction = 'procrastination' | 'distraction' | 'overwhelm' | 'low_energy';

export type RecoveryType = 'focus' | 'activation' | 'urge_delay' | 'breathing';

export interface Goal {
  id: string;
  title: string;
  icon: string;
  createdAt: string; // ISO String
  order: number;
  archived: boolean;
}

export interface Action {
  id: string;
  goalId: string;
  title: string;
  isCompleted: boolean;
  date: string; // YYYY-MM-DD
  order: number;
}

export interface DailyPerformance {
  date: string;
  totalActions: number;
  completedActions: number;
  completionRate: number; // 0.0 to 1.0
  recoveriesUsed: number;
}

export interface AppState {
  _hasHydrated: boolean;

  // Onboarding & Preferences
  onboarded: boolean;
  language: Language;
  primaryFriction: Friction | null; // Kept for onboarding/recovery context
  darkMode: boolean;
  hasShownReview: boolean;

  // Core Data
  goals: Goal[];
  actions: Record<string, Action[]>; // Keyed by YYYY-MM-DD

  // Progress & History
  streak: number;
  lastActiveDate: string | null;
  lastEveningReviewDate: string | null;
  history: Record<string, DailyPerformance>; // Keyed by YYYY-MM-DD
}

export interface AppActions {
  setHydrated: (h: boolean) => void;

  // Preferences
  setLanguage: (lang: Language) => void;
  setPrimaryFriction: (f: Friction) => void;
  toggleDarkMode: () => void;
  setHasShownReview: (shown: boolean) => void;

  // Onboarding
  completeOnboarding: (initialGoal: Goal, initialAction: Action) => void;

  // Goals CRUD
  addGoal: (g: Omit<Goal, 'id' | 'createdAt' | 'archived'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  reorderGoals: (newOrder: Goal[]) => void;

  // Actions CRUD
  addAction: (dateStr: string, a: Omit<Action, 'id' | 'date' | 'isCompleted'>) => void;
  updateAction: (dateStr: string, id: string, updates: Partial<Action>) => void;
  deleteAction: (dateStr: string, id: string) => void;
  toggleActionCompletion: (dateStr: string, id: string) => void;
  reorderActions: (dateStr: string, newOrder: Action[]) => void;
  
  // Evening Review
  completeEveningReview: (dateStr: string) => void;

  // Execution & Logs
  logRecovery: (type: RecoveryType) => void;

  // System
  checkNewDay: () => void;
  resetAll: () => void;
}
