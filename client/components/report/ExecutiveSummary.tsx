import { FileText } from "lucide-react";

import { G, sectionTitle } from "@/lib/constants";
import IconWrap from "../analyze/shared/IconWrap";

export default function ExecutiveSummary({ content }: { content: string }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-6 py-3">
        <IconWrap gradient={G.summary} size="md">
          <FileText size={14} />
        </IconWrap>
        <h2 className={sectionTitle}>Executive Summary</h2>
      </div>
      <div className="p-6">
        <p className="text-[15px] leading-relaxed text-slate-700">{content}</p>
      </div>
    </section>
  );
}