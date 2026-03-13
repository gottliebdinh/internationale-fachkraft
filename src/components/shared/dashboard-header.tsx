"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  title: string;
  notificationCount?: number;
}

export function DashboardHeader({
  title,
  notificationCount = 0,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <h1 className="font-semibold text-lg flex-1">{title}</h1>

      <DropdownMenu>
        <DropdownMenuTrigger className="relative inline-flex shrink-0 items-center justify-center rounded-lg h-8 w-8 text-sm font-medium transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
            >
              {notificationCount}
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuItem className="text-muted-foreground text-sm">
            Keine neuen Benachrichtigungen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
