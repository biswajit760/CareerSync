"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  FileText,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function ResumeUploadSection() {
  return (
    <section className="relative w-full overflow-hidden bg-black py-28">

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

      {/* Ambient Center Glow */}
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

      {/* ================= CONTENT ================= */}

      <div className="relative max-w-7xl mx-auto px-6">

        <div
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border
            border-white/[0.08]
            bg-white/[0.03]
            backdrop-blur-2xl
            px-8
            py-16
            md:px-16
            md:py-20
            shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
          "
        >

          {/* Card Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-lime-400/[0.03] via-transparent to-transparent" />

          

          <div className="relative grid lg:grid-cols-2 gap-16 items-center">

            {/* ================= LEFT CONTENT ================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 40,
                filter: "blur(10px)",
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >

              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl mb-8">

                <div className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime-400 shadow-[0_0_12px_#a3e635]"></span>
                </div>

                <span className="text-sm tracking-wide text-white/70">
                  AI Resume Analysis
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-4xl md:text-6xl font-[500] tracking-tight leading-tight text-white">
                Analyze Your Resume
                <br />
                <span className="bg-gradient-to-b from-lime-300 to-lime-500 bg-clip-text text-transparent">
                  With AI Precision
                </span>
              </h2>

              {/* Description */}
              <p className="mt-8 text-lg text-white/45 leading-relaxed max-w-2xl">
                Upload your resume and job description to receive
                AI-powered ATS scoring, keyword analysis, missing
                skill detection, and personalized career insights
                within seconds.
              </p>

              {/* Feature Points */}
              <div className="mt-10 space-y-5">

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-11 h-11 rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                    <FileText className="w-5 h-5 text-lime-300" />
                  </div>

                  <div>
                    <h3 className="text-white font-medium">
                      Resume & JD Analysis
                    </h3>

                    <p className="mt-1 text-sm text-white/45">
                      Compare your resume against job descriptions
                      using advanced AI analysis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-11 h-11 rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                    <Sparkles className="w-5 h-5 text-lime-300" />
                  </div>

                  <div>
                    <h3 className="text-white font-medium">
                      ATS Optimization Insights
                    </h3>

                    <p className="mt-1 text-sm text-white/45">
                      Discover missing keywords, formatting issues,
                      and improve ATS compatibility.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-11 h-11 rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                    <Briefcase className="w-5 h-5 text-lime-300" />
                  </div>

                  <div>
                    <h3 className="text-white font-medium">
                      Smart Career Recommendations
                    </h3>

                    <p className="mt-1 text-sm text-white/45">
                      Get role suggestions and career guidance
                      tailored to your skills and profile.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-14 flex flex-wrap items-center gap-5">

  {/* Primary CTA */}
  <Link href="/analyze">
    <button
      className="
        group
        relative
        overflow-hidden
        inline-flex
        items-center
        justify-center
        gap-3
        rounded-full
        bg-lime-400
        px-8
        py-4
        text-black
        font-medium
        transition-all
        duration-300
        hover:scale-[1.03]
        hover:shadow-[0_0_50px_rgba(163,230,53,0.35)]
      "
    >
      <span className="relative z-10">
        Start Analysis
      </span>

      <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />

      <div className="absolute inset-0 bg-gradient-to-r from-lime-300 to-lime-400 opacity-0 group-hover:opacity-100 transition duration-300" />
    </button>
  </Link>

  {/* Secondary CTA */}
  <button
    className="
      rounded-full
      border
      border-white/[0.08]
      bg-white/[0.03]
      backdrop-blur-xl
      px-8
      py-4
      text-white/75
      transition-all
      duration-300
      hover:bg-white/[0.05]
      hover:border-white/[0.12]
      hover:text-white
    "
  >
    View Sample Report
  </button>
</div>
            </motion.div>

            {/* ================= RIGHT VISUAL ================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: 60,
                filter: "blur(12px)",
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
              }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative h-[500px] hidden lg:flex items-center justify-center"
            >

              {/* Main Glow */}
              <div className="absolute w-[350px] h-[350px] bg-lime-400/10 blur-[120px] rounded-full" />

              {/* Main Dashboard Card */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  relative
                  z-10
                  w-[420px]
                  rounded-[2rem]
                  border
                  border-white/[0.08]
                  bg-black/50
                  backdrop-blur-2xl
                  p-6
                  shadow-[0_0_100px_rgba(163,230,53,0.08)]
                "
              >

                {/* Card Header */}
                <div className="flex items-center justify-between mb-8">

                  <div>
                    <p className="text-sm text-white/45">
                      ATS Compatibility
                    </p>

                    <h3 className="mt-2 text-5xl font-semibold text-white">
                      92%
                    </h3>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-lime-400/15 border border-lime-400/20 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-lime-300" />
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-5">

                  {[
                    {
                      label: "Keyword Match",
                      value: "95%",
                      width: "w-[95%]",
                    },
                    {
                      label: "Formatting",
                      value: "88%",
                      width: "w-[88%]",
                    },
                    {
                      label: "Experience",
                      value: "91%",
                      width: "w-[91%]",
                    },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white/60">
                          {item.label}
                        </span>

                        <span className="text-sm text-lime-300">
                          {item.value}
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r from-lime-300 to-lime-500 ${item.width}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom */}
                <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-sm text-white/45">
                    AI Recommendation
                  </p>

                  <p className="mt-2 text-sm text-white/80 leading-relaxed">
                    Add React Testing Library and TypeScript
                    keywords to improve ATS ranking for frontend
                    developer roles.
                  </p>
                </div>
              </motion.div>

              {/* Floating Card */}
              <motion.div
                animate={{
                  y: [0, 12, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  bottom-0
                  left-0
                  w-[220px]
                  rounded-[1.7rem]
                  border
                  border-white/[0.08]
                  bg-white/[0.03]
                  backdrop-blur-2xl
                  p-5
                "
              >
                <p className="text-sm text-white/45">
                  Missing Skills
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Next.js",
                    "TypeScript",
                    "MongoDB",
                    "REST API",
                  ].map((skill, i) => (
                    <span
                      key={i}
                      className="
                        rounded-full
                        border
                        border-lime-400/20
                        bg-lime-400/10
                        px-3
                        py-1
                        text-xs
                        text-lime-300
                      "
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}