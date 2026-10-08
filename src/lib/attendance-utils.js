export const RFID_PREFIX = "RFID-";

const HEX = "0123456789ABCDEF";

export function makeUid() {
  let out = "";
  for (let i = 0; i < 8; i += 1) out += HEX[Math.floor(Math.random() * HEX.length)];
  return RFID_PREFIX + out;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function toISODate(value = new Date()) {
  const d = new Date(value);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDate(value) {
  if (!value) return null;
  return new Date(value.length <= 10 ? `${value}T00:00:00` : value);
}

export function formatDate(value) {
  const d = parseDate(value);
  if (!d) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function formatLongDate(value = new Date()) {
  return new Date(value).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(value = new Date()) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function formatClock(value = new Date()) {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatElapsed(from) {
  if (!from) return "00:00";
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(from).getTime()) / 1000));
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

const AVATAR_TONES = [
  "bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300",
  "bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-sky-500/12 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300",
  "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
  "bg-rose-500/12 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
  "bg-violet-500/12 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300",
];

export function avatarTone(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 9973;
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

export const SESSION_STATUS = {
  scheduled: {
    label: "Scheduled",
    className:
      "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-400/25",
    dot: "bg-sky-500",
  },
  open: {
    label: "Open",
    className:
      "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/25",
    dot: "bg-emerald-500",
  },
  closed: {
    label: "Closed",
    className:
      "bg-amber-500/12 text-amber-700 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/25",
    dot: "bg-amber-500",
  },
  completed: {
    label: "Completed",
    className:
      "bg-slate-500/10 text-slate-600 ring-slate-500/15 dark:bg-slate-400/15 dark:text-slate-300 dark:ring-slate-400/20",
    dot: "bg-slate-400",
  },
};

export const ATTENDANCE_STATUS = {
  present: {
    label: "Present",
    className:
      "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/25",
    dot: "bg-emerald-500",
  },
  late: {
    label: "Late",
    className:
      "bg-amber-500/12 text-amber-700 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/25",
    dot: "bg-amber-500",
  },
  absent: {
    label: "Absent",
    className:
      "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/25",
    dot: "bg-rose-500",
  },
};

export function rosterOf(students = []) {
  return students.filter((student) => student.status !== "inactive");
}

export function recordsFor(sessionId, records = []) {
  return records.filter((record) => record.session_id === sessionId);
}

export function sessionStats(session, students = [], records = []) {
  const roster = rosterOf(students);
  const present = session ? recordsFor(session.id, records) : [];
  const total = roster.length;
  const presentCount = present.length;
  const absentCount = Math.max(total - presentCount, 0);
  return {
    present: presentCount,
    absent: absentCount,
    total,
    rate: total ? Math.round((presentCount / total) * 100) : 0,
  };
}

export function sessionAction(status) {
  if (status === "scheduled") return "Open Session";
  if (status === "open") return "Continue Attendance";
  return "View Attendance";
}

export function nextCardUid(students = []) {
  const taken = new Set(students.map((student) => student.rfid_uid).filter(Boolean));
  let uid = makeUid();
  while (taken.has(uid)) uid = makeUid();
  return uid;
}

export function findStudentByUid(students = [], uid) {
  if (!uid) return null;
  return students.find((student) => student.rfid_uid === uid) || null;
}

export function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const UPCOMING_META = {
  label: "Not started",
  className:
    "bg-slate-500/10 text-slate-600 ring-slate-500/15 dark:bg-slate-400/15 dark:text-slate-300 dark:ring-slate-400/20",
  dot: "bg-slate-400",
};

export function studentHistory(student, sessions = [], attendance = []) {
  const entries = sessions
    .map((session) => {
      const record =
        attendance.find((item) => item.session_id === session.id && item.student_id === student?.id) || null;

      if (record) {
        const meta = ATTENDANCE_STATUS[record.status] || ATTENDANCE_STATUS.present;
        return { session, record, status: record.status, label: meta.label, className: meta.className, dot: meta.dot };
      }
      if (session.status === "scheduled") {
        return { session, record: null, status: "upcoming", label: UPCOMING_META.label, className: UPCOMING_META.className, dot: UPCOMING_META.dot };
      }
      const meta = ATTENDANCE_STATUS.absent;
      return { session, record: null, status: "absent", label: meta.label, className: meta.className, dot: meta.dot };
    })
    .sort((a, b) =>
      `${b.session.date} ${b.session.start_time || ""}`.localeCompare(`${a.session.date} ${a.session.start_time || ""}`)
    );

  const held = entries.filter((entry) => entry.status !== "upcoming");
  const attended = held.filter((entry) => entry.status !== "absent");
  const late = held.filter((entry) => entry.status === "late");

  return {
    entries,
    attended: attended.length,
    total: held.length,
    absent: held.length - attended.length,
    late: late.length,
    rate: held.length ? Math.round((attended.length / held.length) * 100) : 0,
  };
}

export function studentHistoryCsv(student, history) {
  const rows = [["Session", "Class", "Date", "Start Time", "End Time", "Recorded At", "Status"]];
  history.entries.forEach((entry) => {
    rows.push([
      entry.session.subject,
      entry.session.class_name,
      entry.session.date,
      entry.session.start_time,
      entry.session.end_time,
      entry.record?.recorded_at || "",
      entry.label,
    ]);
  });
  return rows;
}