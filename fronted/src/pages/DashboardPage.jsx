import { useEffect, useState } from "react";
import { fetchDashboardView } from "../api/dashboard";
import CourseActionsCard from "../components/dashboard/CourseActionsCard.jsx";
import CreditsDistributionCard from "../components/dashboard/CreditsDistributionCard.jsx";
import AcademicProgressCard from "../components/dashboard/AcademicProgressCard.jsx";
import TranscriptCard from "../components/dashboard/TranscriptCard.jsx";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";

export default function DashboardPage() {
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
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="text-sm text-slate-500">Loading…</div>
        </div>
      </div>
    );
  }

  if (error || !ui) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="text-sm text-red-600">
            {error || "Failed to load dashboard"}
          </div>

          <button
            onClick={load}
            className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const requirements = Array.isArray(ui.requirements) ? ui.requirements : [];
  const transcriptYears = Array.isArray(ui.transcriptYears)
    ? ui.transcriptYears
    : [];

  const cumulativeGPA = Number(ui.cumulativeGPA ?? 0);
  const transcriptCreditsCompleted = Number(ui.transcriptCreditsCompleted ?? 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <DashboardHeader />

        {/* AcademicProgressCard */}
        <section id="progress" className="mt-8 scroll-mt-24">
          <AcademicProgressCard
            requiredCredits={Number(ui.requiredCredits ?? 0)}
            completedCredits={Number(ui.completedCredits ?? 0)}
            requirements={requirements}
          />
        </section>

        {/* Top grid - Course Actions and Credits Distribution side by side */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section
            id="update-courses"
            className="flex scroll-mt-24 lg:col-span-1"
          >
            <div className="h-full w-full">
              <CourseActionsCard
                availableCourses={ui.availableCourses || []}
                completedCourses={ui.completedCourses || []}
                onUpdated={load}
              />
            </div>
          </section>

          <section
            id="distribution"
            className="flex scroll-mt-24 lg:col-span-1"
          >
            <div className="h-full w-full">
              <CreditsDistributionCard requirements={requirements} />
            </div>
          </section>
        </div>

        {/* Transcript - Full width below */}
        <section id="transcript" className="mt-8 scroll-mt-24">
          <TranscriptCard
            cumulativeGPA={cumulativeGPA}
            transcriptCreditsCompleted={transcriptCreditsCompleted}
            transcriptYears={transcriptYears}
          />
        </section>
      </div>
    </div>
  );
}
