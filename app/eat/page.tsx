"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { TodayHeader } from "@/components/TodayHeader";
import { Checkbox } from "@/components/Checkbox";
import { WaterTracker } from "@/components/WaterTracker";
import { ProgressRing } from "@/components/ProgressRing";
import { PLAN, todayKey, type Meal, type MealRotation } from "@/data/plan";
import { useStore, useTodayLog, computeDayTotals } from "@/lib/store";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function EatPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const today = useTodayLog();
  const setMealEaten = useStore((s) => s.setMealEaten);
  const logCustomFood = useStore((s) => s.logCustomFood);
  const removeCustomFood = useStore((s) => s.removeCustomFood);
  const setSupplement = useStore((s) => s.setSupplement);

  const dayKey = todayKey();
  const macros = dayKey === "sun" ? PLAN.macros.rest : PLAN.macros.train;
  const totals = mounted ? computeDayTotals(today) : { kcal: 0, protein: 0, carbs: 0, fat: 0 };

  const [showCustom, setShowCustom] = useState(false);
  const [swap, setSwap] = useState<string | null>(null);

  return (
    <>
      <TodayHeader subtitle="EAT" />
      <motion.div variants={stagger} initial="hidden" animate="visible" className="px-5 pt-2 pb-6 space-y-4">
        {/* MACROS */}
        <motion.div variants={item} className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-baseline justify-between mb-3">
            <div className="text-[0.7rem] font-mono tracking-wider text-muted uppercase">
              Today
            </div>
            <div className="text-xs font-mono text-muted">
              <span className="text-text">{totals.kcal}</span>
              <span className="text-muted">/{macros.kcal} kcal</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <ProgressRing value={totals.protein} max={macros.protein} label="Protein" unit="g" />
            <ProgressRing value={totals.carbs} max={macros.carbs} label="Carbs" unit="g" />
            <ProgressRing value={totals.fat} max={macros.fat} label="Fat" unit="g" />
            <ProgressRing value={totals.kcal} max={macros.kcal} label="Kcal" />
          </div>
        </motion.div>

        {/* MEALS */}
        <motion.section variants={item}>
          <div className="text-[0.65rem] font-mono tracking-wider text-muted uppercase mb-2 px-1">
            Today's meals
          </div>
          <div className="space-y-3">
            {PLAN.meals.map((meal) => (
              <MealCard
                key={meal.key}
                meal={meal}
                eaten={mounted ? !!today.meals[meal.key] : false}
                onToggle={() => setMealEaten(meal.key, !today.meals[meal.key])}
                onSwap={() => setSwap(meal.key)}
              />
            ))}
          </div>
        </motion.section>

        {/* CUSTOM FOODS */}
        <motion.section variants={item}>
          <div className="flex items-baseline justify-between mb-2 px-1">
            <div className="text-[0.65rem] font-mono tracking-wider text-muted uppercase">
              Off-plan foods
            </div>
            <button
              onClick={() => setShowCustom(true)}
              className="text-xs text-accent"
            >
              + Add
            </button>
          </div>
          {!mounted || today.customFoods.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-4 text-center text-xs text-muted">
              Anything you ate that isn't on the plan
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl divide-y divide-border">
              {today.customFoods.map((f) => (
                <div key={f.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{f.name}</div>
                    <div className="text-[0.7rem] text-muted font-mono">
                      {f.kcal} kcal · {f.protein}g P · {f.carbs}g C · {f.fat}g F
                    </div>
                  </div>
                  <button
                    onClick={() => removeCustomFood(f.id)}
                    className="text-muted-2 hover:text-danger text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* WATER */}
        <motion.div variants={item}>
          <WaterTracker />
        </motion.div>

        {/* SUPPLEMENTS */}
        <motion.section variants={item}>
          <div className="text-[0.65rem] font-mono tracking-wider text-muted uppercase mb-2 px-1">
            Supplements
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PLAN.supplements.map((sup) => {
              const taken = mounted ? !!today.supplements[sup.key] : false;
              return (
                <button
                  key={sup.key}
                  onClick={() => setSupplement(sup.key, !taken)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-colors text-left ${
                    taken ? "bg-accent/10 border-accent/40" : "bg-card border-border"
                  }`}
                >
                  <Checkbox checked={taken} onChange={() => setSupplement(sup.key, !taken)} size={18} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-[0.78rem] font-medium ${taken ? "text-accent" : ""}`}>
                      {sup.name.split(" ")[0]}
                    </div>
                    <div className="text-[0.62rem] text-muted font-mono">
                      {sup.dose} · {sup.timing}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.section>
      </motion.div>

      <AnimatePresence>
        {swap && <SwapSheet mealKey={swap} onClose={() => setSwap(null)} />}
        {showCustom && (
          <CustomFoodSheet
            onClose={() => setShowCustom(false)}
            onAdd={(food) => {
              logCustomFood(food);
              setShowCustom(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function MealCard({
  meal,
  eaten,
  onToggle,
  onSwap,
}: {
  meal: Meal;
  eaten: boolean;
  onToggle: () => void;
  onSwap: () => void;
}) {
  return (
    <div className={`bg-card border rounded-2xl overflow-hidden ${eaten ? "border-accent/40" : "border-border"}`}>
      <div className="px-4 py-3 flex items-start gap-3">
        <Checkbox checked={eaten} onChange={onToggle} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <div className={`text-sm font-semibold ${eaten ? "line-through text-muted" : ""}`}>
              {meal.name}
            </div>
            <div className="text-[0.62rem] text-muted font-mono">{meal.time}</div>
          </div>
          <div className="text-[0.7rem] text-muted font-mono mt-0.5">
            <span className="text-muted-2">{meal.kcal} kcal · {meal.protein}g P · {meal.carbs}g C · {meal.fat}g F</span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-3 pl-12 space-y-0.5">
        {meal.items.map((item, i) => (
          <div key={i} className="text-[0.78rem] text-muted-2">
            · {item}
          </div>
        ))}
        {meal.notes && (
          <div className="text-[0.7rem] text-warn mt-1.5">{meal.notes}</div>
        )}
      </div>
      <button
        onClick={onSwap}
        className="w-full py-2 text-[0.7rem] text-muted-2 border-t border-border hover:text-accent transition-colors"
      >
        Swap for rotation →
      </button>
    </div>
  );
}

function SwapSheet({ mealKey, onClose }: { mealKey: string; onClose: () => void }) {
  const meal = PLAN.meals.find((m) => m.key === mealKey);
  if (!meal) return null;
  const slot = meal.key.startsWith("snack") ? "snack" : meal.key;
  const options = (PLAN.mealRotations as Record<string, MealRotation[]>)[slot] ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="w-full max-w-[480px] bg-bg border-t border-border rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-border-strong rounded-full mx-auto mb-4" />
        <div className="text-[0.65rem] font-mono tracking-wider text-muted uppercase mb-1">
          Swap {meal.name}
        </div>
        <h2 className="font-display text-xl font-extrabold mb-4">Pick an alternative</h2>
        <div className="space-y-2">
          {options.length === 0 && (
            <div className="text-sm text-muted">No rotations defined for this meal.</div>
          )}
          {options.map((opt, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-3">
              <div className="flex items-baseline justify-between mb-1">
                <div className="text-sm font-semibold">{opt.name}</div>
                <div className="text-[0.7rem] text-muted font-mono">
                  {opt.kcal} kcal · {opt.protein}g P
                </div>
              </div>
              <div className="text-[0.7rem] text-muted-2 space-y-0.5">
                {opt.items.map((it, j) => (
                  <div key={j}>· {it}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-xl bg-surface border border-border text-muted-2"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

function CustomFoodSheet({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (f: { name: string; kcal: number; protein: number; carbs: number; fat: number }) => void;
}) {
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const canSave = name.trim() && kcal && protein;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="w-full max-w-[480px] mx-auto bg-bg border-t border-border rounded-t-3xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-border-strong rounded-full mx-auto mb-4" />
        <h2 className="font-display text-xl font-extrabold mb-4">Log a custom food</h2>
        <div className="space-y-3">
          <Field label="What did you eat?" value={name} onChange={setName} placeholder="e.g. 2 scoops ice cream" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Calories" value={kcal} onChange={setKcal} placeholder="0" type="number" />
            <Field label="Protein (g)" value={protein} onChange={setProtein} placeholder="0" type="number" />
            <Field label="Carbs (g)" value={carbs} onChange={setCarbs} placeholder="0" type="number" />
            <Field label="Fat (g)" value={fat} onChange={setFat} placeholder="0" type="number" />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-surface border border-border text-muted-2"
          >
            Cancel
          </button>
          <button
            disabled={!canSave}
            onClick={() => {
              onAdd({
                name: name.trim(),
                kcal: parseFloat(kcal) || 0,
                protein: parseFloat(protein) || 0,
                carbs: parseFloat(carbs) || 0,
                fat: parseFloat(fat) || 0,
              });
            }}
            className="flex-1 py-3 rounded-xl bg-accent text-black font-bold disabled:opacity-40"
          >
            Log
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <div className="text-[0.6rem] font-mono tracking-wider text-muted uppercase mb-1.5">
        {label}
      </div>
      <input
        type={type}
        inputMode={type === "number" ? "decimal" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-base font-mono text-text focus:outline-none focus:border-accent"
      />
    </div>
  );
}
