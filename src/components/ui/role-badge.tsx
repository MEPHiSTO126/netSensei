import { Badge } from "@/components/ui/badge";

/**
 * One label for a person's role, wherever it appears. The navbar, the sidebar
 * and the student pages used to style the same word three different ways.
 */
export function RoleBadge({
  role,
  className,
}: {
  role: "STUDENT" | "TUTOR";
  className?: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={`text-xs font-semibold uppercase tracking-wider ${className ?? ""}`}
    >
      {role === "TUTOR" ? "Tutor" : "Student"}
    </Badge>
  );
}
