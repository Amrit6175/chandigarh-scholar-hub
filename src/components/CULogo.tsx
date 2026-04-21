import { GraduationCap } from "lucide-react";

export function CULogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";
  return (
    <div className="flex items-center gap-3">
      <div className={`${dims} relative grid place-items-center rounded-xl bg-gradient-primary shadow-glow`}>
        <GraduationCap className="h-1/2 w-1/2 text-primary-foreground" strokeWidth={2.4} />
        <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
      </div>
      <div className="leading-tight">
        <div className={`font-display font-bold tracking-tight ${text}`}>Chandigarh University</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Online Examination System
        </div>
      </div>
    </div>
  );
}
