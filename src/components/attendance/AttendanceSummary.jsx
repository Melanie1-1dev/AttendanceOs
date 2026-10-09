import React from "react";
import { UserCheck, UserX, Users } from "lucide-react";
import CircularProgress from "@/components/common/CircularProgress";
import AnimatedNumber from "@/components/common/AnimatedNumber";

const TILES = [
  { key: "present", label: "Present", icon: UserCheck, classes: "text-emerald-600 dark:text-emerald-300" },
  { key: "absent", label: "Absent", icon: UserX, classes: "text-rose-600 dark:text-rose-300" },
  { key: "total", label: "Total", icon: Users, classes: "text-slate-600 dark:text-slate-300" },
];

export default function AttendanceSummary({ stats }) {
  return (
    <section className="surface flex flex-col gap-6 p-5 sm:flex-row sm:items-center">
      <div className="flex justify-center">
        <CircularProgress value={stats.rate} size={158} stroke={14}>
          <span className="font-heading text-3xl font-extrabold tracking-tight">
            <AnimatedNumber value={stats.rate} />
            <span className="text-base font-bold text-muted-foreground">%</span>
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Attendance</span>
        </CircularProgress>
      </div>

      <div className="flex-1">
        <p className="font-heading text-base font-bold tracking-tight">Attendance Summary</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Live figures for this session, updated with every scan.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <div key={tile.key} className="rounded-xl border border-border/70 bg-muted/40 p-3">
                <Icon className={`h-4 w-4 ${tile.classes}`} />
                <p className="mt-2 font-heading text-2xl font-extrabold tracking-tight">
                  <AnimatedNumber value={stats[tile.key]} />
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{tile.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-700 ease-out"
            style={{ width: `${stats.rate}%` }}
          />
        </div>
      </div>
    </section>
  );
}