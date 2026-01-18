import { useEffect, useRef, useState } from "react";
import { addCompleted, addInProgress, addGrade } from "../../api/dashboard";
import Card from "./ui/Card";

const GRADES = ["A+", "A", "A-", "B+", "B", "C+", "C", "D+", "D", "E", "F", "ABS", "EIN"];

export default function CourseActionsCard({
  availableCourses = [],
  completedCourses = [],
  onUpdated,
}) {
  const [course, setCourse] = useState("");
  const [inProgCourse, setInProgCourse] = useState("");
  const [gradeCourse, setGradeCourse] = useState("");
  const [grade, setGrade] = useState("A");
  const [electiveName, setElectiveName] = useState("");
  const [electiveCredits, setElectiveCredits] = useState("3");
  const [status, setStatus] = useState("");

  const timerRef = useRef(null);

  // Keep selections valid when backend data changes
  useEffect(() => {
    setCourse((prev) =>
      availableCourses.includes(prev) ? prev : (availableCourses[0] || "")
    );

    setInProgCourse((prev) =>
      availableCourses.includes(prev) ? prev : (availableCourses[0] || "")
    );

    setGradeCourse((prev) =>
      completedCourses.includes(prev) ? prev : (completedCourses[0] || "")
    );
  }, [availableCourses, completedCourses]);

  // Cleanup any pending timeout
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function run(action) {
    try {
      setStatus("Saving...");
      await action();
      setStatus("Saved ✅");

      onUpdated?.();

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setStatus(""), 1200);
    } catch (e) {
      setStatus(e?.message || "Error");
    }
  }

  async function handleAddElective() {
    if (!electiveName.trim()) {
      setStatus("Please enter course name");
      return;
    }

    const credits = parseInt(electiveCredits);
    if (isNaN(credits) || credits <= 0) {
      setStatus("Please enter valid credits");
      return;
    }

    await run(async () => {
      // You'll need to implement this API endpoint
      const response = await fetch("/api/dashboard/elective", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseName: electiveName.trim(),
          credits,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add elective");
      }

      setElectiveName("");
      setElectiveCredits("3");
    });
  }

  return (
    <Card className="h-full p-6">
      <div className="flex items-center gap-3">
        <span className="text-xl">➕</span>
        <div>
          <h3 className="text-xl font-semibold text-sky-900">Update Courses</h3>
          <p className="mt-1 text-sm text-slate-500">
            Add completed/in-progress courses and grades
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Add completed */}
        <div>
          <div className="text-sm font-semibold text-slate-900">
            Mark as completed
          </div>
          <div className="mt-2 flex gap-2">
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              disabled={availableCourses.length === 0}
            >
              {availableCourses.length === 0 ? (
                <option value="">No courses available</option>
              ) : (
                availableCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))
              )}
            </select>

            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
              onClick={() => run(() => addCompleted(course))}
              disabled={!course}
            >
              Add
            </button>
          </div>
        </div>

        {/* Add in progress */}
        <div>
          <div className="text-sm font-semibold text-slate-900">
            Mark as in progress
          </div>
          <div className="mt-2 flex gap-2">
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={inProgCourse}
              onChange={(e) => setInProgCourse(e.target.value)}
              disabled={availableCourses.length === 0}
            >
              {availableCourses.length === 0 ? (
                <option value="">No courses available</option>
              ) : (
                availableCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))
              )}
            </select>

            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
              onClick={() => run(() => addInProgress(inProgCourse))}
              disabled={!inProgCourse}
            >
              Add
            </button>
          </div>
        </div>

        {/* Add elective */}
        <div>
          <div className="text-sm font-semibold text-slate-900">
            Add elective course
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Course name"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={electiveName}
              onChange={(e) => setElectiveName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Credits"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={electiveCredits}
              onChange={(e) => setElectiveCredits(e.target.value)}
              min="1"
            />

            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
              onClick={handleAddElective}
              disabled={!electiveName.trim()}
            >
              Add
            </button>
          </div>
        </div>

        {/* Add grade */}
        <div>
          <div className="text-sm font-semibold text-slate-900">Set grade</div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={gradeCourse}
              onChange={(e) => setGradeCourse(e.target.value)}
              disabled={completedCourses.length === 0}
            >
              {completedCourses.length === 0 ? (
                <option value="">No completed courses</option>
              ) : (
                completedCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))
              )}
            </select>

            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
              onClick={() => run(() => addGrade(gradeCourse, grade))}
              disabled={!gradeCourse}
            >
              Save
            </button>
          </div>
        </div>

        {status ? (
          <div className="text-sm text-slate-500">{status}</div>
        ) : null}
      </div>
    </Card>
  );
}
