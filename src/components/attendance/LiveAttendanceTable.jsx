import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Download, ArrowUpDown, ClipboardList, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";
import {
  ATTENDANCE_STATUS,
  avatarTone,
  downloadCsv,
  formatTime,
  initials,
  rosterOf,
} from "@/lib/attendance-utils";

const FILTERS = [
  { key: "present", label: "Present" },
  { key: "absent", label: "Absent" },
  { key: "all", label: "All" },
];

export default function LiveAttendanceTable({ session, students = [], records = [], latestId }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("present");
  const [sort, setSort] = useState("recent");

  const { presentRows, absentRows } = useMemo(() => {
    const byStudent = new Map(records.map((record) => [record.student_id, record]));
    const present = records
      .map((record) => ({
        key: record.id,
        student: students.find((item) => item.id === record.student_id),
        uid: record.rfid_uid,
        time: record.recorded_at,
        status: record.status || "present",
      }))
      .filter((row) => row.student);

    const absent = rosterOf(students)
      .filter((student) => !byStudent.has(student.id))
      .map((student) => ({ key: `absent-${student.id}`, student, uid: student.rfid_uid, time: null, status: "absent" }));

    return { presentRows: present, absentRows: absent };
  }, [records, students]);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = (row) =>
      !needle ||
      row.student.full_name.toLowerCase().includes(needle) ||
      row.student.student_code.toLowerCase().includes(needle) ||
      (row.uid || "").toLowerCase().includes(needle);

    let base = [];
    if (filter === "present") base = presentRows.filter(matches);
    else if (filter === "absent") base = absentRows.filter(matches);
    else base = [...presentRows.filter(matches), ...absentRows.filter(matches)];

    const sorted = [...base];
    if (sort === "recent") {
      sorted.sort((a, b) => {
        if (a.status === "absent" && b.status !== "absent") return 1;
        if (b.status === "absent" && a.status !== "absent") return -1;
        return new Date(b.time || 0) - new Date(a.time || 0);
      });
    } else if (sort === "name") {
      sorted.sort((a, b) => a.student.full_name.localeCompare(b.student.full_name));
    } else {
      sorted.sort((a, b) => a.student.student_code.localeCompare(b.student.student_code));
    }
    return sorted;
  }, [presentRows, absentRows, query, filter, sort]);

  const handleExport = () => {
    const header = ["Student ID", "Student Name", "RFID UID", "Attendance Time", "Status"];
    const body = rows.map((row) => [
      row.student.student_code,
      row.student.full_name,
      row.uid || "—",
      row.time ? formatTime(row.time) : "—",
      ATTENDANCE_STATUS[row.status]?.label || row.status,
    ]);
    downloadCsv(`${session?.subject || "session"}-attendance.csv`.replace(/\s+/g, "-").toLowerCase(), [header, ...body]);
  };

  return (
    <section className="surface overflow-hidden">
      <header className="flex flex-wrap items-center gap-3 border-b border-border/70 px-5 py-4">
        <div className="mr-auto">
          <p className="font-heading text-base font-bold tracking-tight">Live Attendance</p>
          <p className="text-xs text-muted-foreground">
            {presentRows.length} present · {absentRows.length} absent · updates with every scan
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, ID or UID"
            className="h-9 w-full pl-8 sm:w-60"
          />
        </div>

        <div className="flex items-center rounded-xl border border-border bg-muted/50 p-0.5">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={cn(
                "rounded-[10px] px-3 py-1.5 text-xs font-semibold transition-all",
                filter === item.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-9 appearance-none rounded-lg border border-input bg-card pl-8 pr-8 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="recent">Most recent</option>
            <option value="name">Name A–Z</option>
            <option value="id">Student ID</option>
          </select>
        </div>

        <Button variant="outline" size="sm" onClick={handleExport} disabled={!rows.length}>
          <Download className="mr-2 h-3.5 w-3.5" />
          Export
        </Button>
      </header>

      {rows.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={filter === "absent" ? UserX : ClipboardList}
            title={query ? "No matching students" : filter === "absent" ? "Everyone is present" : "No attendance records yet"}
            description={
              query
                ? "Try a different name, student ID or RFID UID."
                : filter === "absent"
                ? "All students in this class have been recorded for this session."
                : "Place an RFID card on the reader to record the first student."
            }
          />
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/70 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-5 py-3">Student ID</th>
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-5 py-3">RFID UID</th>
                  <th className="px-5 py-3">Attendance Time</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {rows.map((row) => {
                  const meta = ATTENDANCE_STATUS[row.status] || ATTENDANCE_STATUS.present;
                  return (
                    <tr
                      key={row.key}
                      onClick={() => navigate(`/students/${row.student.id}`)}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-muted/40",
                        row.key === latestId && "rise-in"
                      )}
                    >
                      <td className="px-5 py-3 font-mono text-xs font-semibold text-muted-foreground">
                        {row.student.student_code}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                              avatarTone(row.student.full_name)
                            )}
                          >
                            {initials(row.student.full_name)}
                          </div>
                          <span className="text-sm font-semibold">{row.student.full_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {row.uid ? <span className="uid-chip">{row.uid}</span> : <span className="text-xs text-muted-foreground">No card</span>}
                      </td>
                      <td className="px-5 py-3 text-sm tabular-nums text-muted-foreground">
                        {row.time ? formatTime(row.time) : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge label={meta.label} className={meta.className} dot={meta.dot} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-border/60 md:hidden">
            {rows.map((row) => {
              const meta = ATTENDANCE_STATUS[row.status] || ATTENDANCE_STATUS.present;
              return (
                <div
                  key={row.key}
                  onClick={() => navigate(`/students/${row.student.id}`)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40",
                    row.key === latestId && "rise-in"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      avatarTone(row.student.full_name)
                    )}
                  >
                    {initials(row.student.full_name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{row.student.full_name}</p>
                    <p className="truncate font-mono text-[11px] text-muted-foreground">
                      {row.student.student_code} · {row.uid || "no card"}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge label={meta.label} className={meta.className} dot={meta.dot} size="sm" />
                    <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
                      {row.time ? formatTime(row.time) : "—"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}