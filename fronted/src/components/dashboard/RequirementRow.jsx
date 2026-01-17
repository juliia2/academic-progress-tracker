import ProgressBar from "./ui/ProgressBar";

export default function RequirementRow({ item }) {
  const pct = Math.round((item.done / item.req) * 100);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full ${item.color}`} />
          <span className="font-semibold text-gray-900">{item.label}</span>
          <span className="text-yellow-500">🏅</span>
        </div>
        <div className="text-gray-500">
          {item.done} / {item.req} credits
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar value={Math.min(100, pct)} />
      </div>
    </div>
  );
}
