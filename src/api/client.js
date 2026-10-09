const USERS = "attendance_users";
const SESSION = "attendance_session";
const RESETS = "attendance_resets";
const DEV_OTP = "123456"; // verification code for local development
const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const fail = (message, status) => Object.assign(new Error(message), { status });

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return formatLocalDate(result);
};

const today = new Date();
const todayDate = formatLocalDate(today);
const todayWeekday = WEEKDAYS[today.getDay()];
const demoSlots = [
  { id: "slot-monday", day_of_week: "monday", class_name: "CS Year 3", subject: "Database Systems", teacher_name: "Jordan Lee", room: "Lab 2", start_time: "09:00", end_time: "10:30" },
  { id: "slot-tuesday", day_of_week: "tuesday", class_name: "CS Year 3", subject: "Network Security", teacher_name: "Morgan Taylor", room: "Room 104", start_time: "10:00", end_time: "11:30" },
  { id: "slot-wednesday", day_of_week: "wednesday", class_name: "CS Year 3", subject: "Software Engineering", teacher_name: "Jordan Lee", room: "Lab 2", start_time: "13:00", end_time: "14:30" },
  { id: "slot-thursday", day_of_week: "thursday", class_name: "CS Year 3", subject: "Cloud Computing", teacher_name: "Morgan Taylor", room: "Room 208", start_time: "09:30", end_time: "11:00" },
  { id: "slot-friday", day_of_week: "friday", class_name: "CS Year 3", subject: "Data Structures", teacher_name: "Jordan Lee", room: "Lab 1", start_time: "11:00", end_time: "12:30" },
];
const todaySlot = demoSlots.find((slot) => slot.day_of_week === todayWeekday) || demoSlots[0];
const demoStudents = [
  { id: "student-001", student_code: "AS-2026-001", full_name: "Alex Morgan", class_name: "CS Year 3", rfid_uid: "04:A1:B2:C3:D4" },
  { id: "student-002", student_code: "AS-2026-002", full_name: "Jamie Rivera", class_name: "CS Year 3", rfid_uid: "04:A1:B2:C5:E6" },
  { id: "student-003", student_code: "AS-2026-003", full_name: "Taylor Kim", class_name: "CS Year 3", rfid_uid: "04:A1:B2:C7:F8" },
  { id: "student-004", student_code: "AS-2026-004", full_name: "Casey Patel", class_name: "CS Year 3", rfid_uid: "04:A1:B2:C9:A0" },
  { id: "student-005", student_code: "AS-2026-005", full_name: "Riley Chen", class_name: "CS Year 3", rfid_uid: "" },
  { id: "student-006", student_code: "AS-2026-006", full_name: "Drew Wilson", class_name: "CS Year 3", rfid_uid: "" },
];
const demoSessions = [
  {
    id: "session-today",
    class_name: todaySlot.class_name,
    subject: todaySlot.subject,
    teacher_name: todaySlot.teacher_name,
    room: todaySlot.room,
    date: todayDate,
    start_time: todaySlot.start_time,
    end_time: todaySlot.end_time,
    status: "scheduled",
    slot_id: todaySlot.id,
  },
  {
    id: "session-yesterday",
    class_name: "CS Year 3",
    subject: "Algorithms",
    teacher_name: "Jordan Lee",
    room: "Lab 2",
    date: addDays(today, -1),
    start_time: "09:00",
    end_time: "10:30",
    status: "completed",
    slot_id: "",
  },
];
const demoAttendance = demoStudents.slice(0, 4).map((student, index) => ({
  id: `attendance-demo-${index + 1}`,
  session_id: "session-yesterday",
  student_id: student.id,
  rfid_uid: student.rfid_uid,
  status: "present",
  recorded_at: new Date(`${addDays(today, -1)}T09:15:00`).toISOString(),
  method: "rfid",
}));
const DEMO_DATA = {
  Student: demoStudents,
  Session: demoSessions,
  Attendance: demoAttendance,
  TimetableSlot: demoSlots,
};

const publicUser = (u) => ({
  id: u.id,
  email: u.email,
  full_name: u.full_name || u.email.split("@")[0],
});

const sortRows = (rows, sort) => {
  if (!sort) return rows;
  const desc = sort.startsWith("-");
  const key = desc ? sort.slice(1) : sort;
  return [...rows].sort((a, b) => {
    const x = a[key];
    const y = b[key];
    if (x === y) return 0;
    if (x == null) return 1;
    if (y == null) return -1;
    const c =
      typeof x === "number" && typeof y === "number"
        ? x - y
        : String(x).localeCompare(String(y));
    return desc ? -c : c;
  });
};

