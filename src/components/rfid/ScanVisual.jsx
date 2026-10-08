import React from "react";
import { ScanLine, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

const LABELS = {
  idle: "Place RFID card on the reader",
  scanning: "Reading card…",
  success: "Attendance recorded",
  duplicate: "Card already scanned",
  unknown: "Card not recognised",
  closed: "Session closed",
  scheduled: "Session not started",
  offline: "Reader offline",
};

const ICON_STYLES = {
  success: "from-emerald-500 to-teal-500 shadow-emerald-500/30",
  duplicate: "from-amber-500 to-orange-500 shadow-amber-500/30",
  unknown: "from-rose-500 to-red-500 shadow-rose-500/30",
  offline: "from-slate-500 to-slate-700 shadow-slate-500/30",
  closed: "from-slate-500 to-slate-700 shadow-slate-500/30",
  scheduled: "from-indigo-500 to-violet-600 shadow-indigo-500/30",
};

export default function ScanVisual({ state, isOnline, compact = false, label, caption }) {
  const active = state === "scanning";
  const isIdle = state === "idle";
  const accent = ICON_STYLES[state];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl border border-border/70",
        compact ? "h-[230px]" : "h-[330px]",
        "bg-gradient-to-b from-slate-50 to-white dark:from-white/[0.04] dark:to-transparent"
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(100,116,139,0.25)_1px,transparent_0)] [background-size:22px_22px]" />

      {["left-4 top-4 border-l-2 border-t-2", "right-4 top-4 border-r-2 border-t-2", "left-4 bottom-4 border-b-2 border-l-2", "right-4 bottom-4 border-b-2 border-r-2"].map(
        (position) => (
          <span key={position} className={cn("pointer-events-none absolute h-5 w-5 rounded-[3px] border-primary/40", position)} />
        )
      )}

      {isOnline && (active || isIdle) && (
        <div className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-primary/20 to-transparent rfid-sweep" />
      )}

      <div className="relative flex flex-col items-center">
        <div className="relative flex h-[190px] w-[190px] items-center justify-center">
          {isOnline &&
            [0, 1, 2].map((index) => (
              <span
                key={index}
                className={cn(
                  "absolute h-[190px] w-[190px] rounded-full border border-primary/35 rfid-ring",
                  index === 1 && "rfid-ring-2",
                  index === 2 && "rfid-ring-3"
                )}
              />
            ))}

          <div
            className={cn(
              "relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br shadow-xl transition-all duration-500",
              accent || "from-indigo-500 to-violet-600 shadow-indigo-500/30",
              active && "scale-105"
            )}
          >
            {isOnline ? (
              <ScanLine className="h-10 w-10 text-white" />
            ) : (
              <WifiOff className="h-10 w-10 text-white" />
            )}
          </div>

          <div
            className={cn(
              "absolute -right-1 top-2 h-9 w-14 rounded-lg border border-white/40 bg-white/80 shadow-lg backdrop-blur soft-float dark:bg-white/10",
              !isOnline && "opacity-40"
            )}
          >
            <span className="absolute left-2 top-2 h-2 w-3 rounded-sm bg-amber-400/90" />
            <span className="absolute left-2 top-5 h-1.5 w-8 rounded-full bg-slate-400/70" />
          </div>
        </div>

        <p className="mt-6 font-heading text-lg font-bold tracking-tight">{label || LABELS[state] || LABELS.idle}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {caption || (isOnline ? "READER-01 · awaiting card" : "No device detected on USB-HID")}
        </p>
      </div>
    </div>
  );
}