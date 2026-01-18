import ProgressBar from "./ui/ProgressBar";

export default function RequirementRow({ item }) {
  const done = Number(item?.done) || 0;
  const req = Number(item?.req) || 0;
  const pct = req > 0 ? Math.round((done / req) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Keep the dot subtle (avoid rainbow UI) */}
          <span
            className={`h-3 w-3 rounded-full bg-slate-300 ${
              item?.color ? `ring-1 ring-slate-200 ${item.color}` : ""
            }`}
          />
          <span className="font-semibold text-slate-900">{item.label}</span>

          {/* Medal should not scream */}
          <span className="text-slate-400" aria-hidden="true">
            🏅
          </span>
        </div>

        <div className="text-sm text-slate-500">
          {done} / {req} credits
        </div>
      </div>

      <div className="mt-3">
        {/* Make row progress bars muted, keep hero bar strong elsewhere */}
        <ProgressBar value={Math.min(100, Math.max(0, pct))} fillClassName="bg-slate-400" />
      </div>
    </div>
  );
}


