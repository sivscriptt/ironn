"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PLAN, todayDateStr, type WorkoutKey } from "@/data/plan";

// ─── Types ──────────────────────────────────────────────────────────────────

export type SetLog = {
  reps: number;
  weight: number;
  rir?: number;
  completedAt: number;
};

export type ExerciseLog = {
  exerciseKey: string;
  sets: SetLog[];
};

export type Session = {
  id: string;
  date: string;
  workoutKey: WorkoutKey;
  exercises: ExerciseLog[];
  startedAt: number;
  finishedAt?: number;
  notes?: string;
};

export type DayLog = {
  date: string;
  // Meals: which planned meals have been marked eaten today
  meals: Record<string, boolean>;
  // Custom (off-plan) foods logged today
  customFoods: CustomFood[];
  // Water in ml
  water: number;
  steps?: number;
  weight?: number; // kg
  sleepInBed?: string; // HH:MM
  sleepOutBed?: string; // HH:MM
  supplements: Record<string, boolean>;
  mood?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
};

export type CustomFood = {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  slot?: string; // "breakfast" | "lunch" | "dinner" | "snack"
  loggedAt: number;
};

export type WeighIn = {
  id: string;
  date: string;
  weight: number;
  notes?: string;
};

export type ProgressPhoto = {
  id: string;
  date: string;
  dataUrl: string; // base64
  pose: "front" | "side" | "back";
};

// ─── Store ──────────────────────────────────────────────────────────────────

type State = {
  sessions: Session[];
  dayLogs: Record<string, DayLog>; // keyed by date YYYY-MM-DD
  weighIns: WeighIn[];
  photos: ProgressPhoto[];

  // SESSION (workout)
  startSession: (workoutKey: WorkoutKey) => Session;
  logSet: (sessionId: string, exerciseKey: string, set: Omit<SetLog, "completedAt">) => void;
  removeLastSet: (sessionId: string, exerciseKey: string) => void;
  finishSession: (sessionId: string, notes?: string) => void;
  getActiveSession: () => Session | undefined;
  getLastSession: (workoutKey: WorkoutKey) => Session | undefined;
  getLastSetFor: (exerciseKey: string) => SetLog | undefined;

  // DAY LOG
  today: () => DayLog;
  getDay: (date: string) => DayLog;
  setMealEaten: (mealKey: string, eaten: boolean) => void;
  setSupplement: (key: string, taken: boolean) => void;
  addWater: (ml: number) => void;
  setSteps: (n: number) => void;
  setWeight: (kg: number) => void;
  logCustomFood: (food: Omit<CustomFood, "id" | "loggedAt">) => void;
  removeCustomFood: (id: string) => void;
  setSleep: (inBed: string, outBed: string) => void;

  // WEIGH-IN
  addWeighIn: (weight: number, notes?: string) => void;
  removeWeighIn: (id: string) => void;

  // PHOTO
  addPhoto: (dataUrl: string, pose: ProgressPhoto["pose"]) => void;
  removePhoto: (id: string) => void;

  // Reset
  reset: () => void;
};

