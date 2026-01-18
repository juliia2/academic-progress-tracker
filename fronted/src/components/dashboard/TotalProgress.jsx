import ProgressBar from "./ui/ProgressBar";

export default function TotalProgress({
  completedCredits = 0,
  requiredCredits = 0,
}) {
  const req = Number(requiredCredits) || 0;
  const done = Number(completedCredits) || 0;
  const remaining = Math.max(0, req - done);

  const pct = req > 0 ? Math.round((done / req) * 100) : 0;
  const pctClamped = Math.min(100, Math.max(0, pct));

  return (
    <div>
      {/* Numeric display */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Total Progress
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-5xl font-extrabold text-sky-900">
              {done}
            </span>
            <span className="text-2xl font-semibold text-slate-400">
              / {req}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            credits
          </p>
        </div>

        <div className="text-right">
          <div className="text-6xl font-extrabold text-sky-900">
            {pct}%
          </div>
          <div className="text-sm font-medium text-slate-500">
            Complete
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <ProgressBar value={pctClamped} className="h-4" />
      </div>
    </div>
  );
}
