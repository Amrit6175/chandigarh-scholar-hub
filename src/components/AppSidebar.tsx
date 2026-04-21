import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  ClipboardList,
  GaugeCircle,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { CULogo } from "./CULogo";
import { Button } from "./ui/button";
import type { Role } from "@/lib/types";

const itemsByRole: Record<Role, { title: string; url: string; icon: any }[]> = {
  admin: [
    { title: "Dashboard", url: "/app", icon: LayoutDashboard },
    { title: "Exams", url: "/app/exams", icon: ClipboardList },
    { title: "Question Bank", url: "/app/questions", icon: BookOpen },
    { title: "Results", url: "/app/results", icon: GaugeCircle },
    { title: "Users", url: "/app/users", icon: Users },
  ],
  teacher: [
    { title: "Dashboard", url: "/app", icon: LayoutDashboard },
    { title: "Exams", url: "/app/exams", icon: ClipboardList },
    { title: "Question Bank", url: "/app/questions", icon: BookOpen },
    { title: "Results", url: "/app/results", icon: GaugeCircle },
  ],
  student: [
    { title: "Dashboard", url: "/app", icon: LayoutDashboard },
    { title: "Exams", url: "/app/exams", icon: ClipboardList },
    { title: "My Results", url: "/app/results", icon: GaugeCircle },
  ],
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { currentUser, logout } = useApp();
  const location = useLocation();
  if (!currentUser) return null;
  const items = itemsByRole[currentUser.role];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/60">
      <SidebarHeader className="border-b border-sidebar-border/60 bg-sidebar/70 px-3 py-4">
        {collapsed ? (
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
        ) : (
          <CULogo size="sm" />
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="px-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
              Workspace
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = location.pathname === item.url || (item.url !== "/app" && location.pathname.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-10 rounded-lg">
                      <NavLink
                        to={item.url}
                        end={item.url === "/app"}
                        className={`group flex w-full items-center gap-3 px-3 transition-colors ${
                          active
                            ? "bg-gradient-to-r from-primary/20 to-primary/5 text-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                        }`}
                      >
                        <item.icon className={`h-4 w-4 ${active ? "text-primary-glow" : ""}`} />
                        {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                        {active && !collapsed && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-glow shadow-glow" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 p-2">
        {!collapsed ? (
          <div className="rounded-lg bg-sidebar-accent/40 p-3">
            <div className="text-xs text-muted-foreground">Demo Mode</div>
            <div className="mt-0.5 text-sm font-medium capitalize">{currentUser.role} session</div>
            <Button onClick={logout} variant="outline" size="sm" className="mt-3 w-full">
              <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
            </Button>
          </div>
        ) : (
          <Button onClick={logout} variant="ghost" size="icon" className="w-full" title="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
