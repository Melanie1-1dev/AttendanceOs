import React, { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarRange } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { rosterOf, toISODate } from "@/lib/attendance-utils";

const DAY_COUNT = 30;

function shortLabel(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function buildSeries(sessions = [], attendance = [], students = []) {
  const roster = rosterOf(students).length;
  const heldByDate = new Map();

  sessions.forEach((session) => {
    if (!session.date || session.status === "scheduled") return;
    const list = heldByDate.get(session.date) || [];
    list.push(session);
    heldByDate.set(session.date, list);
  });

  const idsByDate = new Map();
  heldByDate.forEach((list, date) => {
    idsByDate.set(date, new Set(list.map((s) => s.id)));
  });

  const points = [];
  const today = new Date();
  for (let i = DAY_COUNT - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = toISODate(d);
    const ids = idsByDate.get(iso);
    if (!ids) continue;
    const present = attendance.filter(
      (a) => ids.has(a.session_id) && (a.status === "present" || a.status === "late")
    ).length;
    const expected = (heldByDate.get(iso) || []).length * roster;
    const absent = Math.max(expected - present, 0);
    points.push({
      date: iso,
      label: shortLabel(iso),
      present,
      absent,
      rate: expected ? Math.round((present / expected) * 100) : 0,
    });
  }
  return points;
}

function TrendTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-border/70 bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-foreground">{point.label}</p>
      <p className="mt-1 text-emerald-600 dark:text-emerald-400">Present: {point.present}</p>
      <p className="text-rose-600 dark:text-rose-400">Absent: {point.absent}</p>
      <p className="mt-1 text-muted-foreground">Rate: {point.rate}%</p>
    </div>
  );
}

export default function AttendanceTrendChart({ sessions, attendance, students }) {
  const points = useMemo(
    () => buildSeries(sessions, attendance, students),
    [sessions, attendance, students]
  );

  return (
    <section className="surface p-6">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-heading text-base font-bold tracking-tight">Attendance Trends</p>
          <p className="text-sm text-muted-foreground">Daily present vs absent over the last 30 days.</p>
        </div>
        <CalendarRange className="h-5 w-5 shrink-0 text-muted-foreground" />
      </header>

      {points.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="No attendance data yet"
          description="Once sessions are held and scanned, trends will appear here."
        />
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="presentFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="absentFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip content={<TrendTooltip />} />
              <Area type="monotone" dataKey="present" name="Present" stroke="var(--chart-2)" strokeWidth={2} fill="url(#presentFill)" />
              <Area type="monotone" dataKey="absent" name="Absent" stroke="var(--chart-5)" strokeWidth={2} fill="url(#absentFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}