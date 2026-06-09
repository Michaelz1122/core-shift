import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppState, AppActions, Language, Struggle, Goal, Action } from '@/types';
import { generatePlan } from '@/utils/planEngine';

export const getLocalDateStr = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function calculateStreak(history: Record<string, boolean>): number {
  let streak = 0;
  const today = new Date();
  const todayStr = getLocalDateStr(today);
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateStr(yesterday);
  
  if (!history[todayStr] && !history[yesterdayStr]) {
    return 0;
  }
  
  const checkDate = new Date(history[todayStr] ? today : yesterday);
  
  while (true) {
    const checkStr = getLocalDateStr(checkDate);
    if (history[checkStr]) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

const getLevel = (xp: number) => Math.floor(xp / 100) + 1;

type Store = AppState & AppActions;

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────
      _hasHydrated: false,
      onboarded: false,
      language: 'en',
      struggle: null,
      goals: [],

      // Plan
      actions: [],

      // Progress
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null,
      history: {},
      lastOverloadPrompt: null,

      // Settings
      darkMode: false,
      remindersEnabled: true,

      setHydrated: (h: boolean) => set({ _hasHydrated: h }),

      // ── Onboarding ─────────────────────────────
      setLanguage: (lang: Language) => set({ language: lang }),

      setStruggle: (s: Struggle) => set({ struggle: s }),

      toggleGoal: (g: Goal) => set((state) => {
        const hasGoal = state.goals.includes(g);
        if (hasGoal) {
          return { goals: state.goals.filter((goal) => goal !== g) };
        } else {
          return { goals: [...state.goals, g] };
        }
      }),

      completeOnboarding: (customActions: Action[]) => {
        set({
          onboarded: true,
          actions: customActions,
          lastActiveDate: getLocalDateStr(),
          streak: 0,
        });
      },

      // ── Actions ────────────────────────────────
      toggleAction: (id: string) => {
        const { actions, xp } = get();
        const updated = actions.map((a) => {
          if (a.id !== id) return a;
          const newCompleted = !a.completed;
          return { ...a, completed: newCompleted };
        });

        const wasCompleted = actions.find((a) => a.id === id)?.completed ?? false;
        const xpDelta = wasCompleted ? -10 : 10;

        const anyDone = updated.some((a) => a.completed);
        const today = getLocalDateStr();
        const history = { ...get().history };
        if (anyDone) {
          history[today] = true;
        } else {
          delete history[today];
        }

        const newXp = Math.max(0, xp + xpDelta);
        const newStreak = calculateStreak(history);

        set({
          actions: updated,
          xp: newXp,
          level: getLevel(newXp),
          history,
          streak: newStreak,
        });
      },

      regeneratePlan: () => {
        const { struggle, goals } = get();
        const actions = generatePlan(struggle, goals[0] || 'work');
        set({ actions });
      },

      // ── Progress ───────────────────────────────
      addXp: (amount: number) => {
        const newXp = get().xp + amount;
        set({ xp: newXp, level: getLevel(newXp) });
      },

      checkNewDay: () => {
        const { lastActiveDate, actions } = get();
        const today = getLocalDateStr();
        if (lastActiveDate === today) return;

        // Reset action completions for new day
        const resetActions = actions.map((a) => ({ ...a, completed: false }));

        // Recalculate streak
        const newStreak = calculateStreak(get().history);

        set({
          lastActiveDate: today,
          streak: newStreak,
          actions: resetActions,
        });
      },

      setOverloadPrompt: (streak: number) => set({ lastOverloadPrompt: streak }),

      // ── Settings ───────────────────────────────
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      toggleReminders: () => set((s) => ({ remindersEnabled: !s.remindersEnabled })),

      resetAll: () =>
        set({
          onboarded: false,
          language: 'en',
          struggle: null,
          goals: [],
          actions: [],
          xp: 0,
          level: 1,
          streak: 0,
          lastActiveDate: null,
          history: {},
          lastOverloadPrompt: null,
          darkMode: false,
          remindersEnabled: true,
        }),
    }),
    {
      name: 'coreshift-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
