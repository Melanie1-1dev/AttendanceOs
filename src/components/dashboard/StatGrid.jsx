import React from "react";
import { Radio, UserCheck, UserX, Users } from "lucide-react";
import StatCard from "@/components/common/StatCard";

export default function StatGrid({ presentToday, absentToday, activeSession, totalStudents }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={UserCheck}
        label="Present Today"
        value={presentToday}
        tone="emerald"
        hint="Students recorded across today's sessions"
      />
      <StatCard
        icon={UserX}
        label="Absent Today"
        value={absentToday}
        tone="rose"
        hint="No RFID scan recorded yet"
        delay={0.1}
      />
      <StatCard
        icon={Radio}
        label="Active Session"
        value={activeSession ? 1 : 0}
        tone="indigo"
        hint={activeSession ? `${activeSession.subject} · live now` : "No session currently open"}
        delay={0.2}
      />
      <StatCard
        icon={Users}
        label="Total Students"
        value={totalStudents}
        tone="slate"
        hint="Enrolled in the class roster"
        delay={0.3}
      />
    </div>
  );
}