"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProgressState {
  visitedModules: string[];
  completedLessons: string[];
  completedExercises: string[];
  completedProjects: string[];
  streak: { lastActiveDate: string; count: number };
  currentModuleId: string | null;
  currentLessonId: string | null;
  // actions
  openModule: (moduleId: string, lessonId?: string | null) => void;
  openLesson: (moduleId: string, lessonId: string) => void;
  markLessonComplete: (moduleId: string, lessonId: string) => void;
  markExerciseComplete: (key: string) => void;
  markProjectComplete: (key: string) => void;
  reset: () => void;
  registerActivity: () => void;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      visitedModules: [],
      completedLessons: [],
      completedExercises: [],
      completedProjects: [],
      streak: { lastActiveDate: "", count: 0 },
      currentModuleId: null,
      currentLessonId: null,

      openModule: (moduleId, lessonId = null) => {
        set((s) => {
          const visited = s.visitedModules.includes(moduleId)
            ? s.visitedModules
            : [...s.visitedModules, moduleId];
          const today = todayKey();
          const lastDate = s.streak.lastActiveDate;
          let count = s.streak.count;
          if (lastDate !== today) {
            count = lastDate === yesterdayKey() ? count + 1 : 1;
          } else if (count === 0) {
            count = 1;
          }
          return {
            visitedModules: visited,
            currentModuleId: moduleId,
            currentLessonId: lessonId,
            streak: { lastActiveDate: today, count },
          };
        });
      },

      openLesson: (moduleId, lessonId) => {
        set((s) => {
          const visited = s.visitedModules.includes(moduleId)
            ? s.visitedModules
            : [...s.visitedModules, moduleId];
          return {
            visitedModules: visited,
            currentModuleId: moduleId,
            currentLessonId: lessonId,
          };
        });
      },

      markLessonComplete: (moduleId, lessonId) => {
        const key = `${moduleId}/${lessonId}`;
        set((s) =>
          s.completedLessons.includes(key)
            ? s
            : { completedLessons: [...s.completedLessons, key] },
        );
      },

      markExerciseComplete: (key) => {
        set((s) =>
          s.completedExercises.includes(key)
            ? s
            : { completedExercises: [...s.completedExercises, key] },
        );
      },

      markProjectComplete: (key) => {
        set((s) =>
          s.completedProjects.includes(key)
            ? s
            : { completedProjects: [...s.completedProjects, key] },
        );
      },

      registerActivity: () => {
        set((s) => {
          const today = todayKey();
          const lastDate = s.streak.lastActiveDate;
          let count = s.streak.count;
          if (lastDate !== today) {
            count = lastDate === yesterdayKey() ? count + 1 : 1;
          } else if (count === 0) {
            count = 1;
          }
          return { streak: { lastActiveDate: today, count } };
        });
      },

      reset: () =>
        set({
          visitedModules: [],
          completedLessons: [],
          completedExercises: [],
          completedProjects: [],
          streak: { lastActiveDate: "", count: 0 },
          currentModuleId: null,
          currentLessonId: null,
        }),
    }),
    {
      name: "pylab-progress-v1",
      version: 1,
    },
  ),
);

// Helpers
export function selectModuleProgress(moduleId: string, totalLessons: number): number {
  const s = useProgressStore.getState();
  const done = s.completedLessons.filter((k) => k.startsWith(`${moduleId}/`)).length;
  return totalLessons === 0 ? 0 : done / totalLessons;
}

export function selectOverallProgress(totalLessons: number): number {
  const s = useProgressStore.getState();
  return totalLessons === 0 ? 0 : s.completedLessons.length / totalLessons;
}
