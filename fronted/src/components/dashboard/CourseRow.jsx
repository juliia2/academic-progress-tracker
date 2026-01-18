import Badge from "./ui/Badge";
import Card from "./ui/Card";

function categoryDot(category) {
  // Calmer, muted dots (no neon)
  if (category === "General Education") return "bg-sky-700";
  if (category === "Core Requirements") return "bg-violet-700";
  if (category === "Major Courses") return "bg-emerald-700";
  return "bg-orange-700";
}

export default function CourseRow({ course }) {
  return (
    <Card className="px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-lg font-semibold text-slate-900">
              {course.code}
            </span>
            <span className="text-lg font-semibold text-slate-900">
              {course.name}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3 text-slate-500">
            <span
              className={`h-2.5 w-2.5 rounded-full ${categoryDot(course.category)}`}
            />
            <span>{course.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="default">{course.credits} credits</Badge>
          <Badge
            variant={course.gradeVariant || "success"}
            className="min-w-12 justify-center"
          >
            {course.grade}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
