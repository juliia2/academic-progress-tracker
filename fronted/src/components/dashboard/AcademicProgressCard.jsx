import Card from "./ui/Card";
import Badge from "./ui/Badge";
import ProgressBar from "./ui/ProgressBar";
import RequirementRow from "./RequirementRow";

export default function AcademicProgressCard({
  requiredCredits = 0,
  completedCredits = 0,
  requirements = [],
}) {
  const req = Number(requiredCredits) || 0;
  const done = Number(completedCredits) || 0;

  const pct = req > 0 ? Math.round((done / req) * 100) : 0;
  const pctClamped = Math.min(100, Math.max(0, pct));

  const remaining = Math.max(0, req - done);

  const safeRequirements = Array.isArray(requirements) ? requirements : [];

  return (
    <Card className="p-8">
      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">🎓</span>
          <h2 className="text-xl font-semibold text-gray-900">Academic Progress</h2>
        </div>

        <Badge variant="dark">{done >= req && req > 0 ? "Completed" : "In progress"}</Badge>
      </div>

      {/* Total progress */}
      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-gray-500">Total Progress</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-5xl font-extrabold text-gray-900">{done}</span>
            <span className="text-2xl font-semibold text-gray-400">/ {req}</span>
          </div>
          <p className="mt-1 text-gray-500">credits</p>
        </div>

        <div className="text-right">
          <div className="text-6xl font-extrabold text-gray-900">{pct}%</div>
          <div className="text-gray-500">Complete!</div>
        </div>
      </div>

      <div className="mt-6">
        <ProgressBar value={pctClamped} className="h-4" />
      </div>

      {/* Requirements Breakdown */}
      <div className="mt-10">
        <div className="flex items-center gap-3">
          <span className="text-xl">📖</span>
          <h3 className="text-xl font-semibold text-gray-900">Requirements Breakdown</h3>
        </div>

        <div className="mt-6 space-y-5">
          {safeRequirements.map((r) => (
            <RequirementRow key={r.label} item={r} />
          ))}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="grid grid-cols-3 text-center">
            <div>
              <div className="text-3xl font-extrabold text-emerald-600">{done}</div>
              <div className="text-gray-500">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-600">{remaining}</div>
              <div className="text-gray-500">Remaining</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-purple-600">{req}</div>
              <div className="text-gray-500">Required</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
