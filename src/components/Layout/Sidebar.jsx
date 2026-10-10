import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarClock, CalendarDays, CreditCard, Settings, ScanLine, X, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useAuth } from "@/lib/AuthContext";
import useCurrentUser from "@/lib/use-current-user";
import { initials } from "@/lib/attendance-utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/sessions", label: "Sessions", icon: CalendarClock },
  { to: "/timetable", label: "Timetable", icon: CalendarDays },
  { to: "/rfid-cards", label: "RFID Cards", icon: CreditCard },
];

function NavItem({ item, collapsed, onNavigate }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          collapsed && "justify-center px-0",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "absolute left-0 h-6 w-1 rounded-r-full bg-sidebar-primary transition-all duration-300",
              isActive ? "opacity-100" : "opacity-0"
            )}
          />
          <Icon className={cn("h-[18px] w-[18px] shrink-0 transition-colors", isActive && "text-sidebar-primary")} />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
  const user = useCurrentUser();
  const { logout } = useAuth();
  const name = user?.full_name || "Teacher";

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-out",
          "border-r border-sidebar-border",
          collapsed ? "w-[86px]" : "w-[272px]",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className={cn("flex h-16 items-center gap-3 px-5", collapsed && "justify-center px-0")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/40">
            <ScanLine className="h-[18px] w-[18px] text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-heading text-[15px] font-bold tracking-tight text-amber-200">AttendanceOS</p>
              <p className="truncate text-[11px] text-sidebar-foreground/80">RFID Attendance Platform</p>
            </div>
          )}
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className={cn("mt-4 flex-1 space-y-1", collapsed ? "px-3" : "px-3")}>
          {!collapsed && (
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/60">
              Workspace
            </p>
          )}
          {NAV.map((item) => (
            <NavItem key={item.to} item={item} collapsed={collapsed} onNavigate={onClose} />
          ))}
        </nav>

        <div className="space-y-2 border-t border-sidebar-border px-3 py-3">
          <ThemeToggle variant="sidebar" collapsed={collapsed} />
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )
            }
          >
            <Settings className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>Settings</span>}
          </NavLink>

          <div
            className={cn(
              "flex items-center gap-3 rounded-xl bg-sidebar-accent/60 p-3",
              collapsed && "justify-center p-2"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-[13px] font-bold text-white">
              {initials(name)}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-amber-200" title={name}>{name}</p>
                <p className="truncate text-[11px] text-sidebar-foreground/80">Class Teacher</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={logout}
            aria-label="Log out"
            title={collapsed ? "Log out" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>

          <button
            onClick={onToggleCollapse}
            className={cn(
              "hidden w-full items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground lg:flex",
              collapsed && "justify-center px-0"
            )}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse sidebar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}