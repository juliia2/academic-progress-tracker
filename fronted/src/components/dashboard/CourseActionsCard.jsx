import { useEffect, useMemo, useRef, useState } from "react";
import { addCompleted, addInProgress, addGrade, addElective, removeInProgress } from "../../api/dashboard";
import Card from "./ui/Card";

const GRADES = ["A+", "A", "A-", "B+", "B", "C+", "C", "D+", "D", "E", "F", "ABS", "EIN"];

export default function CourseActionsCard({
  availableCourses = [],
  inProgressCourses = [],
  onUpdated,
}) {
  // Track user's dropdown selection; fall back to first available if current is no longer valid
  const [selectedRequired, setSelectedRequired] = useState("");
  const validSelected = availableCourses.includes(selectedRequired)
    ? selectedRequired
    : availableCourses[0] || "";

  const [electiveSearch, setElectiveSearch] = useState("");
  const [freeElectives, setFreeElectives] = useState({});
  const [inProgressGrades, setInProgressGrades] = useState({});
  const [status, setStatus] = useState("");
  const timerRef = useRef(null);

  // Fetch free electives catalog once on mount
  useEffect(() => {
    fetch("/freeElectives.json")
      .then((r) => r.json())
      .then(setFreeElectives)
      .catch(() => {});
  }, []);

  // Derive search results directly — no effect needed
  const electiveResults = useMemo(() => {
    if (!electiveSearch.trim()) return [];
    const q = electiveSearch.toLowerCase();
    return Object.entries(freeElectives)
      .filter(([code, info]) =>
        code.toLowerCase().includes(q) || info.name.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [electiveSearch, freeElectives]);

  // Cleanup timer on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  async function run(action) {
    try {
      setStatus("Saving...");
      await action();
      setStatus("Saved ✅");
      onUpdated?.();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setStatus(""), 1500);
    } catch (e) {
      setStatus(e?.message || "Error");
    }
  }

  async function handleComplete(course) {
    const grade = inProgressGrades[course] || "A";
    await run(async () => {
      await addCompleted(course);
      await addGrade(course, grade);
    });
  }

  return (
    <Card className="h-full p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl">➕</span>
        <div>
          <h3 className="text-xl font-semibold text-sky-900">Update Courses</h3>
          <p className="mt-1 text-sm text-slate-500">Manage your courses and progress</p>
        </div>
      </div>

      <div className="space-y-6">

        {/* Required Courses */}
        <div>
          <div className="text-sm font-semibold text-slate-900 mb-2">Required Courses</div>
          <div className="flex gap-2">
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={validSelected}
              onChange={(e) => setSelectedRequired(e.target.value)}
              disabled={availableCourses.length === 0}
            >
              {availableCourses.length === 0 ? (
                <option value="">All courses added</option>
              ) : (
                availableCourses.map((c) => <option key={c} value={c}>{c}</option>)
              )}
            </select>
            <button
              type="button"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
              onClick={() => run(() => addInProgress(validSelected))}
              disabled={!validSelected}
            >
              Add
            </button>
          </div>
        </div>

        {/* Elective Search */}
        <div>
          <div className="text-sm font-semibold text-slate-900 mb-2">Add Elective</div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by course code or name..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={electiveSearch}
              onChange={(e) => setElectiveSearch(e.target.value)}
            />
            {electiveResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden">
                {electiveResults.map(([code, info]) => (
                  <button
                    key={code}
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-0"
                    onClick={() => {
                      run(async () => {
                        await addElective(code, info.credits);
                        await addInProgress(code); // move to in progress immediately
                      });
                      setElectiveSearch(""); // clearing search clears results via useMemo
                    }}
                  >
                    <span className="font-mono font-semibold text-slate-800">{code}</span>
                    <span className="ml-2 text-slate-500">{info.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* In Progress Display */}
        {inProgressCourses.length > 0 && (
          <div>
            <div className="text-sm font-semibold text-slate-900 mb-2">In Progress</div>
            <div className="space-y-2">
              {inProgressCourses.map((course) => (
                <div key={course} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                    onClick={() => run(() => removeInProgress(course))}
                    title="Remove from in progress"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                  <span className="flex-1 font-mono text-sm font-semibold text-slate-800">{course}</span>
                  <select
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                    value={inProgressGrades[course] || "A"}
                    onChange={(e) => setInProgressGrades((prev) => ({ ...prev, [course]: e.target.value }))}
                  >
                    {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-600 px-3 py-1 text-sm font-semibold text-white hover:bg-emerald-700"
                    onClick={() => handleComplete(course)}
                  >
                    Complete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {status && <div className="text-sm text-slate-500">{status}</div>}
      </div>
    </Card>
  );
}
