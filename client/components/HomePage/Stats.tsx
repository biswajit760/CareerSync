"use client";

// 1. All necessary tools are imported here together
import { motion, useMotionValue, useTransform, animate, useInView, useSpring } from "framer-motion";
import { useEffect, useRef, useState, MouseEvent } from "react";

// ============================================================================
// LAYER 1: THE COUNTER ENGINE (Internal Assistant Component)
// ============================================================================
type CountUpProps = {
  end: number;
  suffix?: string;
  duration?: number;
};

function CountUp({
  end,
  suffix = "",
  duration = 2.8,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  // Base motion value
  const count = useMotionValue(0);

  // Spring smoothing for ultra smooth interpolation
  const smoothCount = useSpring(count, {
    damping: 20,
    stiffness: 100,
    mass: 0.8,
  });

  // Transform into formatted string
  const display = useTransform(smoothCount, (latest) => {
    return `${Math.round(latest).toLocaleString()}${suffix}`;
  });

  const isInView = useInView(ref, {
    once: true,
    amount: 0.4,
  });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, end, {
      duration,
      ease: [0.22, 1, 0.36, 1], // smoother premium easing
    });

    const unsubscribe = display.on("change", (value) => {
      if (ref.current) {
        ref.current.textContent = value;
      }
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [isInView, end, duration, count, display]);

  return (
    <span
      ref={ref}
      className="tabular-nums"
    >
      0{suffix}
    </span>
      );
}

// ============================================================================
// LAYER 2: THE DATA MATRIX (Your Display Information)
// ============================================================================
const stats = [
  {
    value: 75,
    suffix: "%",
    label: "of resumes rejected by ATS before human review",
  },
  {
    value: 24,
    suffix: "K+",
    label: "resumes analyzed since launch",
  },
  {
    value: 16,
    suffix: "+",
    label: "countries with live job listings",
  },
  {
    value: 100,
    suffix: "%",
    label: "free — no subscription required",
  },
];

// ============================================================================
// LAYER 3: THE MAIN VIEWPORT (The Visual Grid & Interactive Lights)
// ============================================================================
export default function Stats() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Tracks the mouse position specifically inside this container for the spotlight effect
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;

    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden bg-black border-y border-white/[0.06] isolate"
    >
      {/* BACKGROUND GRAPHICS: Deep ambient glows and noise overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(156,240,22,0.04),transparent_70%)] z-0 pointer-events-none" />

      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-15%] top-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-lime-400/5 blur-[140px] rounded-full pointer-events-none z-10"
      />

      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-15%] top-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-lime-400/5 blur-[140px] rounded-full pointer-events-none z-10"
      />

      {/* Mouse Tracking Ambient Light */}
      <motion.div
        animate={{ x: mousePosition.x - 250, y: mousePosition.y - 250 }}
        transition={{ type: "spring", stiffness: 100, damping: 25, mass: 0.4 }}
        className="absolute w-[500px] h-[500px] rounded-full bg-lime-400/[0.04] blur-[120px] pointer-events-none z-10"
      />

      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-20"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />

      {/* INTERACTIVE CARDS GRID */}
      <div className="relative max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 z-30">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden border-b md:border-b-0 md:border-r border-white/[0.06] px-6 md:px-10 py-14 bg-transparent"
          >
            {/* Card Glass Surfaces */}
            <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-[1px] z-0 pointer-events-none" />

            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
              transition={{ duration: 6, repeat: Infinity, delay: index * 0.7 }}
              className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-48 h-48 bg-lime-400/[0.05] blur-[60px] rounded-full z-10 pointer-events-none"
            />

            {/* Individual Hover Card Spotlight Overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"
              style={{
                background: `
                  radial-gradient(
                    350px circle at ${mousePosition.x}px ${mousePosition.y}px,
                    rgba(163, 230, 53, 0.08),
                    transparent 60%
                  )
                `,
              }}
            />

            {/* Moving Shimmer Accent Line */}
            <motion.div
              animate={{ x: ["-150%", "300%"] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "linear", delay: index * 0.6 }}
              className="absolute top-0 left-0 h-full w-[50%] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-[-20deg] pointer-events-none z-20"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent opacity-100 z-20 pointer-events-none" />

            {/* FOREGROUND TYPOGRAPHY CONTENT */}
            <div className="relative z-40 pointer-events-none">
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-4xl md:text-5xl font-medium tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              >
                <span className="bg-gradient-to-b from-white via-white to-lime-300 bg-clip-text text-transparent">
                  {/* The counter engine is integrated cleanly here */}
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </span>
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 + index * 0.1 }}
                className="mt-5 text-[11px] uppercase tracking-[0.25em] text-zinc-400 leading-relaxed max-w-[220px]"
              >
                {stat.label}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* TOP & BOTTOM GLOW EDGE ACCENTS */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-lime-400/25 to-transparent z-50 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-lime-400/15 to-transparent z-50 pointer-events-none" />
    </section>
  );
}