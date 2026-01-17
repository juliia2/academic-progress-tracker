const links = [
  { id: 1, href: "#progress", text: "Progress" },
  { id: 2, href: "#distribution", text: "Distribution" },
  { id: 3, href: "#transcript", text: "Transcript" },
];

export default function DashboardHeader() {
  return (
    <header id="top" className="pb-6">
      {/* Title */}
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
        Academic Progress Tracker
      </h1>

      {/* Subtitle */}
      <p className="mt-2 text-lg text-gray-500">
        Bachelor of Science in Computer Science • Expected Graduation: May 2027
      </p>

      {/* Section Nav */}
      <nav className="mt-6">
        <div className="inline-flex gap-2 rounded-full border border-gray-200 bg-white p-1 shadow-sm">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
            >
              {l.text}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