const blankDay = (date: string): DayLog => ({
  date,
  meals: {},
  customFoods: [],
  water: 0,
  supplements: {},
});

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      sessions: [],
      dayLogs: {},
      weighIns: [],
      photos: [],

      startSession: (workoutKey) => {
        const session: Session = {
          id: uid(),
          date: todayDateStr(),
          workoutKey,
          exercises: [],
          startedAt: Date.now(),
        };
        set((s) => ({ sessions: [...s.sessions, session] }));
        return session;
      },

      logSet: (sessionId, exerciseKey, setData) => {
        set((s) => ({
          sessions: s.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            const existing = sess.exercises.find((e) => e.exerciseKey === exerciseKey);
            const newSet: SetLog = { ...setData, completedAt: Date.now() };
            if (existing) {
              return {
                ...sess,
                exercises: sess.exercises.map((e) =>
                  e.exerciseKey === exerciseKey ? { ...e, sets: [...e.sets, newSet] } : e,
                ),
              };
            }
            return {
              ...sess,
              exercises: [...sess.exercises, { exerciseKey, sets: [newSet] }],
            };
          }),
        }));
      },

      removeLastSet: (sessionId, exerciseKey) => {
        set((s) => ({
          sessions: s.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            return {
              ...sess,
              exercises: sess.exercises
                .map((e) =>
                  e.exerciseKey === exerciseKey ? { ...e, sets: e.sets.slice(0, -1) } : e,
                )
                .filter((e) => e.sets.length > 0),
            };
          }),
        }));
      },

      finishSession: (sessionId, notes) => {
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === sessionId ? { ...sess, finishedAt: Date.now(), notes } : sess,
          ),
        }));
      },

      getActiveSession: () => {
        const today = todayDateStr();
        return get().sessions.find((s) => s.date === today && !s.finishedAt);
      },

      getLastSession: (workoutKey) => {
        const sessions = get()
          .sessions.filter((s) => s.workoutKey === workoutKey && s.finishedAt)
          .sort((a, b) => (a.finishedAt! < b.finishedAt! ? 1 : -1));
        return sessions[0];
      },

      getLastSetFor: (exerciseKey) => {
        const sessions = [...get().sessions].sort((a, b) =>
          (b.finishedAt ?? b.startedAt) - (a.finishedAt ?? a.startedAt),
        );
        for (const sess of sessions) {
          const ex = sess.exercises.find((e) => e.exerciseKey === exerciseKey);
          if (ex && ex.sets.length > 0) return ex.sets[ex.sets.length - 1];
        }
        return undefined;
      },

      today: () => {
        const date = todayDateStr();
        return get().dayLogs[date] ?? blankDay(date);
      },

      getDay: (date) => get().dayLogs[date] ?? blankDay(date),

      setMealEaten: (mealKey, eaten) => {
        const date = todayDateStr();
        set((s) => {
          const day = s.dayLogs[date] ?? blankDay(date);
          return {
            dayLogs: {
              ...s.dayLogs,
              [date]: { ...day, meals: { ...day.meals, [mealKey]: eaten } },
            },
          };
        });
      },

      setSupplement: (key, taken) => {
        const date = todayDateStr();
        set((s) => {
          const day = s.dayLogs[date] ?? blankDay(date);
          return {
            dayLogs: {
              ...s.dayLogs,
              [date]: {
                ...day,
                supplements: { ...day.supplements, [key]: taken },
              },
            },
          };
        });
      },

      addWater: (ml) => {
        const date = todayDateStr();
        set((s) => {
          const day = s.dayLogs[date] ?? blankDay(date);
          return {
            dayLogs: {
              ...s.dayLogs,
              [date]: { ...day, water: Math.max(0, day.water + ml) },
            },
          };
        });
      },

      setSteps: (n) => {
        const date = todayDateStr();
        set((s) => {
          const day = s.dayLogs[date] ?? blankDay(date);
          return {
            dayLogs: {
              ...s.dayLogs,
              [date]: { ...day, steps: n },
            },
          };
        });
      },

      setWeight: (kg) => {
        const date = todayDateStr();
        set((s) => {
          const day = s.dayLogs[date] ?? blankDay(date);
          return {
            dayLogs: {
              ...s.dayLogs,
              [date]: { ...day, weight: kg },
            },
          };
        });
      },

      logCustomFood: (food) => {
        const date = todayDateStr();
        const entry: CustomFood = { ...food, id: uid(), loggedAt: Date.now() };
        set((s) => {
          const day = s.dayLogs[date] ?? blankDay(date);
          return {
            dayLogs: {
              ...s.dayLogs,
              [date]: { ...day, customFoods: [...day.customFoods, entry] },
            },
          };
        });
      },

      removeCustomFood: (id) => {
        const date = todayDateStr();
        set((s) => {
          const day = s.dayLogs[date] ?? blankDay(date);
          return {
            dayLogs: {
              ...s.dayLogs,
              [date]: { ...day, customFoods: day.customFoods.filter((f) => f.id !== id) },
            },
          };
        });
      },

      setSleep: (inBed, outBed) => {
        const date = todayDateStr();
        set((s) => {
          const day = s.dayLogs[date] ?? blankDay(date);
          return {
            dayLogs: {
              ...s.dayLogs,
              [date]: { ...day, sleepInBed: inBed, sleepOutBed: outBed },
            },
          };
        });
      },

      addWeighIn: (weight, notes) => {
        const entry: WeighIn = {
          id: uid(),
          date: todayDateStr(),
          weight,
          notes,
        };
        set((s) => ({ weighIns: [...s.weighIns, entry] }));
      },

      removeWeighIn: (id) => {
        set((s) => ({ weighIns: s.weighIns.filter((w) => w.id !== id) }));
      },

      addPhoto: (dataUrl, pose) => {
        const entry: ProgressPhoto = {
          id: uid(),
          date: todayDateStr(),
          dataUrl,
          pose,
        };
        set((s) => ({ photos: [...s.photos, entry] }));
      },

      removePhoto: (id) => {
        set((s) => ({ photos: s.photos.filter((p) => p.id !== id) }));
      },

      reset: () => set({ sessions: [], dayLogs: {}, weighIns: [], photos: [] }),
    }),
    {
      name: "ironn-v2",
      version: 1,
    },
  ),
);

