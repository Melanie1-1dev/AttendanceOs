import { api } from "@/api/client";

export const CLASS_OPTIONS = ["CS Year 3", "CS Year 2", "IT Year 3", "SE Year 4"];

export async function loadClassroom() {
  const [students, sessions, attendance] = await Promise.all([
    api.entities.Student.list("student_code", 300),
    api.entities.Session.list("-date", 200),
    api.entities.Attendance.list("-recorded_at", 1000),
  ]);
  return { students, sessions, attendance };
}

export async function openSessionRecord(session) {
  return api.entities.Session.update(session.id, {
    status: "open",
    opened_at: new Date().toISOString(),
  });
}

export async function closeSessionRecord(session) {
  return api.entities.Session.update(session.id, {
    status: "completed",
    closed_at: new Date().toISOString(),
  });
}