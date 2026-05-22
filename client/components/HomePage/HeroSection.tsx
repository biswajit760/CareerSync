"use client";

import Button from "../ui/Button";
import {
  ArrowRight,
  Play,
  Star,
  Upload,
  FileText,
  Brain,
  BarChart,
  Briefcase,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen py-24 md:py-36 overflow-hidden bg-[#010401] text-white antialiased flex flex-col justify-center items-center">

      {/* ===== TRUE ATMOSPHERIC CINEMATIC BACKGROUND ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

        {/* ===== LEFT ATMOSPHERIC GLOW BALL ===== */}
        <div className="absolute -left-[22%] top-[-10%] w-[48vw] h-[48vw] rounded-full pointer-events-none z-10">

          {/* Core Glow */}
          <div
            className="absolute inset-0 rounded-full z-10"
            style={{
              
              background: `
                radial-gradient(
                  circle,
                  rgba(190,255,0,0.30) 0%,
                  rgba(163,230,53,0.22) 18%,
                  rgba(120,180,20,0.14) 38%,
                  rgba(40,80,10,0.06) 62%,
                  transparent 78%
                )
              `,
              
              filter: "blur(80px)",
              transform: "scale(1.1)",
            }}
          />

          {/* Secondary Fog Layer */}
          <div
            className="absolute inset-0 rounded-full mix-blend-screen"
            style={{
              background: `
                radial-gradient(
                  circle,
                  rgba(220,255,120,0.16) 0%,
                  rgba(163,230,53,0.08) 30%,
                  transparent 70%
                )
              `,
              filter: "blur(140px)",
              transform: "scale(1.4)",
            }}
          />
        </div>

        {/* ===== RIGHT ATMOSPHERIC GLOW BALL ===== */}
        <div className="absolute -right-[22%] top-[-10%] w-[48vw] h-[48vw] rounded-full pointer-events-none z-10">

          {/* Core Glow */}
          <div
            className="absolute inset-0 rounded-full z-10"
            style={{
              background: `
                radial-gradient(
                  circle,
                  rgba(196,255,0,0.30) 0%,
                  rgba(168,230,53,0.22) 18%,
                  rgba(120,180,20,0.14) 38%,
                  rgba(40,80,10,0.06) 62%,
                  transparent 78%
                )
              `,
              filter: "blur(80px)",
              transform: "scale(1.1)",
            }}
          />

          {/* Secondary Fog Layer */}
          <div
            className="absolute inset-0 rounded-full mix-blend-screen z-30"
            style={{
              background: `
                radial-gradient(
                  circle,
                  rgba(220,255,120,0.16) 0%,
                  rgba(163,230,53,0.08) 30%,
                  transparent 70%
                )
              `,
              filter: "blur(140px)",
              transform: "scale(1.4)",
            }}
          />
        </div>

        {/* Layer 1: Base Solid Deep Pine */}
        <div className="absolute inset-0 bg-[#000000] " />

        {/* Layer 2: Primary Atmospheric Radiance */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse 150% 110% at 50% -15%,
                rgba(196, 255, 0, 0.9) 0%,
                rgba(163, 230, 53, 0.75) 15%,
                rgba(110, 180, 20, 0.5) 35%,
                rgba(40, 80, 15, 0.25) 55%,
                rgba(10, 20, 8, 0.08) 75%,
                transparent 100%
              )
            `,
          }}
        />

        {/* Layer 3: Ultra Bright Hotspot */}
        <div
          className="absolute inset-0 mix-blend-screen opacity-36 z-10"
          style={{
            background: `
              radial-gradient(
                ellipse 75% 45% at 50% -6%,
                rgba(220, 255, 100, 0.7) 0%,
                rgba(180, 230, 50, 0.3) 40%,
                transparent 90%
              )
            `,
            filter: "blur(70px)",
          }}
        />

        {/* Layer 4: Mid Atmospheric Extension */}
        <div
          className="absolute inset-0 mix-blend-lighten opacity-20 z-10"
          style={{
            background: `
              radial-gradient(
                ellipse 100% 80% at 50% 30%,
                rgba(160, 200, 40, 0.3) 0%,
                rgba(80, 120, 20, 0.1) 50%,
                transparent 100%
              )
            `,
            filter: "blur(80px)",
          }}
        />

        {/* ===== ATMOSPHERIC MOVING SMOKE LAYER 1 ===== */}
<div
  className="
    absolute
    -top-[20%]
    left-[-10%]
    w-[70vw]
    h-[70vw]
    rounded-full
    opacity-30
    animate-[floatSmoke1_18s_ease-in-out_infinite]
    blur-[120px]
    z-20
  "
  style={{
    background: `
      radial-gradient(
        circle,
        rgba(163,230,53,0.22) 0%,
        rgba(163,230,53,0.10) 35%,
        rgba(163,230,53,0.04) 55%,
        transparent 75%
      )
    `,
  }}
/>

{/* ===== ATMOSPHERIC MOVING SMOKE LAYER 2 ===== */}
<div
  className="
    absolute
    top-[-15%]
    right-[-15%]
    w-[65vw]
    h-[65vw]
    rounded-full
    opacity-20
    animate-[floatSmoke2_22s_ease-in-out_infinite]
    blur-[140px]
    z-20
  "
  style={{
    background: `
      radial-gradient(
        circle,
        rgba(190,255,0,0.18) 0%,
        rgba(163,230,53,0.08) 40%,
        transparent 75%
      )
    `,
  }}
/>

{/* ===== CENTER FOG ATMOSPHERE ===== */}
<div
  className="
    absolute
    top-[5%]
    left-1/2
    -translate-x-1/2
    w-[80vw]
    h-[40vw]
    opacity-10
    blur-[120px]
    animate-[floatSmoke3_26s_ease-in-out_infinite]
    z-20
  "
  style={{
    background: `
      radial-gradient(
        ellipse,
        rgba(210,255,120,0.16) 0%,
        rgba(163,230,53,0.06) 45%,
        transparent 80%
      )
    `,
  }}
/>

        {/* Layer 5: Cinematic Vignette */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `
              radial-gradient(
                ellipse 110% 95% at 50% 50%,
                transparent 35%,
                rgba(1, 4, 1, 0.5) 70%,
                rgba(0, 0, 0, 0.9) 90%,
                rgba(0, 0, 0, 0.98) 100%
              )
            `,
          }}
        />

        {/* Layer 6: Bottom Fade */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `
              linear-gradient(
                to bottom,
                transparent 0%,
                rgba(0, 0, 0, 0.2) 40%,
                rgba(0, 0, 0, 0.7) 75%,
                rgba(0, 0, 0, 0.98) 95%,
                #000000 100%
              )
            `,
          }}
        />

        {/* Layer 7: Grain Texture */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">

        {/* Social Proof */}
        <div className="inline-flex items-center justify-center gap-4 bg-white/[0.02] border border-white/[0.06] backdrop-blur-md px-4 py-2 rounded-full mb-10 shadow-inner z-10">

          {/* Avatars */}
          <div className="flex -space-x-2.5">
            {[
              "https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97",
              "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
              "https://plus.unsplash.com/premium_photo-1688350808212-4e6908a03925",
              "https://images.unsplash.com/photo-1619895862022-09114b41f16f",
            ].map((src, i) => (
              <img
                key={i}
                src={`${src}?w=200&auto=format&fit=crop`}
                className="w-8 h-8 rounded-full border-2 border-black object-cover"
                alt="user avatar"
              />
            ))}
          </div>

          <div className="h-4 w-[1px] bg-white/20" />

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 text-[#A3E635] fill-[#A3E635]"
                />
              ))}
            </div>

            <p className="text-xs font-medium text-gray-300 tracking-wide">
              Used by 10,000+ fast-growing professionals
            </p>
          </div>
        </div>

        {/* ===== HERO HEADING ===== */}
<div className="max-w-5xl mx-auto text-center font-medium">

  <h1 className="text-[42px] sm:text-[56px] md:text-[65px] leading-[1] font-[500]  text-white">
    
    Accelerate Your Career With
    
    <br />

    <span className="relative inline-block mt-3">
      
      {/* Gradient Text */}
      <span className="bg-gradient-to-b from-[#ffffff] via-[#d9ff8c] to-[#A3E635] bg-clip-text text-transparent">
        AI-Powered Job Intelligence
      </span>

      {/* Glow Behind Text */}
      <span className="absolute inset-0 blur-3xl opacity-20 bg-[#A3E635] -z-10" />
    </span>
  </h1>

  {/* ===== PARAGRAPH ===== */}
  <p className="mt-8 max-w-2xl mx-auto text-[15px] sm:text-[17px] leading-[1.8] text-[#b5b5b5] font-[400] tracking-[-0.01em]">
    Optimize your resume, discover missing technical skills, and unlock
    high-quality opportunities using advanced AI-driven career analysis
    and intelligent job matching systems.
  </p>
</div>

        {/* ===== HERO CTA BUTTONS ===== */}
<div className="mt-12 flex items-center justify-center gap-4 flex-wrap">

  {/* Primary CTA */}
  <button
    className="
      group
      relative
      flex
      items-center
      gap-5
      pl-7
      pr-2
      py-2
      rounded-full
      bg-white
      text-black
      transition-all
      duration-300
      hover:scale-[1.015]
      hover:shadow-[0_0_40px_rgba(163,230,53,0.16)]
    "
  >
    {/* Text */}
    <span className="text-[15px] font-[600] tracking-[-0.02em]">
      Get Started
    </span>

    {/* Arrow Circle */}
    <div
      className="
        w-11
        h-11
        rounded-full
        bg-[#A3E635]
        flex
        items-center
        justify-center
        transition-all
        duration-300
        group-hover:-rotate-45
        cursor-pointer
      "
    >
      <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
    </div>

    {/* Soft Glow */}
    <div
      className="
        absolute
        inset-0
        rounded-full
        opacity-0
        group-hover:opacity-100
        transition-opacity
        duration-500
        blur-2xl
        bg-[#A3E635]/10
        -z-10
      "
    />
  </button>

  {/* Secondary CTA */}
  <button
    className="
      group
      flex
      items-center
      gap-4
      px-6
      py-[13px]
      rounded-full
      border
      border-white/10
      bg-white/[0.03]
      backdrop-blur-xl
      text-white
      transition-all
      duration-300
      hover:bg-white/[0.06]
      hover:border-white/20
      cursor-pointer
    "
  >
    {/* Play Icon */}
    <div
      className="
        w-9
        h-9
        rounded-full
        bg-white/[0.06]
        flex
        items-center
        justify-center
        transition-all
        duration-300
        group-hover:bg-[#A3E635]
      "
    >
      <Play className="w-3.5 h-3.5  text-white group-hover:text-black fill-current" />
    </div>

    {/* Text */}
    <span className="text-[15px] font-[500] tracking-[-0.02em]">
      Watch Demo
    </span>
  </button>
</div>

        {/* Product Flow */}
        <div className="mt-24 w-full max-w-5xl mx-auto">

          <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] rounded-2xl px-8 py-6 backdrop-blur-xl relative">

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-6 md:gap-4 text-gray-400">

              {[
                { icon: Upload, label: "Upload CV" },
                { icon: FileText, label: "Parsing" },
                { icon: Brain, label: "AI Analysis" },
                { icon: BarChart, label: "ATS Score" },
                { icon: Briefcase, label: "Job Matching" },
              ].map((step, index, arr) => {
                const Icon = step.icon;

                return (
                  <div
                    key={index}
                    className="flex flex-1 min-w-[140px] items-center justify-center gap-4 group"
                  >
                    {/* Step Card */}
                    <div className="flex flex-col items-center gap-2 transition-transform duration-300 group-hover:-translate-y-1">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/[0.08] flex items-center justify-center transition-all duration-300 group-hover:border-[#A3E635]/40 group-hover:shadow-[0_0_15px_rgba(163,230,53,0.1)]">

                        <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#A3E635] transition-colors" />
                      </div>

                      <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors tracking-wide">
                        {step.label}
                      </span>
                    </div>

                    {/* Connector */}
                    {index !== arr.length - 1 && (
                      <ArrowRight className="w-6 h-4 text-gray-400 hidden lg:block ml-auto" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}