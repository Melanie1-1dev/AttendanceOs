import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Plus, Radio, RefreshCw, Search, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/common/Skeletons";
import AssignCardModal from "@/components/cards/AssignCardModal";
import { useReader } from "@/lib/reader-context";
import { loadClassroom } from "@/lib/classroom";
import { avatarTone, initials, rosterOf } from "@/lib/attendance-utils";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "All students" },
  { key: "active", label: "Active card" },
  { key: "none", label: "No card" },
];

const CARD_ACTIVE =
  "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/25";
const CARD_NONE =
  "bg-slate-500/10 text-slate-600 ring-slate-500/15 dark:bg-slate-400/15 dark:text-slate-300 dark:ring-slate-400/20";

export default function RfidCards() {
  const navigate = useNavigate();
  const { isOnline, toggle } = useReader();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isError, refetch } = useQuery({
    queryKey: ["classroom"],
    queryFn: loadClassroom,
  });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [preselect, setPreselect] = useState(null);

  const refresh = useCallback(() => refetch(), [refetch]);

  const students = useMemo(() => rosterOf(data?.students || []), [data]);

  const counts = useMemo(
    () => ({
      withCard: students.filter((student) => student.rfid_uid).length,
      withoutCard: students.filter((student) => !student.rfid_uid).length,
    }),
    [students]
  );

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return students.filter((student) => {
      const matchesQuery =
        !needle ||
        student.full_name.toLowerCase().includes(needle) ||
        student.student_code.toLowerCase().includes(needle) ||
        (student.rfid_uid || "").toLowerCase().includes(needle);
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && student.rfid_uid) ||
        (filter === "none" && !student.rfid_uid);
      return matchesQuery && matchesFilter;
    });
  }, [students, query, filter]);

  const openFor = (student) => {
    setPreselect(student?.id || null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-extrabold tracking-tight">RFID Card Management</h2>
          <p className="mt-1 text-sm text-muted-foreground">Assign and manage RFID cards for students.</p>
        </div>
        <Button onClick={() => openFor(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Assign New Card
        </Button>
      </div>

      <div
        className={cn(
          "surface flex flex-wrap items-center gap-4 p-4",
          !isOnline && "border-rose-500/30 bg-rose-500/[0.04]"
        )}
      >
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            isOnline ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300" : "bg-rose-500/12 text-rose-600 dark:text-rose-300"
          )}
        >
          {isOnline ? <Radio className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
        </div>
        <div className="mr-auto">
          <p className="font-heading text-sm font-bold tracking-tight">READER-01 · USB-HID</p>
          <p className={cn("text-xs font-medium", isOnline ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300")}>
            {isOnline ? "🟢 Reader Online — ready to read cards" : "🔴 Reader Offline — card scanning unavailable"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-300">
            {counts.withCard} with card
          </span>
          <span className="rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-muted-foreground">
            {counts.withoutCard} without card
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={toggle}>
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          {isOnline ? "Simulate disconnect" : "Bring online"}
        </Button>
      </div>

      <div className="surface overflow-hidden">
        <header className="flex flex-wrap items-center gap-3 border-b border-border/70 px-5 py-4">
          <p className="mr-auto font-heading text-base font-bold tracking-tight">Student Cards</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search students"
              className="h-9 w-full pl-8 sm:w-56"
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
        </header>

        {isError ? (
          <div className="p-5 text-sm text-destructive" role="alert">
            Could not load the student roster.{" "}
            <button className="font-semibold underline" onClick={() => refetch()}>Try again</button>
          </div>
        ) : !data ? (
          <div className="p-5">
            <TableSkeleton rows={6} />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={CreditCard}
              title={query ? "No matching students" : "No students in this filter"}
              description={
                query
                  ? "Try a different name, student ID or RFID UID."
                  : "Every student in this class already has an RFID card assigned."
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
                    <th className="px-5 py-3">Card Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {rows.map((student) => (
                    <tr
                      key={student.id}
                      onClick={() => navigate(`/students/${student.id}`)}
                      className="cursor-pointer transition-colors hover:bg-muted/40"
                    >
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-muted-foreground">
                        {student.student_code}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                              avatarTone(student.full_name)
                            )}
                          >
                            {initials(student.full_name)}
                          </div>
                          <span className="text-sm font-semibold">{student.full_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {student.rfid_uid ? (
                          <span className="uid-chip">{student.rfid_uid}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">No card assigned</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge
                          label={student.rfid_uid ? "🟢 Active" : "⚪ No Card"}
                          className={student.rfid_uid ? CARD_ACTIVE : CARD_NONE}
                          size="sm"
                        />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(event) => {
                            event.stopPropagation();
                            openFor(student);
                          }}
                        >
                          <CreditCard className="mr-2 h-3.5 w-3.5" />
                          {student.rfid_uid ? "Reassign" : "Assign Card"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-border/60 md:hidden">
              {rows.map((student) => (
                <div
                  key={student.id}
                  onClick={() => navigate(`/students/${student.id}`)}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      avatarTone(student.full_name)
                    )}
                  >
                    {initials(student.full_name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{student.full_name}</p>
                    <p className="truncate font-mono text-[11px] text-muted-foreground">
                      {student.student_code} · {student.rfid_uid || "no card"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(event) => {
                      event.stopPropagation();
                      openFor(student);
                    }}
                  >
                    {student.rfid_uid ? "Reassign" : "Assign"}
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <AssignCardModal
        open={modalOpen || Boolean(searchParams.get("assign"))}
        onOpenChange={(value) => {
          setModalOpen(value);
          if (!value && searchParams.has("assign")) {
            setSearchParams({}, { replace: true });
          }
          if (!value) setPreselect(null);
        }}
        students={students}
        initialStudentId={searchParams.has("assign") ? null : preselect}
        onAssigned={refresh}
      />
    </div>
  );
}