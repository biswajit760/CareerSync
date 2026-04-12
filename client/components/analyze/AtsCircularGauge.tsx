"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AtsCircularGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export default function AtsCircularGauge({ 
  score = 0, 
  size = 200, 
  strokeWidth = 12 
}: AtsCircularGaugeProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(score), 400);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // SaaS Color Logic: Using Gradients instead of flat hex
  const getGradientId = () => {
    if (progress >= 80) return "grad-emerald";
    if (progress >= 60) return "grad-amber";
    return "grad-rose";
  };

  const getTextColor = () => {
    if (progress >= 80) return "text-emerald-600";
    if (progress >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  return (
    <div className="flex flex-col items-center justify-center relative group" style={{ width: size, height: size }}>
      
      {/* 1. BLUR GLOW EFFECT (The "SaaS Secret") */}
      <div 
        className={`absolute inset-0 rounded-full opacity-20 blur-2xl transition-colors duration-1000 ${
          progress >= 80 ? 'bg-emerald-400' : progress >= 60 ? 'bg-amber-400' : 'bg-rose-400'
        }`}
      />

      <svg className="transform -rotate-90 relative z-10" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="grad-rose" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
          
          {/* Subtle drop shadow for the stroke */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="0" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Track - Ultra Light */}
        <circle
          className="text-slate-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        
        {/* The Animated Progress Ring */}
        <motion.circle
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          stroke={`url(#${getGradientId()})`}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          filter="url(#shadow)"
          className="drop-shadow-md"
        />
      </svg>

      {/* 2. CENTER CONTENT - Sophisticated Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="flex flex-col items-center leading-none">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-6xl font-black tabular-nums tracking-tighter ${getTextColor()}`}
          >
            {Math.round(progress)}
          </motion.span>
          <div className="flex items-center gap-1 mt-1">
             <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
               progress >= 80 ? 'bg-emerald-500' : progress >= 60 ? 'bg-amber-500' : 'bg-rose-500'
             }`} />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               Score Percent
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}