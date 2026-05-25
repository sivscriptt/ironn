// THE PLAN — hardcoded personal protocol.
// All numbers are YOUR targets, not generic defaults.
// To tweak: edit this file. App reads from here as source of truth.

export type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
export type WorkoutKey =
  | "upper-a"
  | "lower-a"
  | "cardio-hiit"
  | "upper-b"
  | "lower-b"
  | "long-cardio"
  | "rest";

export type WarmupStep = { name: string; detail?: string };

export type Exercise = {
  key: string;
  name: string;
  sets: number;
  reps: string; // "8-10", "12", "20 steps", "15 sec"
  restSec: number;
  notes?: string;
  isMainLift?: boolean; // tracked for strength progression chart
};

export type FinisherStep = {
  name: string;
  sets: number;
  reps: string;
};

export type CooldownStep = { name: string; duration: string };

export type LiftWorkout = {
  key: WorkoutKey;
  name: string;
  type: "lift";
  focus: string;
  duration: string;
  warmup: WarmupStep[];
  exercises: Exercise[];
  finisher: FinisherStep[];
  cooldown: CooldownStep[];
};

export type CardioWorkout = {
  key: WorkoutKey;
  name: string;
  type: "cardio";
  focus: string;
  duration: string;
  blocks: { name: string; duration: string; detail: string }[];
};

export type RestWorkout = {
  key: WorkoutKey;
  name: string;
  type: "rest";
  focus: string;
  duration: string;
  actions: { icon: string; name: string; detail: string }[];
};

export type Workout = LiftWorkout | CardioWorkout | RestWorkout;

export type Meal = {
  key: string;
  name: string;
  time: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  items: string[];
  notes?: string;
};

