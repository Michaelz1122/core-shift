import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleDailyReminder, cancelAllReminders } from '@/services/NotificationService';
import type {
  Language,
  ChallengeId,
  VisionId,
  Action,
  CheckIn,
  Note,
  MoodType,
} from '@/types';
import { getTodayString } from '@/utils/dates';
import { getLevelForXp } from '@/utils/xpHelper';

// ─── State shape ──────────────────────────────────────────────────────────────

interface AppStore {
  // Language
  language: Language;

  // User
  userName: string;
  userEmail: string;
  authProvider: 'email' | 'google' | null;

  // Onboarding
  onboardingCompleted: boolean;
  selectedChallengeIds: ChallengeId[];
  selectedVisionIds: VisionId[];
  quizAnswers: Record<string, string>;
  actions: Action[];           // full catalogue of user's actions
  activeActionIds: string[];   // which actions are currently active
  onboardingCompletedAt: string | null;

  // Today (date-aware, auto-reset on new day)
  completedActionIdsToday: string[];
  completionDate: string;
  todayCheckIn: CheckIn | null;
  checkInDate: string;

  // Retention
  lastActiveDate: string;
  pendingRecoveryCheckIn: boolean;
  lastWeeklyReviewDate: string;

  // Notes
  notes: Note[];

  // Stats & Gamification
  totalActionsCompleted: number;
  xp: number;
  level: number;
  streakHistory: Record<string, boolean>; // 'YYYY-MM-DD' → true

  // Settings
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  reminderArchetype: 'zen' | 'copilot' | 'discipline';
  isDarkMode: boolean;

  // ── Actions ──────────────────────────────────────────────────────────────

  // Auth
  setUser: (name: string, email: string, provider: 'email' | 'google') => void;

  // Language
  setLanguage: (lang: Language) => void;

  // Onboarding
  toggleChallenge: (id: ChallengeId) => void;
  toggleVision: (id: VisionId) => void;
  setQuizAnswers: (answers: Record<string, string>) => void;
  setActions: (actions: Action[]) => void;
  toggleAction: (id: string) => void;
  addCustomAction: (title: string, challengeId: ChallengeId, frequency: 'daily' | 'weekly') => void;
  completeOnboarding: () => void;

  // Today — date-aware helpers
  checkDateReset: () => void;
  toggleActionCompletion: (actionId: string) => void;
  isActionCompleted: (actionId: string) => boolean;
  saveCheckIn: (data: Omit<CheckIn, 'date'>) => void;
  getTodayCheckIn: () => CheckIn | null;
  clearPendingRecovery: () => void;
  setLastWeeklyReviewDate: (date: string) => void;
  downgradeActiveActionsForToday: () => void;

  // Notes
  addNote: (content: string) => void;
  deleteNote: (id: string) => void;

  // Settings
  setDailyReminder: (enabled: boolean, time?: string, language?: Language) => void;
  setReminderArchetype: (archetype: 'zen' | 'copilot' | 'discipline') => void;
  toggleDarkMode: () => void;

  // Gamification
  addXp: (amount: number) => void;

  // Dev
  resetAll: () => void;
}

// ─── Initial values ───────────────────────────────────────────────────────────

const INITIAL: Omit<
  AppStore,
  | 'setUser'
  | 'setLanguage'
  | 'toggleChallenge'
  | 'toggleVision'
  | 'setQuizAnswers'
  | 'setActions'
  | 'toggleAction'
  | 'addCustomAction'
  | 'completeOnboarding'
  | 'checkDateReset'
  | 'toggleActionCompletion'
  | 'isActionCompleted'
  | 'saveCheckIn'
  | 'getTodayCheckIn'
  | 'clearPendingRecovery'
  | 'setLastWeeklyReviewDate'
  | 'downgradeActiveActionsForToday'
  | 'addNote'
  | 'deleteNote'
  | 'setDailyReminder'
  | 'setReminderArchetype'
  | 'toggleDarkMode'
  | 'addXp'
  | 'resetAll'
