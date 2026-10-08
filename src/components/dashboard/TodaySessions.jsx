import React from "react";
import { CalendarX2 } from "lucide-react";
import SessionCard from "@/components/dashboard/SessionCard";
import EmptyState from "@/components/common/EmptyState";
import { sessionStats } from "@/lib/attendance-utils";

export default function TodaySessions({ sessions, students, attendance, onAction }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-heading text-lg font-bold tracking-tight">Today's Sessions</h2>
          <p className="text-sm text-muted-foreground">Open a session to start scanning RFID cards.</p>
        </div>
        <span className="rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
          {sessions.length} scheduled today
        </span>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={CalendarX2}
          title="No sessions today"
          description="Nothing is on the timetable for today. Create a session from the Sessions page to begin taking attendance."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              stats={sessionStats(session, students, attendance)}
              onAction={onAction}
            />
          ))}
        </div>
      )}
    </section>
  );
}