"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useStore, useTodayLog, computeDayTotals } from "@/lib/store";
import { PLAN, todayKey, isLift, isCardio, isRest } from "@/data/plan";
import { TodayHeader } from "@/components/TodayHeader";
import { ProgressRing } from "@/components/ProgressRing";
import { Checkbox } from "@/components/Checkbox";
import { WaterTracker } from "@/components/WaterTracker";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const card = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function TodayPage() {
  const [mounted, setMounted] = useState(false);
  const today = useTodayLog();
  const setMealEaten = useStore((s) => s.setMealEaten);
  const setSupplement = useStore((s) => s.setSupplement);
  const setWeight = useStore((s) => s.setWeight);
  const setSteps = useStore((s) => s.setSteps);
  const [weightInput, setWeightInput] = useState("");
  const [stepsInput, setStepsInput] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const dayKey = todayKey();
  const workoutKey = PLAN.schedule[dayKey];
  const workout = PLAN.workouts[workoutKey];
  const macros = dayKey === "sun" ? PLAN.macros.rest : PLAN.macros.train;
  const totals = mounted ? computeDayTotals(today) : { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  const steps = mounted ? (today.steps ?? 0) : 0;

  return (
    <>
      <TodayHeader subtitle={workout.name.toUpperCase()} />

      <motion.div variants={stagger} initial="hidden" animate="visible" className="px-5 pt-2 pb-4 space-y-4">
        {/* WORKOUT CARD */}
        <motion.div variants={card}>
          <WorkoutSummary workoutKey={workoutKey} />
        </motion.div>

        {/* PROGRESS RINGS */}
        <motion.div
          variants={card}
          className="bg-card border border-border rounded-2xl p-4"
        >
          <div className="text-[0.7rem] font-mono tracking-wider text-muted uppercase mb-3">
            Today
          </div>
          <div className="grid grid-cols-4 gap-2">
            <ProgressRing
              value={totals.protein}
              max={macros.protein}
              label="Protein"
              unit="g"
            />
            <ProgressRing
              value={totals.kcal}
              max={macros.kcal}
              label="Kcal"
            />
            <ProgressRing
              value={Math.round(today.water / 10) / 100}
              max={PLAN.water / 1000}
              label="Water"
              unit="L"
            />
            <ProgressRing
              value={steps}
              max={PLAN.steps}
              label="Steps"
            />
          </div>
        </motion.div>

        {/* MEALS */}
        <motion.div variants={card} className="bg-card border border-border rounded-2xl p-4">
          <div className="text-[0.7rem] font-mono tracking-wider text-muted uppercase mb-3">
            Meals
          </div>
          <div className="space-y-2">
            {PLAN.meals.map((meal) => {
              const eaten = mounted ? !!today.meals[meal.key] : false;
              return (
                <div key={meal.key} className="flex items-center gap-3 py-2">
                  <Checkbox checked={eaten} onChange={(v) => setMealEaten(meal.key, v)} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${eaten ? "line-through text-muted" : ""}`}>
                      {meal.name}
                    </div>
                    <div className="text-[0.7rem] text-muted font-mono">
                      <span className="text-muted-2">{meal.kcal} kcal · {meal.protein}g P</span>
                      <span className="ml-1">· {meal.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            href="/eat"
            className="block text-center text-xs text-accent mt-3 hover:underline"
          >
            See full meal plan →
          </Link>
        </motion.div>

        {/* SUPPLEMENTS */}
        <motion.div variants={card} className="bg-card border border-border rounded-2xl p-4">
          <div className="text-[0.7rem] font-mono tracking-wider text-muted uppercase mb-3">
            Supplements
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PLAN.supplements.map((sup) => {
              const taken = mounted ? !!today.supplements[sup.key] : false;
              return (
                <button
                  key={sup.key}
                  onClick={() => setSupplement(sup.key, !taken)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-colors ${
                    taken ? "bg-accent/10 border-accent/40" : "bg-surface border-border"
                  }`}
                >
                  <Checkbox checked={taken} onChange={() => setSupplement(sup.key, !taken)} size={18} />
                  <div className="flex-1 min-w-0 text-left">
                    <div className={`text-[0.78rem] font-medium ${taken ? "text-accent" : ""}`}>
                      {sup.name.split(" ")[0]}
                    </div>
                    <div className="text-[0.62rem] text-muted font-mono">{sup.dose}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* WATER */}
        <motion.div variants={card}>
          <WaterTracker />
        </motion.div>

        {/* QUICK LOGS */}
        <motion.div variants={card} className="grid grid-cols-2 gap-3">
          {/* Steps */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="text-[0.7rem] font-mono tracking-wider text-muted uppercase mb-2">
              Steps
            </div>
            <input
              type="number"
              inputMode="numeric"
              value={stepsInput}
              onChange={(e) => setStepsInput(e.target.value)}
              placeholder={steps ? String(steps) : "0"}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-base font-mono text-text focus:outline-none focus:border-accent mb-2"
            />
            <button
              onClick={() => {
                const n = parseInt(stepsInput, 10);
                if (!isNaN(n)) setSteps(n);
                setStepsInput("");
              }}
              disabled={!stepsInput}
              className="w-full py-2 rounded-lg bg-accent text-black font-semibold text-sm disabled:opacity-40"
            >
              Save
            </button>
          </div>

          {/* Weight */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="text-[0.7rem] font-mono tracking-wider text-muted uppercase mb-2">
              Weight (kg)
            </div>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder={today.weight ? String(today.weight) : "0.0"}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-base font-mono text-text focus:outline-none focus:border-accent mb-2"
            />
            <button
              onClick={() => {
                const n = parseFloat(weightInput);
                if (!isNaN(n)) setWeight(n);
                setWeightInput("");
              }}
              disabled={!weightInput}
              className="w-full py-2 rounded-lg bg-accent text-black font-semibold text-sm disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

function WorkoutSummary({ workoutKey }: { workoutKey: keyof typeof PLAN.workouts }) {
  const workout = PLAN.workouts[workoutKey];
  const tint =
    workout.type === "lift"
      ? "bg-gradient-to-br from-[#001833] to-bg border-[#1a3a66]"
      : workout.type === "cardio"
        ? "bg-gradient-to-br from-[#003d35] to-bg border-[#0d6655]"
        : "bg-surface border-border";

  let summary = "";
  if (isLift(workout)) summary = `${workout.exercises.length} lifts · ${workout.warmup.length} warmup steps`;
  if (isCardio(workout)) summary = `${workout.blocks.length} blocks`;
  if (isRest(workout)) summary = `${workout.actions.length} recovery tasks`;

  return (
    <Link href="/train" className="block">
      <div className={`p-5 rounded-2xl border overflow-hidden relative ${tint}`}>
        <div className="text-[0.62rem] font-mono tracking-wider text-muted uppercase mb-2">
          {workout.focus}
        </div>
        <div className="font-display text-[1.7rem] font-extrabold tracking-tight leading-tight mb-1.5">
          {workout.name}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-[0.78rem] text-muted-2 font-mono">
            {workout.duration} · {summary}
          </div>
          <div className="bg-accent text-black px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {workout.type === "rest" ? "View" : "Start"}
          </div>
        </div>
      </div>
    </Link>
  );
}
