import React from "react";
import { CalendarDays, Clock, MapPin, Eye, PlayCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge";
import { SESSION_STATUS, formatDate, sessionAction } from "@/lib/attendance-utils";

const ACTION_ICON = { scheduled: PlayCircle, open: ArrowRight, closed: Eye, completed: Eye };

export default function SessionCard({ session, stats, onAction }) {
  const meta = SESSION_STATUS[session.status] || SESSION_STATUS.scheduled;
  const Icon = ACTION_ICON[session.status] || Eye;

  return (
    <article className="surface surface-hover flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{session.class_name}</p>
          <p className="mt-1 truncate font-heading text-base font-bold tracking-tight">{session.subject}</p>
        </div>
        <StatusBadge
          label={meta.label}
          className={meta.className}
          dot={meta.dot}
          size="sm"
          pulse={session.status === "open"}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(session.date)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {session.start_time} – {session.end_time}
        </span>
        {session.room && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {session.room}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-muted-foreground">Attendance</span>
          <span className="tabular-nums">{stats.rate}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-700 ease-out"
            style={{ width: `${stats.rate}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border/70 bg-muted/40 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Present</p>
          <p className="mt-0.5 font-heading text-lg font-extrabold tabular-nums text-emerald-600 dark:text-emerald-300">
            {stats.present}
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-muted/40 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Absent</p>
          <p className="mt-0.5 font-heading text-lg font-extrabold tabular-nums text-rose-600 dark:text-rose-300">
            {stats.absent}
          </p>
        </div>
      </div>

      <Button
        className="mt-4 w-full"
        variant={session.status === "open" ? "default" : "outline"}
        onClick={() => onAction(session)}
      >
        <Icon className="mr-2 h-4 w-4" />
        {sessionAction(session.status)}
      </Button>
    </article>
  );
}