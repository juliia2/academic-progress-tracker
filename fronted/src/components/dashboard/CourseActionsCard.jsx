import { useEffect, useRef, useState } from "react";
import { addCompleted, addInProgress, addGrade } from "../../api/dashboard";

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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-xl">➕</span>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Update Courses</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add completed/in-progress courses and grades
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Add completed */}
        <div>
          <div className="text-sm font-semibold text-gray-900">Mark as completed</div>
          <div className="mt-2 flex gap-2">
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
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
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
              onClick={() => run(() => addCompleted(course))}
              disabled={!course}
            >
              Add
            </button>
          </div>
        </div>

        {/* Add in progress */}
        <div>
          <div className="text-sm font-semibold text-gray-900">Mark as in progress</div>
          <div className="mt-2 flex gap-2">
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
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
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
              onClick={() => run(() => addInProgress(inProgCourse))}
              disabled={!inProgCourse}
            >
              Add
            </button>
          </div>
        </div>

        {/* Add grade */}
        <div>
          <div className="text-sm font-semibold text-gray-900">Set grade</div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <select
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
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
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
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
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
              onClick={() => run(() => addGrade(gradeCourse, grade))}
              disabled={!gradeCourse}
            >
              Save
            </button>
          </div>
        </div>

        {status ? <div className="text-sm text-gray-500">{status}</div> : null}
      </div>
    </div>
  );
}
