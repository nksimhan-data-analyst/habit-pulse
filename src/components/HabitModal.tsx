import React, { useState, useEffect } from 'react';
import { X, Sparkles, PlusCircle } from 'lucide-react';
import { Habit, HabitCategory, HabitColor, HabitFrequency, HabitType } from '../types';
import { useHabits } from '../context/HabitContext';
import { ICON_MAP, COLOR_STYLES } from '../utils/habitThemes';

interface HabitModalProps {
  initialHabit?: Habit | null;
  onClose: () => void;
}

const CATEGORIES: HabitCategory[] = [
  'Coding',
  'Fitness',
  'Reading',
  'Mindset',
  'Language',
  'Design',
  'Health',
  'Productivity',
];

const COLORS: HabitColor[] = [
  'emerald',
  'indigo',
  'amber',
  'rose',
  'cyan',
  'violet',
  'orange',
  'blue',
];

const AVAILABLE_ICONS = Object.keys(ICON_MAP);

export const HabitModal: React.FC<HabitModalProps> = ({ initialHabit, onClose }) => {
  const { addHabit, updateHabit } = useHabits();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<HabitType>('habit');
  const [category, setCategory] = useState<HabitCategory>('Coding');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [targetDaysPerWeek, setTargetDaysPerWeek] = useState(7);
  const [color, setColor] = useState<HabitColor>('emerald');
  const [icon, setIcon] = useState<string>('Code');
  const [unit, setUnit] = useState<string>('mins');
  const [targetValue, setTargetValue] = useState<string>('30');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name);
      setDescription(initialHabit.description || '');
      setType(initialHabit.type);
      setCategory(initialHabit.category);
      setFrequency(initialHabit.frequency);
      setTargetDaysPerWeek(initialHabit.targetDaysPerWeek);
      setColor(initialHabit.color);
      setIcon(initialHabit.icon);
      setUnit(initialHabit.unit || '');
      setTargetValue(initialHabit.targetValue ? String(initialHabit.targetValue) : '');
    }
  }, [initialHabit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a goal name.');
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      type,
      color,
      icon,
      frequency,
      targetDaysPerWeek: Number(targetDaysPerWeek) || 7,
      unit: unit.trim() || undefined,
      targetValue: targetValue ? Number(targetValue) : undefined,
    };

    if (initialHabit) {
      updateHabit({
        ...initialHabit,
        ...payload,
      });
    } else {
      addHabit(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {initialHabit ? 'Edit Habit or Skill' : 'Create New Goal'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Set your target, track streaks, and build consistent habits
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Goal Type Switcher (Habit vs Skill) */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Goal Focus Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-700/60 rounded-xl">
              <button
                type="button"
                onClick={() => setType('habit')}
                className={`py-2 px-3 rounded-lg font-semibold transition-all ${
                  type === 'habit'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Habit (Daily Routine)
              </button>
              <button
                type="button"
                onClick={() => setType('skill')}
                className={`py-2 px-3 rounded-lg font-semibold transition-all ${
                  type === 'skill'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Skill (Deliberate Practice)
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Goal Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g., LeetCode 2 Problems, Morning Run, Read 20 Pages"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Motivation / Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this matters or instructions"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Category & Frequency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="daily">Every Day (7/7)</option>
                <option value="weekdays">Weekdays (Mon-Fri)</option>
                <option value="flexible">Flexible Days</option>
              </select>
            </div>
          </div>

          {/* Target Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Value (Optional)
              </label>
              <input
                type="number"
                min="1"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="e.g. 2, 30, 10"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Unit (Optional)
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="mins, pages, reps, problems"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          {/* Theme Color Selection */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Theme Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLORS.map((c) => {
                const isSelected = color === c;
                const style = COLOR_STYLES[c];
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform ${style.accentBg} ${
                      isSelected ? 'ring-3 ring-slate-900 dark:ring-white scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                    title={style.name}
                  />
                );
              })}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Icon
            </label>
            <div className="grid grid-cols-8 gap-2 p-2 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-700">
              {AVAILABLE_ICONS.map((iconName) => {
                const IconComp = ICON_MAP[iconName] || Sparkles;
                const isSelected = icon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setIcon(iconName)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                    title={iconName}
                  >
                    <IconComp className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95"
            >
              {initialHabit ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
