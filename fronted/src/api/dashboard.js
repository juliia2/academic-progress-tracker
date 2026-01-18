const API = import.meta.env.VITE_API_URL;

/**
 * Fetch the full dashboard state.
 * Backend must return UI-ready data.
 */
export async function fetchDashboardView() {
  const res = await fetch(`${API}/api/dashboard`, {
    cache: "no-store", // <-- ensures fresh data, avoids 304
  });
  if (!res.ok) throw new Error("Failed to load dashboard");
  return res.json();
}


/**
 * Mark a course as completed.
 */
export async function addCompleted(course) {
  const res = await fetch(`${API}/api/add_completed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course }),
  });

  if (!res.ok) throw new Error("Failed to add completed course");
  return res.json();
}

/**
 * Mark a course as in progress.
 */
export async function addInProgress(course) {
  const res = await fetch(`${API}/api/add_in_progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course }),
  });

  if (!res.ok) throw new Error("Failed to add in-progress course");
  return res.json();
}

/**
 * Add an elective course (user-defined).
 */
export async function addElective(courseName, credits) {
  const res = await fetch(`${API}/api/add_elective`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      courseName,
      credits,
    }),
  });

  // Handle empty responses safely
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || "Failed to add elective");
  }

  return data;
}

/**
 * Set grade for a completed course.
 */
export async function addGrade(course, grade) {
  const res = await fetch(`${API}/api/add_grade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course, grade }),
  });

  if (!res.ok) throw new Error("Failed to add grade");
  return res.json();
}
