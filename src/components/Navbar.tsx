import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Plus,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Download,
  Upload,
  RotateCcw,
  Info,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
  onOpenPortfolioModal: () => void;
  onReplayLoading: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenExportModal,
  onOpenPortfolioModal,
  onReplayLoading,
}) => {
  const {
    theme,
    toggleTheme,
    soundEnabled,
    setSoundEnabled,
    resetToDemoData,
    habits,
    logs,
  } = useHabits();

  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importDataJSON } = useHabits();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = importDataJSON(text);
      if (res.success) {
        alert('Data imported successfully!');
      } else {
        alert(`Failed to import data: ${res.error}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/85 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  HabitPulse
                </span>
                <span className="text-[11px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                  Pro
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 -mt-0.5">
                Interactive Habit & Skill Tracker
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              aria-label={soundEnabled ? 'Mute audio' : 'Enable audio'}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <VolumeX className="w-4.5 h-4.5 text-slate-400" />
              )}
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle color theme"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-slate-600" />
              )}
            </button>

            {/* 3D Intro Replay Button */}
            <button
              onClick={onReplayLoading}
              title="Replay 3D loading animation"
              aria-label="Replay 3D loading animation"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-4.5 h-4.5 text-emerald-500" />
            </button>

            {/* Portfolio / Info Button */}
            <button
              onClick={onOpenPortfolioModal}
              title="Portfolio & Next Steps"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            >
              <Info className="w-4.5 h-4.5 text-indigo-500 dark:text-indigo-400" />
            </button>

            {/* Data Menu (Export/Import/Reset) */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Data</span>
                <span className="text-[10px] opacity-60">▼</span>
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50 text-xs">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenExportModal();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                    >
                      <Download className="w-4 h-4 text-emerald-500" />
                      <span>Export JSON Backup</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                    >
                      <Upload className="w-4 h-4 text-indigo-500" />
                      <span>Import JSON Backup</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                    <button
                      onClick={() => {
                        if (confirm('Load demo seed data with rich history?')) {
                          resetToDemoData();
                        }
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2 text-slate-600 dark:text-slate-300"
                    >
                      <RotateCcw className="w-4 h-4 text-amber-500" />
                      <span>Reset to Demo Data</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Add Habit Primary CTA */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Goal</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
