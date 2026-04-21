import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, LogOut, Repeat, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { Role } from "@/lib/types";

const roleLabel: Record<Role, string> = {
  admin: "Administrator",
  teacher: "Faculty",
  student: "Student",
};

export function TopHeader() {
  const { currentUser, logout, loginAs } = useApp();
  if (!currentUser) return null;
  const initials = currentUser.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/40 bg-background/60 px-4 backdrop-blur-xl md:px-6">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <div className="hidden items-center gap-2 rounded-lg border border-border/50 bg-card/40 px-3 py-1.5 md:flex md:w-72">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search exams, questions, students…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
        />
      </div>
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 animate-glow-pulse rounded-full bg-accent" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-11 gap-3 rounded-xl px-2 hover:bg-card/60">
              <div
                className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${currentUser.avatarColor} text-sm font-semibold text-white shadow-soft`}
              >
                {initials}
              </div>
              <div className="hidden text-left md:block">
                <div className="text-sm font-medium leading-tight">{currentUser.name}</div>
                <div className="text-xs text-muted-foreground">{roleLabel[currentUser.role]}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 glass-strong">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Signed in</span>
              <Badge variant="secondary" className="capitalize">{currentUser.role}</Badge>
            </DropdownMenuLabel>
            <div className="px-2 pb-2 text-xs text-muted-foreground">{currentUser.email}</div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Repeat className="h-3 w-3" /> Switch demo role
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => loginAs("admin")}>Continue as Admin</DropdownMenuItem>
            <DropdownMenuItem onClick={() => loginAs("teacher")}>Continue as Teacher</DropdownMenuItem>
            <DropdownMenuItem onClick={() => loginAs("student")}>Continue as Student</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
