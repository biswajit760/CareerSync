"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  Briefcase,
  CheckCircle2,
  Loader2,
  X,
  Zap,
  ShieldCheck,
  Star,
  Lock,
  Brain,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function ResumeForm() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Helper to determine active step
  const currentStep = !file ? 0 : !jd.trim() ? 1 : 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!file || !jd.trim()) return;

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jd);

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Request failed");

      router.push(`/results/${data?.data?._id}`);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen py-16 bg-[#fcfdfc] overflow-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-100/40 blur-[120px] rounded-full" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* HERO */}
        <div className="text-center mb-6">
          <h2 className="text-4xl md:text-[2.8rem] font-bold text-slate-900 leading-tight">
            Land more interviews with <br />
            <span className="text-green-600">AI Resume Analysis</span>
          </h2>

          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Get ATS score, keyword insights, and actionable improvements in seconds.
          </p>
        </div>

        {/* STEPPER */}
        <div className="relative max-w-xl mx-auto mb-10">
          <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-200" />
          <div
            className="absolute top-4 left-0 h-[2px] bg-green-500 transition-all"
            style={{ width: `${(currentStep / 2) * 100}%` }}
          />

          <div className="flex justify-between relative">
            {["Upload", "JD", "Report"].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold ${
                  i <= currentStep ? "bg-green-600 text-white" : "bg-slate-200 text-slate-400"
                }`}>
                  {i < currentStep ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-xs font-medium text-slate-500">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* RESUME CARD */}
          <div className="group bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-green-200 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-50 rounded-lg">
                <FileText className="text-green-600 w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Your Resume</h3>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile?.type === "application/pdf") setFile(droppedFile);
              }}
              className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center min-h-[250px] transition-all duration-200 ${
                isDragging ? "border-green-500 bg-green-50/50" : "border-slate-200 bg-slate-50/30 hover:bg-slate-50"
              }`}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />

              {!file ? (
                <div className="text-center">
                  <UploadCloud className="w-12 h-12 text-green-500 mb-4 mx-auto opacity-80 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-slate-700">Drop or click to upload</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4 text-uppercase tracking-wider">PDF ONLY • MAX 5MB</p>
                  <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors">
                    Browse Files
                  </span>
                </div>
              ) : (
                <div className="w-full bg-white border border-green-100 rounded-xl p-4 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                  <div className="p-2 bg-green-50 rounded-lg"><CheckCircle2 className="text-green-600 w-5 h-5" /></div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold text-slate-700 truncate">{file.name}</span>
                    <span className="text-green-600 text-xs font-medium">Ready for analysis</span>
                  </div>
                  <button type="button" onClick={() => setFile(null)} className="ml-auto p-1 text-slate-300 hover:text-red-500 transition-colors z-20">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* JD CARD */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-50 rounded-lg">
                <Briefcase className="text-green-600 w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Job Description</h3>
            </div>
            <div className="relative flex-grow">
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job description here to compare against your resume..."
                className="w-full h-full min-h-[250px] border border-slate-200 rounded-2xl p-5 focus:border-green-500 focus:ring-4 focus:ring-green-500/5 outline-none resize-none transition-all placeholder:text-slate-300 text-slate-600 leading-relaxed"
              />
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                {jd.length} Characters
              </div>
            </div>
          </div>

          

          {/* CTA AREA */}
          <div className="lg:col-span-2 flex flex-col items-center mt-4">
            
<Button
  disabled={loading}
  className={`relative group overflow-hidden px-12 py-5 rounded-xl font-semibold text-white
             bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500
             transition-all duration-300 ease-out
             hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(16,185,129,0.45)]
             active:scale-[0.97] ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
>
  {/* Content */}
  <span className="relative z-10 flex items-center gap-2 tracking-wide">
    {loading ? 'Analyzing...' : 'Analyze Resume'}
    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
  </span>

  {/* Shine sweep */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700">
    <div className="absolute top-0 left-[-120%] w-[60%] h-full 
                    bg-gradient-to-r from-transparent via-white/40 to-transparent 
                    skew-x-[-20deg]
                    group-hover:left-[120%] transition-all duration-1000" />
  </div>

  {/* Soft glow layer */}
  <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
</Button>           <div className="flex items-center justify-center gap-10 mt-10 text-sm text-slate-400">

  <div className="flex items-center gap-2 text-slate-900 transition">
    <Sparkles className="w-4 h-4 text-amber-700" />
    <span>Instant Analysis</span>
  </div>

  <div className="flex items-center gap-2 text-slate-900 transition">
    
    <ShieldCheck className="w-4 h-4 text-blue-700" />
    <span>Secure</span>
  </div>

  <div className="flex items-center gap-2 text-slate-900 transition">
    <Brain className="w-4 h-4 text-violet-700" />
    <span>AI Powered</span>
  </div>

</div>
          </div>
        </form>
      </div>
    </section>
  );
}