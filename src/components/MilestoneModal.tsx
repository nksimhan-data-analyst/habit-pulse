import React from 'react';
import { Award, Zap, Flame, Target, Sparkles, Trophy, X } from 'lucide-react';
import { Milestone } from '../types';

interface MilestoneModalProps {
  milestone: Milestone;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Zap,
  Flame,
  Target,
  Award,
  Sparkles,
  Trophy,
};

export const MilestoneModal: React.FC<MilestoneModalProps> = ({ milestone, onClose }) => {
  const IconComp = ICON_MAP[milestone.badgeIcon] || Trophy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-sm w-full p-6 text-center border border-amber-200/60 dark:border-amber-900/40 shadow-2xl animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebratory Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 mb-4 animate-bounce">
          <IconComp className="w-10 h-10" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/70 px-2.5 py-1 rounded-full">
          New Milestone Unlocked!
        </span>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3">
          {milestone.title}
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          {milestone.description}
        </p>

        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          <span>{milestone.streakRequirement} Consecutive Days Accomplished!</span>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 px-4 font-bold text-sm rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95"
        >
          Keep Crushing It!
        </button>
      </div>
    </div>
  );
};
