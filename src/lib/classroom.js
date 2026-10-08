import { base44 } from "@/api/base44Client";

export const CLASS_OPTIONS = ["CS Year 3", "CS Year 2", "IT Year 3", "SE Year 4"];

export async function loadClassroom() {
  const [students, sessions, attendance] = await Promise.all([
    base44.entities.Student.list("student_code", 300),
    base44.entities.Session.list("-date", 200),
    base44.entities.Attendance.list("-recorded_at", 1000),
  ]);
  return { students, sessions, attendance };
}

export async function openSessionRecord(session) {
  return base44.entities.Session.update(session.id, {
    status: "open",
    opened_at: new Date().toISOString(),
  });
}

export async function closeSessionRecord(session) {
  return base44.entities.Session.update(session.id, {
    status: "completed",
    closed_at: new Date().toISOString(),
  });
}