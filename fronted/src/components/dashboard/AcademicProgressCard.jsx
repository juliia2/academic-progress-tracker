import Card from "./ui/Card";
import Badge from "./ui/Badge";
import ProgressBar from "./ui/ProgressBar";
import RequirementRow from "./RequirementRow";

export default function AcademicProgressCard() {
  // Mock data (replace with API later)
  const requiredCredits = 120;
  const completedCredits = 146;

  const pct = Math.round((completedCredits / requiredCredits) * 100);

  const requirements = [
    { label: "General Education", color: "bg-blue-500", done: 30, req: 30 },
    { label: "Core Requirements", color: "bg-purple-500", done: 50, req: 45 },
    { label: "Major Courses", color: "bg-green-500", done: 30, req: 30 },
    { label: "Electives", color: "bg-orange-500", done: 36, req: 15 },
  ];

  const remaining = Math.max(0, requiredCredits - completedCredits);

  return (
    <Card className="p-8">
      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">🎓</span>
          <h2 className="text-xl font-semibold text-gray-900">Academic Progress</h2>
        </div>
        <Badge variant="dark">Completed</Badge>
      </div>

      {/* Total progress */}
      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-gray-500">Total Progress</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-5xl font-extrabold text-gray-900">
              {completedCredits}
            </span>
            <span className="text-2xl font-semibold text-gray-400">/ {requiredCredits}</span>
          </div>
          <p className="mt-1 text-gray-500">credits</p>
        </div>

        <div className="text-right">
          <div className="text-6xl font-extrabold text-gray-900">{pct}%</div>
          <div className="text-gray-500">Complete!</div>
        </div>
      </div>

      <div className="mt-6">
        <ProgressBar value={Math.min(100, pct)} className="h-4" />
      </div>

      {/* Requirements Breakdown */}
      <div className="mt-10">
        <div className="flex items-center gap-3">
          <span className="text-xl">📖</span>
          <h3 className="text-xl font-semibold text-gray-900">Requirements Breakdown</h3>
        </div>

        <div className="mt-6 space-y-5">
          {requirements.map((r) => (
            <RequirementRow key={r.label} item={r} />
          ))}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="grid grid-cols-3 text-center">
            <div>
              <div className="text-3xl font-extrabold text-emerald-600">{completedCredits}</div>
              <div className="text-gray-500">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-600">{remaining}</div>
              <div className="text-gray-500">Remaining</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-purple-600">{requiredCredits}</div>
              <div className="text-gray-500">Required</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
