import { cn } from "@/lib/utils";
import type { ExamStatus } from "@/lib/types";

export function StatusBadge({ status, className }: { status: ExamStatus; className?: string }) {
  const styles: Record<ExamStatus, string> = {
    Live: "bg-success/15 text-success border-success/30",
    Upcoming: "bg-info/15 text-info border-info/30",
    Completed: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[status],
        className
      )}
    >
      {status === "Live" && <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-success" />}
      {status}
    </span>
  );
}
