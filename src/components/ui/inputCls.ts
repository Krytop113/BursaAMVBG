export function inputCls(hasError: boolean, extra = ""): string {
  return [
    "w-full px-3.5 py-2.5 bg-slate-950 border rounded-lg",
    "text-white placeholder-gray-600 text-sm",
    "focus:outline-none focus:ring-1 transition-all",
    extra,
    hasError
      ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-700 focus:border-teal-500 focus:ring-teal-500/30",
  ]
    .filter(Boolean)
    .join(" ");
}
