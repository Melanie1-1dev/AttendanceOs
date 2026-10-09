import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import SessionToolbar from "@/components/sessions/SessionToolbar";
import SessionList from "@/components/sessions/SessionList";
import CreateSessionModal from "@/components/sessions/CreateSessionModal";
import { TableSkeleton } from "@/components/common/Skeletons";
import { loadClassroom, openSessionRecord } from "@/lib/classroom";

export default function Sessions() {
  const navigate = useNavigate();
  const { data, isError, refetch } = useQuery({
    queryKey: ["classroom"],
    queryFn: loadClassroom,
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("all");

  const refresh = useCallback(() => refetch(), [refetch]);

  const filtered = useMemo(() => {
    const sessions = data?.sessions || [];
    const needle = query.trim().toLowerCase();
    return sessions.filter((session) => {
      const matchesQuery =
        !needle ||
        session.subject?.toLowerCase().includes(needle) ||
        session.class_name?.toLowerCase().includes(needle) ||
        session.teacher_name?.toLowerCase().includes(needle);
      const matchesDate = !date || session.date === date;
      const matchesStatus = status === "all" || session.status === status;
      return matchesQuery && matchesDate && matchesStatus;
    });
  }, [data, query, date, status]);

  const handleAction = async (session) => {
    if (session.status === "scheduled") {
      await openSessionRecord(session);
      toast.success("Session opened", { description: `${session.subject} is now accepting RFID scans.` });
    }
    navigate(`/sessions/${session.id}`);
  };

  const isFiltered = Boolean(query || date) || status !== "all";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-extrabold tracking-tight">Sessions</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage classroom attendance sessions.</p>
        </div>
        {data && (
          <div className="flex gap-2 text-xs font-semibold">
            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-300">
              {data.sessions.filter((item) => item.status === "open").length} open
            </span>
            <span className="rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-muted-foreground">
              {data.sessions.length} total
            </span>
          </div>
        )}
      </div>

      <SessionToolbar
        query={query}
        onQuery={setQuery}
        date={date}
        onDate={setDate}
        status={status}
        onStatus={setStatus}
        onCreate={() => setCreateOpen(true)}
      />

      {isError ? (
        <div className="surface p-6 text-center" role="alert">
          <p className="font-semibold">Could not load the classroom data.</p>
          <button className="mt-3 text-sm font-semibold text-primary hover:underline" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : !data ? (
        <TableSkeleton rows={5} />
      ) : (
        <SessionList
          sessions={filtered}
          students={data.students}
          attendance={data.attendance}
          onAction={handleAction}
          filtered={isFiltered}
        />
      )}

      <CreateSessionModal open={createOpen} onOpenChange={setCreateOpen} onCreated={refresh} />
    </div>
  );
}