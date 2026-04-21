import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Flag, Send, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function ExamTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { exams, questions, submitExam } = useApp();
  const exam = exams.find((e) => e.id === id);

  const examQuestions = useMemo(
    () => (exam ? exam.questionIds.map((qid) => questions.find((q) => q.id === qid)).filter(Boolean) as typeof questions : []),
    [exam, questions]
  );

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(exam ? exam.durationMin * 60 : 0);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [resultModal, setResultModal] = useState<null | { score: number; total: number; status: string }>(null);

  useEffect(() => {
    if (!exam) return;
    setSecondsLeft(exam.durationMin * 60);
  }, [exam]);

  useEffect(() => {
    if (resultModal) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resultModal]);

  useEffect(() => {
    if (secondsLeft === 0 && exam && !resultModal) {
      handleSubmit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  if (!exam) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-center">
        <div>
          <h2 className="font-display text-2xl font-bold">Exam not found</h2>
          <Button onClick={() => navigate("/app/exams")} className="mt-4">Back to exams</Button>
        </div>
      </div>
    );
  }

  const q = examQuestions[idx];
  const answeredCount = Object.keys(answers).length;
  const progressPct = examQuestions.length ? ((idx + 1) / examQuestions.length) * 100 : 0;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const lowTime = secondsLeft < 60;

  const select = (optIdx: number) => {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.id]: optIdx }));
  };

  const handleSubmit = (auto = false) => {
    const result = submitExam(exam.id, answers);
    setResultModal({ score: result.score, total: result.total, status: result.status });
    if (auto) toast({ title: "Time's up!", description: "Your exam was auto-submitted." });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Custom header — replaces normal layout */}
      <div className="sticky top-0 z-30 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Chandigarh University · Live Exam</div>
            <div className="truncate font-display text-lg font-semibold">{exam.title}</div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 font-mono text-sm font-semibold",
                lowTime
                  ? "border-destructive/40 bg-destructive/10 text-destructive animate-glow-pulse"
                  : "border-border/50 bg-card/60 text-foreground"
              )}
            >
              <Clock className="h-4 w-4" />
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/app/exams")}>
              <X className="mr-1 h-4 w-4" /> Exit
            </Button>
          </div>
        </div>
        <Progress value={progressPct} className="h-1 rounded-none" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1fr_280px]">
        {/* Question card */}
        <div className="glass-strong rounded-2xl p-6 md:p-8 animate-fade-in" key={q?.id}>
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Question {idx + 1} of {examQuestions.length}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-card/60 px-2 py-0.5 text-muted-foreground">{q?.subject}</span>
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">{q?.marks} marks</span>
            </div>
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold leading-snug md:text-2xl">{q?.text}</h2>

          <div className="mt-6 space-y-3">
            {q?.options.map((opt, i) => {
              const selected = answers[q.id] === i;
              return (
                <button
                  key={i}
                  onClick={() => select(i)}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/15 shadow-glow"
                      : "border-border/60 bg-card/40 hover:border-primary/40 hover:bg-card/60"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-sm font-semibold",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/70 bg-background/40 text-muted-foreground group-hover:border-primary/40"
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 text-sm md:text-base">{opt}</span>
                  {selected && <CheckCircle2 className="h-5 w-5 text-primary-glow" />}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button variant="outline" disabled={idx === 0} onClick={() => setIdx((i) => Math.max(0, i - 1))}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <div className="text-xs text-muted-foreground">
              {answeredCount}/{examQuestions.length} answered
            </div>
            {idx < examQuestions.length - 1 ? (
              <Button onClick={() => setIdx((i) => Math.min(examQuestions.length - 1, i + 1))} className="bg-gradient-primary">
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => setConfirmSubmit(true)} className="bg-gradient-accent text-accent-foreground">
                <Send className="mr-1.5 h-4 w-4" /> Submit
              </Button>
            )}
          </div>
        </div>

        {/* Question palette */}
        <aside className="glass h-fit rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold">Question palette</h3>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {examQuestions.map((qq, i) => {
              const answered = qq && answers[qq.id] !== undefined;
              const current = i === idx;
              return (
                <button
                  key={qq?.id}
                  onClick={() => setIdx(i)}
                  className={cn(
                    "h-9 rounded-md text-xs font-semibold transition",
                    current
                      ? "bg-gradient-primary text-primary-foreground shadow-glow"
                      : answered
                        ? "bg-success/20 text-success"
                        : "bg-card/60 text-muted-foreground hover:bg-card"
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-1.5 text-xs">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-gradient-primary" /> Current</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-success/40" /> Answered</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-card" /> Not visited</div>
          </div>
          <Button onClick={() => setConfirmSubmit(true)} className="mt-5 w-full bg-gradient-accent text-accent-foreground">
            <Send className="mr-1.5 h-4 w-4" /> Submit exam
          </Button>
        </aside>
      </div>

      {/* Confirm submit */}
      <Dialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
        <DialogContent className="glass-strong sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit your exam?</DialogTitle>
            <DialogDescription>
              You answered {answeredCount} of {examQuestions.length} questions. You won't be able to change answers after submitting.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmSubmit(false)}>Keep editing</Button>
            <Button onClick={() => { setConfirmSubmit(false); handleSubmit(); }} className="bg-gradient-primary">
              <Send className="mr-1.5 h-4 w-4" /> Submit now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Result */}
      <Dialog open={!!resultModal} onOpenChange={(o) => { if (!o) { setResultModal(null); navigate("/app/results"); } }}>
        <DialogContent className="glass-strong sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" /> Exam submitted
            </DialogTitle>
            <DialogDescription>Great work! Here's your instant performance summary.</DialogDescription>
          </DialogHeader>
          {resultModal && (
            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Your score</div>
              <div className="mt-1 font-display text-5xl font-bold text-gradient">
                {resultModal.score}<span className="text-2xl text-muted-foreground">/{resultModal.total}</span>
              </div>
              <div className={cn("mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium",
                resultModal.status === "Pass" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive")}>
                {resultModal.status}
              </div>
              <Progress value={(resultModal.score / Math.max(1, resultModal.total)) * 100} className="mt-4 h-2" />
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => { setResultModal(null); navigate("/app/results"); }} className="bg-gradient-primary">
              View detailed results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
