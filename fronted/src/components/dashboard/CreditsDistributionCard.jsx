import React, { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import Card from "./ui/Card";

// Slightly softer, calmer palette (still distinct categories)
const COLORS = ["#2563eb", "#7c3aed", "#16a34a", "#ea580c"]; // blue, purple, green, orange

function pct(done, req) {
  if (!req || req <= 0) return 0;
  return Math.round((done / req) * 100);
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const d = payload[0].payload;
  const done = Number(d.done ?? 0);
  const req = Number(d.req ?? 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-lg">
      <div className="text-lg font-extrabold text-slate-900">{d.label}</div>

      <div className="mt-1 text-sm text-slate-600">
        Completed:{" "}
        <span className="font-semibold text-slate-900">{done}</span> credits
      </div>

      <div className="text-sm text-slate-600">
        Required:{" "}
        <span className="font-semibold text-slate-900">{req}</span> credits
      </div>

      <div className="text-sm text-slate-600">
        Progress:{" "}
        <span className="font-semibold text-slate-900">
          {pct(done, req)}%
        </span>
      </div>
    </div>
  );
};

export default function CreditsDistributionCard({ requirements = [] }) {
  const data = useMemo(() => {
    const list = Array.isArray(requirements) ? requirements : [];

    return list.map((r, i) => {
      const req = Number(r.req ?? 0);
      const done = Number(r.done ?? 0);
      return {
        label: r.label ?? `Category ${i + 1}`,
        req,
        done,
        // slice sizes based on required credits distribution
        value: Math.max(0, req),
      };
    });
  }, [requirements]);

  const totals = useMemo(() => {
    const totalReq = data.reduce((s, d) => s + (Number.isFinite(d.req) ? d.req : 0), 0);
    const totalDone = data.reduce((s, d) => s + (Number.isFinite(d.done) ? d.done : 0), 0);
    const totalPct = totalReq > 0 ? Math.round((totalDone / totalReq) * 100) : 0;
    return { totalReq, totalDone, totalPct };
  }, [data]);

  if (totals.totalReq <= 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <span className="text-xl">📊</span>
          <h3 className="text-lg font-semibold text-sky-900">
            Credits Distribution
          </h3>
        </div>
        <div className="mt-4 text-sm text-slate-500">
          No requirements data yet.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <span className="text-xl">📊</span>
        <h3 className="text-lg font-semibold text-sky-900">
          Credits Distribution
        </h3>
      </div>

      {/* Chart */}
      <div className="relative mt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="48%"
              innerRadius="62%"
              outerRadius="82%"
              paddingAngle={2}
              isAnimationActive={false}
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center KPI */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-slate-900">
              {totals.totalPct}%
            </div>
            <div className="mt-1 text-sm text-slate-500">
              {totals.totalDone} / {totals.totalReq} credits
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-5">
        {data.map((d, idx) => {
          const color = COLORS[idx % COLORS.length];
          const p = pct(d.done, d.req);

          return (
            <div key={d.label} className="flex items-start gap-3">
              <span
                className="mt-2 h-4 w-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div className="min-w-0">
                <div className="truncate text-base font-extrabold text-slate-900">
                  {d.label}
                </div>
                <div className="text-sm text-slate-500">
                  {d.done}/{d.req} ({p}%)
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
