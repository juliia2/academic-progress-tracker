import crypto from "crypto";

let userId = localStorage.getItem("userId");
if (!userId) {
  userId = crypto.randomUUID(); // generate a unique id
  localStorage.setItem("userId", userId);
}



//const API = "http://127.0.0.1:5000";

// Ensure no trailing slash on the base API URL
const API = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

// Helper to build URLs safely
function buildUrl(path) {
  return `${API}${path.startsWith("/") ? path : "/" + path}`;
}

export async function fetchDashboardView() {
  const res = await fetch(buildUrl("/api/dashboard"),
{
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId, // pass user ID
    },
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
    headers: { "Content-Type": "application/json", "x-user-id": userId },
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
    headers: { "Content-Type": "application/json", "x-user-id": userId },
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
    headers: { "Content-Type": "application/json", "x-user-id": userId },
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
    headers: { "Content-Type": "application/json", "x-user-id": userId },
    body: JSON.stringify({ course, grade }),
  });

  if (!res.ok) throw new Error("Failed to add grade");
  return res.json();
}




export async function resetAll() {
  if (!confirm("Are you sure you want to reset all your data?")) return;

  const res = await fetch(buildUrl("/reset_all"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
  });

  if (!res.ok) {
    alert("Failed to reset data");
    return;
  }

  alert("Your data has been reset!");
  window.location.reload(); // refresh to show empty dashboard
}
