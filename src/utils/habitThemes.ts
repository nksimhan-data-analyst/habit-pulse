import {
  Code,
  Terminal,
  Flame,
  BookOpen,
  Brain,
  Globe,
  Dumbbell,
  Target,
  Sparkles,
  Zap,
  Heart,
  Coffee,
  Music,
  PenTool,
  Cpu,
  Smile,
  LucideIcon,
} from 'lucide-react';
import { HabitColor } from '../types';

export const ICON_MAP: Record<string, LucideIcon> = {
  Terminal,
  Code,
  Flame,
  BookOpen,
  Brain,
  Globe,
  Dumbbell,
  Target,
  Sparkles,
  Zap,
  Heart,
  Coffee,
  Music,
  PenTool,
  Cpu,
  Smile,
};

export const COLOR_STYLES: Record<
  HabitColor,
  {
    name: string;
    badgeBg: string;
    badgeText: string;
    accentBg: string;
    accentBorder: string;
    dotBg: string;
    checkboxActive: string;
    heatColor: string;
  }
> = {
  emerald: {
    name: 'Emerald',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    accentBg: 'bg-emerald-500',
    accentBorder: 'border-emerald-500',
    dotBg: 'bg-emerald-500',
    checkboxActive: 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500',
    heatColor: 'bg-emerald-500',
  },
  indigo: {
    name: 'Indigo',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    accentBg: 'bg-indigo-500',
    accentBorder: 'border-indigo-500',
    dotBg: 'bg-indigo-500',
    checkboxActive: 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500',
    heatColor: 'bg-indigo-500',
  },
  amber: {
    name: 'Amber',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    accentBg: 'bg-amber-500',
    accentBorder: 'border-amber-500',
    dotBg: 'bg-amber-500',
    checkboxActive: 'bg-amber-600 text-white border-amber-600 dark:bg-amber-500',
    heatColor: 'bg-amber-500',
  },
  rose: {
    name: 'Rose',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    accentBg: 'bg-rose-500',
    accentBorder: 'border-rose-500',
    dotBg: 'bg-rose-500',
    checkboxActive: 'bg-rose-600 text-white border-rose-600 dark:bg-rose-500',
    heatColor: 'bg-rose-500',
  },
  cyan: {
    name: 'Cyan',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/40',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    accentBg: 'bg-cyan-500',
    accentBorder: 'border-cyan-500',
    dotBg: 'bg-cyan-500',
    checkboxActive: 'bg-cyan-600 text-white border-cyan-600 dark:bg-cyan-500',
    heatColor: 'bg-cyan-500',
  },
  violet: {
    name: 'Violet',
    badgeBg: 'bg-violet-50 dark:bg-violet-950/40',
    badgeText: 'text-violet-700 dark:text-violet-300',
    accentBg: 'bg-violet-500',
    accentBorder: 'border-violet-500',
    dotBg: 'bg-violet-500',
    checkboxActive: 'bg-violet-600 text-white border-violet-600 dark:bg-violet-500',
    heatColor: 'bg-violet-500',
  },
  orange: {
    name: 'Orange',
    badgeBg: 'bg-orange-50 dark:bg-orange-950/40',
    badgeText: 'text-orange-700 dark:text-orange-300',
    accentBg: 'bg-orange-500',
    accentBorder: 'border-orange-500',
    dotBg: 'bg-orange-500',
    checkboxActive: 'bg-orange-600 text-white border-orange-600 dark:bg-orange-500',
    heatColor: 'bg-orange-500',
  },
  blue: {
    name: 'Blue',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40',
    badgeText: 'text-blue-700 dark:text-blue-300',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-500',
    dotBg: 'bg-blue-500',
    checkboxActive: 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500',
    heatColor: 'bg-blue-500',
  },
};
