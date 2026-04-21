import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

const emptyForm: Omit<Question, "id" | "createdBy"> = {
  text: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  subject: "Data Structures",
  difficulty: "Easy",
  marks: 2,
};

const subjects = ["Data Structures", "Operating Systems", "Mathematics", "DBMS", "Networks"];
const difficulties: Question["difficulty"][] = ["Easy", "Medium", "Hard"];

export default function QuestionBank() {
  const { currentUser, questions, addQuestion, updateQuestion, deleteQuestion } = useApp();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<string>("All");
  const [diff, setDiff] = useState<string>("All");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [form, setForm] = useState(emptyForm);

  const canManage = currentUser?.role === "admin" || currentUser?.role === "teacher";

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (subject !== "All" && q.subject !== subject) return false;
      if (diff !== "All" && q.difficulty !== diff) return false;
      if (query && !q.text.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [questions, subject, diff, query]);

  if (!currentUser) return null;

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (q: Question) => {
    setEditing(q);
    setForm({ text: q.text, options: [...q.options], correctIndex: q.correctIndex, subject: q.subject, difficulty: q.difficulty, marks: q.marks });
    setOpen(true);
  };

  const save = () => {
    if (!form.text.trim() || form.options.some((o) => !o.trim())) {
      toast({ title: "Missing fields", description: "Please fill the question and all 4 options.", variant: "destructive" });
      return;
    }
    if (editing) {
      updateQuestion(editing.id, form);
      toast({ title: "Question updated" });
    } else {
      addQuestion(form);
      toast({ title: "Question added" });
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Question Bank</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {canManage ? "Curate and maintain your question library." : "Browse the available questions."}
          </p>
        </div>
        {canManage && (
          <Button onClick={openAdd} className="bg-gradient-primary shadow-elegant">
            <Plus className="mr-1.5 h-4 w-4" /> Add question
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="glass flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search questions…" className="pl-9" />
        </div>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger className="md:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All subjects</SelectItem>
            {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={diff} onValueChange={setDiff}>
          <SelectTrigger className="md:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All levels</SelectItem>
            {difficulties.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center text-sm text-muted-foreground">
            No questions match your filters.
          </div>
        )}
        {filtered.map((q) => (
          <div key={q.id} className="glass rounded-2xl p-5 transition hover:border-primary/30">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary-glow">{q.subject}</Badge>
                  <Badge variant="outline" className={cn(
                    "border",
                    q.difficulty === "Easy" && "border-success/40 bg-success/10 text-success",
                    q.difficulty === "Medium" && "border-warning/40 bg-warning/10 text-warning",
                    q.difficulty === "Hard" && "border-destructive/40 bg-destructive/10 text-destructive"
                  )}>{q.difficulty}</Badge>
                  <Badge variant="secondary">{q.marks} marks</Badge>
                </div>
                <p className="font-medium">{q.text}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, i) => (
                    <div key={i} className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                      i === q.correctIndex ? "border-success/40 bg-success/10 text-success" : "border-border/50 bg-card/40 text-muted-foreground"
                    )}>
                      <span className="font-mono text-xs">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                      {i === q.correctIndex && <CheckCircle2 className="ml-auto h-3.5 w-3.5" />}
                    </div>
                  ))}
                </div>
              </div>
              {canManage && (
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(q)}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-strong">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this question?</AlertDialogTitle>
                        <AlertDialogDescription>It will be removed from the bank and any exams using it.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => { deleteQuestion(q.id); toast({ title: "Question deleted" }); }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-strong sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit question" : "Add new question"}</DialogTitle>
            <DialogDescription>Fill in the details and mark the correct option.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Question</Label>
              <Textarea
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="Enter the question text…"
                className="mt-1.5 min-h-24"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label>Subject</Label>
                <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={(v: any) => setForm({ ...form, difficulty: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{difficulties.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Marks</Label>
                <Input type="number" min={1} max={10} value={form.marks} onChange={(e) => setForm({ ...form, marks: Number(e.target.value) || 1 })} className="mt-1.5" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Options (select the correct one)</Label>
              {form.options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, correctIndex: i })}
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-lg border text-sm font-semibold transition",
                      form.correctIndex === i ? "border-success bg-success/15 text-success" : "border-border/60 bg-card/40 text-muted-foreground"
                    )}
                    title="Mark as correct"
                  >
                    {String.fromCharCode(65 + i)}
                  </button>
                  <Input
                    value={o}
                    onChange={(e) => {
                      const opts = [...form.options];
                      opts[i] = e.target.value;
                      setForm({ ...form, options: opts });
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} className="bg-gradient-primary">
              {editing ? "Save changes" : "Add question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
