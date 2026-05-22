export const DEMO_PROGRESS = {
  journeyStartDate: '2025-05-01',
  currentStreak: 7,
  bestStreak: 12,
  totalCompleted: 47,
  weeklyCompletionRate: 0.74,
  weeklyData: [
    { day: 'Mon', completed: 4, total: 5 },
    { day: 'Tue', completed: 5, total: 5 },
    { day: 'Wed', completed: 3, total: 5 },
    { day: 'Thu', completed: 5, total: 5 },
    { day: 'Fri', completed: 4, total: 5 },
    { day: 'Sat', completed: 2, total: 5 },
    { day: 'Sun', completed: 0, total: 5 },
  ],
  byGoal: [
    { goalLabel: 'Health', completed: 18, total: 25, rate: 0.72 },
    { goalLabel: 'Reading', completed: 15, total: 20, rate: 0.75 },
    { goalLabel: 'Digital Discipline', completed: 14, total: 20, rate: 0.7 },
  ],
};

export const RESCUE_RESPONSES: Record<string, { message: string; action: string }> = {
  laziness: {
    message: "You don't need motivation to start. You need one step.",
    action: "Stand up and drink a glass of water. That's enough to begin.",
  },
  distraction: {
    message: 'Your focus is scattered. That\'s normal. Let\'s bring it back.',
    action: 'Close all tabs and apps. Set a 10-minute timer. Do one thing.',
  },
  'low-motivation': {
    message: "Motivation follows action, not the other way around.",
    action: "Pick the smallest habit on your list. Do just that.",
  },
  'harmful-urge': {
    message: "You noticed it. That awareness is already a win.",
    action: "Take 5 deep breaths: in for 4 seconds, hold for 4, out for 6.",
  },
  relapse: {
    message: "A slip is not a fall. You can reset right now.",
    action: "Write one sentence about how you want to feel tomorrow.",
  },
  sadness: {
    message: "It's okay to feel this. You don't have to fix it immediately.",
    action: "Go outside for 5 minutes. Fresh air, no phone.",
  },
  anxiety: {
    message: "You're safe. This feeling will pass.",
    action: "Name 5 things you can see right now. Breathe slowly.",
  },
  loneliness: {
    message: "Reaching out takes courage. You have it.",
    action: "Send one message to someone you trust. Even a voice note.",
  },
  'feeling-lost': {
    message: "You don't need the whole path. Just the next step.",
    action: "Open your goals. Read them. Pick one small thing to do today.",
  },
};
