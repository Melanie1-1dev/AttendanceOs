import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Lock, WifiOff, Loader2, CreditCard, Radio, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { avatarTone, formatTime, initials } from "@/lib/attendance-utils";

const TONES = {
  neutral: "border-border/70 bg-muted/40",
  success: "border-emerald-500/30 bg-emerald-500/[0.07]",
  warning: "border-amber-500/30 bg-amber-500/[0.07]",
  danger: "border-rose-500/30 bg-rose-500/[0.07]",
};

function Shell({ tone, icon, iconClass, title, subtitle, children }) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex h-full flex-col rounded-2xl border p-5", TONES[tone])}
    >
      <div className="flex items-center gap-3">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", iconClass)}>{icon}</div>
        <div className="min-w-0">
          <p className="font-heading text-base font-bold tracking-tight">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-4 flex-1">{children}</div>
    </motion.div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/70 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 truncate text-sm font-semibold", mono && "font-mono text-[13px]")}>{value || "—"}</p>
    </div>
  );
}

export default function ScanResult({ view, result, onManageCard, onOpenSession, onReconnect }) {
  const student = result?.student;

  return (
    <div className="min-h-[330px]">
      <AnimatePresence mode="wait">
        {view === "success" && student && (
          <Shell
            tone="success"
            icon={<CheckCircle2 className="h-6 w-6" />}
            iconClass="bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
            title="Attendance Recorded"
            subtitle="Attendance successfully recorded."
          >
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 p-3">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  avatarTone(student.full_name)
                )}
              >
                {initials(student.full_name)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{student.full_name}</p>
                <p className="text-xs text-muted-foreground">{student.class_name}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Field label="Student ID" value={student.student_code} />
              <Field label="RFID UID" value={result.uid} mono />
              <Field label="Time" value={formatTime(result.time)} />
              <Field label="Method" value="RFID card" />
            </div>
          </Shell>
        )}

        {view === "duplicate" && student && (
          <Shell
            tone="warning"
            icon={<AlertTriangle className="h-6 w-6" />}
            iconClass="bg-amber-500/15 text-amber-600 dark:text-amber-300"
            title="Already Marked Present"
            subtitle="No new record was created."
          >
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 p-3">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  avatarTone(student.full_name)
                )}
              >
                {initials(student.full_name)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{student.full_name}</p>
                <p className="text-xs text-muted-foreground">First recorded at {formatTime(result.time)}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              This student already has an attendance record for this session. Each student can only be marked present once.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Field label="Student ID" value={student.student_code} />
              <Field label="RFID UID" value={result.uid} mono />
            </div>
          </Shell>
        )}

        {view === "unknown" && (
          <Shell
            tone="danger"
            icon={<AlertTriangle className="h-6 w-6" />}
            iconClass="bg-rose-500/15 text-rose-600 dark:text-rose-300"
            title="Unregistered RFID Card"
            subtitle="This card is not assigned to a student."
          >
            <div className="rounded-xl border border-border/60 bg-card/80 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Detected UID</p>
              <p className="mt-0.5 font-mono text-sm font-semibold">{result?.uid || "—"}</p>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              No student is linked to this card, so no attendance was recorded. Assign it from Card Management first.
            </p>
            <Button className="mt-4 w-full" onClick={onManageCard}>
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Card
            </Button>
          </Shell>
        )}

        {view === "closed" && (
          <Shell
            tone="neutral"
            icon={<Lock className="h-6 w-6" />}
            iconClass="bg-slate-500/15 text-slate-600 dark:text-slate-300"
            title="Attendance Session Closed"
            subtitle="Recording is locked for this session."
          >
            <p className="text-sm text-muted-foreground">
              New attendance records cannot be created. Closed sessions keep the attendance list frozen for reporting.
            </p>
          </Shell>
        )}

        {view === "scheduled" && (
          <Shell
            tone="neutral"
            icon={<PlayCircle className="h-6 w-6" />}
            iconClass="bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
            title="Session Not Started"
            subtitle="Open the session to begin scanning."
          >
            <p className="text-sm text-muted-foreground">
              Attendance can only be recorded while a session is open. Start this session when the class begins.
            </p>
            <Button className="mt-4 w-full" onClick={onOpenSession}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Open Session
            </Button>
          </Shell>
        )}

        {view === "offline" && (
          <Shell
            tone="danger"
            icon={<WifiOff className="h-6 w-6" />}
            iconClass="bg-rose-500/15 text-rose-600 dark:text-rose-300"
            title="RFID Reader Offline"
            subtitle="No device detected on USB-HID."
          >
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-rose-500">•</span> Check the USB cable between the reader and this computer.
              </li>
              <li className="flex gap-2">
                <span className="text-rose-500">•</span> Reconnect the reader, then wait for the status light.
              </li>
              <li className="flex gap-2">
                <span className="text-rose-500">•</span> Attendance cannot be recorded until the reader is online.
              </li>
            </ul>
            <Button variant="outline" className="mt-4 w-full" onClick={onReconnect}>
              <Radio className="mr-2 h-4 w-4" />
              Reconnect Reader
            </Button>
          </Shell>
        )}

        {view === "scanning" && (
          <Shell
            tone="neutral"
            icon={<Loader2 className="h-6 w-6 animate-spin" />}
            iconClass="bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
            title="Reading Card…"
            subtitle="Validating UID against student registry"
          >
            <div className="space-y-2">
              {[0, 1, 2].map((index) => (
                <div key={index} className="h-3 animate-pulse rounded-full bg-muted" style={{ width: `${90 - index * 18}%` }} />
              ))}
            </div>
          </Shell>
        )}

        {view === "idle" && (
          <Shell
            tone="neutral"
            icon={<CreditCard className="h-6 w-6" />}
            iconClass="bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
            title="Ready for Attendance"
            subtitle="Place RFID card on the reader"
          >
            <div className="space-y-3">
              {[
                { step: "1", text: "Reader captures the card UID" },
                { step: "2", text: "UID is matched to a registered student" },
                { step: "3", text: "Duplicates are rejected automatically" },
                { step: "4", text: "Attendance is recorded instantly" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                    {item.step}
                  </span>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </Shell>
        )}
      </AnimatePresence>
    </div>
  );
}