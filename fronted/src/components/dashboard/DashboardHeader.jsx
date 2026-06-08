import { useEffect, useMemo, useState } from "react";

const links = [
  { id: 1, href: "#progress", text: "Academic Progress" },
  { id: 2, href: "#update-courses", text: "Update Courses" },
  { id: 3, href: "#distribution", text: "Credits Distribution" },
  { id: 4, href: "#transcript", text: "Transcript" },
];

export default function DashboardHeader({ onReset }) {
  const sectionIds = useMemo(
    () => links.map((l) => l.href.replace("#", "")),
    []
  );

  // Initialize active from URL hash, or default to first section
  const [active, setActive] = useState(
    () => window.location.hash || "#progress"
  );

  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (els.length === 0) return;

    // ScrollSpy: pick the section closest to the top "reading line"
    const observer = new IntersectionObserver(
      (entries) => {
        // Only consider visible entries
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;

        // Choose the one with the smallest distance to the top
        visible.sort((a, b) => {
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });

        const id = visible[0].target.id;
        setActive(`#${id}`);

        // Optional: keep URL in sync without jumping
        window.history.replaceState(null, "", `#${id}`);
      },
      {
        // This makes "active" switch when section crosses a line ~25% from top
        root: null,
        rootMargin: "-25% 0px -65% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 1],
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <header id="top" className="pb-6">
      {/* Title */}
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
        uDash
      </h1>

      {/* Subtitle */}
      <p className="mt-2 text-lg text-slate-500">
        Bachelor of Science in Computer Science • Expected Graduation: May 2029
      </p>

      {/* Section Nav + Reset button on the same row */}
      <nav className="mt-6 flex items-center justify-between">
        <div className="inline-flex gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {links.map((l) => {
            const isActive = active === l.href;

            return (
              <a
                key={l.id}
                href={l.href}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")}
              >
                {l.text}
              </a>
            );
          })}
        </div>

        {/* Reset button — outside the pill, right-aligned */}
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-500 shadow-sm hover:bg-red-50 hover:text-red-600 transition"
        >
          Reset All Data
        </button>
      </nav>
    </header>
  );
}