> = {
  language: 'en',
  userName: '',
  userEmail: '',
  authProvider: null,
  onboardingCompleted: false,
  selectedChallengeIds: [],
  selectedVisionIds: [],
  quizAnswers: {},
  actions: [],
  activeActionIds: [],
  onboardingCompletedAt: null,
  completedActionIdsToday: [],
  completionDate: '',
  todayCheckIn: null,
  checkInDate: '',
  lastActiveDate: '',
  pendingRecoveryCheckIn: false,
  lastWeeklyReviewDate: '',
  notes: [],
  totalActionsCompleted: 0,
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

      // ── Language ──────────────────────────────────────────────────────────
      setLanguage: (lang) => set({ language: lang }),

      // ── Onboarding ────────────────────────────────────────────────────────
      toggleChallenge: (id) => {
        const current = get().selectedChallengeIds;
        if (current.includes(id)) {
          set({ selectedChallengeIds: current.filter((c) => c !== id) });
        } else if (current.length < 2) {
          set({ selectedChallengeIds: [...current, id] });
        }
      },
      toggleVision: (id) => {
        const current = get().selectedVisionIds;
        if (current.includes(id)) {
          set({ selectedVisionIds: current.filter((v) => v !== id) });
        } else {
          set({ selectedVisionIds: [...current, id] });
        }
      },
      setQuizAnswers: (answers) => set({ quizAnswers: answers }),

      setActions: (actions) =>
        set({
          actions,
          // Pre-select top 5 (caller decides; here we default to first 5)
          activeActionIds: actions.slice(0, 5).map((a) => a.id),
        }),

      toggleAction: (id) => {
        const current = get().activeActionIds;
        if (current.includes(id)) {
          set({ activeActionIds: current.filter((a) => a !== id) });
        } else {
          set({ activeActionIds: [...current, id] });
        }
      },

      addCustomAction: (title, challengeId, frequency) => {
        const id = `custom-${Date.now()}`;
        const newAction: Action = {
          id,
          title,
          emoji: '⭐',
          challengeId,
          frequency,
          difficulty: 'beginner',
          isCustom: true,
        };
        set({
          actions: [...get().actions, newAction],
          activeActionIds: [...get().activeActionIds, id],
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
        const { completionDate, checkInDate, lastActiveDate, pendingRecoveryCheckIn } = get();
        const updates: Partial<AppStore> = {};
        
        // Retention Check (Missed Day Detection)
        if (lastActiveDate && lastActiveDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (lastActiveDate !== yesterdayStr) {
            // Gap of > 1 day detected
            updates.pendingRecoveryCheckIn = true;
          }
        }
        updates.lastActiveDate = today;

        if (completionDate !== today) {
          updates.completedActionIdsToday = [];
          updates.completionDate = today;
        }
        if (checkInDate !== today) {
          updates.todayCheckIn = null;
          updates.checkInDate = today;
        }
        if (Object.keys(updates).length) set(updates as AppStore);
      },

      toggleActionCompletion: (actionId) => {
        const today = getTodayString();
        const state = get();

        if (state.completionDate !== today) {
          set({ completedActionIdsToday: [], completionDate: today });
        }

        const current = get().completedActionIdsToday;
        const wasCompleted = current.includes(actionId);
        const newCompletions = wasCompleted
          ? current.filter((id) => id !== actionId)
          : [...current, actionId];

        const xpChange = wasCompleted ? -10 : 10;
        const newXp = Math.max(0, get().xp + xpChange);
        const newLevel = getLevelForXp(newXp);

        // Streak: all active actions done today?
        const activeActions = get().activeActionIds.filter((id) =>
          get().actions.some((a) => a.id === id)
        );
        const isAllDone =
          activeActions.length > 0 &&
          activeActions.every((id) => newCompletions.includes(id));

        const newStreak = { ...get().streakHistory };
        if (isAllDone) {
          newStreak[today] = true;
        } else {
          delete newStreak[today];
        }

        set({
          completedActionIdsToday: newCompletions,
          totalActionsCompleted: wasCompleted
            ? Math.max(0, get().totalActionsCompleted - 1)
            : get().totalActionsCompleted + 1,
          xp: newXp,
          level: newLevel,
          streakHistory: newStreak,
        });
      },

      isActionCompleted: (actionId) => {
        const today = getTodayString();
        const { completionDate, completedActionIdsToday } = get();
        if (completionDate !== today) return false;
        return completedActionIdsToday.includes(actionId);
      },

      saveCheckIn: (data) => {
        const today = getTodayString();
        const state = get();
        const isNewCheckIn = state.todayCheckIn === null || state.checkInDate !== today;
        const xpChange = isNewCheckIn ? 25 : 0;
        const newXp = Math.max(0, state.xp + xpChange);
        const newLevel = getLevelForXp(newXp);

        let currentNotes = [...state.notes];
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
          notes: currentNotes,
        });
      },

      getTodayCheckIn: () => {
        const today = getTodayString();
        const { checkInDate, todayCheckIn } = get();
        return checkInDate === today ? todayCheckIn : null;
      },

      clearPendingRecovery: () => set({ pendingRecoveryCheckIn: false }),
      setLastWeeklyReviewDate: (date: string) => set({ lastWeeklyReviewDate: date }),
      
      downgradeActiveActionsForToday: () => {
        // Temporarily set active actions to smaller version
        const { actions, activeActionIds } = get();
        const updatedActions = actions.map(a => 
          activeActionIds.includes(a.id) 
            ? { ...a, selectedVersion: 'smaller' as const } 
            : a
        );
        set({ actions: updatedActions });
      },

      // ── Notes ─────────────────────────────────────────────────────────────
      addNote: (content) => {
        const note: Note = {
          id: `note-${Date.now()}`,
          date: getTodayString(),
          content,
          createdAt: new Date().toISOString(),
        };
        const newXp = Math.max(0, get().xp + 15);
        set({
          notes: [note, ...get().notes],
          xp: newXp,
          level: getLevelForXp(newXp),
        });
      },

      deleteNote: (id) => set({ notes: get().notes.filter((n) => n.id !== id) }),

      // ── Settings ──────────────────────────────────────────────────────────
      setDailyReminder: (enabled, time, language = 'en') => {
        const targetTime = time ?? get().dailyReminderTime;
        set({
          dailyReminderEnabled: enabled,
          dailyReminderTime: targetTime,
        });

        if (enabled && targetTime) {
          const date = new Date(targetTime);
          scheduleDailyReminder(date.getHours(), date.getMinutes(), language).catch(console.error);
        } else {
          cancelAllReminders().catch(console.error);
        }
      },
      setReminderArchetype: (archetype) => set({ reminderArchetype: archetype }),
      toggleDarkMode: () => set({ isDarkMode: !get().isDarkMode }),

      // ── Gamification ──────────────────────────────────────────────────────
      addXp: (amount) => {
        const newXp = Math.max(0, get().xp + amount);
        set({ xp: newXp, level: getLevelForXp(newXp) });
      },

      // ── Dev reset ─────────────────────────────────────────────────────────
      resetAll: () => set({ ...INITIAL }),
    }),
    {
      name: 'coreshift-v2',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from unversioned to version 1
          // Ensure all active actions have a selectedVersion and originalTemplateId
          if (persistedState.actions && Array.isArray(persistedState.actions)) {
            persistedState.actions = persistedState.actions.map((action: any) => ({
              ...action,
              selectedVersion: action.selectedVersion || 'standard',
              originalTemplateId: action.originalTemplateId || action.templateId || action.id,
            }));
          }
          // Ensure retention state exists
          persistedState.lastActiveDate = persistedState.lastActiveDate || '';
          persistedState.pendingRecoveryCheckIn = persistedState.pendingRecoveryCheckIn || false;
          persistedState.lastWeeklyReviewDate = persistedState.lastWeeklyReviewDate || '';
        }
        return persistedState;
      },
    }
  )
);
