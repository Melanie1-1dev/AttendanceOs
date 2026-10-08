import React from "react";
import { cn } from "@/lib/utils";

export default function StatusBadge({ label, className, dot, pulse = false, size = "md" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", dot)} />}
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", dot)} />
        </span>
      )}
      {label}
    </span>
  );
}