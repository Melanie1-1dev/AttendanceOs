import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, CalendarDays, Clock, Lock, MapPin, PlayCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/common/Skeletons";
import AttendanceSummary from "@/components/attendance/AttendanceSummary";
import LiveAttendanceTable from "@/components/attendance/LiveAttendanceTable";
import RfidScanner from "@/components/rfid/RfidScanner";
import CloseSessionDialog from "@/components/sessions/CloseSessionDialog";
import { closeSessionRecord, loadClassroom, openSessionRecord } from "@/lib/classroom";
import { SESSION_STATUS, formatDate, sessionStats } from "@/lib/attendance-utils";

export default function SessionDetail() {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [session, setSession] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closeOpen, setCloseOpen] = useState(false);
  const [latestId, setLatestId] = useState(null);

  const refresh = useCallback(async () => {
    const data = await loadClassroom();
    setStudents(data.students);
    setSession(data.sessions.find((item) => item.id === id) || null);
    setRecords(data.attendance.filter((item) => item.session_id === id));
    setLoading(false);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

  const handleOpen = async () => {
    await openSessionRecord(session);
    setSession((prev) => ({ ...prev, status: "open", opened_at: new Date().toISOString() }));
    toast.success("Session opened", { description: `${session.subject} is now accepting RFID scans.` });
  };

  const handleClose = async () => {
    await closeSessionRecord(session);
    setSession((prev) => ({ ...prev, status: "completed", closed_at: new Date().toISOString() }));
    setCloseOpen(false);
    toast.success("Session closed", { description: "Attendance is now locked for this session." });
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <TableSkeleton rows={4} />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (!session) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="Session not found"
        description="This session may have been removed."
        action={
          <Button asChild variant="outline">
            <Link to="/sessions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sessions
            </Link>
          </Button>
        }
      />
    );
  }

  const meta = SESSION_STATUS[session.status] || SESSION_STATUS.scheduled;
  const stats = sessionStats(session, students, records);

  return (
    <div className="space-y-5">
      <Link
        to="/sessions"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sessions
      </Link>

      <section className="surface p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {session.class_name}
            </p>
            <h2 className="mt-1 font-heading text-2xl font-extrabold tracking-tight">{session.subject}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {session.teacher_name || "Teacher"}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(session.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {session.start_time} – {session.end_time}
              </span>
              {session.room && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {session.room}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              label={meta.label}
              className={meta.className}
              dot={meta.dot}
              pulse={session.status === "open"}
            />
            {session.status === "scheduled" && (
              <Button onClick={handleOpen}>
                <PlayCircle className="mr-2 h-4 w-4" />
                Open Session
              </Button>
            )}
            {session.status === "open" && (
              <Button variant="outline" onClick={() => setCloseOpen(true)}>
                <Lock className="mr-2 h-4 w-4" />
                Close Session
              </Button>
            )}
          </div>
        </div>
      </section>

      <AttendanceSummary stats={stats} />

      <RfidScanner
        session={session}
        students={students}
        records={records}
        onRecorded={(record) => {
          setRecords((prev) => [...prev, record]);
          setLatestId(record.id);
        }}
        onOpenSession={handleOpen}
        onAssignCard={() => {}}
      />

      <LiveAttendanceTable session={session} students={students} records={records} latestId={latestId} />

      <CloseSessionDialog open={closeOpen} onOpenChange={setCloseOpen} session={session} onConfirm={handleClose} />
    </div>
  );
}