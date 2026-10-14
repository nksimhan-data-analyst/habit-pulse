import React, { useMemo } from 'react';
import {
  Flame,
  Check,
  MoreVertical,
  Edit2,
  Trash2,
  Trophy,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Habit } from '../types';
import { useHabits } from '../context/HabitContext';
import { getLastNDays, calculateHabitStats, formatNiceDate } from '../utils/dateUtils';
import { ICON_MAP, COLOR_STYLES } from '../utils/habitThemes';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onSelectDayToInspect: (dateISO: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onEdit,
  onSelectDayToInspect,
}) => {
  const { logs, toggleHabitDay, deleteHabit } = useHabits();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const stats = useMemo(() => calculateHabitStats(habit, logs), [habit, logs]);
  const last7Days = useMemo(() => getLastNDays(7), []);

  const IconComponent = ICON_MAP[habit.icon] || Sparkles;
  const colorStyle = COLOR_STYLES[habit.color] || COLOR_STYLES.emerald;

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      deleteHabit(habit.id);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-750 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Icon, Name, Type, and Options menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            {/* Habit Icon Container */}
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorStyle.badgeBg} ${colorStyle.badgeText}`}
            >
              <IconComponent className="w-5 h-5" />
            </div>

            {/* Title & Metadata */}
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white tracking-tight leading-snug">
                {habit.name}
              </h3>
              {habit.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {habit.description}
                </p>
              )}
              {/* Clean unboxed metadata according to frontend-design rules */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
                <span>{habit.category}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{habit.type}</span>
                {habit.targetValue && habit.unit && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>
                      {habit.targetValue} {habit.unit}/day
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Options Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-700/60 transition-colors"
              aria-label="Habit options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-36 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-40 text-xs">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(habit);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit Goal</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleDelete();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 text-rose-600 dark:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Streaks Banner */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
            <Flame className="w-4 h-4 fill-amber-500/30" />
            <span>{stats.currentStreak} day streak</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium">
            <span title="Longest continuous streak recorded">
              Best: <strong className="text-slate-700 dark:text-slate-300">{stats.longestStreak}d</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Total: <strong className="text-slate-700 dark:text-slate-300">{stats.totalCompletions}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Interactive 7-Day Check-off Tracker Strip */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {last7Days.map((day) => {
            const isCompleted = Boolean(logs[day.date]?.[habit.id]?.completed);
            const isToday = day.isToday;

            return (
              <div key={day.date} className="flex flex-col items-center">
                {/* Day Header (e.g. Mon / 12) */}
                <span
                  className={`text-[10px] uppercase font-semibold ${
                    isToday
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {isToday ? 'Today' : day.dayInitial}
                </span>

                {/* Day Check-off Button */}
                <button
                  type="button"
                  onClick={() => toggleHabitDay(habit.id, day.date)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onSelectDayToInspect(day.date);
                  }}
                  title={`${habit.name} on ${formatNiceDate(day.date)}: ${
                    isCompleted ? 'Completed (Click to uncheck)' : 'Incomplete (Click to complete)'
                  }`}
                  aria-label={`Toggle ${habit.name} on ${day.date}`}
                  className={`mt-1.5 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs font-semibold transition-all duration-150 transform active:scale-90 ${
                    isCompleted
                      ? `${colorStyle.checkboxActive} shadow-xs`
                      : isToday
                      ? 'bg-slate-100 dark:bg-slate-700/80 border-2 border-dashed border-emerald-500/70 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                      : 'bg-slate-100/80 dark:bg-slate-750 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span className="text-[11px] opacity-75">{day.dayNumber}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
