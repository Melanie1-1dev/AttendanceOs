import React from "react";
import { Lock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CloseSessionDialog({ open, onOpenChange, session, onConfirm }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-300">
            <Lock className="h-5 w-5" />
          </div>
          <AlertDialogTitle className="font-heading text-xl font-bold tracking-tight">
            Close attendance session?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Students will no longer be able to record attendance after this session is closed. The attendance list stays
            available for viewing and export.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {session && (
          <div className="rounded-xl border border-border/70 bg-muted/50 px-4 py-3">
            <p className="text-sm font-semibold">{session.subject}</p>
            <p className="text-xs text-muted-foreground">
              {session.class_name} · {session.start_time} – {session.end_time}
            </p>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Close Session</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}