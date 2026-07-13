import CourseRow from "./CourseRow.jsx";

export default function YearSection({ year }) {
  if (!year) return null;

  return (
    <div className="border-t border-slate-200 pt-8">
      {/* Courses */}
      {year.courses && year.courses.length > 0 && (
        <div className="space-y-4">
          {year.courses.map((course, idx) => (
            <CourseRow key={course.code || idx} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
