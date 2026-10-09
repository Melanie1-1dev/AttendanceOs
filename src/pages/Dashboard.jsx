import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import GreetingHeader from "@/components/dashboard/GreetingHeader";
import StatGrid from "@/components/dashboard/StatGrid";
import TodaySessions from "@/components/dashboard/TodaySessions";
import AttendanceTrendChart from "@/components/dashboard/AttendanceTrendChart";
import { CardGridSkeleton, StatGridSkeleton } from "@/components/common/Skeletons";
import { loadClassroom, openSessionRecord } from "@/lib/classroom";
import { rosterOf, toISODate } from "@/lib/attendance-utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isError, refetch } = useQuery({
    queryKey: ["classroom"],
    queryFn: loadClassroom,
  });

  const handleAction = async (session) => {
    if (session.status === "scheduled") {
      await openSessionRecord(session);
      toast.success("Session opened", { description: `${session.subject} is now accepting RFID scans.` });
    }
    navigate(`/sessions/${session.id}`);
  };

  const today = toISODate();
  const sessions = data?.sessions || [];
  const students = data?.students || [];
  const attendance = data?.attendance || [];

  const todaySessions = sessions
    .filter((session) => session.date === today)
    .sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));

  const todayIds = new Set(todaySessions.map((session) => session.id));
  const activeSession = todaySessions.find((session) => session.status === "open") || null;
  const presentToday = new Set(
    attendance.filter((record) => todayIds.has(record.session_id)).map((record) => record.student_id)
  ).size;
  const totalStudents = rosterOf(students).length;

  return (
    <div className="space-y-6">
      <GreetingHeader />

      {isError ? (
        <div className="surface p-6 text-center" role="alert">
          <p className="font-semibold">Could not load the classroom data.</p>
          <button className="mt-3 text-sm font-semibold text-primary hover:underline" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : !data ? (
        <div className="space-y-6">
          <StatGridSkeleton />
          <CardGridSkeleton count={3} />
        </div>
      ) : (
        <>
          <StatGrid
            presentToday={presentToday}
            absentToday={Math.max(totalStudents - presentToday, 0)}
            activeSession={activeSession}
            totalStudents={totalStudents}
          />
          <AttendanceTrendChart sessions={sessions} attendance={attendance} students={students} />
          <TodaySessions sessions={todaySessions} students={students} attendance={attendance} onAction={handleAction} />
        </>
      )}
    </div>
  );
}