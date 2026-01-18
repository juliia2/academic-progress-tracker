import RequirementRow from "./RequirementRow";

export default function RequirementsBreakdown({ requirements = [] }) {
  const safeRequirements = Array.isArray(requirements) ? requirements : [];

  // Calculate totals
  const done = safeRequirements.reduce((sum, r) => sum + (Number(r.done) || 0), 0);
  const req = safeRequirements.reduce((sum, r) => sum + (Number(r.req) || 0), 0);
  const remaining = Math.max(0, req - done);

  if (safeRequirements.length === 0) {
    return (
      <div>
        <div className="flex items-center gap-3">
          <span className="text-xl">📖</span>
          <h3 className="text-xl font-semibold text-sky-900">
            Requirements Breakdown
          </h3>
        </div>
        <div className="mt-6 text-sm text-slate-500">
          No requirements data yet.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-xl">📖</span>
        <h3 className="text-xl font-semibold text-sky-900">
          Requirements Breakdown
        </h3>
      </div>

      {/* Requirements list */}
      <div className="mt-6 space-y-5">
        {safeRequirements.map((r) => (
          <RequirementRow key={r.label} item={r} />
        ))}
      </div>

      {/* Summary statistics */}
      <div className="mt-8 border-t border-slate-200 pt-8">
        <div className="grid grid-cols-3 text-center">
          <div>
            <div className="text-3xl font-extrabold text-emerald-700">
              {done}
            </div>
            <div className="text-sm text-slate-500">Completed</div>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-sky-900">
              {remaining}
            </div>
            <div className="text-sm text-slate-500">Remaining</div>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-slate-700">
              {req}
            </div>
            <div className="text-sm text-slate-500">Required</div>
          </div>
        </div>
      </div>
    </div>
  );
}
