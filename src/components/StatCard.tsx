import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  accent?: "primary" | "accent" | "success" | "warning" | "info";
  className?: string;
}

const accentStyles = {
  primary: "from-primary/30 to-primary/5 text-primary-glow",
  accent: "from-accent/30 to-accent/5 text-accent",
  success: "from-success/30 to-success/5 text-success",
  warning: "from-warning/30 to-warning/5 text-warning",
  info: "from-info/30 to-info/5 text-info",
};

export function StatCard({ label, value, icon: Icon, hint, accent = "primary", className }: StatCardProps) {
  return (
    <div className={cn("glass relative overflow-hidden rounded-2xl p-5", className)}>
      <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br blur-2xl opacity-60", accentStyles[accent])} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br", accentStyles[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
