import React, { useMemo } from 'react';
import { Flame, Trophy, CheckCircle2, TrendingUp, Sparkles, Target } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { calculateHabitStats, getTodayISO, addDays } from '../utils/dateUtils';

export const DashboardStats: React.FC = () => {
  const { habits, logs } = useHabits();
  const todayISO = getTodayISO();

  const stats = useMemo(() => {
    const activeHabits = habits.filter((h) => !h.archived);
    const totalActive = activeHabits.length;
    const skillsCount = activeHabits.filter((h) => h.type === 'skill').length;
    const habitsCount = activeHabits.filter((h) => h.type === 'habit').length;

    let bestCurrentStreak = 0;
    let bestCurrentStreakHabitName = '';
    let allTimeLongestStreak = 0;
    let allTimeLongestHabitName = '';

    let completedTodayCount = 0;

    activeHabits.forEach((h) => {
      const hStats = calculateHabitStats(h, logs);
      if (hStats.isCompletedToday) {
        completedTodayCount++;
      }
      if (hStats.currentStreak > bestCurrentStreak) {
        bestCurrentStreak = hStats.currentStreak;
        bestCurrentStreakHabitName = h.name;
      }
      if (hStats.longestStreak > allTimeLongestStreak) {
        allTimeLongestStreak = hStats.longestStreak;
        allTimeLongestHabitName = h.name;
      }
    });

    const todayPercent = totalActive > 0 ? Math.round((completedTodayCount / totalActive) * 100) : 0;

    // Weekly completion rate across all active habits (past 7 days)
    let totalPossible7d = totalActive * 7;
    let totalDone7d = 0;
    for (let i = 0; i < 7; i++) {
      const date = addDays(todayISO, -i);
      activeHabits.forEach((h) => {
        if (logs[date]?.[h.id]?.completed) {
          totalDone7d++;
        }
      });
    }
    const weeklyRate = totalPossible7d > 0 ? Math.round((totalDone7d / totalPossible7d) * 100) : 0;

    // Monthly completion rate across all active habits (past 30 days)
    let totalPossible30d = totalActive * 30;
    let totalDone30d = 0;
    for (let i = 0; i < 30; i++) {
      const date = addDays(todayISO, -i);
      activeHabits.forEach((h) => {
        if (logs[date]?.[h.id]?.completed) {
          totalDone30d++;
        }
      });
    }
    const monthlyRate = totalPossible30d > 0 ? Math.round((totalDone30d / totalPossible30d) * 100) : 0;

    return {
      totalActive,
      skillsCount,
      habitsCount,
      bestCurrentStreak,
      bestCurrentStreakHabitName,
      allTimeLongestStreak,
      allTimeLongestHabitName,
      completedTodayCount,
      todayPercent,
      weeklyRate,
      monthlyRate,
    };
  }, [habits, logs, todayISO]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* 1. Active Habits Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-750 shadow-xs transition-colors">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Active Goals</span>
          <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.totalActive}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">total tracked</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2.5">
          <span>{stats.habitsCount} habits</span>
          <span aria-hidden="true">·</span>
          <span>{stats.skillsCount} skills</span>
        </div>
      </div>

      {/* 2. Current Streak Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-750 shadow-xs transition-colors">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Top Streak</span>
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {stats.bestCurrentStreak}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">days active</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate border-t border-slate-100 dark:border-slate-700/60 pt-2.5">
          <span className="truncate">
            {stats.bestCurrentStreakHabitName ? stats.bestCurrentStreakHabitName : 'Start your streak today'}
          </span>
        </div>
      </div>

      {/* 3. Best Streak Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-750 shadow-xs transition-colors">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Best Streak</span>
          <Trophy className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {stats.allTimeLongestStreak}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">record days</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate border-t border-slate-100 dark:border-slate-700/60 pt-2.5">
          <span className="truncate">
            {stats.allTimeLongestHabitName ? stats.allTimeLongestHabitName : 'Consistency milestone'}
          </span>
        </div>
      </div>

      {/* 4. Today's Progress & Completion Rate */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-750 shadow-xs transition-colors">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Today's Focus</span>
          <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.completedTodayCount}
            </span>
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
              /{stats.totalActive}
            </span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            {stats.todayPercent}%
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2.5">
          <div className="flex items-center gap-1.5">
            <span>7d: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{stats.weeklyRate}%</strong></span>
            <span aria-hidden="true">·</span>
            <span>30d: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{stats.monthlyRate}%</strong></span>
          </div>
          <span className="text-[11px] text-slate-400">consistency</span>
        </div>
      </div>
    </div>
  );
};
