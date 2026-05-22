import { create } from 'zustand';
import {
  GoalId,
  HabitCompletion,
  CheckIn,
  Note,
  MoodType,
  AppState,
} from '@/types';
import { DEMO_HABITS } from '@/data/mockHabits';
import { DEMO_NOTES } from '@/data/mockNotes';
import { getTodayString } from '@/utils/dates';

interface AppStore extends AppState {
  // Onboarding actions
  setSelectedGoals: (ids: GoalId[]) => void;
  toggleGoal: (id: GoalId) => void;
  setSelectedHabits: (ids: string[]) => void;
  toggleHabit: (id: string) => void;
  completeOnboarding: () => void;

  // Today actions
  toggleHabitCompletion: (habitId: string) => void;
  isHabitCompleted: (habitId: string) => boolean;
  saveCheckIn: (checkIn: Omit<CheckIn, 'date'>) => void;

  // Notes actions
  addNote: (content: string) => void;
  deleteNote: (id: string) => void;

  // Settings actions
  setDailyReminder: (enabled: boolean, time?: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  hasCompletedOnboarding: false,
  selectedGoalIds: [],
  selectedHabitIds: DEMO_HABITS.map((h) => h.id),
  todayCompletions: [
    { habitId: 'h-health-1', date: getTodayString(), completed: true },
    { habitId: 'h-health-2', date: getTodayString(), completed: true },
  ],
  todayCheckIn: null,
  notes: DEMO_NOTES,
  dailyReminderEnabled: true,
  dailyReminderTime: '08:00',

  // Onboarding
  setSelectedGoals: (ids) => set({ selectedGoalIds: ids }),
  toggleGoal: (id) => {
    const current = get().selectedGoalIds;
    if (current.includes(id)) {
      set({ selectedGoalIds: current.filter((g) => g !== id) });
    } else if (current.length < 3) {
      set({ selectedGoalIds: [...current, id] });
    }
  },
  setSelectedHabits: (ids) => set({ selectedHabitIds: ids }),
  toggleHabit: (id) => {
    const current = get().selectedHabitIds;
    if (current.includes(id)) {
      set({ selectedHabitIds: current.filter((h) => h !== id) });
    } else {
      set({ selectedHabitIds: [...current, id] });
    }
  },
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),

  // Today
  toggleHabitCompletion: (habitId) => {
    const today = getTodayString();
    const completions = get().todayCompletions;
    const existing = completions.find(
      (c) => c.habitId === habitId && c.date === today
    );
    if (existing) {
      set({
        todayCompletions: completions.map((c) =>
          c.habitId === habitId && c.date === today
            ? { ...c, completed: !c.completed }
            : c
        ),
      });
    } else {
      set({
        todayCompletions: [
          ...completions,
          { habitId, date: today, completed: true },
        ],
      });
    }
  },
  isHabitCompleted: (habitId) => {
    const today = getTodayString();
    const completion = get().todayCompletions.find(
      (c) => c.habitId === habitId && c.date === today
    );
    return completion?.completed ?? false;
  },
  saveCheckIn: (checkIn) => {
    set({ todayCheckIn: { ...checkIn, date: getTodayString() } });
  },

  // Notes
  addNote: (content) => {
    const today = getTodayString();
    const newNote: Note = {
      id: `note-${Date.now()}`,
      date: today,
      content,
      createdAt: new Date().toISOString(),
    };
    set({ notes: [newNote, ...get().notes] });
  },
  deleteNote: (id) => {
    set({ notes: get().notes.filter((n) => n.id !== id) });
  },

  // Settings
  setDailyReminder: (enabled, time) => {
    set({
      dailyReminderEnabled: enabled,
      dailyReminderTime: time ?? get().dailyReminderTime,
    });
  },
}));