// ─── Derived helpers ────────────────────────────────────────────────────────

export function computeDayTotals(day: DayLog): {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
} {
  let kcal = 0, protein = 0, carbs = 0, fat = 0;
  for (const key of Object.keys(day.meals)) {
    if (!day.meals[key]) continue;
    const meal = PLAN.meals.find((m) => m.key === key);
    if (!meal) continue;
    kcal += meal.kcal;
    protein += meal.protein;
    carbs += meal.carbs;
    fat += meal.fat;
  }
  for (const f of day.customFoods) {
    kcal += f.kcal;
    protein += f.protein;
    carbs += f.carbs;
    fat += f.fat;
  }
  return { kcal, protein, carbs, fat };
}

export function nonNegotiablesHit(day: DayLog, totals: { protein: number; kcal: number }): {
  hit: number;
  total: number;
  details: { rule: string; ok: boolean }[];
} {
  const proteinOk = totals.protein >= PLAN.macros.train.protein - 5;
  const waterOk = day.water >= PLAN.water;
  const stepsOk = (day.steps ?? 0) >= PLAN.steps;
  const creatineOk = !!day.supplements.creatine;
  const sleepOk = day.sleepInBed ? day.sleepInBed <= "22:30" : false;
  const details = [
    { rule: "Protein 145g", ok: proteinOk },
    { rule: "4L water", ok: waterOk },
    { rule: "8k steps", ok: stepsOk },
    { rule: "Creatine taken", ok: creatineOk },
    { rule: "In bed by 22:30", ok: sleepOk },
  ];
  return { hit: details.filter((d) => d.ok).length, total: details.length, details };
}

// ─── Stable hooks (avoid getSnapshot infinite loops) ───────────────────────

const EMPTY_DAYS = new Map<string, DayLog>();
function emptyDay(date: string): DayLog {
  let d = EMPTY_DAYS.get(date);
  if (!d) {
    d = blankDay(date);
    EMPTY_DAYS.set(date, d);
  }
  return d;
}

export function useTodayLog(): DayLog {
  const date = todayDateStr();
  const dayLog = useStore((s) => s.dayLogs[date]);
  return dayLog ?? emptyDay(date);
}

export function computeStreak(dayLogs: Record<string, DayLog>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const log = dayLogs[dateStr];
    if (!log) {
      if (i === 0) continue;
      break;
    }
    const totals = computeDayTotals(log);
    const nn = nonNegotiablesHit(log, totals);
    if (nn.hit >= 4) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}
