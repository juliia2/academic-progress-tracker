import CourseRow from "./CourseRow.jsx";

export default function YearSection({ year }) {
  if (!year) return null;

  const hasStats = year.gpa !== undefined && year.credits !== undefined;

  return (
    <div className="border-t border-slate-200 pt-8">
      {/* Year header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-3xl font-extrabold text-slate-900">
            {year.year}
          </div>
          <div className="text-sm text-slate-500">
            Academic Year {year.academicYear}
          </div>
        </div>

        {hasStats && (
          <div className="text-right">
            <div className="text-2xl font-extrabold text-slate-900">
              {Number(year.gpa).toFixed(2)}
            </div>
            <div className="text-sm text-slate-500">
              {year.credits} credits
            </div>
          </div>
        )}
      </div>

      {/* Courses */}
      {year.courses && year.courses.length > 0 && (
        <div className="mt-6 space-y-4">
          {year.courses.map((course, idx) => (
            <CourseRow key={course.code || idx} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
