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

  // Premium, 2-stop laser gradients (No disco lights)
  const getScoreStyles = () => {
    if (score >= 85)
      return {
        bgGradient: "bg-gradient-to-r from-[#4d8600] to-[#8BEE00]",
        text: "text-[#8BEE00]",
        lightBg: "bg-[#8BEE00]/10",
        border: "border-[#8BEE00]/30",
        glow: "shadow-[0_0_12px_rgba(139,238,0,0.6)]",
      };
    if (score >= 70)
      return {
        bgGradient: "bg-gradient-to-r from-gray-500 to-white",
        text: "text-white",
        lightBg: "bg-white/10",
        border: "border-white/20",
        glow: "shadow-[0_0_10px_rgba(255,255,255,0.3)]",
      };
    return {
      bgGradient: "bg-gradient-to-r from-gray-800 to-gray-500",
      text: "text-gray-400",
      lightBg: "bg-white/5",
      border: "border-white/10",
      glow: "shadow-none",
    };
  };

  const styles = getScoreStyles();

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      className="group flex flex-col h-full bg-[#0A0A0A] backdrop-blur-xl rounded-3xl border border-white/[0.06] hover:border-[#8BEE00]/30 transition-all duration-300 overflow-hidden hover:shadow-[0_8px_30px_rgba(139,238,0,0.08)] relative"
    >
      {/* Subtle top ambient glow on hover */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-[#8BEE00] opacity-0 group-hover:opacity-[0.12] blur-3xl transition-opacity duration-500 pointer-events-none" />

      {/* RAZOR THIN PREMIUM PROGRESS BAR */}
      <div className="w-full h-[3px] bg-white/[0.03]">
        <motion.div
          className={`h-full ${styles.bgGradient} ${styles.glow} rounded-r-full`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
        />
      </div>

      <div className="p-6 flex flex-col flex-grow space-y-5 relative z-10">
        
        {/* ROW 1: Title & Score Badge */}
        <div className="flex justify-between items-start gap-4 pb-2">
          <h3 className="flex-1 text-lg font-bold text-white leading-snug line-clamp-2 group-hover:text-[#8BEE00] transition-colors duration-300">
            {job.title}
          </h3>

          <motion.div
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            className={`flex flex-col items-center px-3.5 py-2 rounded-xl border whitespace-nowrap ${styles.lightBg} ${styles.border} backdrop-blur-md`}
          >
            <span className={`text-base font-black ${styles.text} leading-none`}>
              {score}%
            </span>
            <span className={`text-[8px] uppercase font-bold tracking-widest ${styles.text} opacity-70 mt-1`}>
              Match
            </span>
          </motion.div>
        </div>

        {/* ROW 2: Company + Posted Date (Now aligned perfectly like Location Row) */}
        <div className="flex items-center justify-between gap-3 text-sm text-gray-400 pb-5 border-b border-white/[0.06]">
          <span className="truncate font-semibold text-gray-300">
            {job.company}
          </span>
          <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {job.posted}
          </span>
        </div>

        {/* ROW 3: Location + Job Type */}
        <div className="flex items-center justify-between gap-3 text-sm text-gray-400">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:bg-[#8BEE00]/10 group-hover:border-[#8BEE00]/20 transition-colors duration-300">
              <MapPin className="w-4 h-4 text-gray-400 group-hover:text-[#8BEE00] transition-colors duration-300" />
            </div>
            <span className="truncate font-medium">{job.location}</span>
          </div>

          {job.jobType && (
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
              {job.jobType}
            </span>
          )}
        </div>

        {/* Salary block */}
        {job.salary && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-[#8BEE00]/10 to-transparent border border-[#8BEE00]/20">
            <div className="p-1 rounded-md bg-[#8BEE00]/20 text-[#8BEE00]">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white tracking-wide">{job.salary}</span>
          </div>
        )}

        {/* BULLETPROOF DESCRIPTION TRUNCATION */}
        <div className="flex-grow min-h-[60px]">
          <p className="text-[13px] text-gray-400 leading-relaxed font-medium line-clamp-3 text-ellipsis overflow-hidden">
            {job.description}
          </p>
        </div>

        {/* Footer with Actions */}
        <div className="pt-4 border-t border-white/[0.06] flex gap-3 mt-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            className={`flex items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
              isSaved
                ? "bg-[#8BEE00] border-[#8BEE00] text-black shadow-[0_0_15px_rgba(139,238,0,0.4)]"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-[#8BEE00] hover:border-[#8BEE00]/40 hover:bg-[#8BEE00]/10"
            }`}
            title={isSaved ? "Unsave job" : "Save job"}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </motion.button>

          <motion.a
            whileTap={{ scale: 0.98 }}
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black hover:bg-[#8BEE00] hover:text-black px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(139,238,0,0.3)] group/btn"
          >
            Apply Now
            <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};