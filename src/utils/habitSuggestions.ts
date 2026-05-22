import { GoalId, StruggleId, Habit } from '@/types';

// ─── Goal-based habits ────────────────────────────────────────────────────────

type RawHabit = Omit<Habit, 'id'>;

const HABITS_BY_GOAL: Record<GoalId, RawHabit[]> = {
  health: [
    { title: 'Drink water after waking up', goalId: 'health', frequency: 'daily' },
    { title: 'Take a 10-minute walk', goalId: 'health', frequency: 'daily' },
    { title: 'Sleep 30 minutes earlier', goalId: 'health', frequency: 'daily' },
    { title: 'Eat one clean meal today', goalId: 'health', frequency: 'daily' },
    { title: 'No sugar after 6 PM', goalId: 'health', frequency: 'daily' },
  ],
  fitness: [
    { title: '20-minute workout', goalId: 'fitness', frequency: 'daily' },
    { title: '10,000 steps today', goalId: 'fitness', frequency: 'daily' },
    { title: 'Morning stretch (5 min)', goalId: 'fitness', frequency: 'daily' },
    { title: 'No elevator today', goalId: 'fitness', frequency: 'daily' },
  ],
  productivity: [
    { title: 'Plan your top 3 tasks', goalId: 'productivity', frequency: 'daily' },
    { title: '90-minute deep work block', goalId: 'productivity', frequency: 'daily' },
    { title: 'Clear inbox before noon', goalId: 'productivity', frequency: 'daily' },
    { title: 'Weekly review on Sunday', goalId: 'productivity', frequency: 'weekly' },
  ],
  career: [
    { title: 'Work on one career skill', goalId: 'career', frequency: 'daily' },
    { title: 'Reach out to one contact', goalId: 'career', frequency: 'weekly' },
    { title: 'Read one industry article', goalId: 'career', frequency: 'daily' },
  ],
  learning: [
    { title: '30 minutes of learning', goalId: 'learning', frequency: 'daily' },
    { title: 'Review notes from yesterday', goalId: 'learning', frequency: 'daily' },
    { title: 'Teach something small to yourself', goalId: 'learning', frequency: 'daily' },
  ],
  reading: [
    { title: 'Read 5 pages', goalId: 'reading', frequency: 'daily' },
    { title: 'Read for 10 minutes', goalId: 'reading', frequency: 'daily' },
    { title: 'Save one quote', goalId: 'reading', frequency: 'daily' },
  ],
  'digital-discipline': [
    { title: 'No phone for first 20 minutes', goalId: 'digital-discipline', frequency: 'daily' },
    { title: 'Turn off one distracting app', goalId: 'digital-discipline', frequency: 'daily' },
    { title: '30 minutes of focused work', goalId: 'digital-discipline', frequency: 'daily' },
    { title: 'Keep phone away during meals', goalId: 'digital-discipline', frequency: 'daily' },
  ],
  'social-life': [
    { title: 'Check in on a friend', goalId: 'social-life', frequency: 'weekly' },
    { title: 'One meaningful conversation', goalId: 'social-life', frequency: 'daily' },
    { title: 'Plan one social thing this week', goalId: 'social-life', frequency: 'weekly' },
  ],
  'emotional-balance': [
    { title: '5-minute breathing exercise', goalId: 'emotional-balance', frequency: 'daily' },
    { title: 'Write one thing you are grateful for', goalId: 'emotional-balance', frequency: 'daily' },
    { title: '10 minutes of quiet time', goalId: 'emotional-balance', frequency: 'daily' },
  ],
  'spiritual-growth': [
    { title: 'Spend 5 minutes in quiet reflection', goalId: 'spiritual-growth', frequency: 'daily' },
    { title: 'Write one gratitude note', goalId: 'spiritual-growth', frequency: 'daily' },
    { title: 'Read one meaningful page', goalId: 'spiritual-growth', frequency: 'daily' },
    { title: 'Pause before reacting today', goalId: 'spiritual-growth', frequency: 'daily' },
  ],
  custom: [],
};

// ─── Struggle-based habits ────────────────────────────────────────────────────

