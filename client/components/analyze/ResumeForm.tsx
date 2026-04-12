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

  const handleSubmit = async (e: React.FormEvent) => {

  if (!isAuthenticated) {
    alert("Please login first");
    router.push("/login");
    return;
  }

  e.preventDefault();

  if (!file || !jd.trim()) {
    alert("Please upload resume and paste job description");
    return;
  }

  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobDescription", jd);

  try {
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, // ✅ FIXED
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    let data;

    try {
      data = await res.json();
    } catch (parseError) {
      const text = await res.text();
      throw new Error(`Server error (${res.status}): ${text || res.statusText}`);
    }

    if (!res.ok) {
      throw new Error(data?.message || `Request failed (${res.status})`);
    }

    // ✅ IMPORTANT (correct already)
    const resultId = data?.data?._id;
    if (!resultId) {
      throw new Error("Invalid response: missing result ID");
    }
    router.push(`/results/${resultId}`);
  } catch (err: any) {
    console.error("Upload error:", err);
    alert(err.message || "Something went wrong during analysis");
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="relative min-h-screen py-20 bg-gradient-to-b from-white to-green-50/40 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-200/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-100/40 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* HERO */}
        <div className="text-center max-w-5xl mx-auto mb-12">
          

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Land More Interviews with{" "} <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              AI Resume Analysis
            </span>
          </h2>

          <p className="mt-2 text-lg text-gray-600">
            Get ATS score, keyword insights, and actionable improvements in
            seconds.
          </p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex justify-center gap-6 mb-12 text-sm text-gray-500">
          {["Upload Resume", "Paste Job Description", "Get Report"].map(
            (step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-semibold">
                  {i + 1}
                </div>
                <span>{step}</span>
              </div>
            )
          )}
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
        >
          {/* RESUME UPLOAD */}
          <div className="group bg-white/70 backdrop-blur-xl  rounded-xl p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-300 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-50 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Your Resume
              </h3>
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
                if (droppedFile?.type === "application/pdf")
                  setFile(droppedFile);
              }}
              className={`relative border-2 border-dashed rounded-2xl p-10 transition-all duration-200 flex flex-col items-center justify-center min-h-[260px]
                ${
                  isDragging
                    ? "border-green-500 bg-green-50/60 shadow-lg shadow-green-200"
                    : "border-gray-200 hover:border-green-400 hover:bg-white"
                }`}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />

              {!file ? (
                <>
                  <div className="w-16 h-16 bg-white shadow-md border border-gray-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">
                    Click or drop PDF
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Max size: 5MB
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-xl shadow-md border border-gray-100 animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="text-green-500 w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[180px]">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="ml-auto text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* JOB DESCRIPTION */}
          <div className="bg-white/70 backdrop-blur-xl  border border-gray-200 rounded-xl p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Target Role
              </h3>
            </div>

            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job description or specific requirements here..."
              className="flex-grow w-full border border-gray-200 bg-white/60 backdrop-blur-md
              focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/20
              outline-none p-5 rounded-2xl h-64 lg:h-full transition-all resize-none text-gray-700 leading-relaxed"
            />
          </div>

          {/* CTA */}
          <div className="lg:col-span-2 flex flex-col items-center mt-6">
            <Button
              type="submit"
              disabled={loading}
              className="relative px-14 py-5 rounded-full text-lg font-semibold text-white
              bg-gradient-to-r from-green-600 to-emerald-500
              shadow-lg shadow-green-300/40
              transition-all duration-300
              hover:scale-105 hover:shadow-xl hover:shadow-green-400/50
              active:scale-95"
            >
              <div className="flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze My Resume →</span>
                  </>
                )}
              </div>
            </Button>

            {/* TRUST BADGES */}
            <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500">
              <span>⚡ Takes &lt; 10 seconds</span>
              <span>🔒 Secure & Private</span>
              <span>⭐ Trusted by students</span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}