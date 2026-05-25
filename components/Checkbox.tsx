"use client";

import { motion } from "framer-motion";

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: number;
};

export function Checkbox({ checked, onChange, size = 22 }: Props) {
  return (
    <motion.button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-md border-2 transition-colors flex items-center justify-center ${
        checked ? "bg-accent border-accent" : "bg-transparent border-border-strong"
      }`}
      style={{ width: size, height: size }}
      whileTap={{ scale: 0.88 }}
      initial={false}
      aria-pressed={checked}
    >
      {checked && (
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          width={size * 0.7}
          height={size * 0.7}
        >
          <motion.polyline
            points="20 6 9 17 4 12"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.svg>
      )}
    </motion.button>
  );
}
