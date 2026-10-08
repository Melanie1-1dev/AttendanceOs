import React from "react";
import { CalendarX2, Eye, PlayCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import SessionCard from "@/components/dashboard/SessionCard";
import { SESSION_STATUS, formatDate, sessionAction, sessionStats } from "@/lib/attendance-utils";

const ACTION_ICON = { scheduled: PlayCircle, open: ArrowRight, closed: Eye, completed: Eye };

export default function SessionList({ sessions, students, attendance, onAction, filtered }) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={CalendarX2}
        title={filtered ? "No sessions match your filters" : "No sessions yet"}
        description={
          filtered
            ? "Try clearing the search box, date or status filter."
            : "Create your first attendance session to start tracking RFID scans."
        }
      />
    );
  }

  return (
    <>
      <div className="surface hidden overflow-hidden lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/70 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              <th className="px-5 py-3">Class</th>
              <th className="px-5 py-3">Teacher</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Time</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Attendance</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {sessions.map((session) => {
              const meta = SESSION_STATUS[session.status] || SESSION_STATUS.scheduled;
              const stats = sessionStats(session, students, attendance);
              const Icon = ACTION_ICON[session.status] || Eye;
              return (
                <tr key={session.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold">{session.subject}</p>
                    <p className="text-xs text-muted-foreground">{session.class_name}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{session.teacher_name || "—"}</td>
                  <td className="px-5 py-3.5 text-sm tabular-nums text-muted-foreground">{formatDate(session.date)}</td>
                  <td className="px-5 py-3.5 text-sm tabular-nums text-muted-foreground">
                    {session.start_time} – {session.end_time}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge
                      label={meta.label}
                      className={meta.className}
                      dot={meta.dot}
                      size="sm"
                      pulse={session.status === "open"}
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold tabular-nums">
                        {stats.present}/{stats.total}
                      </span>
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                          style={{ width: `${stats.rate}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-muted-foreground">{stats.rate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      size="sm"
                      variant={session.status === "open" ? "default" : "outline"}
                      onClick={() => onAction(session)}
                    >
                      <Icon className="mr-2 h-3.5 w-3.5" />
                      {sessionAction(session.status)}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            stats={sessionStats(session, students, attendance)}
            onAction={onAction}
          />
        ))}
      </div>
    </>
  );
}