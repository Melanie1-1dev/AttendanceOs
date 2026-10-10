import React from "react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge";
import { SESSION_STATUS } from "@/lib/attendance-utils";
import { cn } from "@/lib/utils";

const TONES = {
  indigo: { bar: "bg-indigo-500", chip: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300" },
  emerald: { bar: "bg-emerald-500", chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" },
  sky: { bar: "bg-sky-500", chip: "bg-sky-500/10 text-sky-600 dark:text-sky-300" },
  amber: { bar: "bg-amber-500", chip: "bg-amber-500/12 text-amber-600 dark:text-amber-300" },
  violet: { bar: "bg-violet-500", chip: "bg-violet-500/10 text-violet-600 dark:text-violet-300" },
  teal: { bar: "bg-teal-500", chip: "bg-teal-500/10 text-teal-600 dark:text-teal-300" },
  rose: { bar: "bg-rose-500", chip: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
};

export default function SlotCard({ slot, session, onOpenSession, onCreate }) {
  const tone = TONES[slot.accent] || TONES.indigo;
  const meta = session ? SESSION_STATUS[session.status] || SESSION_STATUS.scheduled : null;

  return (
    <article className="relative overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <span className={cn("absolute inset-y-0 left-0 w-1", tone.bar)} />
      <div className="space-y-1.5 py-2.5 pl-4 pr-3">
        <span className={cn("inline-flex rounded-full px-2 py-0.5 font-mono text-[10px] font-bold", tone.chip)}>
          {slot.start_time}–{slot.end_time}
        </span>

        <p className="text-sm font-semibold leading-snug">{slot.subject}</p>
        <p className="text-xs text-muted-foreground">
          {slot.room ? `${slot.room} · ` : ""}
          {slot.teacher_name || "Teacher"}
        </p>

        <div>
          {session ? (
            <StatusBadge
              label={meta.label}
              className={meta.className}
              dot={meta.dot}
              size="sm"
              pulse={session.status === "open"}
            />
          ) : (
            <span className="text-xs text-muted-foreground">No session yet</span>
          )}
        </div>

        <Button
          size="sm"
          variant={session ? "outline" : "default"}
          className="h-7 w-full text-xs"
          onClick={() => (session ? onOpenSession(session) : onCreate(slot))}
        >
          {session ? "View Session" : "Create Session"}
        </Button>
      </div>
    </article>
  );
}