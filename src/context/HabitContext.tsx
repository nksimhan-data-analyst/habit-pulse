import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Habit, HabitLogState, Milestone, ViewFilter } from '../types';
import { INITIAL_HABITS, INITIAL_MILESTONES, generateInitialLogs } from '../data/initialData';
import { getTodayISO, calculateHabitStats } from '../utils/dateUtils';
import { fireCelebrationConfetti, fireMilestoneConfetti } from '../utils/confetti';
import { sounds } from '../utils/audio';

interface HabitContextType {
  habits: Habit[];
  logs: HabitLogState;
  milestones: Milestone[];
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  selectedCategory: string;
  viewFilter: ViewFilter;
  searchQuery: string;
  newlyUnlockedMilestone: Milestone | null;
  dismissMilestoneModal: () => void;
  setSelectedCategory: (cat: string) => void;
  setViewFilter: (filter: ViewFilter) => void;
  setSearchQuery: (query: string) => void;
  toggleTheme: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleHabitDay: (habitId: string, dateISO: string, value?: number, note?: string) => void;
  addHabit: (habitData: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  resetToDemoData: () => void;
  clearAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => { success: boolean; error?: string };
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const HABITS_STORAGE_KEY = 'habitpulse_v1_habits';
const LOGS_STORAGE_KEY = 'habitpulse_v1_logs';
const MILESTONES_STORAGE_KEY = 'habitpulse_v1_milestones';
const THEME_STORAGE_KEY = 'habitpulse_v1_theme';
const SOUND_STORAGE_KEY = 'habitpulse_v1_sound';

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Sound state
  const [soundEnabled, setSoundState] = useState<boolean>(() => {
    const saved = localStorage.getItem(SOUND_STORAGE_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newlyUnlockedMilestone, setNewlyUnlockedMilestone] = useState<Milestone | null>(null);

  // Habits state with localStorage
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(HABITS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load habits from localStorage', e);
    }
    return INITIAL_HABITS;
  });

  // Logs state with localStorage
  const [logs, setLogs] = useState<HabitLogState>(() => {
    try {
      const saved = localStorage.getItem(LOGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) return parsed;
      }
    } catch (e) {
      console.error('Failed to load logs from localStorage', e);
    }
    return generateInitialLogs();
  });

