import React, { useState } from 'react';
import { Award, Zap, Flame, Target, Sparkles, Trophy, Lock, Check, Box } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { calculateHabitStats } from '../utils/dateUtils';
import { Milestone3DModal } from './3d/Milestone3DModal';
import { Milestone } from '../types';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Zap,
  Flame,
  Target,
  Award,
  Sparkles,
  Trophy,
};

export const MilestonesSection: React.FC = () => {
  const { milestones, habits, logs } = useHabits();
  const [selectedMilestone3D, setSelectedMilestone3D] = useState<Milestone | null>(null);

  // Find current maximum active streak
  let maxActiveStreak = 0;
  habits.forEach((h) => {
    if (!h.archived) {
      const stats = calculateHabitStats(h, logs);
      if (stats.currentStreak > maxActiveStreak) {
        maxActiveStreak = stats.currentStreak;
      }
    }
  });

  return (
    <>
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-750 shadow-xs mb-8 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Streak Milestones & Badges
              </h2>
              <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Consistency Badges</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Unlock badges as you build continuous unbroken streaks. Click any badge to inspect in 3D!
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {milestones.filter((m) => m.unlocked).length} of {milestones.length} Unlocked
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {milestones.map((m) => {
            const IconComp = ICON_MAP[m.badgeIcon] || Award;
            const isUnlocked = m.unlocked;
            const progressPercent = Math.min(
              100,
              Math.round((maxActiveStreak / m.streakRequirement) * 100)
            );

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMilestone3D(m)}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer group ${
                  isUnlocked
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/50 hover:border-amber-400'
                    : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/70 opacity-75 hover:opacity-100'
                }`}
                title="Click to inspect badge in 3D space"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/20'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      <IconComp className="w-4.5 h-4.5" />
                    </div>
                    {isUnlocked ? (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                        <Check className="w-3 h-3 stroke-[3]" /> Done
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {m.title}
                    </h4>
                    <Box className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {m.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 w-full">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <span>{m.streakRequirement} Days</span>
                    <span>{isUnlocked ? '3D View' : `${maxActiveStreak}/${m.streakRequirement}d`}</span>
                  </div>
                  {!isUnlocked && (
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedMilestone3D && (
        <Milestone3DModal
          milestone={selectedMilestone3D}
          onClose={() => setSelectedMilestone3D(null)}
        />
      )}
    </>
  );
};