const entity = (name) => {
  const key = `attendance_${name}`;
  const all = () => read(key, DEMO_DATA[name] || []);
  return {
    async list(sort, limit) {
      const rows = sortRows(all(), sort);
      return limit ? rows.slice(0, limit) : rows;
    },
    async filter(query = {}, sort, limit) {
      const rows = sortRows(
        all().filter((r) => Object.entries(query).every(([k, v]) => r[k] === v)),
        sort
      );
      return limit ? rows.slice(0, limit) : rows;
    },
    async create(data) {
      const row = { ...data, id: crypto.randomUUID(), created_date: new Date().toISOString() };
      write(key, [...all(), row]);
      return row;
    },
    async bulkCreate(items) {
      return Promise.all(items.map((i) => this.create(i)));
    },
    async update(id, data) {
      const rows = all();
      const i = rows.findIndex((r) => r.id === id);
      if (i === -1) throw fail(`${name} not found`, 404);
      rows[i] = { ...rows[i], ...data };
      write(key, rows);
      return rows[i];
    },
    async delete(id) {
      write(key, all().filter((r) => r.id !== id));
      return { id };
    },
  };
};

export const api = {
  entities: {
    Student: entity("Student"),
    Session: entity("Session"),
    Attendance: entity("Attendance"),
    TimetableSlot: entity("TimetableSlot"),
  },

  auth: {
    async register({ email, password, full_name }) {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail || !password) throw fail("Email and password are required", 400);
      const users = read(USERS, []);
      const existing = users.find((u) => u.email === normalizedEmail);
      if (existing?.verified) throw fail("Email already registered", 409);
      const user = { id: existing?.id || crypto.randomUUID(), email: normalizedEmail, password, full_name, verified: false };
      write(USERS, [...users.filter((u) => u.email !== normalizedEmail), user]);
      return { verificationCode: DEV_OTP };
    },
    async verifyOtp({ email, otpCode }) {
      const users = read(USERS, []);
      const user = users.find((u) => u.email === email);
      if (!user) throw fail("Account not found", 404);
      if (String(otpCode) !== DEV_OTP) throw fail("Invalid verification code", 400);
      write(USERS, users.map((u) => (u.id === user.id ? { ...u, verified: true } : u)));
      return { access_token: user.id };
    },
    async resendOtp(email) {
      const normalizedEmail = email.trim().toLowerCase();
      const user = read(USERS, []).find((item) => item.email === normalizedEmail && !item.verified);
      if (!user) throw fail("No pending verification was found for this email", 404);
      return { verificationCode: DEV_OTP };
    },
    setToken(token) {
      const user = read(USERS, []).find((u) => u.id === token);
      if (user) write(SESSION, publicUser(user));
    },
    currentUser() {
      return read(SESSION, null);
    },
    async loginViaEmailPassword(email, password) {
      const normalizedEmail = email.trim().toLowerCase();
      const user = read(USERS, []).find(
        (u) => u.email === normalizedEmail && u.password === password && u.verified === true
      );
      if (!user) throw fail("Invalid email or password", 401);
      write(SESSION, publicUser(user));
      return publicUser(user);
    },
    async loginWithProvider(provider) {
      throw fail(`${provider} sign-in requires a configured server-side OAuth provider`, 501);
    },
    async me() {
      const session = this.currentUser();
      if (!session) throw fail("Not authenticated", 401);
      return session;
    },
    logout() {
      localStorage.removeItem(SESSION);
    },
    isLoggedIn() {
      return !!read(SESSION, null);
    },
    async resetPasswordRequest(email) {
      const normalizedEmail = email.trim().toLowerCase();
      const userExists = read(USERS, []).some((user) => user.email === normalizedEmail);
      if (!userExists) return {};
      const token = crypto.randomUUID();
      write(RESETS, { ...read(RESETS, {}), [token]: normalizedEmail });
      const resetUrl = new URL("/reset-password", window.location.origin);
      resetUrl.searchParams.set("token", token);
      return { resetUrl: resetUrl.toString() };
    },
    async resetPassword({ resetToken, newPassword }) {
      const resets = read(RESETS, {});
      const email = resets[resetToken];
      if (!email) throw fail("Invalid or expired reset link", 400);
      write(USERS, read(USERS, []).map((u) => (u.email === email ? { ...u, password: newPassword } : u)));
      delete resets[resetToken];
      write(RESETS, resets);
      return {};
    },
  },
};