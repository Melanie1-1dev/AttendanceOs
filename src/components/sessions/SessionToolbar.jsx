import React from "react";
import { Plus, Search, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "completed", label: "Completed" },
];

export default function SessionToolbar({
  query,
  onQuery,
  date,
  onDate,
  status,
  onStatus,
  onCreate,
}) {
  return (
    <div className="surface flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search class, subject or teacher"
          className="h-10 pl-9"
        />
      </div>

      <div className="relative">
        <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="date" value={date} onChange={(event) => onDate(event.target.value)} className="h-10 pl-9 lg:w-[190px]" />
      </div>

      <select
        value={status}
        onChange={(event) => onStatus(event.target.value)}
        className="h-10 rounded-lg border border-input bg-card px-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring lg:w-[170px]"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Button className="h-10" onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Create Session
      </Button>
    </div>
  );
}