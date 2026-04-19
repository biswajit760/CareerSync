"use client";

import { motion } from "framer-motion";

interface GaugeProps {
  score: number;
}

export default function AtsCircularGauge({ score }: GaugeProps) {
  const size = 200;
  const stroke = 10; // thinner = more premium
  const radius = (size - stroke) / 2;

  const getStyles = (val: number) => {
    if (val >= 80)
      return {
        gradient: ["#34D399", "#059669"],
        glow: "rgba(16,185,129,0.35)",
        status: "Strong",
        bg: "bg-emerald-50",
        text: "text-emerald-600",
      };
    if (val >= 60)
      return {
        gradient: ["#FBBF24", "#D97706"],
        glow: "rgba(245,158,11,0.35)",
        status: "Moderate",
        bg: "bg-amber-50",
        text: "text-amber-600",
      };
    return {
      gradient: ["#F87171", "#DC2626"],
      glow: "rgba(239,68,68,0.35)",
      status: "Weak",
      bg: "bg-rose-50",
      text: "text-rose-600",
    };
  };

  const styles = getStyles(score);

  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center h-[180px]">
      
      {/* GAUGE */}
      <div className="relative  w-[200px] h-[150px] ">
        <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>

          {/* Gradient */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={styles.gradient[0]} />
              <stop offset="100%" stopColor={styles.gradient[1]} />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <path
            d={`
              M ${stroke / 2},${size / 2}
              A ${radius},${radius} 0 0 1 ${size - stroke / 2},${size / 2}
            `}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Animated Progress */}
          <motion.path
            d={`
              M ${stroke / 2},${size / 2}
              A ${radius},${radius} 0 0 1 ${size - stroke / 2},${size / 2}
            `}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 2px 6px ${styles.glow})`,
            }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: 1.4,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        </svg>

        {/* CENTER CONTENT */}
        <div className="absolute -inset-3 flex flex-col items-center justify-end pb-4 ">

          {/* SCORE */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-end gap-1"
          >
            <span className="text-4xl font-black tracking-tight text-slate-900 leading-none">
              {score}
            </span>
            <span className="text-sm font-semibold text-slate-400 mb-1">
              /100
            </span>
          </motion.div>

          {/* LABEL */}
          <span className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            ATS SCORE
          </span>

          {/* STATUS BADGE */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`mt-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide ${styles.bg} ${styles.text}`}
          >
            {styles.status} Profile
          </motion.div>

        </div>
      </div>
    </div>
  );
}