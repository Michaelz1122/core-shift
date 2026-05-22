import { Habit, GoalId } from '@/types';

export const SUGGESTED_HABITS: Record<GoalId, Habit[]> = {
  health: [
    { id: 'h-health-1', title: 'Drink 8 glasses of water', goalId: 'health', frequency: 'daily' },
    { id: 'h-health-2', title: 'Sleep before 11 PM', goalId: 'health', frequency: 'daily' },
    { id: 'h-health-3', title: 'Take a 10-minute walk', goalId: 'health', frequency: 'daily' },
    { id: 'h-health-4', title: 'Eat one healthy meal', goalId: 'health', frequency: 'daily' },
    { id: 'h-health-5', title: 'No sugar after 6 PM', goalId: 'health', frequency: 'daily' },
  ],
  fitness: [
    { id: 'h-fitness-1', title: '20-minute workout', goalId: 'fitness', frequency: 'daily' },
    { id: 'h-fitness-2', title: '10,000 steps', goalId: 'fitness', frequency: 'daily' },
    { id: 'h-fitness-3', title: 'Morning stretch', goalId: 'fitness', frequency: 'daily' },
    { id: 'h-fitness-4', title: 'No elevator today', goalId: 'fitness', frequency: 'daily' },
  ],
  productivity: [
    { id: 'h-prod-1', title: 'Plan your top 3 tasks', goalId: 'productivity', frequency: 'daily' },
    { id: 'h-prod-2', title: '90-minute deep work block', goalId: 'productivity', frequency: 'daily' },
    { id: 'h-prod-3', title: 'Clear inbox before noon', goalId: 'productivity', frequency: 'daily' },
    { id: 'h-prod-4', title: 'Weekly review on Sunday', goalId: 'productivity', frequency: 'weekly' },
  ],
  career: [
    { id: 'h-career-1', title: 'Work on one career skill', goalId: 'career', frequency: 'daily' },
    { id: 'h-career-2', title: 'Reach out to one contact', goalId: 'career', frequency: 'weekly' },
    { id: 'h-career-3', title: 'Read industry news', goalId: 'career', frequency: 'daily' },
  ],
  learning: [
    { id: 'h-learn-1', title: '30 minutes of learning', goalId: 'learning', frequency: 'daily' },
    { id: 'h-learn-2', title: 'Watch one educational video', goalId: 'learning', frequency: 'daily' },
    { id: 'h-learn-3', title: 'Review notes from yesterday', goalId: 'learning', frequency: 'daily' },
  ],
  reading: [
    { id: 'h-read-1', title: 'Read 10 pages', goalId: 'reading', frequency: 'daily' },
    { id: 'h-read-2', title: 'Read for 15 minutes', goalId: 'reading', frequency: 'daily' },
    { id: 'h-read-3', title: 'Save one quote', goalId: 'reading', frequency: 'daily' },
  ],
  'digital-discipline': [
    { id: 'h-dd-1', title: 'No phone for first 30 min', goalId: 'digital-discipline', frequency: 'daily' },
    { id: 'h-dd-2', title: 'Turn off one distracting app', goalId: 'digital-discipline', frequency: 'daily' },
    { id: 'h-dd-3', title: '30 minutes of deep work', goalId: 'digital-discipline', frequency: 'daily' },
    { id: 'h-dd-4', title: 'No social media after 9 PM', goalId: 'digital-discipline', frequency: 'daily' },
  ],
  'social-life': [
    { id: 'h-social-1', title: 'Check in on a friend', goalId: 'social-life', frequency: 'weekly' },
    { id: 'h-social-2', title: 'One meaningful conversation', goalId: 'social-life', frequency: 'daily' },
    { id: 'h-social-3', title: 'Plan something social this week', goalId: 'social-life', frequency: 'weekly' },
  ],
  'emotional-balance': [
    { id: 'h-em-1', title: '5-minute breathing exercise', goalId: 'emotional-balance', frequency: 'daily' },
    { id: 'h-em-2', title: 'Write one thing you\'re grateful for', goalId: 'emotional-balance', frequency: 'daily' },
    { id: 'h-em-3', title: '10-minute quiet time', goalId: 'emotional-balance', frequency: 'daily' },
  ],
  'spiritual-growth': [
    { id: 'h-sg-1', title: '10-minute reflection', goalId: 'spiritual-growth', frequency: 'daily' },
    { id: 'h-sg-2', title: 'Read a meaningful passage', goalId: 'spiritual-growth', frequency: 'daily' },
    { id: 'h-sg-3', title: 'Morning intention setting', goalId: 'spiritual-growth', frequency: 'daily' },
  ],
  custom: [],
};

export const DEMO_HABITS: Habit[] = [
  { id: 'h-health-1', title: 'Drink 8 glasses of water', goalId: 'health', frequency: 'daily' },
  { id: 'h-health-2', title: 'Sleep before 11 PM', goalId: 'health', frequency: 'daily' },
  { id: 'h-health-3', title: 'Take a 10-minute walk', goalId: 'health', frequency: 'daily' },
  { id: 'h-read-1', title: 'Read 10 pages', goalId: 'reading', frequency: 'daily' },
  { id: 'h-dd-1', title: 'No phone for first 30 min', goalId: 'digital-discipline', frequency: 'daily' },
];
