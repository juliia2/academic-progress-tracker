import Card from "./ui/Card";

export default function ProgressSummary({
  cumulativeGPA = 0,
  completedCredits = 0,
  requiredCredits = 0,
  remainingSemesters = null,
}) {
  const remaining = Math.max(0, requiredCredits - completedCredits);
  const pct =
    requiredCredits > 0
      ? Math.round((completedCredits / requiredCredits) * 100)
      : 0;

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-xl">📊</span>
        <h3 className="text-lg font-semibold text-sky-900">Quick Stats</h3>
      </div>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        {/* GPA */}
        <div>
          <div className="text-3xl font-extrabold text-slate-900">
            {Number.isFinite(cumulativeGPA) ? cumulativeGPA.toFixed(2) : "0.00"}
          </div>
          <div className="mt-1 text-sm text-slate-500">Cumulative GPA</div>
        </div>

        {/* Progress Percentage (primary) */}
        <div>
          <div className="text-3xl font-extrabold text-sky-900">{pct}%</div>
          <div className="mt-1 text-sm text-slate-500">Progress</div>
        </div>

        {/* Credits Completed (success only) */}
        <div>
          <div className="text-3xl font-extrabold text-emerald-700">
            {completedCredits}
          </div>
          <div className="mt-1 text-sm text-slate-500">Credits Completed</div>
        </div>

        {/* Credits Remaining (primary, not bright blue) */}
        <div>
          <div className="text-3xl font-extrabold text-sky-900">
            {remaining}
          </div>
          <div className="mt-1 text-sm text-slate-500">Credits Remaining</div>
        </div>
      </div>

      {/* Optional: Remaining Semesters */}
      {remainingSemesters !== null && (
        <div className="mt-6 border-t border-slate-200 pt-6">
          <div className="text-center">
            <div className="text-2xl font-extrabold text-slate-900">
              {remainingSemesters}
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Semester{remainingSemesters !== 1 ? "s" : ""} Remaining
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
