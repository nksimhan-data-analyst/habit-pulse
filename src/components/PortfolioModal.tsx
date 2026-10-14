import React from 'react';
import { X, Sparkles, Layers, Cloud, Trophy, BellRing, Code, ShieldCheck } from 'lucide-react';

interface PortfolioModalProps {
  onClose: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Project Architecture & Portfolio Next Steps
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Technical overview and advanced roadmap extensions
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

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300">
          {/* Tech Stack Summary */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
              Production Stack Highlights
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block">React 19 + Vite</span>
                <span className="text-[11px] text-slate-400">Functional & Hooks</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block">Tailwind CSS v4</span>
                <span className="text-[11px] text-slate-400">Dark/Light Mode</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block">Web Audio API</span>
                <span className="text-[11px] text-slate-400">Zero-asset audio</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block">Canvas Confetti</span>
                <span className="text-[11px] text-slate-400">Milestone bursts</span>
              </div>
            </div>
          </div>

          {/* 3 Advanced Features Roadmap */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              3 High-Impact Features to Add to Your Portfolio
            </h4>

            <div className="space-y-3">
              {/* Feature 1 */}
              <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20">
                <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                  <Cloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>1. Full Cloud & Multi-Device Sync (Firebase / Supabase Auth)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Extend the current localStorage architecture with Firebase Firestore or Supabase PostgreSQL.
                  Users can sign in with Google or GitHub, allowing real-time sync across desktop, laptop, and mobile devices with offline-first caching via IndexedDB.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-4 rounded-xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 mb-1">
                  <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>2. Social Accountability & Community Streak Challenges</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Add collaborative habit circles where friends or teammates track shared challenges
                  (e.g., &ldquo;30 Days of LeetCode&rdquo; or &ldquo;100 Days of Code&rdquo;). Include an automated leaderboard, peer reactions, and shareable weekly streak snapshot cards for LinkedIn/Twitter.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-4 rounded-xl border border-teal-100 dark:border-teal-900/40 bg-teal-50/40 dark:bg-teal-950/20">
                <div className="flex items-center gap-2 font-bold text-teal-900 dark:text-teal-200 mb-1">
                  <BellRing className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>3. PWA Integration with Smart Web Push Reminders</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Turn the application into an installable Progressive Web App (PWA) with a Service Worker, Web App Manifest,
                  and local notification scheduling (e.g. &ldquo;Don&apos;t break your 14-day streak on TypeScript Practice today!&rdquo;) triggered during the user&apos;s preferred focus window.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-750/60 border-t border-slate-100 dark:border-slate-700/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-xs sm:text-sm rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
