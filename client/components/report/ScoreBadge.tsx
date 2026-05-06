export default function ScoreBadge({ score }: { score: number }) {
  const getStyle = () => {
    if (score >= 80)
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (score >= 60)
      return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-rose-50 text-rose-600 border-rose-100";
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {score}%
    </span>
  );
}