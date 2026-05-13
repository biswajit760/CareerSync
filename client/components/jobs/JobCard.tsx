import { Bookmark, MapPin, ExternalLink, DollarSign, Clock } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

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
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
}

export const JobCard = ({ job, matchScore }: { job: Job; matchScore: number }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const score = matchScore || 78;

  const getScoreStyles = () => {
    if (score >= 85)
      return {
        bg: "bg-emerald-500",
        text: "text-emerald-700",
        lightBg: "bg-emerald-50",
        border: "border-emerald-100",
        ring: "ring-emerald-500",
        label: "Excellent Fit",
      };
    if (score >= 70)
      return {
        bg: "bg-blue-500",
        text: "text-blue-700",
        lightBg: "bg-blue-50",
        border: "border-blue-100",
        ring: "ring-blue-500",
        label: "Strong Match",
      };
    return {
      bg: "bg-amber-500",
      text: "text-amber-700",
      lightBg: "bg-amber-50",
      border: "border-amber-100",
      ring: "ring-amber-500",
      label: "Potential Match",
    };
  };

  const styles = getScoreStyles();

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      className="group flex flex-col h-full bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      
      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-100">
        <motion.div
          className={`h-full ${styles.bg}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>

      <div className="p-5 flex flex-col flex-grow space-y-4">
        
        {/* Header with Title and Score Badge */}
        <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-100">
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {job.title}
            </h3>
          </div>

          <motion.div
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            className={`flex flex-col items-center px-3 py-1.5 rounded-lg border whitespace-nowrap ${styles.lightBg} ${styles.border}`}
          >
            <span className={`text-sm font-bold ${styles.text}`}>
              {score}%
            </span>
            <span className={`text-[7px] uppercase font-semibold tracking-wider ${styles.text} opacity-60`}>
              Match
            </span>
          </motion.div>
        </div>

        {/* Company + Posted Date */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-600 truncate">
            {job.company}
          </p>
          <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {job.posted}
          </span>
        </div>

        {/* Location + Job Type */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          {job.jobType && (
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px] tracking-wide whitespace-nowrap">
              {job.jobType}
            </span>
          )}
        </div>

        {/* Salary */}
        {job.salary && (
          <div className="flex items-center gap-2 p-2 rounded bg-indigo-50 border border-indigo-100">
            <DollarSign className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-indigo-700">{job.salary}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-[14px] text-slate-600 leading-relaxed line-clamp-3 flex-grow italic">
          {job.description}
        </p>

        {/* Footer with Actions */}
        <div className="pt-3 border-t border-slate-100 flex gap-2 mt-auto">
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            className={`flex items-center justify-center p-2.5 rounded-lg border transition-all ${
              isSaved
                ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                : "bg-white border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50"
            }`}
            title={isSaved ? "Unsave job" : "Save job"}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </motion.button>

          <motion.a
            whileTap={{ scale: 0.98 }}
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-slate-900 text-white px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-lg"     >
            Apply Now
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};