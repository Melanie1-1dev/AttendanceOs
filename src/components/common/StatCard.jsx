import React from "react";
import { cn } from "@/lib/utils";
import AnimatedNumber from "@/components/common/AnimatedNumber";

const TONES = {
  indigo: {
    icon: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
    glow: "from-indigo-500/10",
    accent: "bg-indigo-500",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
    glow: "from-emerald-500/10",
    accent: "bg-emerald-500",
  },
  rose: {
    icon: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
    glow: "from-rose-500/10",
    accent: "bg-rose-500",
  },
  amber: {
    icon: "bg-amber-500/12 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
    glow: "from-amber-500/10",
    accent: "bg-amber-500",
  },
  slate: {
    icon: "bg-slate-500/10 text-slate-600 dark:bg-slate-400/15 dark:text-slate-300",
    glow: "from-slate-500/10",
    accent: "bg-slate-400",
  },
};

export default function StatCard({ icon: Icon, label, value, hint, tone = "indigo", suffix, delay = 0 }) {
  const theme = TONES[tone] || TONES.indigo;

  return (
    <div className="surface surface-hover group relative overflow-hidden p-5">
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-gradient-to-br to-transparent opacity-70",
          theme.glow
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
          <p className="mt-2 font-heading text-3xl font-extrabold tracking-tight">
            <AnimatedNumber value={value} duration={1.1 + delay} />
            {suffix && <span className="ml-1 text-lg font-bold text-muted-foreground">{suffix}</span>}
          </p>
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", theme.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {hint && <p className="relative mt-3 truncate text-xs text-muted-foreground">{hint}</p>}
      <div className={cn("absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100", theme.accent)} />
    </div>
  );
}