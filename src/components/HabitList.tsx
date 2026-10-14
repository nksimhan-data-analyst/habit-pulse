import React, { useMemo } from 'react';
import { Habit } from '../types';
import { useHabits } from '../context/HabitContext';
import { HabitCard } from './HabitCard';
import { Card3DTilt } from './3d/Card3DTilt';
import { PlusCircle, SearchX, Sparkles } from 'lucide-react';

interface HabitListProps {
  onEditHabit: (habit: Habit) => void;
  onOpenAddModal: () => void;
  onSelectDayToInspect: (dateISO: string) => void;
}

export const HabitList: React.FC<HabitListProps> = ({
  onEditHabit,
  onOpenAddModal,
  onSelectDayToInspect,
}) => {
  const { habits, viewFilter, selectedCategory, searchQuery, setSearchQuery } = useHabits();

  const filteredHabits = useMemo(() => {
    return habits
      .filter((h) => !h.archived)
      .filter((h) => {
        if (viewFilter === 'all') return true;
        return h.type === viewFilter;
      })
      .filter((h) => {
        if (selectedCategory === 'all') return true;
        return h.category.toLowerCase() === selectedCategory.toLowerCase();
      })
      .filter((h) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          h.name.toLowerCase().includes(q) ||
          (h.description && h.description.toLowerCase().includes(q)) ||
          h.category.toLowerCase().includes(q)
        );
      });
  }, [habits, viewFilter, selectedCategory, searchQuery]);

  if (filteredHabits.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-10 border border-slate-200/80 dark:border-slate-750 text-center flex flex-col items-center justify-center my-6">
        {searchQuery ? (
          <>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-slate-400 mb-3">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              No matching habits found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              We couldn't find any goals matching &ldquo;{searchQuery}&rdquo;. Try another keyword or clear filter.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
            >
              Clear Search
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              No habits in this category yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              Start building your daily routines or tracking deliberate skills practice today.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Your First Goal</span>
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {filteredHabits.map((habit) => (
        <Card3DTilt key={habit.id} maxTilt={6}>
          <HabitCard
            habit={habit}
            onEdit={onEditHabit}
            onSelectDayToInspect={onSelectDayToInspect}
          />
        </Card3DTilt>
      ))}
    </div>
  );
};
