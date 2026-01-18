import YearSection from "./YearSection.jsx";
import Card from "./ui/Card";

export default function TranscriptCard({
  cumulativeGPA = 0,
  transcriptCreditsCompleted = 0,
  transcriptYears = [],
}) {
  return (
    <Card className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xl">🎓</span>
            <h3 className="text-xl font-semibold text-sky-900">
              Academic Transcript
            </h3>
          </div>
          <p className="mt-2 text-slate-500">
            {transcriptCreditsCompleted} credits completed
          </p>
        </div>

        <div className="text-right">
          <div className="text-4xl font-extrabold text-slate-900">
            {Number.isFinite(cumulativeGPA) ? cumulativeGPA.toFixed(2) : "0.00"}
          </div>
          <div className="text-sm text-slate-500">Cumulative GPA</div>
        </div>
      </div>

      {/* Years */}
      <div className="mt-8 space-y-10">
        {transcriptYears.length === 0 ? (
          <div className="text-sm text-slate-500">No transcript data yet.</div>
        ) : (
          transcriptYears.map((year) => (
            <YearSection key={year.year} year={year} />
          ))
        )}
      </div>
    </Card>
  );
}
