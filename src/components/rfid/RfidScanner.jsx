import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Radio, Timer, Zap, WifiOff, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReader } from "@/lib/reader-context";
import useAttendanceScanner from "@/hooks/useAttendanceScanner";
import ScanVisual from "@/components/rfid/ScanVisual";
import ScanResult from "@/components/rfid/ScanResult";
import SimulatorMenu from "@/components/rfid/SimulatorMenu";
import { formatElapsed } from "@/lib/attendance-utils";

export default function RfidScanner({ session, students, records, onRecorded, onOpenSession, onAssignCard }) {
  const navigate = useNavigate();
  const { isOnline, goOnline } = useReader();
  const [, refreshElapsed] = useState(0);
  const scanner = useAttendanceScanner({ session, students, records, onRecorded });

  const locked = !session || session.status !== "open";
  const lockedState = locked ? (session?.status === "scheduled" ? "scheduled" : "closed") : null;
  const view = scanner.state === "idle" && lockedState ? lockedState : scanner.state;

  useEffect(() => {
    const id = setInterval(() => refreshElapsed((value) => value + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (scanner.state === "success" && scanner.result?.student) {
      toast.success("Attendance recorded", {
        description: `${scanner.result.student.full_name} · ${scanner.result.student.student_code}`,
      });
    }
    if (scanner.state === "duplicate" && scanner.result?.student) {
      toast.warning("Already marked present", {
        description: `${scanner.result.student.full_name} was already recorded for this session.`,
      });
    }
    if (scanner.state === "unknown") {
      toast.error("Unregistered RFID card", { description: `UID ${scanner.result?.uid} is not assigned to a student.` });
    }
    if (scanner.state === "offline") {
      toast.error("RFID reader offline", { description: "Reconnect the reader to continue recording attendance." });
    }
  }, [scanner.state, scanner.result]);

  const canScan = isOnline && !locked && !scanner.busy;

  const handleScan = () => {
    if (!isOnline || locked || scanner.busy) return;
    scanner.simulateRandom();
  };

  return (
    <section className="surface overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              isOnline ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300" : "bg-rose-500/12 text-rose-600 dark:text-rose-300"
            )}
          >
            {isOnline ? <Radio className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-heading text-sm font-bold tracking-tight">READER-01 · USB-HID</p>
            <p className={cn("text-xs font-medium", isOnline ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300")}>
              {isOnline ? "Reader Online" : "Reader Offline"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {session && (
            <span className="rounded-full border border-border/70 bg-muted/60 px-3 py-1.5 text-xs font-semibold">
              {session.subject}
            </span>
          )}
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs font-semibold",
              session?.status === "open"
                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-border/70 bg-muted/60 text-muted-foreground"
            )}
          >
            <Timer className="h-3.5 w-3.5" />
            {session?.status === "open" && session?.opened_at ? formatElapsed(session.opened_at) : "—"}
          </span>
        </div>
      </header>

      <div className="grid gap-5 p-5 lg:grid-cols-2">
        <ScanVisual state={view} isOnline={isOnline} />
        <ScanResult
          view={view}
          result={scanner.result}
          onManageCard={() => navigate("/rfid-cards")}
          onOpenSession={onOpenSession}
          onReconnect={() => {
            goOnline();
            scanner.reset();
            toast.success("Reader reconnected");
          }}
        />
      </div>

      <footer className="flex flex-wrap items-center gap-3 border-t border-border/70 bg-muted/40 px-5 py-4">
        <Button onClick={handleScan} disabled={!canScan} size="lg">
          <Zap className="mr-2 h-4 w-4" />
          {scanner.busy ? "Reading…" : "Simulate RFID Scan"}
        </Button>

        <SimulatorMenu
          onSuccess={scanner.simulateSuccess}
          onDuplicate={scanner.simulateDuplicate}
          onUnknown={scanner.simulateUnknown}
          onAssign={() => onAssignCard?.()}
          onReassign={() => onAssignCard?.({ reassign: true })}
          onOffline={scanner.simulateOffline}
        />

        {!isOnline && (
          <Button
            variant="outline"
            onClick={() => {
              goOnline();
              scanner.reset();
              toast.success("Reader reconnected");
            }}
          >
            <Radio className="mr-2 h-4 w-4" />
            Bring reader online
          </Button>
        )}

        <p className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <ScanLine className="h-3.5 w-3.5" />
          {locked ? "Scanner disabled while the session is not open" : "No reader at hand? The simulator behaves exactly like the hardware"}
        </p>
      </footer>
    </section>
  );
}