export default function Badge({ children, variant = "default", className = "" }) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium";
  const styles = {
    default: "bg-gray-100 text-gray-700",
    dark: "bg-gray-900 text-white",
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    info: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  };

  return <span className={`${base} ${styles[variant]} ${className}`}>{children}</span>;
}
