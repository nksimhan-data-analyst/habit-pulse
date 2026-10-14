import React, { useState } from 'react';
import { HabitProvider, useHabits } from './context/HabitContext';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { FilterBar } from './components/FilterBar';
import { HabitList } from './components/HabitList';
import { HeatmapGrid } from './components/HeatmapGrid';
import { MilestonesSection } from './components/MilestonesSection';
import { HabitModal } from './components/HabitModal';
import { DayDetailsModal } from './components/DayDetailsModal';
import { MilestoneModal } from './components/MilestoneModal';
import { ExportImportModal } from './components/ExportImportModal';
import { PortfolioModal } from './components/PortfolioModal';
import { LoadingScreen } from './components/3d/LoadingScreen';
import { StreakOrb3D } from './components/3d/StreakOrb3D';
import { Habit } from './types';
import { getTodayISO } from './utils/dateUtils';
import { Flame, CheckCircle, Database, Sparkles, Box } from 'lucide-react';

const MainTrackerContent: React.FC = () => {
  const { newlyUnlockedMilestone, dismissMilestoneModal, habits, logs } = useHabits();

  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'weekly' | 'heatmap'>('weekly');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [inspectingDate, setInspectingDate] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);

  const todayISO = getTodayISO();
  const completedTodayCount = habits.filter(
    (h) => !h.archived && logs[todayISO]?.[h.id]?.completed
  ).length;
  const totalActive = habits.filter((h) => !h.archived).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors flex flex-col">
      {/* Custom 3D Loading Page Animation */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={() => {
          setEditingHabit(null);
          setIsAddModalOpen(true);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenPortfolioModal={() => setIsPortfolioModalOpen(true)}
        onReplayLoading={() => setIsLoading(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {/* Dynamic 3D Hero & Daily Motivation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Daily Motivation Banner */}
          <div className="lg:col-span-2 flex flex-col justify-between bg-gradient-to-r from-emerald-600/10 via-teal-500/10 to-indigo-500/10 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-indigo-950/30 border border-emerald-500/20 dark:border-emerald-500/10 rounded-2xl p-5">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    Consistency is the bridge between goals and accomplishment.
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Today: <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">{completedTodayCount} of {totalActive}</strong> goals completed.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                Small repeated habits compound exponentially over time. Keep your unbroken streak alive and watch your capabilities transform.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/15 dark:border-emerald-500/10 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => setInspectingDate(todayISO)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Review Today's Checklist</span>
              </button>

              <button
                onClick={() => setIsLoading(true)}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <Box className="w-3.5 h-3.5 text-indigo-500" />
                <span>Replay 3D Intro Animation</span>
              </button>
            </div>
          </div>

          {/* Interactive 3D Momentum Orb Card */}
          <div className="lg:col-span-1">
            <StreakOrb3D />
          </div>
        </div>

        {/* 1. Dashboard Overview Metrics */}
        <DashboardStats />

        {/* 2. Filter Bar (View Mode, Categories, Types, Search) */}
        <FilterBar activeView={activeView} setActiveView={setActiveView} />

        {/* 3. Heatmap View (Shown prominently when active or toggleable) */}
        {activeView === 'heatmap' && (
          <HeatmapGrid onSelectDate={(date) => setInspectingDate(date)} />
        )}

        {/* 4. Habit Cards List with Interactive 7-Day Matrix */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {activeView === 'weekly' ? 'Active Goals & 7-Day Check-off' : 'Tracked Goals'}
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Click any circle to toggle completion
            </span>
          </div>

          <HabitList
            onEditHabit={(habit) => {
              setEditingHabit(habit);
              setIsAddModalOpen(true);
            }}
            onOpenAddModal={() => {
              setEditingHabit(null);
              setIsAddModalOpen(true);
            }}
            onSelectDayToInspect={(date) => setInspectingDate(date)}
          />
        </div>

        {/* 5. Streak Milestones & Badges Section */}
        <MilestonesSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">HabitPulse</span>
            <span aria-hidden="true">·</span>
            <span>Local Storage Persistent</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Database className="w-3.5 h-3.5" /> Auto-saved
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPortfolioModalOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Portfolio Roadmap & Architecture
            </button>
            <span aria-hidden="true">·</span>
            <span>Built with React 19 & Tailwind CSS</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isAddModalOpen && (
        <HabitModal
          initialHabit={editingHabit}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingHabit(null);
          }}
        />
      )}

      {inspectingDate && (
        <DayDetailsModal
          dateISO={inspectingDate}
          onClose={() => setInspectingDate(null)}
        />
      )}

      {newlyUnlockedMilestone && (
        <MilestoneModal
          milestone={newlyUnlockedMilestone}
          onClose={dismissMilestoneModal}
        />
      )}

      {isExportModalOpen && (
        <ExportImportModal onClose={() => setIsExportModalOpen(false)} />
      )}

      {isPortfolioModalOpen && (
        <PortfolioModal onClose={() => setIsPortfolioModalOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <HabitProvider>
      <MainTrackerContent />
    </HabitProvider>
  );
}
