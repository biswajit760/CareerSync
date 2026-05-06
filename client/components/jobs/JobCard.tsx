import { Bookmark, MapPin, ExternalLink } from "lucide-react";
import { useState } from "react";

interface Job {
  id?: string;
  title: string;
  company: string;
  location: string;
  link: string;
  salary: string;
  posted: string;
  matchScore?: number;
  description: string;
}

export const JobCard = ({ job, matchScore }: { job: Job; matchScore: number }) => {
  const [isSaved, setIsSaved] = useState(false);
  const score = matchScore || 78;

  const getScoreStyles = () => {
    if (score >= 85)
      return {
        bg: "bg-emerald-500",
        text: "text-emerald-700",
        lightBg: "bg-emerald-50",
        border: "border-emerald-100",
      };
    if (score >= 70)
      return {
        bg: "bg-blue-500",
        text: "text-blue-700",
        lightBg: "bg-blue-50",
        border: "border-blue-100",
      };
    return {
      bg: "bg-amber-500",
      text: "text-amber-700",
      lightBg: "bg-amber-50",
      border: "border-amber-100",
    };
  };

  const styles = getScoreStyles();

  return (
    <div className="group flex flex-col h-full bg-white rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      
      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-100">
        <div
          className={`h-full ${styles.bg} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="p-6 flex flex-col flex-grow space-y-5">
        
        {/* Header */}
        <div className="flex justify-between items-start gap-6 pb-4 border-b border-slate-200">
          <h3 className="text-[18px] font-semibold text-black leading-snug line-clamp-2">
            {job.title}
          </h3>

          <div className={`flex flex-col items-center px-2.5 py-1 rounded-lg border ${styles.lightBg} ${styles.border}`}>
            <span className={`text-xs font-bold ${styles.text}`}>
              {score}%
            </span>
            <span className={`text-[8px] uppercase font-semibold tracking-wide ${styles.text} opacity-70`}>
              Match
            </span>
          </div>
        </div>

        {/* Company + Date */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700 truncate">
            {job.company}
          </p>
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {job.posted}
          </span>
        </div>

        {/* Location + Tag */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
            {job.location}
          </div>

          <span className="px-2 py-0.5 rounded-sm bg-slate-200 text-slate-500 font-medium text-[10px] tracking-wide">
            Full-Time
          </span>
        </div>

        {/* Description */}
        <p className="text-[17px] text-slate-600 leading-relaxed line-clamp-3">
          {job.description}
        </p>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex gap-3 mt-auto">
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            className={`flex items-center justify-center p-2.5 rounded-lg border transition-all ${
              isSaved
                ? "bg-slate-900 border-slate-900 text-white"
                : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </button>

          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
          >
            Apply Now
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};