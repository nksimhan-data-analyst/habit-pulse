import React, { useState, useMemo } from 'react';
import { Calendar, Info, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { getHeatmapCalendarDays, formatNiceDate, getTodayISO } from '../utils/dateUtils';
import { COLOR_STYLES } from '../utils/habitThemes';

interface HeatmapGridProps {
  onSelectDate: (dateISO: string) => void;
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({ onSelectDate }) => {
  const { habits, logs } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string>('all');
  const [daysRange, setDaysRange] = useState<number>(140); // ~20 weeks
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    completedCount: number;
    totalPossible: number;
    completedNames: string[];
  } | null>(null);

  const activeHabits = useMemo(() => habits.filter((h) => !h.archived), [habits]);
  const calendarDays = useMemo(() => getHeatmapCalendarDays(daysRange), [daysRange]);

  // Group days into 7-row columns (weeks)
  const weeks = useMemo(() => {
    const result: typeof calendarDays[] = [];
    let currentWeek: typeof calendarDays = [];

    calendarDays.forEach((day, index) => {
      currentWeek.push(day);
      if (day.dayOfWeek === 6 || index === calendarDays.length - 1) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    return result;
  }, [calendarDays]);

  const selectedHabit = useMemo(
    () => habits.find((h) => h.id === selectedHabitId),
    [habits, selectedHabitId]
  );

  const habitColor = selectedHabit ? selectedHabit.color : 'emerald';

  // Get intensity level (0 to 4) for a date
  const getDayIntensity = (dateISO: string) => {
    if (selectedHabitId === 'all') {
      if (activeHabits.length === 0) return 0;
      let completedCount = 0;
      activeHabits.forEach((h) => {
        if (logs[dateISO]?.[h.id]?.completed) {
          completedCount++;
        }
      });

      const ratio = completedCount / activeHabits.length;
      if (ratio === 0) return 0;
      if (ratio <= 0.25) return 1;
      if (ratio <= 0.5) return 2;
      if (ratio <= 0.75) return 3;
      return 4;
    } else {
      const isDone = Boolean(logs[dateISO]?.[selectedHabitId]?.completed);
      return isDone ? 4 : 0;
    }
  };

  // Color classes for intensity levels
  const getCellBgClass = (intensity: number, isFuture: boolean) => {
    if (isFuture) {
      return 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-40 cursor-not-allowed';
    }

    if (intensity === 0) {
      return 'bg-slate-100 dark:bg-slate-750/70 border-slate-200/40 dark:border-slate-700 hover:ring-2 hover:ring-slate-400';
    }

    if (selectedHabitId === 'all') {
      switch (intensity) {
        case 1:
          return 'bg-emerald-200 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-900 hover:ring-2 hover:ring-emerald-500';
        case 2:
          return 'bg-emerald-400 dark:bg-emerald-800 border-emerald-500 dark:border-emerald-700 hover:ring-2 hover:ring-emerald-500';
        case 3:
          return 'bg-emerald-500 dark:bg-emerald-600 border-emerald-600 dark:border-emerald-500 hover:ring-2 hover:ring-emerald-500';
        case 4:
        default:
          return 'bg-emerald-600 dark:bg-emerald-500 border-emerald-700 dark:border-emerald-400 shadow-xs hover:ring-2 hover:ring-emerald-400';
      }
    } else {
      // Habit specific color intensity
      switch (habitColor) {
        case 'indigo':
          return 'bg-indigo-600 dark:bg-indigo-500 border-indigo-700 dark:border-indigo-400 hover:ring-2 hover:ring-indigo-400';
        case 'amber':
          return 'bg-amber-500 dark:bg-amber-500 border-amber-600 dark:border-amber-400 hover:ring-2 hover:ring-amber-400';
        case 'rose':
          return 'bg-rose-500 dark:bg-rose-500 border-rose-600 dark:border-rose-400 hover:ring-2 hover:ring-rose-400';
        case 'cyan':
          return 'bg-cyan-500 dark:bg-cyan-500 border-cyan-600 dark:border-cyan-400 hover:ring-2 hover:ring-cyan-400';
        case 'violet':
          return 'bg-violet-600 dark:bg-violet-500 border-violet-700 dark:border-violet-400 hover:ring-2 hover:ring-violet-400';
        case 'orange':
          return 'bg-orange-500 dark:bg-orange-500 border-orange-600 dark:border-orange-400 hover:ring-2 hover:ring-orange-400';
        case 'blue':
          return 'bg-blue-600 dark:bg-blue-500 border-blue-700 dark:border-blue-400 hover:ring-2 hover:ring-blue-400';
        default:
          return 'bg-emerald-600 dark:bg-emerald-500 border-emerald-700 dark:border-emerald-400 hover:ring-2 hover:ring-emerald-400';
      }
    }
  };

  const handleCellMouseEnter = (day: (typeof calendarDays)[0]) => {
    if (day.isFuture) {
      setHoveredDay(null);
      return;
    }

    const completedNames: string[] = [];
    let completedCount = 0;

    activeHabits.forEach((h) => {
      if (logs[day.date]?.[h.id]?.completed) {
        completedCount++;
        completedNames.push(h.name);
      }
    });

    setHoveredDay({
      date: day.date,
      completedCount,
      totalPossible: activeHabits.length,
      completedNames,
    });
  };

  // Month label headers
  const monthLabels = useMemo(() => {
    const labels: { name: string; colIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, colIdx) => {
      const firstDayOfWeek = week[0];
      if (firstDayOfWeek && firstDayOfWeek.month !== lastMonth) {
        labels.push({
          name: firstDayOfWeek.monthName,
          colIndex: colIdx,
        });
        lastMonth = firstDayOfWeek.month;
      }
    });

    return labels;
  }, [weeks]);

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-750 shadow-xs mb-8 transition-colors">
      {/* Top Header of Heatmap */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Contribution Heatmap
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Interactive Activity Matrix
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Click any cell to inspect or check-off habits for that day.
          </p>
        </div>

        {/* Controls: Target Goal selector & range */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Goal Selector */}
          <select
            value={selectedHabitId}
            onChange={(e) => setSelectedHabitId(e.target.value)}
            className="text-xs font-medium py-1.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">Combined (All Goals)</option>
            {activeHabits.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.category})
              </option>
            ))}
          </select>

          {/* Time range selector */}
          <div className="inline-flex items-center p-0.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-medium">
            <button
              onClick={() => setDaysRange(90)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                daysRange === 90
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              90d
            </button>
            <button
              onClick={() => setDaysRange(140)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                daysRange === 140
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              140d
            </button>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Visual */}
      <div className="mt-5 overflow-x-auto pb-2 scrollbar-thin">
        <div className="inline-block min-w-full">
          {/* Month headers row */}
          <div className="flex text-[11px] text-slate-400 dark:text-slate-500 mb-1.5 pl-8 font-medium">
            {monthLabels.map((ml, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: '54px',
                  width: `${(weeks.length / monthLabels.length) * 16}px`,
                }}
                className="truncate"
              >
                {ml.name}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Days of week initials column (Sun, Mon, Tue, Wed, Thu, Fri, Sat) */}
            <div className="flex flex-col justify-between text-[10px] text-slate-400 dark:text-slate-500 pr-1 select-none font-medium h-[116px] -mt-0.5">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Weeks columns */}
            <div className="flex gap-1.5">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5">
                  {week.map((day) => {
                    const intensity = getDayIntensity(day.date);
                    const cellBg = getCellBgClass(intensity, day.isFuture);
                    const isToday = day.isToday;

                    return (
                      <button
                        key={day.date}
                        disabled={day.isFuture}
                        onClick={() => !day.isFuture && onSelectDate(day.date)}
                        onMouseEnter={() => handleCellMouseEnter(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        aria-label={`View log for ${day.date}`}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] border transition-all ${cellBg} ${
                          isToday ? 'ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-slate-900' : ''
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info: Hovered Day Tooltip Card + Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Dynamic Detail on Hover */}
        <div className="min-h-[22px] flex items-center">
          {hoveredDay ? (
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <span className="font-semibold">{formatNiceDate(hoveredDay.date)}:</span>
              <span>
                {selectedHabitId === 'all' ? (
                  <>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {hoveredDay.completedCount} of {hoveredDay.totalPossible}
                    </strong>{' '}
                    goals completed (
                    {hoveredDay.totalPossible > 0
                      ? Math.round((hoveredDay.completedCount / hoveredDay.totalPossible) * 100)
                      : 0}
                    %)
                  </>
                ) : (
                  <>
                    Status:{' '}
                    <strong
                      className={
                        hoveredDay.completedNames.includes(selectedHabit?.name || '')
                          ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'text-slate-400'
                      }
                    >
                      {hoveredDay.completedNames.includes(selectedHabit?.name || '')
                        ? 'Completed'
                        : 'Incomplete'}
                    </strong>
                  </>
                )}
              </span>
              <span className="text-[11px] text-slate-400 italic hidden md:inline">
                (Click cell to open day log)
              </span>
            </div>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">
              Hover over any square for date details · Click to open day manager
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-slate-400 text-xs self-end sm:self-auto">
          <span>Less</span>
          <div className="flex gap-1 items-center">
            <span className="w-3 h-3 rounded-[3px] bg-slate-100 dark:bg-slate-750 border border-slate-200/40 dark:border-slate-700" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-200 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-900" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-400 dark:bg-emerald-800 border border-emerald-500 dark:border-emerald-700" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-500 dark:bg-emerald-600 border border-emerald-600 dark:border-emerald-500" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-600 dark:bg-emerald-500 border border-emerald-700 dark:border-emerald-400" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
