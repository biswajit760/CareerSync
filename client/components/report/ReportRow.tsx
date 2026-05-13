"use client";
import { useRouter } from "next/navigation";
import { ChevronDown, BarChart3, Info, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScoreBadge from "./ScoreBadge";

export default function ReportRow({ report, index }: any) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const atsScore = report.atsScore ?? 0;
  const status =
    atsScore >= 80
      ? { label: "Excellent", color: "bg-emerald-50 text-emerald-700 border-emerald-100" }
      : atsScore >= 60
      ? { label: "Good", color: "bg-amber-50 text-amber-700 border-amber-100" }
      : { label: "Needs Work", color: "bg-rose-50 text-rose-700 border-rose-100" };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group bg-white border border-slate-200/70 rounded-2xl transition-all duration-300 ${
        open ? "ring-2 ring-indigo-500/10 shadow-lg" : "hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5"
      }`}
    >
      <div className="px-6 py-6 flex justify-between items-center cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-8">
          <span className="text-[10px] text-slate-300 font-bold font-mono tracking-widest group-hover:text-indigo-400 transition-colors">
            #{ (index + 1).toString().padStart(2, "0") }
          </span>

          <div className="flex items-center gap-5">
            <ScoreBadge score={report.atsScore} />
            <div>
              <div className="flex gap-2 items-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}>
                  {status.label.toUpperCase()}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                Resume Performance Analysis
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
          {/* SKILLS PROGRESS */}
          <div className="hidden md:block w-48">
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-2">
              <span className="uppercase tracking-tight">Skills Match</span>
              <span className="text-slate-600">{report.scoreBreakdown?.skillsMatch || 0}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${report.scoreBreakdown?.skillsMatch || 0}%` }}
                className="h-full bg-indigo-500 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/results/${report._id}`);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95"
            >
              View Full Report
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/job-match/${report.resumeId}`);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95"
            >
              View Job
            </button>

            <button className="p-2 text-slate-400 group-hover:text-slate-600 transition-colors">
              <ChevronDown size={18} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 pb-6 overflow-hidden"
          >
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <DetailBox icon={<BarChart3 size={13}  />} title="Insights" content="Your resume shows strong alignment in backend logic but lacks 'Cloud' keywords." />
              <DetailBox icon={<Sparkles size={13}/>} title="Suggestions" content="Include 'Docker' and 'AWS' to boost your score by approximately 14%." />
              <DetailBox icon={<Info size={13}/>} title="ATS Notes" content="Formatting is clean. Resume was successfully parsed by 98% of tested systems." />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DetailBox({ icon, title, content }: any) {
  return (
    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
      <div className="flex items-center gap-2 mb-2 text-indigo-600 ">
        <span className="bg-indigo-600 p-1 rounded-2xl text-white" >{icon}</span>
        <span className="text-[11px] font-extrabold uppercase ">{title}</span>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">{content}</p>
    </div>
  );
}