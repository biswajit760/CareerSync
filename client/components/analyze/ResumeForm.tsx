"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Brain,
  Zap,
  Loader2,
  X,
  Briefcase,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function AnalyzePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];

    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const triggerAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();

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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Analysis failed");
      }

      router.push(`/results/${data?.data?._id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* BACKGROUND */}
      <div className="absolute left-[-10%] top-[10%] w-[600px] h-[600px] bg-lime-400/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute right-[-10%] bottom-[0%] w-[600px] h-[600px] bg-lime-400/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.08),transparent_40%)]" />
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "90px 90px",
        }}
      />

      {/* CONTENT */}
      <div className="relative max-w-7xl mx-auto px-6 py-24">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl">
            <div className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime-400 shadow-[0_0_10px_#a3e635]" />
            </div>
            <span className="text-xs text-white/70 tracking-wide">
              AI Resume Intelligence
            </span>
          </div>

          <h1 className="mt-5 text-[52px] md:text-[78px] leading-[0.92] tracking-[-0.08em] font-[550]">
            Resume
            <span className="bg-gradient-to-b from-white via-lime-200 to-lime-400 bg-clip-text text-transparent">
              {" "}
              Scan
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-white/45">
            Upload your resume and compare it against job descriptions using AI-powered ATS intelligence.
          </p>
        </motion.div>

        {/* MAIN FORM */}
        <form
          onSubmit={triggerAnalysis}
          className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* RESUME CARD */}
          <div className="relative overflow-hidden rounded-[36px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl p-8">
            <div className="absolute top-[-10%] right-[-10%] w-[220px] h-[220px] bg-lime-400/10 blur-[120px] rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-lime-400/10 bg-lime-400/[0.08]">
                  <FileText className="w-6 h-6 text-lime-300" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">
                    Upload Resume
                  </h3>
                  <p className="mt-1 text-sm text-white/35">PDF format only</p>
                </div>
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
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile?.type === "application/pdf") {
                    setFile(droppedFile);
                  }
                }}
                className={`relative min-h-[340px] rounded-[28px] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-10 ${
                  isDragging
                    ? "border-lime-400 bg-lime-400/[0.06]"
                    : "border-white/[0.08] bg-black/20 hover:bg-white/[0.02]"
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleResume}
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                />

                {!file ? (
                  <>
                    <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-lime-400/10 bg-lime-400/[0.08]">
                      <Upload className="w-10 h-10 text-lime-300" />
                    </div>
                    <h3 className="mt-8 text-2xl font-medium text-white">
                      Drop your resume here
                    </h3>
                    <p className="mt-3 text-center text-white/40 leading-7 max-w-sm">
                      Upload your PDF resume and let AI analyze ATS compatibility.
                    </p>
                    <div className="mt-8 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 text-sm text-white/60">
                      PDF • MAX 5MB
                    </div>
                  </>
                ) : (
                  <div className="w-full rounded-[28px] border border-lime-400/10 bg-lime-400/[0.04] p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/[0.08] border border-lime-400/10">
                        <CheckCircle2 className="w-6 h-6 text-lime-300" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="truncate text-white font-medium">
                          {file.name}
                        </h4>
                        <p className="mt-1 text-sm text-lime-300">
                          Ready for ATS analysis
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-black/20 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* JD CARD */}
          <div className="relative overflow-hidden rounded-[36px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl p-8">
            <div className="absolute bottom-[-10%] left-[-10%] w-[220px] h-[220px] bg-cyan-400/10 blur-[120px] rounded-full" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.08]">
                  <Briefcase className="w-6 h-6 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">
                    Job Description
                  </h3>
                  <p className="mt-1 text-sm text-white/35">
                    Paste target role description
                  </p>
                </div>
              </div>
              <div className="relative flex-1">
                <textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="h-[340px] w-full resize-none rounded-[28px] border border-white/[0.08] bg-black/20 p-6 text-white/70 placeholder:text-white/20 outline-none transition-all duration-300 focus:border-lime-400/20 focus:bg-black/30"
                />
                <div className="absolute bottom-5 right-5 rounded-full border border-white/[0.06] bg-black/30 px-3 py-1 text-xs text-white/35">
                  {jd.length} characters
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="lg:col-span-2 flex flex-col items-center mt-2">
            <button
              type="submit"
              disabled={isAnalyzing || !file || !jd.trim()}
              className={`relative overflow-hidden group h-[68px] px-12 rounded-2xl font-semibold text-black transition-all duration-300 bg-gradient-to-r from-lime-300 via-lime-400 to-emerald-400 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(163,230,53,0.35)] ${
                isAnalyzing || !file || !jd.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <span className="relative z-10 flex items-center gap-3 tracking-wide">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    Analyze Resume
                  </>
                )}
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10" />
            </button>

            {/* TRUST */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10 text-sm text-white/45">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Instant Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-300" />
                <span>Secure Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-300" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}