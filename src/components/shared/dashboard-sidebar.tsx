"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/database";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Handshake,
  FileText,
  Settings,
  ShieldCheck,
  BarChart3,
  ClipboardList,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  role: UserRole;
  onSignOut: () => void;
}

const navConfig: Record<
  UserRole,
  { label: string; items: { href: string; labelKey: string; icon: React.ComponentType<{ className?: string }> }[] }[]
> = {
  admin: [
    {
      label: "Administration",
      items: [
        { href: "/dashboard/admin", labelKey: "dashboard", icon: LayoutDashboard },
        { href: "/dashboard/admin/users", labelKey: "users", icon: Users },
        { href: "/dashboard/admin/verification", labelKey: "verification", icon: ShieldCheck },
        { href: "/dashboard/admin/matches", labelKey: "matches", icon: Handshake },
        { href: "/dashboard/admin/audit", labelKey: "audit", icon: ClipboardList },
        { href: "/dashboard/admin/statistics", labelKey: "statistics", icon: BarChart3 },
      ],
    },
  ],
  school: [
    {
      label: "Schule",
      items: [
        { href: "/dashboard/school", labelKey: "dashboard", icon: LayoutDashboard },
        { href: "/dashboard/school/candidates", labelKey: "candidates", icon: GraduationCap },
        { href: "/dashboard/school/matches", labelKey: "matches", icon: Handshake },
        { href: "/dashboard/school/settings", labelKey: "settings", icon: Settings },
      ],
    },
  ],
  employer: [
    {
      label: "Arbeitgeber",
      items: [
        { href: "/dashboard/employer", labelKey: "dashboard", icon: LayoutDashboard },
        { href: "/dashboard/employer/positions", labelKey: "positions", icon: Briefcase },
        { href: "/dashboard/employer/candidates", labelKey: "candidates", icon: Users },
        { href: "/dashboard/employer/matches", labelKey: "matches", icon: Handshake },
        { href: "/dashboard/employer/documents", labelKey: "documents", icon: FileText },
        { href: "/dashboard/employer/settings", labelKey: "settings", icon: Settings },
      ],
    },
  ],
};

export function DashboardSidebar({ role, onSignOut }: DashboardSidebarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const groups = navConfig[role] || navConfig.employer;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-lg font-bold text-sidebar-foreground">
            GeVin
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== `/dashboard/${role}` &&
                      pathname.startsWith(item.href));
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={isActive}
                        className={cn(isActive && "bg-sidebar-accent")}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.labelKey)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Abmelden
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
