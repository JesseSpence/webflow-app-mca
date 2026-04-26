const colours: Record<string, string> = {
  published: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800",
  archived: "bg-gray-100 text-gray-600",
  page: "bg-blue-100 text-blue-800",
  section_only: "bg-purple-100 text-purple-800",
  faq_only: "bg-orange-100 text-orange-800",
  hold: "bg-red-100 text-red-700",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colours[value] ?? "bg-gray-100 text-gray-700"}`}>
      {value}
    </span>
  );
}
