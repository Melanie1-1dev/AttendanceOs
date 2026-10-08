import React from "react";
import { Search, ArrowRight, ScanLine, AlertTriangle, RefreshCw, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ScanVisual from "@/components/rfid/ScanVisual";
import { avatarTone, initials } from "@/lib/attendance-utils";

function StudentChip({ student }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/40 p-3">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          avatarTone(student.full_name)
        )}
      >
        {initials(student.full_name)}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{student.full_name}</p>
        <p className="text-xs text-muted-foreground">
          {student.student_code} · {student.rfid_uid || "no card"}
        </p>
      </div>
    </div>
  );
}

function UidField({ uid }) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/40 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Detected UID</p>
      <p className="mt-1 font-mono text-sm font-semibold">{uid || "—"}</p>
    </div>
  );
}

export function StepSelect({ students, query, onQuery, onPick }) {
  const needle = query.trim().toLowerCase();
  const list = students.filter(
    (student) =>
      !needle ||
      student.full_name.toLowerCase().includes(needle) ||
      student.student_code.toLowerCase().includes(needle)
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search students by name or ID"
          className="h-10 pl-9"
        />
      </div>
      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
        {list.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No students match “{query}”.</p>
        )}
        {list.map((student) => (
          <button
            key={student.id}
            onClick={() => onPick(student)}
            className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/50"
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
              <p className="text-xs text-muted-foreground">{student.student_code}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold",
                student.rfid_uid ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" : "bg-slate-500/10 text-slate-600 dark:text-slate-300"
              )}
            >
              {student.rfid_uid || "No card"}
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepScan({ student, scanning, uid, onScan, onScanConflict, onConfirm, onRescan, onBack }) {
  return (
    <div className="space-y-4">
      <StudentChip student={student} />
      <ScanVisual
        state={scanning ? "scanning" : uid ? "success" : "idle"}
        isOnline
        compact
        label={scanning ? "Reading card…" : uid ? "Card detected" : "Place RFID card on reader"}
        caption={uid ? "UID captured · READER-01" : "READER-01 · awaiting card"}
      />

      {uid ? (
        <>
          <UidField uid={uid} />
          <p className="text-xs text-muted-foreground">
            The UID is read from the card and cannot be edited. Confirm to link it to {student.full_name}.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onBack}>
              Change student
            </Button>
            <Button variant="outline" onClick={onRescan}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Rescan
            </Button>
            <Button className="flex-1" onClick={onConfirm}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Confirm Assignment
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-center text-sm text-muted-foreground">
            Place the RFID card on READER-01 to read its UID.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="flex-1" onClick={onScan} disabled={scanning}>
              <ScanLine className="mr-2 h-4 w-4" />
              {scanning ? "Reading card…" : "Simulate Card Scan"}
            </Button>
            <Button variant="outline" className="flex-1" onClick={onScanConflict} disabled={scanning}>
              Simulate already-assigned card
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export function StepConflict({ student, owner, uid, onCancel, onUpdateOwner }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.08] p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" />
        <div>
          <p className="font-heading text-sm font-bold">Card Already Assigned</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This card is already assigned to {owner.full_name}. Do you want to update its owner?
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StudentChip student={owner} />
        <StudentChip student={student} />
      </div>
      <UidField uid={uid} />

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={onUpdateOwner}>
          Update Owner
        </Button>
      </div>
    </div>
  );
}

export function StepConfirm({ student, owner, uid, saving, onCancel, onConfirm }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.07] p-4">
        <p className="font-heading text-sm font-bold">Confirm RFID reassignment</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The RFID association will move from the current owner to the new student. The card will stop identifying{" "}
          {owner.full_name}.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/40 p-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Current owner</p>
          <p className="truncate text-sm font-semibold">{owner.full_name}</p>
          <p className="text-xs text-muted-foreground">{owner.student_code}</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">New owner</p>
          <p className="truncate text-sm font-semibold">{student.full_name}</p>
          <p className="text-xs text-muted-foreground">{student.student_code}</p>
        </div>
      </div>

      <UidField uid={uid} />

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={onConfirm} disabled={saving}>
          {saving ? "Reassigning…" : "Confirm reassignment"}
        </Button>
      </div>
    </div>
  );
}