import React from "react";
import { SlidersHorizontal, CheckCircle2, CopyX, HelpCircle, WifiOff, CreditCard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SimulatorMenu({ onSuccess, onDuplicate, onUnknown, onAssign, onReassign, onOffline }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          RFID Simulator
          <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          Demo scenarios
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSuccess}>
          <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
          Successful registered card
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}>
          <CopyX className="mr-2 h-4 w-4 text-amber-500" />
          Duplicate card
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onUnknown}>
          <HelpCircle className="mr-2 h-4 w-4 text-rose-500" />
          Unknown card
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onAssign}>
          <CreditCard className="mr-2 h-4 w-4 text-indigo-500" />
          Card assignment
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onReassign}>
          <CreditCard className="mr-2 h-4 w-4 text-violet-500" />
          Existing card reassignment
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onOffline}>
          <WifiOff className="mr-2 h-4 w-4 text-rose-500" />
          Reader offline
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}