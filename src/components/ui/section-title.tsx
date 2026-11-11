/**
 * The section heading used across the app. Desk pages and student pages had
 * two different heading systems, which made the same page type look like two
 * different products.
 */
export function SectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-base font-semibold uppercase tracking-wider text-muted-foreground ${className}`}
    >
      {children}
    </h2>
  );
}
