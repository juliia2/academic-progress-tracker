import Card from "./ui/Card";
import Badge from "./ui/Badge";
import TotalProgress from "./TotalProgress";
import RequirementsBreakdown from "./RequirementsBreakdown";

export default function AcademicProgressCard({
  requiredCredits = 0,
  completedCredits = 0,
  requirements = [],
}) {
  const req = Number(requiredCredits) || 0;
  const done = Number(completedCredits) || 0;

  const safeRequirements = Array.isArray(requirements) ? requirements : [];

  return (
    <Card className="p-8">
      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">🎓</span>
          <h2 className="text-xl font-semibold text-sky-900">
            Academic Progress
          </h2>
        </div>

        <Badge variant={done >= req && req > 0 ? "success" : "info"}>
          {done >= req && req > 0 ? "Completed" : "In progress"}
        </Badge>
      </div>

      {/* Total progress */}
      <div className="mt-8">
        <TotalProgress
          completedCredits={done}
          requiredCredits={req}
        />
      </div>

      {/* Requirements Breakdown */}
      <div className="mt-10">
        <RequirementsBreakdown requirements={safeRequirements} />
      </div>
    </Card>
  );
}
