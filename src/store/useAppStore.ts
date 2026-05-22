import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoalId, StruggleId, Habit, CheckIn, Note, MoodType } from '@/types';
import { getTodayString } from '@/utils/dates';
import { generateHabitSuggestions } from '@/utils/habitSuggestions';

// ─── State shape ──────────────────────────────────────────────────────────────

interface AppStore {
  // User
  userName: string;
  userEmail: string;
  authProvider: 'email' | 'google' | null;

  // Onboarding
  onboardingCompleted: boolean;
  selectedGoalIds: GoalId[];
  selectedStruggleIds: StruggleId[];
  availableHabits: Habit[];      // generated after struggles selected
  selectedHabitIds: string[];    // user's chosen subset
  onboardingCompletedAt: string | null;

  // Today
  completedHabitIdsToday: string[];
  completionDate: string;        // date the completions belong to
  todayCheckIn: CheckIn | null;
  checkInDate: string;           // date the check-in belongs to

  // Notes
  notes: Note[];

  // Stats (lightweight counters)
  totalHabitsCompleted: number;

  // Settings
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;

  // ── Actions ──────────────────────────────────────────────────────────────

  // Auth
  setUser: (name: string, email: string, provider: 'email' | 'google') => void;

  // Onboarding
  toggleGoal: (id: GoalId) => void;
  toggleStruggle: (id: StruggleId) => void;
  buildAvailableHabits: () => void;
  toggleHabit: (id: string) => void;
  completeOnboarding: () => void;

  // Today — date-aware helpers
  checkDateReset: () => void;
  toggleHabitCompletion: (habitId: string) => void;
  isHabitCompleted: (habitId: string) => boolean;
  saveCheckIn: (data: Omit<CheckIn, 'date'>) => void;
  getTodayCheckIn: () => CheckIn | null;

  // Notes
  addNote: (content: string) => void;
  deleteNote: (id: string) => void;

  // Settings
  setDailyReminder: (enabled: boolean, time?: string) => void;

  // Dev/testing
  resetAll: () => void;
}

// ─── Initial values ───────────────────────────────────────────────────────────

const INITIAL: Omit<
  AppStore,
  | 'setUser'
  | 'toggleGoal'
  | 'toggleStruggle'
  | 'buildAvailableHabits'
  | 'toggleHabit'
  | 'completeOnboarding'
  | 'checkDateReset'
  | 'toggleHabitCompletion'
  | 'isHabitCompleted'
  | 'saveCheckIn'
  | 'getTodayCheckIn'
  | 'addNote'
  | 'deleteNote'
  | 'setDailyReminder'
  | 'resetAll'
> = {
  userName: '',
  userEmail: '',
  authProvider: null,
  onboardingCompleted: false,
  selectedGoalIds: [],
  selectedStruggleIds: [],
  availableHabits: [],
  selectedHabitIds: [],
  onboardingCompletedAt: null,
  completedHabitIdsToday: [],
  completionDate: '',
  todayCheckIn: null,
  checkInDate: '',
  notes: [],
  totalHabitsCompleted: 0,
  dailyReminderEnabled: false,
  dailyReminderTime: '08:00',
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...INITIAL,

      // ── Auth ──────────────────────────────────────────────────────────────
      setUser: (name, email, provider) =>
        set({ userName: name, userEmail: email, authProvider: provider }),

      // ── Onboarding ────────────────────────────────────────────────────────
      toggleGoal: (id) => {
        const current = get().selectedGoalIds;
        if (current.includes(id)) {
          set({ selectedGoalIds: current.filter((g) => g !== id) });
        } else if (current.length < 3) {
          set({ selectedGoalIds: [...current, id] });
        }
      },
      toggleStruggle: (id) => {
        const current = get().selectedStruggleIds;
        if (current.includes(id)) {
          set({ selectedStruggleIds: current.filter((s) => s !== id) });
        } else if (current.length < 3) {
          set({ selectedStruggleIds: [...current, id] });
        }
      },
      buildAvailableHabits: () => {
        const { selectedGoalIds, selectedStruggleIds } = get();
        const habits = generateHabitSuggestions(selectedGoalIds, selectedStruggleIds);
        // Pre-select all suggested habits so the user sees them ticked by default
        set({
          availableHabits: habits,
          selectedHabitIds: habits.map((h) => h.id),
        });
      },
      toggleHabit: (id) => {
        const current = get().selectedHabitIds;
        if (current.includes(id)) {
          set({ selectedHabitIds: current.filter((h) => h !== id) });
        } else {
          set({ selectedHabitIds: [...current, id] });
        }
      },
      completeOnboarding: () =>
        set({
          onboardingCompleted: true,
          onboardingCompletedAt: new Date().toISOString(),
        }),

      // ── Today ─────────────────────────────────────────────────────────────
      checkDateReset: () => {
        const today = getTodayString();
        const { completionDate, checkInDate } = get();
        const updates: Partial<AppStore> = {};
        if (completionDate !== today) {
          updates.completedHabitIdsToday = [];
          updates.completionDate = today;
        }
        if (checkInDate !== today) {
          updates.todayCheckIn = null;
          updates.checkInDate = today;
        }
        if (Object.keys(updates).length) set(updates as AppStore);
      },
      toggleHabitCompletion: (habitId) => {
        const today = getTodayString();
        const state = get();

        // Reset if new day
        if (state.completionDate !== today) {
          set({ completedHabitIdsToday: [], completionDate: today });
        }

        const current = get().completedHabitIdsToday;
        const wasCompleted = current.includes(habitId);
        set({
          completedHabitIdsToday: wasCompleted
            ? current.filter((id) => id !== habitId)
            : [...current, habitId],
          totalHabitsCompleted: wasCompleted
            ? Math.max(0, get().totalHabitsCompleted - 1)
            : get().totalHabitsCompleted + 1,
        });
      },
      isHabitCompleted: (habitId) => {
        const today = getTodayString();
        const { completionDate, completedHabitIdsToday } = get();
        if (completionDate !== today) return false;
        return completedHabitIdsToday.includes(habitId);
      },
      saveCheckIn: (data) => {
        const today = getTodayString();
        set({ todayCheckIn: { ...data, date: today }, checkInDate: today });
      },
      getTodayCheckIn: () => {
        const today = getTodayString();
        const { checkInDate, todayCheckIn } = get();
        return checkInDate === today ? todayCheckIn : null;
      },

      // ── Notes ─────────────────────────────────────────────────────────────
      addNote: (content) => {
        const note: Note = {
          id: `note-${Date.now()}`,
          date: getTodayString(),
          content,
          createdAt: new Date().toISOString(),
        };
        set({ notes: [note, ...get().notes] });
      },
      deleteNote: (id) =>
        set({ notes: get().notes.filter((n) => n.id !== id) }),

      // ── Settings ──────────────────────────────────────────────────────────
      setDailyReminder: (enabled, time) =>
        set({
          dailyReminderEnabled: enabled,
          dailyReminderTime: time ?? get().dailyReminderTime,
        }),

      // ── Dev reset ─────────────────────────────────────────────────────────
      resetAll: () => set({ ...INITIAL }),
    }),
    {
      name: 'coreshift-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
