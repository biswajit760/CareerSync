export default function JobMatchPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <section className="rounded-4xl bg-white border border-slate-200 shadow-xl p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-600">Job Match</p>
            <h1 className="mt-4 text-4xl font-bold text-slate-900">Match your resume to the right roles</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Discover career opportunities that match your skills, experience, and resume strengths with AI-powered job matching.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Smart Matching</h2>
              <p className="mt-3 text-sm text-slate-600">
                Find roles that align with your resume, experience level, and career goals.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Skill Fit Score</h2>
              <p className="mt-3 text-sm text-slate-600">
                Understand how well each job fits your qualifications and where to improve.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Actionable Insights</h2>
              <p className="mt-3 text-sm text-slate-600">
                Get recommended resume updates and job search tips for better results.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
