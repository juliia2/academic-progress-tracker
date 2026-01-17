import { useEffect, useState } from "react";
import { fetchDashboardView } from "../api/dashboard";
import CourseActionsCard from "../components/dashboard/CourseActionsCard.jsx";
import CreditsDistributionCard from "../components/dashboard/CreditsDistributionCard.jsx";

export default function DashboardPage() {
  const links = [
    { id: 1, href: "#progress", text: "Progress" },
    { id: 2, href: "#distribution", text: "Distribution" },
    { id: 3, href: "#transcript", text: "Transcript" },
  ];

  const [ui, setUi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const json = await fetchDashboardView();
      setUi(json);
    } catch (e) {
      setError(e?.message || "Failed to load dashboard");
      setUi(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="text-sm text-gray-500">Loading…</div>
        </div>
      </div>
    );
  }

  if (error || !ui) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="text-sm text-red-600">
            {error || "Failed to load dashboard"}
          </div>
          <button
            onClick={load}
            className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const requirements = Array.isArray(ui.requirements) ? ui.requirements : [];
  const transcriptYears = Array.isArray(ui.transcriptYears) ? ui.transcriptYears : [];

  const requiredCredits = Number(ui.requiredCredits ?? 0);
  const completedCredits = Number(ui.completedCredits ?? 0);
  const pct = requiredCredits > 0 ? Math.round((completedCredits / requiredCredits) * 100) : 0;

  const cumulativeGPA = Number(ui.cumulativeGPA ?? 0);
  const transcriptCreditsCompleted = Number(ui.transcriptCreditsCompleted ?? 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
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
                <h2 className="text-xl font-semibold text-gray-900">
                  Academic Progress
                </h2>
              </div>
              <span className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-sm font-medium text-white">
                Completed
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-gray-500">Total Progress</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-5xl font-extrabold text-gray-900">
                    {completedCredits}
                  </span>
                  <span className="text-2xl font-semibold text-gray-400">
                    / {requiredCredits}
                  </span>
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
          </div>
        </section>

        {/* Bottom grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT COLUMN: make the SMALL card the functional one */}
          <section className="lg:col-span-1">
            <CourseActionsCard
              availableCourses={ui.availableCourses || []}
              completedCourses={ui.completedCourses || []}
              onUpdated={load}
            />

            <div id="distribution" className="mt-6 scroll-mt-24">
              <CreditsDistributionCard requirements={requirements} />
            </div>
          </section>

          {/* Transcript */}
          <section id="transcript" className="scroll-mt-24 lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🎓</span>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Academic Transcript
                    </h3>
                  </div>
                  <p className="mt-2 text-gray-500">
                    {transcriptCreditsCompleted} credits completed
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-extrabold text-gray-900">
                    {Number.isFinite(cumulativeGPA) ? cumulativeGPA.toFixed(2) : "0.00"}
                  </div>
                  <div className="text-gray-500">Cumulative GPA</div>
                </div>
              </div>

              <div className="mt-8 space-y-10">
                {transcriptYears.length === 0 ? (
                  <div className="text-sm text-gray-500">No transcript data yet.</div>
                ) : (
                  transcriptYears.map((y) => (
                    <div key={y.year} className="border-t border-gray-200 pt-8">
                      <div className="text-3xl font-extrabold text-gray-900">{y.year}</div>
                      <div className="text-gray-500">Academic Year {y.academicYear}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
