import { CalendarDays } from "lucide-react";
import useCurrentUser from "@/lib/use-current-user";

export default function GreetingHeader() {
  const user = useCurrentUser();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.full_name?.trim().split(/\s+/)[0] || "Teacher";

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
      <div className="relative z-10">
        <p className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
          {greeting}, {firstName}
        </p>
        <p className="mt-2 max-w-xl text-sm text-indigo-100">
          Your classroom attendance at a glance. Open a session to start recording RFID scans.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-indigo-100">
          <CalendarDays className="h-4 w-4" />
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <div aria-hidden="true" className="absolute -right-12 -top-16 h-56 w-56 rounded-full border-[24px] border-white/10" />
      <div aria-hidden="true" className="absolute -bottom-28 right-24 h-48 w-48 rounded-full bg-white/5" />
    </section>
  );
}
