import React, { useState } from 'react';
import { X, Check, Calendar, Sparkles, MessageSquare } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { formatNiceDate, getTodayISO } from '../utils/dateUtils';
import { ICON_MAP, COLOR_STYLES } from '../utils/habitThemes';

interface DayDetailsModalProps {
  dateISO: string;
  onClose: () => void;
}

export const DayDetailsModal: React.FC<DayDetailsModalProps> = ({ dateISO, onClose }) => {
  const { habits, logs, toggleHabitDay } = useHabits();
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  const activeHabits = habits.filter((h) => !h.archived);
  const dayLogs = logs[dateISO] || {};
  const isToday = dateISO === getTodayISO();

  const completedCount = activeHabits.filter((h) => dayLogs[h.id]?.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {formatNiceDate(dateISO)}
                </h3>
                {isToday && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    TODAY
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {completedCount} of {activeHabits.length} goals completed
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Habits Checklist for this date */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-2.5">
          {activeHabits.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              No active habits found. Add your first goal to start tracking!
            </p>
          ) : (
            activeHabits.map((habit) => {
              const isCompleted = Boolean(dayLogs[habit.id]?.completed);
              const IconComponent = ICON_MAP[habit.icon] || Sparkles;
              const colorStyle = COLOR_STYLES[habit.color] || COLOR_STYLES.emerald;

              return (
                <div
                  key={habit.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isCompleted
                      ? 'bg-slate-50/80 dark:bg-slate-750/50 border-slate-200 dark:border-slate-700'
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleHabitDay(habit.id, dateISO)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? `${colorStyle.checkboxActive} shadow-xs`
                          : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold text-xs sm:text-sm truncate ${
                            isCompleted
                              ? 'text-slate-900 dark:text-white line-through opacity-80'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {habit.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                        <span>{habit.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{habit.type}</span>
                        {habit.targetValue && habit.unit && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>
                              {habit.targetValue} {habit.unit}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {isCompleted ? 'Done' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-750/60 border-t border-slate-100 dark:border-slate-700/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
