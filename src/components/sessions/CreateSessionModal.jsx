import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { CLASS_OPTIONS } from "@/lib/classroom";
import { toISODate } from "@/lib/attendance-utils";
import useCurrentUser from "@/lib/use-current-user";

const EMPTY = {
  class_name: "CS Year 3",
  subject: "",
  teacher_name: "",
  room: "",
  date: "",
  start_time: "08:00",
  end_time: "10:00",
};

export default function CreateSessionModal({ open, onOpenChange, onCreated, initialValues }) {
  const user = useCurrentUser();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY, date: toISODate(), teacher_name: user?.full_name || "", ...(initialValues || {}) });
      setError("");
    }
  }, [open, user, initialValues]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.subject.trim()) return setError("Give the session a name, for example “Database Systems”.");
    if (!form.date) return setError("Pick the date the session takes place.");
    if (!form.start_time || !form.end_time) return setError("Set both a start and an end time.");
    if (form.end_time <= form.start_time) return setError("The end time must be later than the start time.");

    setSaving(true);
    setError("");
    try {
      const created = await base44.entities.Session.create({
        ...form,
        subject: form.subject.trim(),
        teacher_name: form.teacher_name.trim() || user?.full_name || "Teacher",
        status: "scheduled",
        slot_id: form.slot_id || "",
      });
      toast.success("Session created", { description: `${created.subject} · ${created.start_time} – ${created.end_time}` });
      onCreated?.(created);
      onOpenChange(false);
    } catch (err) {
      setError("The session could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarPlus className="h-5 w-5" />
          </div>
          <DialogTitle className="font-heading text-xl font-bold tracking-tight">Create Session</DialogTitle>
          <DialogDescription>
            Set up a classroom attendance session. Students can scan their RFID cards once the session is open.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="class_name">Class</Label>
              <select
                id="class_name"
                value={form.class_name}
                onChange={(event) => update("class_name", event.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {CLASS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={form.room}
                onChange={(event) => update("room", event.target.value)}
                placeholder="Lab A"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Session name</Label>
            <Input
              id="subject"
              value={form.subject}
              onChange={(event) => update("subject", event.target.value)}
              placeholder="Database Systems"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher_name">Teacher</Label>
            <Input
              id="teacher_name"
              value={form.teacher_name}
              onChange={(event) => update("teacher_name", event.target.value)}
              placeholder="Teacher name"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={form.date} onChange={(event) => update("date", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_time">Start time</Label>
              <Input
                id="start_time"
                type="time"
                value={form.start_time}
                onChange={(event) => update("start_time", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End time</Label>
              <Input
                id="end_time"
                type="time"
                value={form.end_time}
                onChange={(event) => update("end_time", event.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Creating…" : "Create Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}