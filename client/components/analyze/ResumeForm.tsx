"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

import {
  UploadCloud,
  FileText,
  Trash2,
  Briefcase,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Brain,
  ArrowUpRight,
  ShieldCheck,
  ScanLine,
  Zap,
  Activity,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const rotatingTexts = [
  "Parsing Resume...",
  "Detecting Skills...",
  "Matching Keywords...",
  "Calculating ATS Score...",
];

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {active && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
      )}

      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
          active ? "bg-lime-400" : "bg-white/20"
        }`}
      />
    </span>
  );
}

export default function AnalyzePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    damping: 40,
    stiffness: 250,
  });

  const smoothY = useSpring(mouseY, {
    damping: 40,
    stiffness: 250,
  });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const handleResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);

    const uploadedFile = e.target.files?.[0];

    if (!uploadedFile) return;

    if (uploadedFile.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    if (uploadedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setFile(uploadedFile);
  };

  const removeFile = () => {
    setFile(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const triggerAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!file || !jd.trim()) return;

    try {
      setIsAnalyzing(true);

      const formData = new FormData();

      formData.append("resume", file);
      formData.append("jobDescription", jd);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analyze`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Analysis failed");
      }

      router.push(`/results/${data?.data?._id}`);
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canSubmit = !isAnalyzing && !!file && jd.length > 20;

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-100"
          style={{
            background: `
              radial-gradient(
                520px circle at ${smoothX}px ${smoothY}px,
                rgba(163,230,53,0.12),
                transparent 45%
              )
            `,
          }}
        />

        <div className="absolute top-[-240px] left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-lime-500/10 blur-[160px]" />

        <div className="absolute bottom-[-260px] left-[-120px] w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[180px]" />

        <div className="absolute bottom-[-260px] right-[-120px] w-[550px] h-[550px] bg-lime-400/10 rounded-full blur-[180px]" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-24">
        {/* HERO */}
        <div className="max-w-3xl mx-auto text-center mb-14">
         

          <h1 className="text-4xl md:text-[60px] font-black leading-[0.92] tracking-tight">
            Resume
            <br />
            <span className="bg-gradient-to-b from-lime-100 via-lime-300 to-lime-500 bg-clip-text text-transparent">
              Intelligence Engine
            </span>
          </h1>

          <p className="mt-6 text-white/45 text-sm md:text-[15px] leading-relaxed max-w-2xl mx-auto">
            Upload your resume and job description to unlock ATS scoring,
            keyword analysis, skill intelligence, and AI-powered optimization.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <StatusDot active />

            <AnimatePresence mode="wait">
              <motion.div
                key={textIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-sm text-lime-300"
              >
                {rotatingTexts[textIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={triggerAnalysis}>
          <div className="relative grid lg:grid-cols-[1fr_160px_1fr] gap-10 items-center">
            {/* CONNECTION */}
            <div className="hidden lg:block absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="relative max-w-[72%] mx-auto h-px">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-lime-400/15 to-transparent" />

                <motion.div
                  animate={{
                    x: ["-20%", "120%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute top-1/2 -translate-y-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-lime-300 to-transparent blur-[2px]"
                />
              </div>
            </div>

            {/* RESUME CARD */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="relative z-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/55 font-semibold">
                    <FileText className="w-4 h-4 text-lime-400" />
                    Resume Source
                  </div>

                  <p className="mt-2 text-xs text-white/30">
                    AI extracts structure, skills & ATS signals.
                  </p>
                </div>

                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                  PDF · Max 5MB
                </span>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);

                  const f = e.dataTransfer.files[0];

                  if (f?.type === "application/pdf") {
                    setFile(f);
                  } else {
                    setError("Please upload a valid PDF.");
                  }
                }}
                className={`
                  group relative h-[520px]
                  rounded-[34px]
                  border overflow-hidden
                  transition-all duration-500
                  shadow-[0_0_80px_rgba(0,0,0,0.35)]
                  ${
                    isDragging
                      ? "border-lime-400/40 bg-lime-400/[0.05]"
                      : "border-white/[0.08] bg-white/[0.03]"
                  }
                `}
              >
                <div className="absolute inset-[1px] rounded-[33px] bg-[#090909]" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent" />
                <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:18px_18px]" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-400/60 to-transparent" />

                <motion.div
                  animate={{
                    y: ["-100%", "520px"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-lime-400/[0.06] to-transparent blur-2xl"
                />

                <div className="absolute -top-20 right-[-40px] w-44 h-44 bg-lime-400/10 rounded-full blur-[90px]" />

                {!file && (
  <input
    ref={fileRef}
    type="file"
    accept="application/pdf"
    onChange={handleResume}
    className="absolute inset-0 opacity-0 z-20 cursor-pointer"
  />
)}

                {!file ? (
  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-10">
    <div className="relative w-32 h-32 mb-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 rounded-full border border-dashed border-lime-400/20"
      />

      <div className="absolute inset-[14px] rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl" />

      <div className="absolute inset-[28px] rounded-full bg-lime-400/10 blur-2xl" />

      <UploadCloud className="absolute inset-0 m-auto w-11 h-11 text-lime-400" />
    </div>

    <h3 className="text-3xl font-black text-white mb-3">
      Upload Resume
    </h3>

    <p className="text-white/40 leading-relaxed max-w-sm mb-10">
      Drag & drop your resume or browse files to begin ATS intelligence analysis.
    </p>

    
  </div>
) : (
  <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-10">
    <div className="relative mb-8">
      <div className="absolute inset-0 rounded-full bg-lime-400/20 blur-3xl" />

      <div className="relative w-28 h-28 rounded-full bg-lime-400/10 border border-lime-400/20 flex items-center justify-center shadow-[0_0_60px_rgba(163,230,53,0.15)] backdrop-blur-2xl">
        <CheckCircle2 className="w-14 h-14 text-lime-400" />
      </div>
    </div>

    <h3 className="text-2xl font-black text-white mb-6">
      Resume Uploaded
    </h3>

    {/* Updated File Container with Inline Delete */}
    <div className="relative z-30 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md transition-all hover:bg-white/[0.06]">
      <p className="text-white/80 text-sm font-medium truncate max-w-[220px]">
        {file.name}
      </p>

      <div className="w-px h-4 bg-white/10 mx-1" />

      <button
        type="button"
        onClick={removeFile}
        aria-label="Remove file"
        className="group relative flex items-center justify-center p-1.5 rounded-full transition-all duration-300 hover:bg-red-500/20 z-50"
      >
        <X className="w-4 h-4 text-white/40 group-hover:text-red-400 transition-colors duration-300" />
      </button>
    </div>
  </div>
)}
              </div>
            </motion.div>

            {/* AI ORB */}
            <div className="hidden lg:flex relative z-20 items-center justify-center">
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute w-40 h-40 rounded-full border border-dashed border-lime-400/15"
                />

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute w-28 h-28 rounded-full border border-lime-400/10"
                />

                <motion.div
                  animate={{
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="relative w-24 h-24 rounded-full bg-gradient-to-br from-lime-300 to-lime-500 shadow-[0_0_100px_rgba(163,230,53,0.45)] flex items-center justify-center"
                >
                  <Brain className="w-9 h-9 text-black" />

                  <div className="absolute inset-0 rounded-full border border-white/20" />
                </motion.div>

                <motion.div
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-10 text-[10px] uppercase tracking-[0.25em] text-lime-300"
                >
                  AI Processing
                </motion.div>
              </div>
            </div>

            {/* JD CARD */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="relative z-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/55 font-semibold">
                    <Briefcase className="w-4 h-4 text-lime-400" />
                    Target Role
                  </div>

                  <p className="mt-2 text-xs text-white/30">
                    AI matches your profile against hiring requirements.
                  </p>
                </div>

                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                  {jd.length} chars
                </span>
              </div>

              <div className="relative h-[520px] rounded-[34px] border border-white/[0.08] overflow-hidden bg-white/[0.03] shadow-[0_0_80px_rgba(0,0,0,0.35)]">
                <div className="absolute inset-[1px] rounded-[33px] bg-[#090909]" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:100%_26px]" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-400/60 to-transparent" />

                <div className="absolute top-6 right-6 z-20 flex items-center gap-2 rounded-full border border-lime-400/15 bg-lime-400/[0.05] px-3 py-1.5 backdrop-blur-xl">
                  <ScanLine className="w-3.5 h-3.5 text-lime-400" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-lime-300">
                    Live Parsing
                  </span>
                </div>

                <textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste the complete job description here..."
                  className="relative z-10 w-full h-full resize-none bg-transparent p-8 text-white/75 placeholder:text-white/20 outline-none leading-relaxed custom-scrollbar"
                />

                
              </div>
            </motion.div>
          </div>

          {/* ERROR */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-300"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          {/* CTA */}
          <div className="mt-10">
            <div className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.03] px-7 py-6 backdrop-blur-3xl">
              <div className="absolute inset-[1px] rounded-[29px] bg-[#090909]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(163,230,53,0.14),transparent_25%),radial-gradient(circle_at_right,rgba(16,185,129,0.10),transparent_25%)]" />

              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-y-0 w-40 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent blur-2xl"
              />

              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lime-400/40 to-transparent" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-8 flex-1 min-w-0 flex-wrap">
                  <div className="min-w-[300px]">
                    

                    <h3 className="text-lg font-black leading-tight text-white mb-2">
                      Generate ATS intelligence in seconds.
                    </h3>

                    <p className="text-[12px] text-white/40 max-w-lg">
                      Deep AI analysis including keyword matching, ATS scoring,
                      role compatibility & optimization insights.
                    </p>
                  </div>

                  <div className="hidden xl:block h-16 w-px bg-white/[0.06]" />

                  <div className="flex items-center gap-6 flex-wrap">
                    {[
                      {
                        label: "Resume",
                        active: !!file,
                      },
                      {
                        label: "Job Context",
                        active: jd.length > 20,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`
                            relative w-12 h-12 rounded-2xl
                            border flex items-center justify-center
                            transition-all duration-300
                            ${
                              item.active
                                ? "border-lime-400/20 bg-lime-400/10 shadow-[0_0_25px_rgba(163,230,53,0.15)]"
                                : "border-white/[0.08] bg-white/[0.03]"
                            }
                          `}
                        >
                          {item.active && (
                            <div className="absolute inset-0 rounded-2xl bg-lime-400/10 blur-xl" />
                          )}

                          <StatusDot active={item.active} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-white">
                            {item.label}
                          </p>

                          <p
                            className={`text-xs ${
                              item.active
                                ? "text-lime-300/70"
                                : "text-white/30"
                            }`}
                          >
                            {item.active ? "Ready" : "Waiting"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`
                    group relative overflow-hidden
                    h-[62px]
                    px-9 rounded-2xl
                    text-sm font-bold tracking-wide
                    transition-all duration-500
                    flex items-center justify-center gap-3
                    whitespace-nowrap
                    ${
                      canSubmit
                        ? "bg-lime-400 text-black hover:scale-[1.03] hover:shadow-[0_0_70px_rgba(163,230,53,0.35)]"
                        : "bg-white/[0.05] text-white/30 border border-white/[0.06]"
                    }
                  `}
                >
                  {canSubmit && (
                    <motion.div
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  )}

                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                      Run AI Analysis
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .custom-scrollbar::-webkit-scrollbar {
              width: 5px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(163,230,53,0.25);
              border-radius: 999px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
          `,
        }}
      />
    </section>
  );
}