export const Copy = {
  app: {
    name: 'CoreShift',
    tagline: 'Change from the inside out.',
  },

  auth: {
    welcomeBack: 'Welcome back.',
    startYourShift: 'Start your shift.',
    continueWithGoogle: 'Continue with Google',
    forgotPassword: 'Forgot password?',
    createAccount: "Don't have an account? Create one",
    alreadyHaveAccount: 'Already have an account? Log in',
    loginButton: 'Log In',
    signupButton: 'Create Account',
  },

  onboarding: {
    headline: 'Build your new life system.',
    subheadline:
      'Choose your goals, build small habits, and come back stronger every day.',
    startButton: 'Start your shift',
    goalTitle: 'What do you want to work on?',
    goalSubtitle: 'Choose 1–3 areas to start with.',
    habitTitle: 'Build your first habits.',
    confirmTitle: 'Your first system is ready.',
    confirmSubtitle: 'You can edit everything later.',
    finishButton: 'Finish Setup',
  },

  today: {
    greetingMorning: 'Good morning.',
    greetingAfternoon: 'Good afternoon.',
    greetingEvening: 'Good evening.',
    supportLine: 'One small shift today.',
    checkInTitle: 'How are you feeling today?',
    checkInSub: 'Mood · Energy · Focus',
    checkInButton: 'Start Check-in',
    progressTitle: "Today's Progress",
    habitsTitle: "Today's Habits",
    addHabit: '+ Add Habit',
    rescueTitle: 'Struggling right now?',
    rescueSub: 'Pause and take one small step.',
    rescueButton: 'Open Rescue Mode',
    checkInDone: 'Check-in complete',
  },

  progress: {
    header: 'Your journey so far',
    subline: 'Progress over perfection.',
    journeyDays: 'Day',
    weeklyRate: 'This Week',
    currentStreak: 'Current Streak',
    bestStreak: 'Best Streak',
    completedTotal: 'Habits Completed',
  },

  notes: {
    header: 'Notes',
    subline: 'Write anything. Thoughts, feelings, progress, or lessons.',
    newNote: 'New Note',
    emptyTitle: 'No notes yet.',
    emptySubtitle: 'Write one honest thought to start.',
    prompt: 'How was today? Write anything.',
    savNote: 'Save Note',
  },

  rescue: {
    header: 'Rescue Mode',
    title: 'What are you feeling right now?',
    subtitle: "It's okay. Let's take it one step at a time.",
    responseTitle: 'Pause.',
    responseBody:
      "You don't need to fix everything right now.\nOne small action can bring you back.",
    actionTitle: 'One small action:',
    doItNow: "I'll do it now",
    writeNote: 'Write a note',
    backToToday: 'Back to Today',
    englishSupport: 'You do not have to be perfect. The only thing that matters is that you come back.',
  },

  checkin: {
    title: 'How are you feeling today?',
    moodLabel: 'Your mood',
    energyLabel: 'Energy level',
    focusLabel: 'Focus level',
    notePlaceholder: 'Add a note about your day... (optional)',
    saveButton: 'Save Check-in',
  },

  settings: {
    header: 'Settings',
    manageHabits: 'Manage Habits',
    editGoals: 'Edit Goals',
    reminders: 'Reminder Settings',
    weeklyReview: 'Weekly Review',
    preferences: 'App Preferences',
    darkMode: 'Dark Mode',
    darkModeNote: 'Coming soon',
    logout: 'Log Out',
  },

  empty: {
    noHabits: 'No habits yet.',
    noHabitsSub: 'Add one small shift to get started.',
    noNotes: 'No notes yet.',
    noNotesSub: 'Write one honest thought to start.',
    noProgress: 'Your progress will appear after your first few check-ins.',
    noReview: 'Weekly review not ready yet.',
    noReviewSub: 'Complete a full week to unlock your review.',
  },
} as const;
