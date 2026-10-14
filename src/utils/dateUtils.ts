import { Habit, HabitLogState, HabitStats } from '../types';

/**
 * Formats a Date object to YYYY-MM-DD in local time
 */
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayISO(): string {
  return formatDateToISO(new Date());
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return formatDateToISO(d);
}

/**
 * Returns the last N days ending today
 */
export function getLastNDays(daysCount: number = 7) {
  const result = [];
  const today = new Date();
  
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const iso = formatDateToISO(d);
    
    result.push({
      date: iso,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }), // e.g. "Mon"
      dayInitial: d.toLocaleDateString('en-US', { weekday: 'narrow' }), // e.g. "M"
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    });
  }
  
  return result;
}

/**
 * Generates an array of date objects for the contribution heatmap (e.g. past ~120 to 180 days)
 * aligned to weeks (starting on Sunday or Monday)
 */
export function getHeatmapCalendarDays(totalDays: number = 140) {
  const days = [];
  const today = new Date();
  
  // Find beginning date
  const startDate = new Date();
  startDate.setDate(today.getDate() - totalDays + 1);
  
  // Align to previous Sunday (0) to have complete week columns
  const dayOfWeek = startDate.getDay();
  if (dayOfWeek > 0) {
    startDate.setDate(startDate.getDate() - dayOfWeek);
  }
  
  const current = new Date(startDate);
  const todayISO = getTodayISO();
  
  while (current <= today || current.getDay() !== 0) {
    const iso = formatDateToISO(current);
    days.push({
      date: iso,
      dayOfWeek: current.getDay(),
      month: current.getMonth(),
      monthName: current.toLocaleDateString('en-US', { month: 'short' }),
      dayNumber: current.getDate(),
      isToday: iso === todayISO,
      isFuture: current > today,
    });
    current.setDate(current.getDate() + 1);
    
    // Stop if we went past today and reached Saturday
    if (current > today && current.getDay() === 0) {
      break;
    }
  }
  
  return days;
}

/**
 * Calculates current streak and longest streak for a habit
 */
export function calculateHabitStats(habit: Habit, logs: HabitLogState): HabitStats {
  const todayISO = getTodayISO();
  const todayCompleted = Boolean(logs[todayISO]?.[habit.id]?.completed);
  
  let currentStreak = 0;
  let checkDate = todayISO;
  
  // If not completed today, check if yesterday was completed to see if current streak is still alive
  if (!todayCompleted) {
    checkDate = addDays(todayISO, -1);
  }
  
  while (true) {
    const isDone = Boolean(logs[checkDate]?.[habit.id]?.completed);
    if (isDone) {
      currentStreak++;
      checkDate = addDays(checkDate, -1);
    } else {
      break;
    }
  }
  
  // Longest streak calculation across all recorded history
  // Gather all dates from logs and sort
  const dates = Object.keys(logs).sort();
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate: string | null = null;
  let totalCompletions = 0;
  
  for (const date of dates) {
    if (logs[date]?.[habit.id]?.completed) {
      totalCompletions++;
      if (prevDate && addDays(prevDate, 1) === date) {
        runningStreak++;
      } else {
        runningStreak = 1;
      }
      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
      prevDate = date;
    }
  }
  
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }
  
  // Last 7 days completion rate
  let doneLast7 = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDays(todayISO, -i);
    if (logs[d]?.[habit.id]?.completed) {
      doneLast7++;
    }
  }
  const completionRate7d = Math.round((doneLast7 / 7) * 100);
  
  // Last 30 days completion rate
  let doneLast30 = 0;
  for (let i = 0; i < 30; i++) {
    const d = addDays(todayISO, -i);
    if (logs[d]?.[habit.id]?.completed) {
      doneLast30++;
    }
  }
  const completionRate30d = Math.round((doneLast30 / 30) * 100);
  
  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRate7d,
    completionRate30d,
    isCompletedToday: todayCompleted,
  };
}

export function formatNiceDate(iso: string): string {
  const date = parseISODate(iso);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
