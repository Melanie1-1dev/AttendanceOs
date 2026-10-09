import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/common/Skeletons";
import TimetableBoard from "@/components/timetable/TimetableBoard";
import CreateSessionModal from "@/components/sessions/CreateSessionModal";
import { api } from "@/api/client";
import { DAYS, todayKey, weekDates } from "@/lib/timetable";

const EMPTY_SESSIONS = [];

export default function Timetable() {
  const navigate = useNavigate();
  const { data, isError, refetch } = useQuery({
    queryKey: ["timetable"],
    queryFn: async () => {
      const [slots, sessions] = await Promise.all([
        api.entities.TimetableSlot.list("start_time", 200),
        api.entities.Session.list("-date", 200),
      ]);
      return { slots, sessions };
    },
  });
  const slots = data?.slots ?? null;
  const sessions = data?.sessions ?? EMPTY_SESSIONS;
  const [selectedDay, setSelectedDay] = useState(todayKey);
  const [createOpen, setCreateOpen] = useState(false);
  const [prefill, setPrefill] = useState(null);

  const dates = useMemo(() => weekDates(), []);

  const refresh = useCallback(() => refetch(), [refetch]);

  const board = useMemo(() => {
    const grouped = {};
    DAYS.forEach((day) => {
      grouped[day.key] = [];
    });
    (slots || []).forEach((slot) => {
      if (grouped[slot.day_of_week]) grouped[slot.day_of_week].push(slot);
    });

    const result = {};
    DAYS.forEach((day) => {
      const date = dates[day.key];
      result[day.key] = grouped[day.key]
        .sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""))
        .map((slot) => ({
          slot,
          date,
          session:
            sessions.find((item) => item.slot_id && item.slot_id === slot.id && item.date === date) ||
            sessions.find(
              (item) =>
                !item.slot_id &&
                item.date === date &&
                item.subject === slot.subject &&
                item.start_time === slot.start_time
            ) ||
            null,
        }));
    });
    return result;
  }, [slots, sessions, dates]);

  const openFromSlot = (slot) => {
    setPrefill({
      class_name: slot.class_name,
      subject: slot.subject,
      teacher_name: slot.teacher_name,
      room: slot.room,
      start_time: slot.start_time,
      end_time: slot.end_time,
      date: dates[slot.day_of_week],
      slot_id: slot.id,
    });
    setCreateOpen(true);
  };

  const totalSlots = (slots || []).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-extrabold tracking-tight">Timetable</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Weekly class schedule — prepare a session straight from a slot.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {slots && (
            <span className="rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
              {totalSlots} weekly slots
            </span>
          )}
          <Button
            onClick={() => {
              setPrefill({ date: dates[todayKey()] });
              setCreateOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Session
          </Button>
        </div>
      </div>

      {isError ? (
        <div className="surface p-6 text-center" role="alert">
          <p className="font-semibold">Could not load the timetable.</p>
          <button className="mt-3 text-sm font-semibold text-primary hover:underline" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : !slots ? (
        <TableSkeleton rows={4} />
      ) : slots.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No timetable yet"
          description="Add weekly slots to the class timetable so sessions can be prepared from them."
        />
      ) : (
        <TimetableBoard
          board={board}
          dates={dates}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onOpenSession={(session) => navigate(`/sessions/${session.id}`)}
          onCreate={openFromSlot}
        />
      )}

      <CreateSessionModal
        open={createOpen}
        onOpenChange={(value) => {
          setCreateOpen(value);
          if (!value) setPrefill(null);
        }}
        onCreated={refresh}
        initialValues={prefill}
      />
    </div>
  );
}