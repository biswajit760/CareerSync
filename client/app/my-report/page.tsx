export default function MyReportPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <section className=" bg-white border border-slate-200 shadow-xl p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-600">My Report</p>
            <h1 className="mt-4 text-4xl font-bold text-slate-900">Your resume performance at a glance</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Review your latest ATS report, score breakdown, and personalized recommendations in one polished dashboard.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">ATS Score</h2>
              <p className="mt-3 text-sm text-slate-600">
                See how your resume performed and which areas need improvement.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Personalized Tips</h2>
              <p className="mt-3 text-sm text-slate-600">
                Receive exact recommendations to improve your resume and job matching success.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
