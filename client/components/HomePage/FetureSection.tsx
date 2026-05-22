"use client";

import { motion } from "framer-motion";
import { Brain, BarChart3, Briefcase } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "ATS Score Analysis",
      description:
        "Get a detailed ATS score based on keywords, experience, and formatting.",
      icon: BarChart3,
    },
    {
      title: "AI Skill Gap Detection",
      description:
        "Discover missing skills and improve your resume with AI-powered insights.",
      icon: Brain,
    },
    {
      title: "Smart Job Matching",
      description:
        "Get personalized job recommendations based on your skills and resume.",
      icon: Briefcase,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-black py-28">

      {/* ================= BACKGROUND ATMOSPHERE ================= */}

      {/* Left Glow */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-[-15%]
          top-[10%]
          w-[600px]
          h-[600px]
          bg-lime-400/10
          blur-[160px]
          rounded-full
          pointer-events-none
        "
      />

      {/* Right Glow */}
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          right-[-15%]
          bottom-[0%]
          w-[600px]
          h-[600px]
          bg-lime-400/10
          blur-[160px]
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

      <div className="relative max-w-7xl mx-auto px-6">

        {/* ================= HEADER ================= */}

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
          className="text-center mb-20"
        >

          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl mb-8">

            <div className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime-400 shadow-[0_0_12px_#a3e635]"></span>
            </div>

            <span className="text-sm tracking-wide text-white/70">
              Smart Features
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-[500] tracking-tight text-white leading-tight">
            Improve Your Resume
            <br />
            <span className="bg-gradient-to-b from-lime-300 to-lime-500 bg-clip-text text-transparent">
              With AI Intelligence
            </span>
          </h2>

          {/* Description */}
          <p className="mt-7 text-white/45 text-lg leading-relaxed max-w-3xl mx-auto">
            CareerSync helps you analyze your resume, identify missing skills,
            and discover the best opportunities using advanced AI-driven
            career intelligence.
          </p>
        </motion.div>

        {/* ================= MAIN GRID ================= */}

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* ================= LEFT VISUAL ================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -60,
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
            className="relative flex justify-center h-[500px]"
          >

            {/* Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[420px] h-[420px] bg-lime-400/10 blur-[120px] rounded-full" />
            </div>

            {/* Back Card */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [-4, -2, -4],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                absolute
                top-0
                left-10
                md:left-20
                z-0
                w-[320px]
                h-[420px]
                rounded-[2rem]
                overflow-hidden
                border
                border-white/[0.08]
                bg-white/[0.03]
                backdrop-blur-2xl
                shadow-[0_0_80px_rgba(163,230,53,0.08)]
              "
            >
              <img
                src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=800&q=80"
                className="w-full h-full object-cover opacity-80"
                alt="workspace"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </motion.div>

            {/* Front Card */}
            <motion.div
              animate={{
                y: [0, 10, 0],
                rotate: [4, 2, 4],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                absolute
                bottom-0
                right-10
                md:right-20
                z-10
                w-[280px]
                h-[380px]
                rounded-[2rem]
                overflow-hidden
                border
                border-white/[0.10]
                bg-white/[0.04]
                backdrop-blur-2xl
                shadow-[0_0_100px_rgba(163,230,53,0.10)]
              "
            >
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
                className="w-full h-full object-cover opacity-90"
                alt="professional"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
            </motion.div>
          </motion.div>

          {/* ================= FEATURES ================= */}

          <div className="flex flex-col gap-6">

            {features.map((feature, index) => (
              <motion.div
                key={index}
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
                  duration: 0.9,
                  delay: index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[2rem]
                  border
                  border-white/[0.08]
                  bg-white/[0.03]
                  backdrop-blur-2xl
                  p-7
                  transition-all
                  duration-500
                  hover:border-lime-400/20
                  hover:bg-white/[0.04]
                "
              >

                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700">
                  <div className="absolute inset-0 bg-lime-400/[0.03]" />
                </div>

                {/* Shimmer */}
                <motion.div
                  animate={{
                    x: ["-100%", "250%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.8,
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

                <div className="relative flex items-start gap-5 z-10">

                  {/* Icon */}
                  <div
                    className="
                      relative
                      flex
                      items-center
                      justify-center
                      w-14
                      h-14
                      rounded-2xl
                      border
                      border-white/[0.08]
                      bg-black/40
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
                    "
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent" />

                    <feature.icon className="w-6 h-6 text-lime-300" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-medium text-white mb-3 tracking-tight">
                      {feature.title}
                    </h3>

                    <p className="text-white/45 leading-relaxed text-[15px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}