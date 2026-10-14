import { Habit, HabitLogState, Milestone } from '../types';
import { formatDateToISO } from '../utils/dateUtils';

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'LeetCode & Problem Solving',
    description: 'Solve at least 2 algorithmic problems daily',
    category: 'Coding',
    type: 'skill',
    color: 'emerald',
    icon: 'Terminal',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    createdAt: '2026-08-01',
    archived: false,
    unit: 'problems',
    targetValue: 2,
  },
  {
    id: 'habit-2',
    name: 'TypeScript Deep Practice',
    description: 'Build components or read advanced typing patterns',
    category: 'Coding',
    type: 'skill',
    color: 'indigo',
    icon: 'Code',
    frequency: 'daily',
    targetDaysPerWeek: 6,
    createdAt: '2026-08-10',
    archived: false,
    unit: 'mins',
    targetValue: 45,
  },
  {
    id: 'habit-3',
    name: 'Morning 5km Run / Cardio',
    description: 'Maintain cardio endurance and morning energy',
    category: 'Fitness',
    type: 'habit',
    color: 'orange',
    icon: 'Flame',
    frequency: 'flexible',
    targetDaysPerWeek: 5,
    createdAt: '2026-08-15',
    archived: false,
    unit: 'km',
    targetValue: 5,
  },
  {
    id: 'habit-4',
    name: 'Read Non-Fiction / Tech Books',
    description: 'Read System Design, Clean Architecture or Psychology',
    category: 'Reading',
    type: 'habit',
    color: 'amber',
    icon: 'BookOpen',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    createdAt: '2026-07-20',
    archived: false,
    unit: 'pages',
    targetValue: 20,
  },
  {
    id: 'habit-5',
    name: 'Mindful Meditation & Breathing',
    description: 'Box breathing and 10-minute quiet focus session',
    category: 'Mindset',
    type: 'habit',
    color: 'cyan',
    icon: 'Brain',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    createdAt: '2026-08-25',
    archived: false,
    unit: 'mins',
    targetValue: 10,
  },
  {
    id: 'habit-6',
    name: 'Language Learning (Spanish/Japanese)',
    description: 'Vocabulary review and speaking practice',
    category: 'Language',
    type: 'skill',
    color: 'rose',
    icon: 'Globe',
    frequency: 'daily',
    targetDaysPerWeek: 6,
    createdAt: '2026-09-01',
    archived: false,
    unit: 'mins',
    targetValue: 20,
  },
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'm-3',
    title: 'Spark of Momentum',
    streakRequirement: 3,
    description: 'Completed 3 consecutive days on any habit.',
    badgeIcon: 'Zap',
    unlocked: true,
    unlockedAt: '2026-08-15',
  },
  {
    id: 'm-7',
    title: 'One Week Warrior',
    streakRequirement: 7,
    description: 'Crushed a solid 7-day uninterrupted streak.',
    badgeIcon: 'Flame',
    unlocked: true,
    unlockedAt: '2026-08-22',
  },
  {
    id: 'm-14',
    title: 'Fortnight of Focus',
    streakRequirement: 14,
    description: 'Stayed dedicated for 14 straight days.',
    badgeIcon: 'Target',
    unlocked: true,
    unlockedAt: '2026-09-05',
  },
  {
    id: 'm-21',
    title: 'Habit Neuroplasticity',
    streakRequirement: 21,
    description: 'Reached 21 days—where habits become second nature.',
    badgeIcon: 'Award',
    unlocked: true,
    unlockedAt: '2026-09-26',
  },
  {
    id: 'm-30',
    title: 'Monthly Master',
    streakRequirement: 30,
    description: 'Maintained discipline for an entire 30-day cycle.',
    badgeIcon: 'Sparkles',
    unlocked: false,
  },
  {
    id: 'm-60',
    title: 'Century Club Contender',
    streakRequirement: 60,
    description: 'Achieved an iron-willed 60-day consecutive streak.',
    badgeIcon: 'Trophy',
    unlocked: false,
  },
];

/**
 * Generates realistic historical completion logs for the past 90 days up to today
 */
export function generateInitialLogs(): HabitLogState {
  const logs: HabitLogState = {};
  const today = new Date();

  // Probability patterns for each habit to make realistic streaks
  const habitPatterns: Record<string, { probWeekday: number; probWeekend: number; currentStreakDays: number }> = {
    'habit-1': { probWeekday: 0.90, probWeekend: 0.75, currentStreakDays: 22 }, // High streak on LeetCode
    'habit-2': { probWeekday: 0.85, probWeekend: 0.70, currentStreakDays: 14 }, // TypeScript
    'habit-3': { probWeekday: 0.75, probWeekend: 0.85, currentStreakDays: 6 },  // Fitness
    'habit-4': { probWeekday: 0.80, probWeekend: 0.90, currentStreakDays: 18 }, // Reading
    'habit-5': { probWeekday: 0.85, probWeekend: 0.80, currentStreakDays: 12 }, // Meditation
    'habit-6': { probWeekday: 0.70, probWeekend: 0.60, currentStreakDays: 5 },  // Language
  };

  for (let i = 90; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const iso = formatDateToISO(d);
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    logs[iso] = {};

    Object.entries(habitPatterns).forEach(([habitId, pattern]) => {
      // If within recent currentStreakDays, guarantee completion (except optionally today)
      let completed = false;
      if (i <= pattern.currentStreakDays) {
        completed = true;
      } else {
        const threshold = isWeekend ? pattern.probWeekend : pattern.probWeekday;
        // Pseudo-random deterministic based on date hash
        const seed = (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() + habitId.length * 17) % 100;
        completed = seed / 100 < threshold;
      }

      if (completed) {
        logs[iso][habitId] = {
          completed: true,
          value: habitId === 'habit-1' ? 2 : habitId === 'habit-3' ? 5 : undefined,
        };
      }
    });
  }

  return logs;
}
