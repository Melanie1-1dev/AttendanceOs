import React from "react";
import SlotCard from "@/components/timetable/SlotCard";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/attendance-utils";
import { DAYS, todayKey } from "@/lib/timetable";

export default function TimetableBoard({ board, dates, selectedDay, onSelectDay, onOpenSession, onCreate }) {
  const today = todayKey();

  return (
    <>
      <div className="space-y-4 lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {DAYS.map((day) => (
            <button
              key={day.key}
              onClick={() => onSelectDay(day.key)}
              className={cn(
                "shrink-0 rounded-xl border px-3 py-2 text-center transition-colors",
                selectedDay === day.key
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/70 bg-card text-muted-foreground"
              )}
            >
              <span className="block text-xs font-bold">{day.short}</span>
              <span className="block text-[10px] tabular-nums">
                {formatDate(dates[day.key]).replace(", 2026", "")}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          {(board[selectedDay] || []).length === 0 ? (
            <p className="rounded-xl border border-dashed border-border/70 px-4 py-10 text-center text-sm text-muted-foreground">
              No slots scheduled for this day.
            </p>
          ) : (
            (board[selectedDay] || []).map((entry) => (
              <SlotCard
                key={entry.slot.id}
                slot={entry.slot}
                session={entry.session}
                onOpenSession={onOpenSession}
                onCreate={onCreate}
              />
            ))
          )}
        </div>
      </div>

      <div className="hidden gap-3 lg:grid lg:grid-cols-5">
        {DAYS.map((day) => {
          const isToday = day.key === today;
          const entries = board[day.key] || [];
          return (
            <div
              key={day.key}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border p-3",
                isToday ? "border-primary/30 bg-primary/[0.04]" : "border-border/60 bg-muted/20"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-heading text-sm font-bold tracking-tight">{day.label}</p>
                  <p className="text-[11px] tabular-nums text-muted-foreground">{formatDate(dates[day.key])}</p>
                </div>
                {isToday && (
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    Today
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                {entries.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border/70 px-3 py-8 text-center text-[11px] text-muted-foreground">
                    No slots
                  </p>
                ) : (
                  entries.map((entry) => (
                    <SlotCard
                      key={entry.slot.id}
                      slot={entry.slot}
                      session={entry.session}
                      onOpenSession={onOpenSession}
                      onCreate={onCreate}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}