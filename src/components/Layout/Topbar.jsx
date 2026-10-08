import React from "react";
import { useLocation } from "react-router-dom";
import { Menu, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/layout/ThemeToggle";
import useCurrentUser from "@/lib/use-current-user";
import { useReader } from "@/lib/reader-context";
import { initials } from "@/lib/attendance-utils";

const TITLES = {
  "/": { title: "Dashboard", subtitle: "Live classroom attendance overview" },
  "/sessions": { title: "Sessions", subtitle: "Manage classroom attendance sessions" },
  "/timetable": { title: "Timetable", subtitle: "Weekly class schedule" },
  "/rfid-cards": { title: "RFID Card Management", subtitle: "Assign and manage RFID cards for students" },
  "/settings": { title: "Settings", subtitle: "Reader, profile and appearance" },
};

function resolveTitle(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/sessions/")) return { title: "Session", subtitle: "Live attendance" };
  if (pathname.startsWith("/students/")) return { title: "Student", subtitle: "Full attendance history" };
  return { title: "AttendanceOS", subtitle: "RFID Attendance Platform" };
}

export default function Topbar({ onOpenMenu }) {
  const { pathname } = useLocation();
  const user = useCurrentUser();
  const { isOnline } = useReader();
  const heading = resolveTitle(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onOpenMenu}
          className="rounded-xl border border-border bg-card p-2 text-muted-foreground lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-heading text-[15px] font-bold tracking-tight sm:text-base">{heading.title}</h1>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">{heading.subtitle}</p>
        </div>

        <div
          className={cn(
            "hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold sm:flex",
            isOnline
              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300"
          )}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-70",
                isOnline ? "animate-ping bg-emerald-500" : "bg-rose-500"
              )}
            />
            <span className={cn("relative inline-flex h-2 w-2 rounded-full", isOnline ? "bg-emerald-500" : "bg-rose-500")} />
          </span>
          <Radio className="h-3.5 w-3.5" />
          {isOnline ? "Reader Online" : "Reader Offline"}
        </div>

        <ThemeToggle />

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[12px] font-bold text-white">
          {initials(user?.full_name || "Teacher")}
        </div>
      </div>
    </header>
  );
}