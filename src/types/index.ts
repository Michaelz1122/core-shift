export type Language = 'en' | 'ar';

export type Struggle = 'procrastination' | 'phone_addiction' | 'focus' | 'discipline' | 'consistency';

export type Goal = 'work' | 'study' | 'health' | 'life_balance';

export type Feeling = 'distracted' | 'no_energy' | 'urge' | 'stressed';

export interface Action {
  id: string;
  icon: string;
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  duration?: string;
  completed: boolean;
}

export interface AppState {
  _hasHydrated: boolean;

  // Onboarding
  onboarded: boolean;
  language: Language;
  struggle: Struggle | null;
  goals: Goal[];

  // Plan
  actions: Action[];

  // Progress
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  history: Record<string, boolean>; // dateStr -> allCompleted
  lastOverloadPrompt: number | null;

  // Settings
  darkMode: boolean;
  remindersEnabled: boolean;
}

export interface AppActions {
  setHydrated: (h: boolean) => void;

  // Onboarding
  setLanguage: (lang: Language) => void;
  setStruggle: (s: Struggle) => void;
  toggleGoal: (g: Goal) => void;
  completeOnboarding: (customActions: Action[]) => void;

  // Actions
  toggleAction: (id: string) => void;
  regeneratePlan: () => void;

  // Progress
  addXp: (amount: number) => void;
  checkNewDay: () => void;
  setOverloadPrompt: (streak: number) => void;

  // Settings
  toggleDarkMode: () => void;
  toggleReminders: () => void;
  resetAll: () => void;
}
