export type Language = 'en' | 'ar';

export type Struggle = 'procrastination' | 'phone_addiction' | 'focus' | 'discipline' | 'consistency';

export type Goal = 'work' | 'study' | 'health' | 'life_balance';

export type Feeling = 'distracted' | 'no_energy' | 'urge' | 'stressed';

export interface Action {
  id: string;
  emoji: string;
  title: string;
  titleAr: string;
  completed: boolean;
}

export interface AppState {
  // Onboarding
  onboarded: boolean;
  language: Language;
  struggle: Struggle | null;
  goal: Goal | null;

  // Plan
  actions: Action[];

  // Progress
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  history: Record<string, boolean>; // dateStr -> allCompleted

  // Settings
  darkMode: boolean;
  remindersEnabled: boolean;
}

export interface AppActions {
  // Onboarding
  setLanguage: (lang: Language) => void;
  setStruggle: (s: Struggle) => void;
  setGoal: (g: Goal) => void;
  completeOnboarding: () => void;

  // Actions
  toggleAction: (id: string) => void;
  regeneratePlan: () => void;

  // Progress
  addXp: (amount: number) => void;
  checkNewDay: () => void;

  // Settings
  toggleDarkMode: () => void;
  toggleReminders: () => void;
  resetAll: () => void;
}