export type MealRotation = {
  slot: string; // "breakfast" | "lunch" | "dinner" | "snack"
  name: string;
  items: string[];
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type Supplement = {
  key: string;
  name: string;
  dose: string;
  timing: string;
  why: string;
};

export const PLAN = {
  macros: {
    train: { kcal: 1700, protein: 145, carbs: 180, fat: 50 },
    rest: { kcal: 1500, protein: 145, carbs: 130, fat: 45 },
  },
  water: 4000, // ml
  steps: 8000,

  schedule: {
    mon: "upper-a",
    tue: "lower-a",
    wed: "cardio-hiit",
    thu: "upper-b",
    fri: "lower-b",
    sat: "long-cardio",
    sun: "rest",
  } as Record<DayKey, WorkoutKey>,

  dailySchedule: [
    { time: "5:15 AM", what: "Wake. 500ml water + pinch of salt." },
    { time: "5:25 AM", what: "Pre-gym fuel — 1 banana + 2 boiled eggs OR 1 scoop whey. Black coffee or CBUM if heavy day." },
    { time: "5:50 AM", what: "Arrive gym. Warm-up." },
    { time: "6:00 AM", what: "Train (~55 min)." },
    { time: "7:00 AM", what: "Stretch 5 min." },
    { time: "7:15 AM", what: "Swim 20–30 min easy (optional)." },
    { time: "8:00 AM", what: "Meal 1 — Breakfast." },
    { time: "11:00 AM", what: "Meal 2 — Snack." },
    { time: "1:30 PM", what: "Meal 3 — Lunch." },
    { time: "4:30 PM", what: "Meal 4 — Snack." },
    { time: "7:30 PM", what: "Meal 5 — Dinner. No food after 8pm." },
    { time: "9:00 PM", what: "Wind down. No screens. Stretch 5 min." },
    { time: "10:30 PM", what: "Lights out." },
  ],

  supplements: [
    { key: "creatine", name: "Creatine monohydrate", dose: "5g", timing: "Anytime daily", why: "Strength + muscle" },
    { key: "whey", name: "Whey protein", dose: "1 scoop", timing: "Post-workout or to hit protein", why: "Convenience" },
    { key: "cbum", name: "CBUM pre-workout", dose: "1 scoop", timing: "20 min before heavy days", why: "Energy + focus" },
    { key: "coffee", name: "Black coffee", dose: "1 cup", timing: "Pre-gym daily", why: "Fat burn + focus" },
  ] as Supplement[],

  nonNegotiables: [
    "Hit 145g protein every day",
    "Lift before cardio",
    "Log every set in Ironn — no exceptions",
    "Walk 8,000+ steps daily",
    "4 litres of water daily",
    "Sleep by 10:30 PM",
    "No food after 8 PM",
    "Creatine every single day (including rest)",
    "Progress photos every Sunday — same conditions",
    "Add weight or reps every week (progressive overload)",
  ],

  progressionRules: [
    "Every week, do ONE on every exercise: +1–2 reps, +2.5 kg, or slower tempo (3s eccentric)",
    "Deload week: every 8 weeks, drop weights to 60% for one week",
  ],

  expectedResults: [
    { week: 4, what: "Clothes fitting looser, lifts going up" },
    { week: 8, what: "Visible difference in mirror, ~3 kg fat lost" },
    { week: 12, what: "Belly noticeably smaller, chest fat reducing, first ab definition" },
    { week: 16, what: "Strangers start commenting on the change" },
    { week: 24, what: "Lean, defined, visible abs in good lighting" },
  ],

  meals: [
    {
      key: "breakfast",
      name: "Breakfast",
      time: "8:00 AM",
      kcal: 480,
      protein: 38,
      carbs: 50,
      fat: 14,
      items: [
        "3 whole eggs + 2 egg whites scrambled",
        "60g oats cooked with water",
        "Cinnamon + ½ banana when ripe",
        "Black coffee (no sugar/milk)",
      ],
      notes: "Post-workout meal. Real refuel.",
    },
    {
      key: "snack1",
      name: "Mid-morning",
      time: "11:00 AM",
      kcal: 230,
      protein: 22,
      carbs: 22,
      fat: 8,
      items: ["200g Greek yogurt (plain, low-fat)", "8 almonds", "1 small apple OR handful of berries"],
    },
    {
      key: "lunch",
      name: "Lunch",
      time: "1:30 PM",
      kcal: 520,
      protein: 48,
      carbs: 70,
      fat: 6,
      items: [
        "180g chicken breast (grilled, no oil)",
        "80g basmati rice (dry weight)",
        "Steamed broccoli + carrots — fill the plate",
        "Splash of soy sauce or lemon",
      ],
    },
    {
      key: "snack2",
      name: "Afternoon snack",
      time: "4:30 PM",
      kcal: 180,
      protein: 18,
      carbs: 4,
      fat: 10,
      items: ["2 boiled eggs OR 1 scoop whey in water", "Cucumber slices + lemon + black pepper"],
    },
    {
      key: "dinner",
      name: "Dinner",
      time: "7:30 PM",
      kcal: 390,
      protein: 42,
      carbs: 30,
      fat: 12,
      items: [
        "200g fish (tuna can / salmon / tilapia / fresh fish)",
        "Big salad: spinach, tomato, cucumber, ½ can chickpeas",
        "Lemon + 1 tsp olive oil dressing",
      ],
      notes: "NO rice or carbs at dinner. Cut-off: nothing after 8pm.",
    },
  ] as Meal[],

  mealRotations: {
    breakfast: [
      { slot: "breakfast", name: "Egg white omelette", items: ["5 whites + 1 yolk omelette", "1 slice brown toast", "Berries"], kcal: 320, protein: 32, carbs: 28, fat: 10 },
      { slot: "breakfast", name: "Protein oats", items: ["50g oats", "1 scoop whey stirred in", "Cinnamon"], kcal: 380, protein: 35, carbs: 48, fat: 6 },
      { slot: "breakfast", name: "Big scramble", items: ["4 eggs scrambled", "1 banana", "Black coffee"], kcal: 410, protein: 26, carbs: 30, fat: 22 },
    ],
    lunch: [
      { slot: "lunch", name: "Tuna rice bowl", items: ["2 cans tuna", "80g rice", "Chickpeas + cucumber + lemon"], kcal: 560, protein: 54, carbs: 72, fat: 8 },
      { slot: "lunch", name: "Lentil soup + eggs", items: ["1 bowl lentil soup", "2 boiled eggs", "Side salad"], kcal: 480, protein: 38, carbs: 50, fat: 14 },
      { slot: "lunch", name: "Fish + sweet potato", items: ["180g grilled fish", "180g sweet potato", "Broccoli"], kcal: 520, protein: 45, carbs: 55, fat: 12 },
      { slot: "lunch", name: "Lean beef stir-fry", items: ["150g lean beef", "80g rice", "Mixed veggies"], kcal: 580, protein: 45, carbs: 68, fat: 14 },
    ],
    dinner: [
      { slot: "dinner", name: "Chicken salad bowl", items: ["180g chicken breast", "Mixed greens, tomato, cucumber", "Lemon + olive oil"], kcal: 380, protein: 48, carbs: 12, fat: 16 },
      { slot: "dinner", name: "Fish + grilled veggies + lentils", items: ["180g fish", "Grilled veggies", "½ cup lentils"], kcal: 420, protein: 42, carbs: 32, fat: 12 },
      { slot: "dinner", name: "Veggie omelette + salad", items: ["Egg white omelette with veggies", "Side salad"], kcal: 280, protein: 28, carbs: 14, fat: 12 },
    ],
    snack: [
      { slot: "snack", name: "2 boiled eggs", items: ["2 boiled eggs"], kcal: 140, protein: 12, carbs: 1, fat: 10 },
      { slot: "snack", name: "Greek yogurt", items: ["200g plain Greek yogurt"], kcal: 130, protein: 18, carbs: 7, fat: 4 },
      { slot: "snack", name: "Whey shake", items: ["1 scoop whey", "Water"], kcal: 120, protein: 24, carbs: 3, fat: 1 },
      { slot: "snack", name: "Cottage cheese", items: ["1 cup cottage cheese"], kcal: 180, protein: 25, carbs: 7, fat: 5 },
    ],
  } as Record<string, MealRotation[]>,

  workouts: {
    "upper-a": {
      key: "upper-a",
      name: "Upper A",
      type: "lift",
      focus: "Chest · Back · Shoulders · Arms",
      duration: "~55 min",
      warmup: [
        { name: "Treadmill incline walk", detail: "5 min" },
        { name: "Arm circles", detail: "10 each direction" },
        { name: "Band pull-aparts", detail: "15 reps" },
        { name: "Slow push-ups", detail: "10 reps" },
        { name: "Light warm-up bench set", detail: "1 set" },
      ],
      exercises: [
        { key: "db-bench", name: "Dumbbell bench press", sets: 4, reps: "8-10", restSec: 90, isMainLift: true },
        { key: "seated-cable-row", name: "Seated cable row", sets: 4, reps: "10-12", restSec: 90, isMainLift: true },
        { key: "db-shoulder-press", name: "Dumbbell shoulder press", sets: 3, reps: "10-12", restSec: 90, isMainLift: true },
        { key: "lat-pulldown", name: "Wide-grip lat pulldown", sets: 3, reps: "10-12", restSec: 90 },
        { key: "side-lateral-raise", name: "Side lateral raise", sets: 3, reps: "15", restSec: 75 },
        { key: "tri-pushdown", name: "Triceps pushdown", sets: 3, reps: "12-15", restSec: 75 },
        { key: "db-curl", name: "Dumbbell bicep curl", sets: 3, reps: "10-12", restSec: 75 },
      ],
      finisher: [
        { name: "Cable crunches", sets: 3, reps: "15" },
        { name: "Hanging leg raises", sets: 3, reps: "10" },
        { name: "Side plank", sets: 3, reps: "30 sec each side" },
      ],
      cooldown: [
        { name: "Chest doorframe stretch", duration: "30 sec each side" },
        { name: "Lat hang from bar", duration: "30 sec × 2" },
        { name: "Tricep overhead stretch", duration: "30 sec each" },
        { name: "Shoulder cross-body", duration: "30 sec each" },
      ],
    },

    "lower-a": {
      key: "lower-a",
      name: "Lower A",
      type: "lift",
      focus: "Quads · Hamstrings · Calves",
      duration: "~60 min",
      warmup: [
        { name: "Stationary bike", detail: "5 min" },
        { name: "Leg swings", detail: "10 each, both directions" },
        { name: "Glute bridges", detail: "15 reps" },
        { name: "Bodyweight squats", detail: "15 reps" },
        { name: "Light goblet squat", detail: "1 warm-up set" },
      ],
      exercises: [
        { key: "goblet-squat", name: "Goblet squat", sets: 4, reps: "10-12", restSec: 90, isMainLift: true },
        { key: "rdl", name: "Romanian deadlift", sets: 4, reps: "8-10", restSec: 90, isMainLift: true },
        { key: "walking-lunges", name: "Walking lunges", sets: 3, reps: "20 steps", restSec: 90 },
        { key: "leg-press", name: "Leg press", sets: 3, reps: "12", restSec: 75, isMainLift: true },
        { key: "lying-leg-curl", name: "Lying leg curl", sets: 3, reps: "12", restSec: 75 },
        { key: "calf-raise", name: "Standing calf raise", sets: 4, reps: "15-20", restSec: 60 },
      ],
      finisher: [
        { name: "Cable crunches", sets: 3, reps: "15" },
        { name: "Bicycle crunches", sets: 3, reps: "20" },
        { name: "Plank", sets: 3, reps: "45 sec" },
      ],
      cooldown: [
        { name: "Quad stretch", duration: "30 sec each" },
        { name: "Hamstring stretch", duration: "30 sec each" },
        { name: "Hip flexor lunge stretch", duration: "30 sec each" },
        { name: "Calf wall stretch", duration: "30 sec each" },
      ],
    },

    "cardio-hiit": {
      key: "cardio-hiit",
      name: "Cardio + HIIT",
      type: "cardio",
      focus: "Fat burn · No gym",
      duration: "~40 min",
      blocks: [
        { name: "Easy run", duration: "25 min", detail: "Conversational pace" },
        { name: "Walk recovery", duration: "5 min", detail: "Bring HR down" },
        { name: "Jump rope HIIT", duration: "10 min", detail: "30s on / 30s rest × 10" },
        { name: "Full body stretch", duration: "5 min", detail: "Quads · hams · hips · calves" },
        { name: "Optional swim", duration: "20 min", detail: "Easy pace" },
      ],
    },

    "upper-b": {
      key: "upper-b",
      name: "Upper B",
      type: "lift",
      focus: "Upper chest · All shoulders · Arms",
      duration: "~55 min",
      warmup: [
        { name: "Treadmill incline walk", detail: "5 min" },
        { name: "Band pull-aparts", detail: "15 reps" },
        { name: "Push-ups", detail: "10 reps" },
        { name: "Light cable face pulls", detail: "15 reps" },
        { name: "Light incline press set", detail: "1 warm-up" },
      ],
      exercises: [
        { key: "incline-db-press", name: "Incline dumbbell press", sets: 4, reps: "8-10", restSec: 90, isMainLift: true },
        { key: "bent-db-row", name: "Bent over dumbbell row", sets: 4, reps: "10", restSec: 90, isMainLift: true },
        { key: "arnold-press", name: "Arnold press", sets: 3, reps: "10-12", restSec: 90, isMainLift: true },
        { key: "cable-fly", name: "Cable chest fly", sets: 3, reps: "12-15", restSec: 75 },
        { key: "face-pull", name: "Face pulls", sets: 3, reps: "15", restSec: 60 },
        { key: "overhead-tri", name: "Overhead tricep extension", sets: 3, reps: "12", restSec: 75 },
        { key: "hammer-curl", name: "Hammer curl", sets: 3, reps: "12", restSec: 75 },
      ],
      finisher: [
        { name: "Cable crunches", sets: 3, reps: "15" },
        { name: "Hanging knee raises", sets: 3, reps: "12" },
        { name: "Russian twists", sets: 3, reps: "20 (10/side)" },
      ],
      cooldown: [
        { name: "Chest doorframe stretch", duration: "30 sec each side" },
        { name: "Lat hang from bar", duration: "30 sec × 2" },
        { name: "Tricep overhead stretch", duration: "30 sec each" },
        { name: "Shoulder cross-body", duration: "30 sec each" },
      ],
    },

    "lower-b": {
      key: "lower-b",
      name: "Lower B",
      type: "lift",
      focus: "Hamstrings · Glutes · Balance",
      duration: "~60 min",
      warmup: [
        { name: "Stationary bike", detail: "5 min" },
        { name: "Glute bridges", detail: "15 reps" },
        { name: "BW Bulgarian split squats", detail: "10 each leg" },
        { name: "Bodyweight squats", detail: "15 reps" },
        { name: "Light RDL set", detail: "1 warm-up" },
      ],
      exercises: [
        { key: "rdl-b", name: "Romanian deadlift", sets: 4, reps: "8-10", restSec: 90, isMainLift: true },
        { key: "bulgarian-split", name: "Bulgarian split squat", sets: 3, reps: "8 each leg", restSec: 90, isMainLift: true },
        { key: "hip-thrust", name: "Barbell/DB hip thrust", sets: 3, reps: "12", restSec: 90, isMainLift: true },
        { key: "leg-extension", name: "Leg extension", sets: 3, reps: "15", restSec: 75 },
        { key: "seated-leg-curl", name: "Seated leg curl", sets: 3, reps: "12", restSec: 75 },
        { key: "seated-calf", name: "Seated calf raise", sets: 3, reps: "15-20", restSec: 60 },
      ],
      finisher: [
        { name: "Dead bug", sets: 3, reps: "10 each side" },
        { name: "Cable crunches", sets: 3, reps: "15" },
        { name: "Plank", sets: 3, reps: "45 sec" },
      ],
      cooldown: [
        { name: "Quad stretch", duration: "30 sec each" },
        { name: "Hamstring stretch", duration: "30 sec each" },
        { name: "Hip flexor lunge stretch", duration: "30 sec each" },
        { name: "Calf wall stretch", duration: "30 sec each" },
      ],
    },

    "long-cardio": {
      key: "long-cardio",
      name: "Long cardio + HIIT",
      type: "cardio",
      focus: "Long aerobic + HIIT finisher",
      duration: "~50 min",
      blocks: [
        { name: "Easy long run", duration: "30 min", detail: "Conversational pace, build aerobic base" },
        { name: "Walk recovery", duration: "5 min", detail: "Cool the engine" },
        { name: "Jump rope HIIT", duration: "10 min", detail: "30s on / 30s rest × 10" },
        { name: "Full body stretch", duration: "8 min", detail: "The big weekly stretch" },
        { name: "Optional swim", duration: "30 min", detail: "Easy pace" },
      ],
    },

    rest: {
      key: "rest",
      name: "Full Rest",
      type: "rest",
      focus: "Recovery · Meal prep · Reflect",
      duration: "Self-paced",
      actions: [
        { icon: "📷", name: "Progress photo", detail: "Front · side · back. Same spot, same lighting, fasted." },
        { icon: "⚖️", name: "Weigh in", detail: "Morning, fasted, after bathroom." },
        { icon: "🚶", name: "Walk 20 min", detail: "Optional light movement." },
        { icon: "🍗", name: "Meal prep", detail: "45 min. Chicken, eggs, rice for the week." },
        { icon: "🧘", name: "Mobility 15 min", detail: "Stretching session — the big one." },
        { icon: "😴", name: "Bed by 10:30 PM", detail: "Non-negotiable." },
      ],
    },
  } as Record<WorkoutKey, Workout>,
} as const;

export function todayKey(): DayKey {
  const map: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return map[new Date().getDay()];
}

export function todayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function dayLabel(k: DayKey): string {
  return { sun: "SUN", mon: "MON", tue: "TUE", wed: "WED", thu: "THU", fri: "FRI", sat: "SAT" }[k];
}

export function isLift(w: Workout): w is LiftWorkout {
  return w.type === "lift";
}
export function isCardio(w: Workout): w is CardioWorkout {
  return w.type === "cardio";
}
export function isRest(w: Workout): w is RestWorkout {
  return w.type === "rest";
}

export function todaysMacros(): { kcal: number; protein: number; carbs: number; fat: number } {
  const day = todayKey();
  return day === "sun" ? PLAN.macros.rest : PLAN.macros.train;
}
