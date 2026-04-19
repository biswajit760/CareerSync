import { Layers, CheckCheck, AlertCircle } from "lucide-react";

import { G, sectionTitle, sectionLabel } from "@/lib/constants";
import IconWrap from "../analyze/shared/IconWrap";

export default function StructuralHealth({ missingCount }: { missingCount: number }) {
  const rows = [
    { label: "Contact Information", status: "Optimal", color: "text-emerald-700", grad: G.optimal, analysis: "All links verified" },
    { label: "Professional Experience", status: "Strong", color: "text-emerald-700", grad: G.optimal, analysis: "Quantifiable data found" },
    { label: "Technical Skills", status: "Needs Work", color: "text-amber-700", grad: G.warning, analysis: `Missing ${missingCount} key tags` },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-6 py-3">
        <IconWrap gradient={G.health} size="md">
          <Layers size={14} />
        </IconWrap>
        <h2 className={sectionTitle}>Structural Health Check</h2>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className={sectionLabel + " px-6 py-3"}>Section</th>
            <th className={sectionLabel + " px-6 py-3"}>Status</th>
            <th className={sectionLabel + " px-6 py-3 text-right"}>Analysis</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 font-medium">
          {rows.map((row, i) => (
            <tr key={i} className="transition hover:bg-slate-50">
              <td className="px-6 py-4 text-[13px] text-slate-700">{row.label}</td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-2">
                  <IconWrap gradient={row.grad} size="sm">
                    {row.status === "Optimal" || row.status === "Strong" ? <CheckCheck size={12} /> : <AlertCircle size={12} />}                  </IconWrap>
                  <span className={`text-[13px] font-semibold ${row.color}`}>{row.status}</span>
                </span>
              </td>
              <td className="px-6 py-4 text-right text-[13px] text-slate-400">{row.analysis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}