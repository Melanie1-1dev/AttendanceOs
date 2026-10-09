import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";
import { CreditCard, Moon, Radio, Sparkles, Sun, User, Users, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/api/client";
import useCurrentUser from "@/lib/use-current-user";
import { useReader } from "@/lib/reader-context";
import { initials, rosterOf } from "@/lib/attendance-utils";
import { cn } from "@/lib/utils";

function Panel({ icon: Icon, title, description, children }) {
  return (
    <section className="surface p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="font-heading text-base font-bold tracking-tight">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function Settings() {
  const user = useCurrentUser();
  const { isOnline, toggle } = useReader();
  const { setTheme, theme } = useTheme();
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    api.entities.Student.list("student_code", 300).then((students) => {
      const roster = rosterOf(students);
      setCounts({
        total: roster.length,
        withCard: roster.filter((student) => student.rfid_uid).length,
      });
    });
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-2xl font-extrabold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Reader, profile and appearance preferences.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel icon={User} title="Teacher Profile" description="The account used for this portal.">
          <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/40 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
              {initials(user?.full_name || "Teacher")}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.full_name || "Teacher"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email || "—"}</p>
            </div>
          </div>
        </Panel>

        <Panel icon={Radio} title="RFID Reader" description="READER-01 is the single reader used for this class.">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/40 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">{isOnline ? "🟢 Reader Online" : "🔴 Reader Offline"}</p>
                <p className="text-xs text-muted-foreground">USB-HID · 13.56 MHz</p>
              </div>
              {isOnline ? <Radio className="h-5 w-5 text-emerald-500" /> : <WifiOff className="h-5 w-5 text-rose-500" />}
            </div>
            <Button variant="outline" className="w-full" onClick={toggle}>
              {isOnline ? "Simulate disconnect" : "Bring reader online"}
            </Button>
          </div>
        </Panel>

        <Panel icon={isOnline ? Sun : Moon} title="Appearance" description="Switch between light and dark mode.">
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className="flex-1"
              onClick={() => {
                setTheme("light");
                toast.success("Light mode enabled");
              }}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              className="flex-1"
              onClick={() => {
                setTheme("dark");
                toast.success("Dark mode enabled");
              }}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </Button>
          </div>
        </Panel>

        <Panel icon={CreditCard} title="Class Roster" description="Cards currently linked to students.">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="mt-2 font-heading text-2xl font-extrabold">{counts ? counts.total : "—"}</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Students</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <p className="mt-2 font-heading text-2xl font-extrabold">{counts ? counts.withCard : "—"}</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Active cards</p>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        icon={Sparkles}
        title="Demo Mode"
        description="The prototype ships with a built-in RFID simulator."
      >
        <div className={cn("rounded-xl border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground")}>
          Every scanner has a <span className="font-semibold text-foreground">Simulate RFID Scan</span> button and an{" "}
          <span className="font-semibold text-foreground">RFID Simulator</span> menu so a successful scan, a duplicate, an
          unknown card, a card assignment, a reassignment and an offline reader can all be demonstrated without physical
          hardware.
        </div>
      </Panel>
    </div>
  );
}