import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ variant = "bar", collapsed = false }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (variant === "sidebar") {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
          collapsed && "justify-center px-0"
        )}
      >
        {isDark ? <Sun className="h-[18px] w-[18px] shrink-0" /> : <Moon className="h-[18px] w-[18px] shrink-0" />}
        {!collapsed && <span>{isDark ? "Light mode" : "Dark mode"}</span>}
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
    >
      <Sun className={cn("h-4 w-4 transition-all", isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100")} />
      <Moon
        className={cn("absolute h-4 w-4 transition-all", isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0 opacity-0")}
      />
    </button>
  );
}