const HABITS_BY_STRUGGLE: Record<StruggleId, RawHabit[]> = {
  laziness: [
    { title: 'Start with just 2 minutes', goalId: 'productivity', frequency: 'daily' },
    { title: 'Stand up and move for 60 seconds', goalId: 'fitness', frequency: 'daily' },
  ],
  distraction: [
    { title: 'Put your phone in another room', goalId: 'digital-discipline', frequency: 'daily' },
    { title: 'Close all tabs and do one thing', goalId: 'productivity', frequency: 'daily' },
  ],
  'low-motivation': [
    { title: 'Do the smallest version of one habit', goalId: 'productivity', frequency: 'daily' },
    { title: 'Restart with one habit today', goalId: 'productivity', frequency: 'daily' },
  ],
  overthinking: [
    { title: 'Write one honest sentence', goalId: 'emotional-balance', frequency: 'daily' },
    { title: 'Take 5 slow breaths', goalId: 'emotional-balance', frequency: 'daily' },
    { title: 'Choose one small action only', goalId: 'productivity', frequency: 'daily' },
  ],
  inconsistency: [
    { title: 'Restart with one habit today', goalId: 'productivity', frequency: 'daily' },
    { title: 'Make the habit smaller', goalId: 'productivity', frequency: 'daily' },
    { title: 'Review your day in one note', goalId: 'emotional-balance', frequency: 'daily' },
  ],
  'harmful-urges': [
    { title: 'Open Rescue Mode before acting', goalId: 'emotional-balance', frequency: 'daily' },
    { title: 'Move away from the trigger', goalId: 'emotional-balance', frequency: 'daily' },
  ],
  'low-energy': [
    { title: 'Get outside for 5 minutes', goalId: 'fitness', frequency: 'daily' },
    { title: 'Drink a full glass of water', goalId: 'health', frequency: 'daily' },
  ],
  'feeling-lost': [
    { title: 'Review your goals today', goalId: 'productivity', frequency: 'daily' },
    { title: 'Write one thing you want', goalId: 'emotional-balance', frequency: 'daily' },
  ],
  isolation: [
    { title: 'Send one message to someone you trust', goalId: 'social-life', frequency: 'daily' },
    { title: 'Leave the house for 10 minutes', goalId: 'fitness', frequency: 'daily' },
  ],
  procrastination: [
    { title: 'Start with just 2 minutes', goalId: 'productivity', frequency: 'daily' },
    { title: 'Write the next tiny step', goalId: 'productivity', frequency: 'daily' },
  ],
};

// ─── Suggestion engine ────────────────────────────────────────────────────────

function makeId(prefix: string, title: string): string {
  return `${prefix}-${title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 30)}`;
}

/**
 * Generates a personalised habit list from selected goals + struggles.
 * Deduplicates by title so the same habit never appears twice.
 */
export function generateHabitSuggestions(
  selectedGoals: GoalId[],
  selectedStruggles: StruggleId[]
): Habit[] {
  const habits: Habit[] = [];
  const seenTitles = new Set<string>();

  const add = (raw: RawHabit, idPrefix: string) => {
    const key = raw.title.toLowerCase().trim();
    if (seenTitles.has(key)) return;
    seenTitles.add(key);
    habits.push({ ...raw, id: makeId(idPrefix, raw.title) });
  };

  for (const goalId of selectedGoals) {
    (HABITS_BY_GOAL[goalId] ?? []).forEach((h) => add(h, `g-${goalId}`));
  }

  for (const struggleId of selectedStruggles) {
    (HABITS_BY_STRUGGLE[struggleId] ?? []).forEach((h) =>
      add(h, `s-${struggleId}`)
    );
  }

  return habits;
}

/** Returns habit suggestions grouped by section label for the UI */
export function getSuggestionSections(
  selectedGoals: GoalId[],
  selectedStruggles: StruggleId[]
): { label: string; habits: Habit[] }[] {
  const sections: { label: string; habits: Habit[] }[] = [];
  const seenTitles = new Set<string>();

  const makeHabit = (raw: RawHabit, prefix: string): Habit | null => {
    const key = raw.title.toLowerCase().trim();
    if (seenTitles.has(key)) return null;
    seenTitles.add(key);
    return { ...raw, id: makeId(prefix, raw.title) };
  };

  // Goal sections
  for (const goalId of selectedGoals) {
    const raw = HABITS_BY_GOAL[goalId] ?? [];
    const habits = raw
      .map((h) => makeHabit(h, `g-${goalId}`))
      .filter((h): h is Habit => h !== null);
    if (habits.length) {
      const label = goalId
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      sections.push({ label, habits });
    }
  }

  // Struggle section
  if (selectedStruggles.length > 0) {
    const raw = selectedStruggles.flatMap(
      (s) => HABITS_BY_STRUGGLE[s] ?? []
    );
    const habits = raw
      .map((h, i) => makeHabit(h, `s-struggle`))
      .filter((h): h is Habit => h !== null);
    if (habits.length) {
      sections.push({ label: 'For your struggles', habits });
    }
  }

  return sections;
}
