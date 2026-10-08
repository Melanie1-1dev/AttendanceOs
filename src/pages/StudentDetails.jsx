import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, CheckCircle2, CreditCard, Download, History, Percent, Timer, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/common/StatCard";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import { StatGridSkeleton, TableSkeleton } from "@/components/common/Skeletons";
import { toast } from "sonner";
import { loadClassroom } from "@/lib/classroom";
import {
  avatarTone,
  downloadCsv,
  formatDate,
  formatTime,
  initials,
  studentHistory,
  studentHistoryCsv,
} from "@/lib/attendance-utils";
import { cn } from "@/lib/utils";

const CARD_ACTIVE =
  "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/25";
const CARD_NONE =
  "bg-slate-500/10 text-slate-600 ring-slate-500/15 dark:bg-slate-400/15 dark:text-slate-300 dark:ring-slate-400/20";

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadClassroom().then((data) => {
      if (!active) return;
      setStudent(data.students.find((item) => item.id === id) || null);
      setSessions(data.sessions);
      setAttendance(data.attendance);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-5">
        <StatGridSkeleton />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (!student) {
    return (
      <EmptyState
        icon={UserX}
        title="Student not found"
        description="This student may have been removed from the class roster."
        action={
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        }
      />
    );
  }

  const history = studentHistory(student, sessions, attendance);

  const handleExport = () => {
    const rows = studentHistoryCsv(student, history);
    downloadCsv(`attendance_${student.student_code || student.id}.csv`, rows);
    toast.success("Attendance history exported", {
      description: "Open it in Google Sheets via File → Import → Upload.",
    });
  };

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <section className="surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div
            className={cn(
              "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold",
              avatarTone(student.full_name)
            )}
          >
            {initials(student.full_name)}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight">{student.full_name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-mono">{student.student_code}</span> · {student.class_name}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              label={student.rfid_uid ? "🟢 Active" : "⚪ No Card"}
              className={student.rfid_uid ? CARD_ACTIVE : CARD_NONE}
            />
            {student.rfid_uid && <span className="uid-chip">{student.rfid_uid}</span>}
            <Button variant="outline" asChild>
              <Link to="/rfid-cards">
                <CreditCard className="mr-2 h-4 w-4" />
                Manage card
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CheckCircle2}
          label="Sessions Attended"
          value={history.attended}
          tone="emerald"
          hint={`Out of ${history.total} sessions held`}
        />
        <StatCard
          icon={UserX}
          label="Absences"
          value={history.absent}
          tone="rose"
          hint="Sessions with no scan recorded"
          delay={0.1}
        />
        <StatCard
          icon={Timer}
          label="Late Arrivals"
          value={history.late}
          tone="amber"
          hint="Scanned after the session start"
          delay={0.2}
        />
        <StatCard
          icon={Percent}
          label="Attendance Rate"
          value={history.rate}
          suffix="%"
          tone="indigo"
          hint="Across every session held so far"
          delay={0.3}
        />
      </div>

      <section className="surface overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
          <div>
            <p className="font-heading text-base font-bold tracking-tight">Attendance History</p>
            <p className="text-xs text-muted-foreground">Every session in the class timetable, most recent first.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={history.entries.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <History className="h-5 w-5 shrink-0 text-muted-foreground" />
          </div>
        </header>

        {history.entries.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={CalendarDays}
              title="No sessions yet"
              description="Once sessions are created, this student's attendance will appear here."
            />
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/70 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    <th className="px-5 py-3">Session</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Session Time</th>
                    <th className="px-5 py-3">Recorded At</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {history.entries.map((entry) => (
                    <tr key={entry.session.id} className="transition-colors hover:bg-muted/40">
                      <td className="px-5 py-3.5">
                        <Link to={`/sessions/${entry.session.id}`} className="text-sm font-semibold hover:underline">
                          {entry.session.subject}
                        </Link>
                        <p className="text-xs text-muted-foreground">{entry.session.class_name}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm tabular-nums text-muted-foreground">
                        {formatDate(entry.session.date)}
                      </td>
                      <td className="px-5 py-3.5 text-sm tabular-nums text-muted-foreground">
                        {entry.session.start_time} – {entry.session.end_time}
                      </td>
                      <td className="px-5 py-3.5 text-sm tabular-nums text-muted-foreground">
                        {entry.record?.recorded_at ? formatTime(entry.record.recorded_at) : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge
                          label={entry.label}
                          className={entry.className}
                          dot={entry.dot}
                          size="sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-border/60 md:hidden">
              {history.entries.map((entry) => (
                <Link
                  key={entry.session.id}
                  to={`/sessions/${entry.session.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{entry.session.subject}</p>
                    <p className="truncate text-[11px] tabular-nums text-muted-foreground">
                      {formatDate(entry.session.date)} · {entry.session.start_time} – {entry.session.end_time}
                    </p>
                  </div>
                  <StatusBadge label={entry.label} className={entry.className} dot={entry.dot} size="sm" />
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}