import React from 'react';
import { Search, SlidersHorizontal, Calendar, Grid3X3, ListFilter } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { HabitCategory, ViewFilter } from '../types';

interface FilterBarProps {
  activeView: 'weekly' | 'heatmap';
  setActiveView: (view: 'weekly' | 'heatmap') => void;
}

const CATEGORIES: ('all' | HabitCategory)[] = [
  'all',
  'Coding',
  'Fitness',
  'Reading',
  'Mindset',
  'Language',
  'Health',
  'Productivity',
];

export const FilterBar: React.FC<FilterBarProps> = ({ activeView, setActiveView }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    viewFilter,
    setViewFilter,
    searchQuery,
    setSearchQuery,
  } = useHabits();

  return (
    <div className="space-y-3 mb-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: View Tabs (Weekly vs Heatmap) & Type Tabs (All / Habits / Skills) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Visual Mode Toggle */}
          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveView('weekly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'weekly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>Weekly Tracker</span>
            </button>
            <button
              onClick={() => setActiveView('heatmap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'heatmap'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Contribution Heatmap</span>
            </button>
          </div>

          {/* Type Filter: All / Habits / Skills */}
          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
            <button
              onClick={() => setViewFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                viewFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setViewFilter('habit')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                viewFilter === 'habit'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Habits Only
            </button>
            <button
              onClick={() => setViewFilter('skill')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                viewFilter === 'skill'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Skills Practice
            </button>
          </div>
        </div>

        {/* Right: Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search habits or skills..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* Categories Horizontal Scroll Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 text-[11px] font-medium mr-1 uppercase tracking-wider">
          Category:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3 py-1 rounded-lg font-medium transition-colors ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