  // Milestones state with localStorage
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const saved = localStorage.getItem(MILESTONES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load milestones from localStorage', e);
    }
    return INITIAL_MILESTONES;
  });

  // Sync theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Sync sounds
  useEffect(() => {
    sounds.enabled = soundEnabled;
    localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
  }, [soundEnabled]);

  // Sync habits to localStorage
  useEffect(() => {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  // Sync logs to localStorage
  useEffect(() => {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  // Sync milestones to localStorage
  useEffect(() => {
    localStorage.setItem(MILESTONES_STORAGE_KEY, JSON.stringify(milestones));
  }, [milestones]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundState(enabled);
  }, []);

  // Check milestones helper
  const checkMilestones = useCallback((currentHabits: Habit[], currentLogs: HabitLogState) => {
    // Find highest streak across all habits
    let maxStreak = 0;
    currentHabits.forEach((h) => {
      const stats = calculateHabitStats(h, currentLogs);
      if (stats.currentStreak > maxStreak) {
        maxStreak = stats.currentStreak;
      }
    });

    setMilestones((prevMilestones) => {
      let newlyAchieved: Milestone | null = null;
      const updated = prevMilestones.map((m) => {
        if (!m.unlocked && maxStreak >= m.streakRequirement) {
          const unlockedM = {
            ...m,
            unlocked: true,
            unlockedAt: getTodayISO(),
          };
          if (!newlyAchieved) {
            newlyAchieved = unlockedM;
          }
          return unlockedM;
        }
        return m;
      });

      if (newlyAchieved) {
        setNewlyUnlockedMilestone(newlyAchieved);
        fireMilestoneConfetti();
        sounds.playMilestone();
      }

      return updated;
    });
  }, []);

  // Toggle habit day completion
  const toggleHabitDay = useCallback(
    (habitId: string, dateISO: string, value?: number, note?: string) => {
      setLogs((prevLogs) => {
        const dateLogs = prevLogs[dateISO] || {};
        const isCurrentlyCompleted = Boolean(dateLogs[habitId]?.completed);
        const willBeCompleted = !isCurrentlyCompleted;

        const newDateLogs = { ...dateLogs };
        if (willBeCompleted) {
          newDateLogs[habitId] = {
            completed: true,
            value: value !== undefined ? value : dateLogs[habitId]?.value,
            note: note !== undefined ? note : dateLogs[habitId]?.note,
          };
          sounds.playCheck();

          // Check if all active habits completed for today
          const todayISO = getTodayISO();
          if (dateISO === todayISO) {
            const activeHabitIds = habits.filter((h) => !h.archived).map((h) => h.id);
            const allDone = activeHabitIds.every((id) =>
              id === habitId ? true : Boolean(newDateLogs[id]?.completed)
            );
            if (allDone && activeHabitIds.length > 0) {
              fireCelebrationConfetti();
            }
          }
        } else {
          // Uncheck
          delete newDateLogs[habitId];
          sounds.playUncheck();
        }

        const nextLogs = {
          ...prevLogs,
          [dateISO]: newDateLogs,
        };

        // Milestone evaluation
        setTimeout(() => {
          checkMilestones(habits, nextLogs);
        }, 100);

        return nextLogs;
      });
    },
    [habits, checkMilestones]
  );

  const addHabit = useCallback(
    (habitData: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => {
      const newHabit: Habit = {
        ...habitData,
        id: `habit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: getTodayISO(),
        archived: false,
      };
      setHabits((prev) => [newHabit, ...prev]);
      sounds.playCheck();
    },
    []
  );

  const updateHabit = useCallback((updatedHabit: Habit) => {
    setHabits((prev) => prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)));
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    // Optional: clean up logs for habit
    setLogs((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((d) => {
        if (next[d]?.[habitId]) {
          delete next[d][habitId];
        }
      });
      return next;
    });
  }, []);

  const resetToDemoData = useCallback(() => {
    setHabits(INITIAL_HABITS);
    setLogs(generateInitialLogs());
    setMilestones(INITIAL_MILESTONES);
    sounds.playMilestone();
  }, []);

  const clearAllData = useCallback(() => {
    setHabits([]);
    setLogs({});
    setMilestones(INITIAL_MILESTONES.map((m) => ({ ...m, unlocked: false, unlockedAt: undefined })));
  }, []);

  const exportDataJSON = useCallback(() => {
    const exportPayload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      habits,
      logs,
      milestones,
    };
    return JSON.stringify(exportPayload, null, 2);
  }, [habits, logs, milestones]);

  const importDataJSON = useCallback((jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== 'object') {
        return { success: false, error: 'Invalid file format.' };
      }
      if (Array.isArray(data.habits)) {
        setHabits(data.habits);
      }
      if (typeof data.logs === 'object' && data.logs !== null) {
        setLogs(data.logs);
      }
      if (Array.isArray(data.milestones)) {
        setMilestones(data.milestones);
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Invalid JSON file contents.' };
    }
  }, []);

  const dismissMilestoneModal = useCallback(() => {
    setNewlyUnlockedMilestone(null);
  }, []);

  const value = useMemo(
    () => ({
      habits,
      logs,
      milestones,
      theme,
      soundEnabled,
      selectedCategory,
      viewFilter,
      searchQuery,
      newlyUnlockedMilestone,
      dismissMilestoneModal,
      setSelectedCategory,
      setViewFilter,
      setSearchQuery,
      toggleTheme,
      setSoundEnabled,
      toggleHabitDay,
      addHabit,
      updateHabit,
      deleteHabit,
      resetToDemoData,
      clearAllData,
      exportDataJSON,
      importDataJSON,
    }),
    [
      habits,
      logs,
      milestones,
      theme,
      soundEnabled,
      selectedCategory,
      viewFilter,
      searchQuery,
      newlyUnlockedMilestone,
      dismissMilestoneModal,
      toggleTheme,
      setSoundEnabled,
      toggleHabitDay,
      addHabit,
      updateHabit,
      deleteHabit,
      resetToDemoData,
      clearAllData,
      exportDataJSON,
      importDataJSON,
    ]
  );

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
