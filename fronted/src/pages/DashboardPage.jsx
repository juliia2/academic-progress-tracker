import CreditsDistributionCard from "../components/dashboard/CreditsDistributionCard.jsx";

export default function DashboardPage() {
  const requirements = [
    { label: "General Education", done: 30, req: 30 },
    { label: "Core Requirements", done: 50, req: 45 },
    { label: "Major Courses", done: 30, req: 30 },
    { label: "Electives", done: 36, req: 15 },
  ];

  const transcriptYears = [
    {
      year: "Year 1",
      academicYear: "2023 - 2024",
      gpa: 3.61,
      credits: 34,
      courses: [
        { code: "ENG 101", name: "English Composition I", category: "General Education", credits: 3, grade: "A" },
        { code: "MATH 151", name: "Calculus I", category: "General Education", credits: 4, grade: "A-" },
        { code: "CS 101", name: "Introduction to Programming", category: "Core Requirements", credits: 3, grade: "A" },
        { code: "HIST 101", name: "World History I", category: "General Education", credits: 3, grade: "B+" },
        { code: "PHYS 201", name: "Physics I", category: "General Education", credits: 4, grade: "B" },
      ],
    },
  ];

  const requiredCredits = 120;
  const completedCredits = 146;
  const pct = Math.round((completedCredits / requiredCredits) * 100);

  const cumulativeGPA = 3.75;
  const transcriptCreditsCompleted = 128;

  const links = [
    { id: 1, href: "#progress", text: "Progress" },
    { id: 2, href: "#distribution", text: "Distribution" },
    { id: 3, href: "#transcript", text: "Transcript" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header + in-page nav */}
        <header id="top" className="pb-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            Academic Progress Tracker
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Bachelor of Science in Computer Science • Expected Graduation: May 2027
          </p>

          <nav className="mt-6">
            <div className="inline-flex gap-2 rounded-full border border-gray-200 bg-white p-1 shadow-sm">
              {links.map((l) => (
                <a
                  key={l.id}
                  href={l.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
                >
                  {l.text}
                </a>
              ))}
            </div>
          </nav>
        </header>

        {/* Academic Progress */}
        <section id="progress" className="mt-8 scroll-mt-24">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎓</span>
                <h2 className="text-xl font-semibold text-gray-900">Academic Progress</h2>
              </div>
              <span className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-sm font-medium text-white">
                Completed
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-gray-500">Total Progress</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-5xl font-extrabold text-gray-900">{completedCredits}</span>
                  <span className="text-2xl font-semibold text-gray-400">/ {requiredCredits}</span>
                </div>
                <p className="mt-1 text-gray-500">credits</p>
              </div>

              <div className="text-right">
                <div className="text-6xl font-extrabold text-gray-900">{pct}%</div>
                <div className="text-gray-500">Complete!</div>
              </div>
            </div>

            <div className="mt-6 h-4 w-full rounded-full bg-gray-100">
              <div
                className="h-4 rounded-full bg-gray-900"
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>

            {/* Requirements Breakdown */}
            <div className="mt-10">
              <div className="flex items-center gap-3">
                <span className="text-xl">📖</span>
                <h3 className="text-xl font-semibold text-gray-900">Requirements Breakdown</h3>
              </div>

              <div className="mt-6 space-y-5">
                {requirements.map((r) => {
                  const rpct = Math.round((r.done / r.req) * 100);
                  return (
                    <div key={r.label}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="h-3 w-3 rounded-full bg-gray-900" />
                          <span className="font-semibold text-gray-900">{r.label}</span>
                        </div>
                        <div className="text-gray-500">
                          {r.done} / {r.req} credits
                        </div>
                      </div>

                      <div className="mt-3 h-3 w-full rounded-full bg-gray-100">
                        <div
                          className="h-3 rounded-full bg-gray-900"
                          style={{ width: `${Math.min(100, rpct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="grid grid-cols-3 text-center">
                  <div>
                    <div className="text-3xl font-extrabold text-emerald-600">{completedCredits}</div>
                    <div className="text-gray-500">Completed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-blue-600">
                      {Math.max(0, requiredCredits - completedCredits)}
                    </div>
                    <div className="text-gray-500">Remaining</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-purple-600">{requiredCredits}</div>
                    <div className="text-gray-500">Required</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Credits distribution (NOW REAL COMPONENT) */}
          <section id="distribution" className="scroll-mt-24 lg:col-span-1">
            <CreditsDistributionCard requirements={requirements} />
          </section>

          {/* Transcript */}
          <section id="transcript" className="scroll-mt-24 lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🎓</span>
                    <h3 className="text-xl font-semibold text-gray-900">Academic Transcript</h3>
                  </div>
                  <p className="mt-2 text-gray-500">
                    {transcriptCreditsCompleted} credits completed
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-extrabold text-gray-900">
                    {cumulativeGPA.toFixed(2)}
                  </div>
                  <div className="text-gray-500">Cumulative GPA</div>
                </div>
              </div>

              <div className="mt-8 space-y-10">
                {transcriptYears.map((y) => (
                  <div key={y.year} className="border-t border-gray-200 pt-8">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <div className="text-3xl font-extrabold text-gray-900">{y.year}</div>
                        <div className="text-gray-500">Academic Year {y.academicYear}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-gray-900">{y.gpa.toFixed(2)}</div>
                        <div className="text-gray-500">{y.credits} credits</div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {y.courses.map((c) => (
                        <div
                          key={c.code}
                          className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <div className="flex items-baseline gap-3">
                                <span className="font-mono text-lg font-semibold text-gray-900">{c.code}</span>
                                <span className="text-lg font-semibold text-gray-900">{c.name}</span>
                              </div>
                              <div className="mt-2 text-gray-500">{c.category}</div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                                {c.credits} credits
                              </span>
                              <span className="inline-flex min-w-12 justify-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                                {c.grade}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
