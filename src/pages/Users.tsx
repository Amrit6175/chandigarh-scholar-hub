import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Navigate } from "react-router-dom";
import { Mail } from "lucide-react";

export default function Users() {
  const { currentUser, users } = useApp();
  if (!currentUser) return null;
  if (currentUser.role !== "admin") return <Navigate to="/app" replace />;

  const teachers = users.filter((u) => u.role === "teacher");
  const students = users.filter((u) => u.role === "student");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">All faculty and students registered on the platform.</p>
      </div>

      <Section title="Faculty" users={teachers} accent="from-amber-500/40 to-rose-500/10" />
      <Section title="Students" users={students} accent="from-sky-500/40 to-violet-500/10" />
    </div>
  );
}

function Section({ title, users, accent }: { title: string; users: any[]; accent: string }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <Badge variant="secondary">{users.length}</Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => {
          const initials = u.name.split(" ").map((p: string) => p[0]).slice(0, 2).join("");
          return (
            <div key={u.id} className="glass flex items-center gap-3 rounded-2xl p-4">
              <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${u.avatarColor} text-sm font-semibold text-white shadow-soft`}>
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{u.name}</div>
                <div className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" /> {u.email}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{u.department}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
