import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { 
  AppState, AppActions, Language, Friction, Goal, Action, 
  RecoveryType, DailyPerformance 
} from '@/types';

export const getLocalDateStr = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function calculateStreak(history: Record<string, DailyPerformance>): number {
  let streak = 0;
  const today = new Date();
  const todayStr = getLocalDateStr(today);
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateStr(yesterday);
  
  // A day counts for streak if they completed at least 1 action
  const isDayActive = (dateStr: string) => {
    const stats = history[dateStr];
    return stats && stats.completedActions > 0;
  };

  if (!isDayActive(todayStr) && !isDayActive(yesterdayStr)) {
    return 0;
  }
  
  const checkDate = new Date(isDayActive(todayStr) ? today : yesterday);
  
  while (true) {
    const checkStr = getLocalDateStr(checkDate);
    if (isDayActive(checkStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

const getEmptyDailyPerformance = (dateStr: string): DailyPerformance => ({
  date: dateStr,
  totalActions: 0,
  completedActions: 0,
  completionRate: 0,
  recoveriesUsed: 0,
});

type Store = AppState & AppActions;

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────
      _hasHydrated: false,
      onboarded: false,
      language: 'en',
      primaryFriction: null,
      darkMode: false,
      hasShownReview: false,

      goals: [],
      actions: {},
      
      streak: 0,
      lastActiveDate: null,
      lastEveningReviewDate: null,
      history: {},

      setHydrated: (h: boolean) => set({ _hasHydrated: h }),

      // ── Preferences & Onboarding ───────────────
      setLanguage: (lang: Language) => set({ language: lang }),
      setPrimaryFriction: (f: Friction) => set({ primaryFriction: f }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setHasShownReview: (shown: boolean) => set({ hasShownReview: shown }),

      completeOnboarding: (initialGoal: Goal, initialAction: Action) => {
        const today = getLocalDateStr();
        set({
          onboarded: true,
          goals: [initialGoal],
          actions: { [today]: [initialAction] },
          lastActiveDate: today,
          streak: 0,
        });
      },

      // ── Goals CRUD ─────────────────────────────
      addGoal: (g) => set((s) => {
        const newGoal: Goal = { ...g, id: `goal_${Date.now()}`, createdAt: new Date().toISOString(), archived: false };
        return { goals: [...s.goals, newGoal] };
      }),
      updateGoal: (id, updates) => set((s) => ({
        goals: s.goals.map(g => g.id === id ? { ...g, ...updates } : g)
      })),
      deleteGoal: (id) => set((s) => {
        // Also optionally cleanup actions tied to this goal? Keeping it simple.
        return { goals: s.goals.filter(g => g.id !== id) };
      }),
      reorderGoals: (newOrder) => set({ goals: newOrder }),

      // ── Actions CRUD ───────────────────────────
      addAction: (dateStr, a) => set((s) => {
        const dayActions = s.actions[dateStr] || [];
        const newAction: Action = { ...a, id: `action_${Date.now()}`, date: dateStr, isCompleted: false };
        return {
          actions: { ...s.actions, [dateStr]: [...dayActions, newAction] }
        };
      }),
      updateAction: (dateStr, id, updates) => set((s) => {
        const dayActions = s.actions[dateStr] || [];
        return {
          actions: {
            ...s.actions,
            [dateStr]: dayActions.map(a => a.id === id ? { ...a, ...updates } : a)
          }
        };
      }),
      deleteAction: (dateStr, id) => set((s) => {
        const dayActions = s.actions[dateStr] || [];
        return {
          actions: {
            ...s.actions,
            [dateStr]: dayActions.filter(a => a.id !== id)
          }
        };
      }),
      toggleActionCompletion: (dateStr, id) => set((s) => {
        const dayActions = s.actions[dateStr] || [];
        const updatedActions = dayActions.map(a => a.id === id ? { ...a, isCompleted: !a.isCompleted } : a);
        
        // Update history stats live
        const total = updatedActions.length;
        const completed = updatedActions.filter(a => a.isCompleted).length;
        const currentHist = s.history[dateStr] || getEmptyDailyPerformance(dateStr);
        
        const newHist = {
          ...s.history,
          [dateStr]: {
            ...currentHist,
            totalActions: total,
            completedActions: completed,
            completionRate: total > 0 ? completed / total : 0,
          }
        };

        return {
          actions: { ...s.actions, [dateStr]: updatedActions },
          history: newHist,
          streak: calculateStreak(newHist),
          lastActiveDate: dateStr,
        };
      }),
      reorderActions: (dateStr, newOrder) => set((s) => ({
        actions: { ...s.actions, [dateStr]: newOrder }
      })),

      // ── Evening Review & Execution ─────────────
      completeEveningReview: (dateStr) => set((s) => ({
        lastEveningReviewDate: dateStr,
      })),

      logRecovery: (type) => set((s) => {
        const today = getLocalDateStr();
        const currentStats = s.history[today] || getEmptyDailyPerformance(today);
        
        const newHist = {
          ...s.history,
          [today]: {
            ...currentStats,
            recoveriesUsed: currentStats.recoveriesUsed + 1,
          }
        };

        return {
          history: newHist,
        };
      }),

      // ── System ─────────────────────────────────
      checkNewDay: () => {
        const today = getLocalDateStr();
        const { lastActiveDate, history } = get();
        if (lastActiveDate !== today) {
          const newStreak = calculateStreak(history);
          set({
            streak: newStreak,
          });
        }
      },

      resetAll: () =>
        set({
          onboarded: false,
          language: 'en',
          primaryFriction: null,
          goals: [],
          actions: {},
          streak: 0,
          lastActiveDate: null,
          lastEveningReviewDate: null,
          history: {},
          darkMode: false,
          hasShownReview: false,
        }),
    }),
    {
      name: 'coreshift-store-v3', // Bumped for new schema
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
