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

  // Stats & Gamification
  totalHabitsCompleted: number;
  xp: number;
  level: number;
  streakHistory: Record<string, boolean>; // 'YYYY-MM-DD' -> true

  // Settings
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  reminderArchetype: 'zen' | 'copilot' | 'discipline';
  isDarkMode: boolean;

  // ── Actions ──────────────────────────────────────────────────────────────

  // Auth
  setUser: (name: string, email: string, provider: 'email' | 'google') => void;

  // Onboarding
  toggleGoal: (id: GoalId) => void;
  toggleStruggle: (id: StruggleId) => void;
  buildAvailableHabits: () => void;
  toggleHabit: (id: string) => void;
  addCustomHabit: (title: string, goalId: GoalId, frequency: 'daily' | 'weekly') => void;
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
  setReminderArchetype: (archetype: 'zen' | 'copilot' | 'discipline') => void;
  toggleDarkMode: () => void;

  // Gamification Actions
  addXp: (amount: number) => void;

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
  | 'addCustomHabit'
  | 'completeOnboarding'
  | 'checkDateReset'
  | 'toggleHabitCompletion'
  | 'isHabitCompleted'
  | 'saveCheckIn'
  | 'getTodayCheckIn'
  | 'addNote'
  | 'deleteNote'
  | 'setDailyReminder'
  | 'setReminderArchetype'
  | 'toggleDarkMode'
  | 'addXp'
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
  xp: 0,
  level: 1,
  streakHistory: {},
  dailyReminderEnabled: false,
  dailyReminderTime: '08:00',
  reminderArchetype: 'copilot',
  isDarkMode: false,
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
        const { availableHabits } = get();
        // Safeguard: Do not rebuild and overwrite if habits are already loaded/added!
        if (availableHabits.length > 0) return;

        // Initialize empty to allow 100% custom user-defined habits under selected pathways
        set({
          availableHabits: [],
          selectedHabitIds: [],
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
      addCustomHabit: (title, goalId, frequency) => {
        const id = `custom-${Date.now()}`;
        const newHabit: Habit = {
          id,
          title,
          goalId,
          frequency,
          isCustom: true,
        };
        const currentAvailable = get().availableHabits;
        const currentSelected = get().selectedHabitIds;
        set({
          availableHabits: [...currentAvailable, newHabit],
          selectedHabitIds: [...currentSelected, id],
        });
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

        const newCompletions = wasCompleted
          ? current.filter((id) => id !== habitId)
          : [...current, habitId];

        // Reward +10 XP for completion, subtract -10 XP for un-completion to prevent farming
        const xpChange = wasCompleted ? -10 : 10;
        const currentXp = get().xp;
        const newXp = Math.max(0, currentXp + xpChange);
        const newLevel = Math.floor(newXp / 100) + 1;

        // Check if all selected habits for today are completed to update streakHistory
        const selectedHabits = get().selectedHabitIds.filter(id => 
          get().availableHabits.some(h => h.id === id)
        );
        const isAllDone = selectedHabits.length > 0 && selectedHabits.every(id => newCompletions.includes(id));
        const currentStreakHistory = { ...get().streakHistory };
        if (isAllDone) {
          currentStreakHistory[today] = true;
        } else {
          delete currentStreakHistory[today];
        }

        set({
          completedHabitIdsToday: newCompletions,
          totalHabitsCompleted: wasCompleted
            ? Math.max(0, get().totalHabitsCompleted - 1)
            : get().totalHabitsCompleted + 1,
          xp: newXp,
          level: newLevel,
          streakHistory: currentStreakHistory,
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
        const state = get();
        
        // Only award XP once per day for the check-in
        const isNewCheckIn = state.todayCheckIn === null || state.checkInDate !== today;
        const xpChange = isNewCheckIn ? 25 : 0;
        const currentXp = get().xp;
        const newXp = Math.max(0, currentXp + xpChange);
        const newLevel = Math.floor(newXp / 100) + 1;

        let currentNotes = [...state.notes];
        // If a check-in note is typed, automatically create a beautiful reflection log entry!
        if (data.note && data.note.trim()) {
          const checkInNote: Note = {
            id: `note-${Date.now()}`,
            date: today,
            content: `Daily Reflection [Mood: ${data.mood} · Energy: ${data.energy}/5 · Focus: ${data.focus}/5]: ${data.note.trim()}`,
            createdAt: new Date().toISOString(),
          };
          currentNotes = [checkInNote, ...currentNotes];
        }

        set({ 
          todayCheckIn: { ...data, date: today }, 
          checkInDate: today,
          xp: newXp,
          level: newLevel,
          notes: currentNotes
        });
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

        // Award +15 XP for adding a self-reflection note
        const currentXp = get().xp;
        const newXp = Math.max(0, currentXp + 15);
        const newLevel = Math.floor(newXp / 100) + 1;

        set({ 
          notes: [note, ...get().notes],
          xp: newXp,
          level: newLevel
        });
      },
      deleteNote: (id) =>
        set({ notes: get().notes.filter((n) => n.id !== id) }),

      // ── Settings ──────────────────────────────────────────────────────────
      setDailyReminder: (enabled, time) =>
        set({
          dailyReminderEnabled: enabled,
          dailyReminderTime: time ?? get().dailyReminderTime,
        }),
      setReminderArchetype: (archetype) =>
        set({
          reminderArchetype: archetype,
        }),
      toggleDarkMode: () =>
        set({ isDarkMode: !get().isDarkMode }),

      // ── Gamification Actions ──────────────────────────────────────────────
      addXp: (amount) => {
        const currentXp = get().xp;
        const newXp = Math.max(0, currentXp + amount);
        const newLevel = Math.floor(newXp / 100) + 1;
        set({ xp: newXp, level: newLevel });
      },

      // ── Dev reset ─────────────────────────────────────────────────────────
      resetAll: () => set({ ...INITIAL }),
    }),
    {
      name: 'coreshift-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
