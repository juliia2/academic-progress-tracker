const API = "http://127.0.0.1:5000";

function normalizeDashboard(raw) {
  // raw from FastAPI looks like:
  // {
  //   requirements: { completed: [], in_progress: [], "to do": [], electives: [] },
  //   to_do: [...],
  //   course_grades: {...},
  //   cgpa: 0.0
  // }

  const reqObj = raw?.requirements ?? {};
  const completed = Array.isArray(reqObj.completed) ? reqObj.completed : [];
  const inProgress = Array.isArray(reqObj.in_progress) ? reqObj.in_progress : [];
  const toDo = Array.isArray(raw?.to_do) ? raw.to_do : [];

  // Courses user can pick to add as completed/in-progress:
  // (everything not already completed/in_progress)
  const availableCourses = toDo;

  // UI expectations:
  // - completedCourses: array for grade dropdown
  // - cumulativeGPA
  // - transcriptCreditsCompleted, completedCredits, requiredCredits
  // For demo: assume each course is 3 credits (you can refine later).
  const creditsPerCourse = 3;
  const completedCredits = completed.length * creditsPerCourse;
  const transcriptCreditsCompleted = completedCredits;

  // If you know your program total credits, set it here.
  // Otherwise you can return 120 as default.
  const requiredCredits = 120;

  // Requirements breakdown card expects array with {label, done, req}
  // You can improve these numbers later with real program requirements.
  const requirements = [
    { label: "Completed Courses", done: completed.length, req: completed.length + inProgress.length + toDo.length },
    { label: "In Progress", done: inProgress.length, req: completed.length + inProgress.length + toDo.length },
    { label: "To Do", done: toDo.length, req: completed.length + inProgress.length + toDo.length },
    { label: "Electives", done: (Array.isArray(reqObj.electives) ? reqObj.electives.length : 0), req: 0 },
  ];

  return {
    // what DashboardPage uses
    requirements,
    transcriptYears: [],

    requiredCredits,
    completedCredits,
    cumulativeGPA: Number(raw?.cgpa ?? 0),
    transcriptCreditsCompleted,

    // what CourseActionsCard uses
    availableCourses,
    completedCourses: completed,

    // keep raw too (useful later)
    _raw: raw,
  };
}

export async function fetchDashboardView() {
  const res = await fetch(`${API}/api/dashboard`);
  if (!res.ok) throw new Error("Failed to load dashboard");
  const raw = await res.json();
  return normalizeDashboard(raw);
}

export async function addCompleted(course) {
  const res = await fetch(`${API}/api/add_completed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course }),
  });
  if (!res.ok) throw new Error("Failed to add completed course");
  return res.json();
}

export async function addInProgress(course) {
  const res = await fetch(`${API}/api/add_in_progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course }),
  });
  if (!res.ok) throw new Error("Failed to add in-progress course");
  return res.json();
}

export async function addGrade(course, grade) {
  const res = await fetch(`${API}/api/add_grade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course, grade }),
  });
  if (!res.ok) throw new Error("Failed to add grade");
  return res.json();
}
