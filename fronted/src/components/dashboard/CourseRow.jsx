import Badge from "./ui/Badge";

function categoryDot(category) {
  if (category === "General Education") return "bg-blue-500";
  if (category === "Core Requirements") return "bg-purple-500";
  if (category === "Major Courses") return "bg-green-500";
  return "bg-orange-500";
}

export default function CourseRow({ course }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-lg font-semibold text-gray-900">{course.code}</span>
            <span className="text-lg font-semibold text-gray-900">{course.name}</span>
          </div>

          <div className="mt-2 flex items-center gap-3 text-gray-500">
            <span className={`h-2.5 w-2.5 rounded-full ${categoryDot(course.category)}`} />
            <span>{course.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="default">{course.credits} credits</Badge>
          <Badge variant={course.gradeVariant || "success"} className="min-w-12 justify-center">
            {course.grade}
          </Badge>
        </div>
      </div>
    </div>
  );
}
