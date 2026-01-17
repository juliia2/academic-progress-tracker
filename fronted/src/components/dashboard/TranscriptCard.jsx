import Card from "../ui/Card.jsx";
import CourseRow from "./CourseRow.jsx";

export default function TranscriptCard() {
  const cumulativeGPA = 3.75;

  // Mock data (replace later with backend)
  const years = [
    {
      year: "Year 1",
      academicYear: "2023 – 2024",
      gpa: 3.61,
      credits: 34,
      courses: [
        { code: "ENG 101", name: "English Composition I", category: "General Education", credits: 3, grade: "A", gradeVariant: "success" },
        { code: "MATH 151", name: "Calculus I", category: "General Education", credits: 4, grade: "A-", gradeVariant: "success" },
        { code: "CS 101", name: "Introduction to Programming", category: "Core Requirements", credits: 3, grade: "A", gradeVariant: "success" },
        { code: "HIST 101", name: "World History I", category: "General Education", credits: 3, grade: "B+", gradeVariant: "info" },
        { code: "PHYS 201", name: "Physics I", category: "General Education", credits: 4, grade: "B", gradeVariant: "info" },
      ],
    },
    {
      year: "Year 2",
      academicYear: "2024 – 2025",
      gpa: 3.82,
      credits: 36,
      courses: [
        { code: "CS 201", name: "Data Structures", category: "Core Requirements", credits: 4, grade: "A", gradeVariant: "success" },
        { code: "CS 210", name: "Discrete Mathematics", category: "Core Requirements", credits: 3, grade: "A-", gradeVariant: "success" },
        { code: "STAT 200", name: "Statistics I", category: "General Education", credits: 3, grade: "B+", gradeVariant: "info" },
      ],
    },
  ];

  return (
    <Card className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xl">🎓</span>
            <h3 className="text-xl font-semibold text-gray-900">
              Academic Transcript
            </h3>
          </div>
          <p className="mt-2 text-gray-500">128 credits completed</p>
        </div>

        <div className="text-right">
          <div className="text-4xl font-extrabold text-gray-900">
            {cumulativeGPA.toFixed(2)}
          </div>
          <div className="text-gray-500">Cumulative GPA</div>
        </div>
      </div>

      {/* Years */}
      <div className="mt-8 space-y-10">
        {years.map((year) => (
          <div key={year.year} className="border-t border-gray-200 pt-8">
            {/* Year header */}
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-3xl font-extrabold text-gray-900">
                  {year.year}
                </div>
                <div className="text-gray-500">
                  Academic Year {year.academicYear}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-extrabold text-gray-900">
                  {year.gpa.toFixed(2)}
                </div>
                <div className="text-gray-500">
                  {year.credits} credits
                </div>
              </div>
            </div>

            {/* Courses */}
            <div className="mt-6 space-y-4">
              {year.courses.map((course) => (
                <CourseRow key={course.code} course={course} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
