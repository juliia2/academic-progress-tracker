import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function CreditsDistributionCard({ requirements }) {
  const totalDone = requirements.reduce((sum, r) => sum + r.done, 0);

  const data = requirements.map((r) => ({
    name: r.label,
    value: r.done,
    req: r.req,
  }));

  const COLORS = ["#3b82f6", "#a855f7", "#22c55e", "#f97316"];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-xl">📊</span>
        <h3 className="text-xl font-semibold text-gray-900">
          Credits Distribution
        </h3>
      </div>

      {/* Chart */}
      <div className="mt-8 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={2}
              stroke="white"
              strokeWidth={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

        {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
        {requirements.map((r, i) => {
          const pct = totalDone
            ? Math.round((r.done / totalDone) * 100)
            : 0;

          return (
            <div key={r.label} className="flex items-start gap-3">
              <span
                className="mt-1 h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <div>
                <div className="font-medium text-gray-900">{r.label}</div>
                <div className="text-gray-500">
                  {r.done}/{r.req} ({pct}%)
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
