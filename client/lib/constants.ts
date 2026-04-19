/**
 * UI Theme Gradients
 * Shared across the app for consistent branding.
 */
export const G = {
  nav: "from-slate-700 to-slate-900", // Dark navigation elements
  summary: "from-sky-400 to-blue-600", // Info / Summary sections
  health: "from-teal-400 to-emerald-600", // Structural checks
  optimal: "from-emerald-400 to-green-600", // Positive/Success states
  warning: "from-amber-400 to-orange-500", // Neutral/Warning states
  recruiter: "from-violet-500 to-purple-700", // Branding/Insight sections
  strengths: "from-emerald-400 to-teal-600", // Highlighting wins
  risks: "from-rose-500 to-red-700", // Error/Critical Risk states
  gaps: "from-rose-500 to-rose-700", // Fixes needed
  keyword: "from-indigo-500 to-violet-600", // Technical/ATS sections
  zap: "from-amber-400 to-yellow-500", // Tips & "Quick Fix" actions
} as const;

/**
 * Standardized Typography Styles
 * Ensures section headers look identical across all components.
 */
export const sectionLabel = 
  "text-[10px] font-bold uppercase tracking-widest text-slate-500";

export const sectionTitle = 
  "text-[13px] font-semibold text-slate-800";

/**
 * ATS Logic Helpers
 */

/**
 * Converts a numerical score into a human-readable label
 * @param val - The percentage score (0-100)
 */
export const getKeywordLabel = (val: number = 0): string => {
  if (val >= 85) return "Excellent";
  if (val >= 70) return "Strong";
  if (val >= 50) return "Moderate";
  return "Low";
};

/**
 * Calculates the likelihood of a resume passing a recruiter screen
 * @param atsScore - The raw score from the Gemini analysis
 */
const SHORTLIST_FACTOR = 0.85;

export const getShortlistProbability = (atsScore: number): number => {
  // Logic: Recruiter probability is usually slightly lower than raw keyword match
  if (!Number.isFinite(atsScore) || atsScore < 0) return 0;
  return Math.min(100, Math.round(atsScore * SHORTLIST_FACTOR));
};
/**
 * Common Animation Variants (For use with Framer Motion if you add it later)
 */
export const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};