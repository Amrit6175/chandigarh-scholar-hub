import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CalendarDays, Clock, Eye, FileText, Pencil, Play, Search, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import type { Exam } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function Exams() {
  const navigate = useNavigate();
  const { currentUser, exams, deleteExam, questions } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Live" | "Upcoming" | "Completed">("All");
  const [viewing, setViewing] = useState<Exam | null>(null);

  const role = currentUser?.role;

  const filtered = useMemo(() => {
    return exams.filter((e) => {
      if (filter !== "All" && e.status !== filter) return false;
      if (query && !`${e.title} ${e.subject}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [exams, filter, query]);

  if (!currentUser || !role) return null;

  const handleStart = (e: Exam) => {
    if (e.questionIds.length === 0) {
      toast({ title: "No questions", description: "This exam has no questions yet.", variant: "destructive" });
      return;
    }
    navigate(`/app/exams/${e.id}/take`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Exams</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {role === "student" ? "Browse and start your exams." : "Manage and preview all exams in the system."}
          </p>
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search exams…" className="pl-9" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["All", "Live", "Upcoming", "Completed"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
            className={filter === f ? "bg-gradient-primary" : ""}
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((e) => {
          const qCount = e.questionIds.filter((qid) => questions.some((q) => q.id === qid)).length;
          return (
            <article key={e.id} className="glass group relative flex flex-col overflow-hidden rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-elegant">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Badge variant="outline" className="mb-2 border-primary/30 bg-primary/10 text-primary-glow">{e.subject}</Badge>
                  <h3 className="line-clamp-2 font-display text-lg font-semibold leading-tight">{e.title}</h3>
                </div>
                <StatusBadge status={e.status} />
              </div>
              <p className="relative mt-2 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>

              <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
                <Meta icon={Clock} label="Duration" value={`${e.durationMin}m`} />
                <Meta icon={FileText} label="Marks" value={e.totalMarks} />
                <Meta icon={CalendarDays} label="Date" value={new Date(e.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} />
              </div>

              <div className="relative mt-5 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setViewing(e)}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                </Button>
                <Button size="sm" onClick={() => handleStart(e)} className="bg-gradient-primary">
                  <Play className="mr-1.5 h-3.5 w-3.5" /> {role === "student" ? "Start" : "Preview"}
                </Button>
                {(role === "admin" || role === "teacher") && (
                  <Button size="sm" variant="outline" onClick={() => toast({ title: "Edit exam", description: "Exam editing UI is part of this prototype." })}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                )}
                {role === "admin" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-strong">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this exam?</AlertDialogTitle>
                        <AlertDialogDescription>
                          “{e.title}” and its associated results will be removed from this demo session.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            deleteExam(e.id);
                            toast({ title: "Exam deleted", description: e.title });
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <div className="relative mt-3 text-xs text-muted-foreground">{qCount} questions configured</div>
            </article>
          );
        })}
      </div>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="glass-strong sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewing?.title}</DialogTitle>
            <DialogDescription>{viewing?.subject} · {viewing?.durationMin} min · {viewing?.totalMarks} marks</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{viewing?.description}</p>
          <div className="rounded-lg border border-border/50 bg-card/40 p-3 text-sm">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Scheduled</div>
            <div className="mt-1">{viewing && new Date(viewing.date).toLocaleString("en-IN")}</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
            {viewing && (
              <Button className="bg-gradient-primary" onClick={() => { setViewing(null); handleStart(viewing); }}>
                <Play className="mr-1.5 h-4 w-4" /> {role === "student" ? "Start exam" : "Preview"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="rounded-lg bg-card/40 p-2">
      <Icon className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
      <div className="mt-1 text-sm font-semibold leading-none">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
