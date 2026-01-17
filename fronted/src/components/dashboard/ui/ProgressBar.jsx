export default function ProgressBar({ value, className = "" }) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;

  return (
    <div className={`h-3 w-full rounded-full bg-gray-100 ${className}`}>
      <div
        className="h-3 rounded-full bg-gray-900"
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}
