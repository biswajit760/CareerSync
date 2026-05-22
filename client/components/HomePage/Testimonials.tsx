"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";

const testimonials = [
  {
    name: "Briar Martin",
    handle: "@briarwrites",
    text: "CareerSync completely changed how I optimize resumes for different job roles.",
    src: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Avery Johnson",
    handle: "@averywrites",
    text: "The ATS scoring is pinpoint accurate. Helped me land my first dev role!",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Jordan Lee",
    handle: "@jordanleex",
    text: "The live job matching feature feels genuinely smarter than LinkedIn recommendations.",
    src: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Sam Smith",
    handle: "@samsmith",
    text: "CareerSync is easily the best AI career platform I've used this year.",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=60",
  },
];

const TestimonialCard = ({
  name,
  handle,
  text,
  src,
}: {
  name: string;
  handle: string;
  text: string;
  src: string;
}) => (
  <motion.div
    whileHover={{
      y: -8,
      scale: 1.02,
    }}
    transition={{
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    }}
    className="
      group
      relative
      overflow-hidden
      min-w-[380px]
      max-w-[380px]
      mx-4
      shrink-0
      rounded-[2rem]
      border
      border-white/[0.08]
      bg-white/[0.03]
      backdrop-blur-2xl
      p-7
      shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]
    "
  >

    {/* Card Glow */}
    <div className="absolute inset-0 bg-gradient-to-b from-lime-400/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-700" />

    {/* Hover Spotlight */}
    <div className="absolute -top-20 right-[-20px] w-40 h-40 bg-lime-400/[0.10] blur-[70px] opacity-0 group-hover:opacity-100 transition duration-700" />

    {/* Shimmer */}
    <motion.div
      animate={{
        x: ["-100%", "250%"],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
      className="
        absolute
        top-0
        left-0
        h-full
        w-[40%]
        bg-gradient-to-r
        from-transparent
        via-white/[0.03]
        to-transparent
        skew-x-[-25deg]
      "
    />

    {/* Quote Icon */}
    <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition">
      <Quote className="w-8 h-8 text-lime-300" />
    </div>

    <div className="relative z-10">

      {/* User */}
      <div className="flex items-center gap-4 mb-6">

        <div className="relative">
          <img
            src={src}
            alt={name}
            className="
              w-14
              h-14
              rounded-full
              object-cover
              border
              border-white/[0.08]
            "
          />

          <div className="absolute inset-0 rounded-full ring-2 ring-lime-400/20" />
        </div>

        <div>
          <h4 className="font-medium text-white text-[17px] tracking-tight">
            {name}
          </h4>

          <p className="text-sm text-white/40 tracking-wide">
            {handle}
          </p>
        </div>
      </div>

      {/* Review */}
      <p className="text-[15px] leading-relaxed text-white/60 italic group-hover:text-white/75 transition duration-500">
        “{text}”
      </p>

      {/* Bottom */}
      <div className="mt-7 flex items-center justify-between">

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Sparkles
              key={i}
              className="w-3.5 h-3.5 text-lime-300"
            />
          ))}
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-white/30">
          Verified
        </span>
      </div>
    </div>
  </motion.div>
);

export default function Testimonials() {
  const list = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  return (
    <section className="relative overflow-hidden bg-black py-28 border-y border-white/[0.06]">

      {/* ================= BACKGROUND ================= */}

      {/* Left Glow */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-[-10%]
          top-[10%]
          w-[500px]
          h-[500px]
          bg-lime-400/10
          blur-[140px]
          rounded-full
          pointer-events-none
        "
      />

      {/* Right Glow */}
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          right-[-10%]
          bottom-[0%]
          w-[500px]
          h-[500px]
          bg-lime-400/10
          blur-[140px]
          rounded-full
          pointer-events-none
        "
      />

      {/* Ambient Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.05),transparent_65%)]" />

      {/* Noise Texture */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.035]
          mix-blend-soft-light
          pointer-events-none
        "
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      {/* Top Border Glow */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-lime-400/20 to-transparent" />

      {/* ================= HEADER ================= */}

      <div className="relative container mx-auto px-6 text-center mb-20">

        {/* Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl mb-8">

          <div className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime-400 shadow-[0_0_12px_#a3e635]"></span>
          </div>

          <span className="text-sm tracking-wide text-white/70">
            Trusted By Professionals
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-6xl font-[500] tracking-tight text-white leading-tight">
          Don’t Just Take
          <br />
          <span className="bg-gradient-to-b from-lime-300 to-lime-500 bg-clip-text text-transparent">
            Our Words
          </span>
        </h2>

        {/* Description */}
        <p className="mt-7 text-lg text-white/45 leading-relaxed max-w-3xl mx-auto">
          Thousands of students and professionals use CareerSync
          to optimize resumes, improve ATS compatibility, and
          discover better career opportunities with AI.
        </p>
      </div>

      {/* ================= TESTIMONIAL MARQUEE ================= */}

      <div className="relative flex flex-col gap-10">

        {/* Row 1 */}
        <div className="flex animate-marquee pause-on-hover w-max">
          {list.map((t, i) => (
            <TestimonialCard key={`r1-${i}`} {...t} />
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex animate-marquee-reverse pause-on-hover w-max">
          {list.map((t, i) => (
            <TestimonialCard key={`r2-${i}`} {...t} />
          ))}
        </div>

        {/* Edge Fade Left */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-52 bg-gradient-to-r from-black to-transparent z-20" />

        {/* Edge Fade Right */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-52 bg-gradient-to-l from-black to-transparent z-20" />
      </div>
    </section>
  );
}