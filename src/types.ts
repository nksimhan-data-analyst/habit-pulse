export type HabitCategory =
  | 'Coding'
  | 'Fitness'
  | 'Reading'
  | 'Mindset'
  | 'Language'
  | 'Design'
  | 'Health'
  | 'Productivity';

export type HabitType = 'habit' | 'skill';

export type HabitColor =
  | 'emerald'
  | 'indigo'
  | 'amber'
  | 'rose'
  | 'cyan'
  | 'violet'
  | 'orange'
  | 'blue';

export type HabitFrequency = 'daily' | 'weekdays' | 'flexible';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  type: HabitType;
  color: HabitColor;
  icon: string;
  frequency: HabitFrequency;
  targetDaysPerWeek: number;
  createdAt: string; // ISO string YYYY-MM-DD
  archived: boolean;
  unit?: string; // e.g., 'mins', 'pages', 'problems'
  targetValue?: number; // e.g., 30 (mins)
}

export interface DayCompletion {
  completed: boolean;
  value?: number;
  note?: string;
}

export interface HabitLogState {
  // Record: dateString (YYYY-MM-DD) -> Record<habitId, DayCompletion>
  [date: string]: {
    [habitId: string]: DayCompletion;
  };
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate7d: number;
  completionRate30d: number;
  isCompletedToday: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  streakRequirement: number;
  description: string;
  badgeIcon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export type ViewFilter = 'all' | 'habit' | 'skill';
