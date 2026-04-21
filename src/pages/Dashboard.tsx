import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  Activity,
  Award,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Plus,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

export default function Dashboard() {
  const { currentUser, exams, questions, users, results } = useApp();
  if (!currentUser) return null;

  const greeting = `Welcome back, ${currentUser.name.split(" ")[0]}`;
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  if (currentUser.role === "admin") {
    return (
      <div className="space-y-8">
        <Header title={greeting} subtitle={`Examination Cell · ${today}`} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Exams" value={exams.length} icon={ClipboardList} accent="primary" hint="Across all departments" />
          <StatCard label="Question Bank" value={questions.length} icon={BookOpen} accent="info" hint="Approved questions" />
          <StatCard label="Active Users" value={users.length} icon={Users} accent="accent" hint="Faculty & students" />
          <StatCard label="Submissions" value={results.length} icon={Trophy} accent="success" hint="Lifetime evaluations" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Recent exams</h3>
              <Button asChild variant="ghost" size="sm"><Link to="/app/exams">View all</Link></Button>
            </div>
            <div className="space-y-3">
              {exams.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-xl border border-border/50 bg-card/40 p-4">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{e.title}</div>
                    <div className="text-xs text-muted-foreground">{e.subject} · {e.durationMin} min · {e.totalMarks} marks</div>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              ))}
            </div>
          </div>
          <QuickActions role="admin" />
        </div>
      </div>
    );
  }

  if (currentUser.role === "teacher") {
    const myExams = exams.filter((e) => e.createdBy === currentUser.id);
    const myQuestions = questions.filter((q) => q.createdBy === currentUser.id);
    return (
      <div className="space-y-8">
        <Header title={greeting} subtitle={`${currentUser.department} · ${today}`} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="My Exams" value={myExams.length} icon={ClipboardList} accent="primary" />
          <StatCard label="My Questions" value={myQuestions.length} icon={BookOpen} accent="info" />
          <StatCard label="Avg. Class Score" value={`${avg(results)}%`} icon={TrendingUp} accent="success" />
          <StatCard label="Pending Reviews" value={2} icon={Activity} accent="warning" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">My exams</h3>
              <Button asChild size="sm" className="bg-gradient-primary"><Link to="/app/exams"><Plus className="mr-1 h-4 w-4" /> Manage</Link></Button>
            </div>
            <div className="space-y-3">
              {myExams.map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-xl border border-border/50 bg-card/40 p-4">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{e.title}</div>
                    <div className="text-xs text-muted-foreground">{e.questionIds.length} questions · {e.durationMin} min</div>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              ))}
            </div>
          </div>
          <QuickActions role="teacher" />
        </div>
      </div>
    );
  }

  // Student
  const myResults = results.filter((r) => r.studentId === currentUser.id);
  const attemptedIds = new Set(myResults.map((r) => r.examId));
  const upcoming = exams.filter((e) => e.status !== "Completed" && !attemptedIds.has(e.id));
  const latest = myResults[0];
  const totalScore = myResults.reduce((a, r) => a + r.score, 0);
  const totalMax = myResults.reduce((a, r) => a + r.total, 0);
  const pct = totalMax ? Math.round((totalScore / totalMax) * 100) : 0;

  return (
    <div className="space-y-8">
      <Header title={greeting} subtitle={`${currentUser.department} · ${today}`} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Upcoming Exams" value={upcoming.length} icon={ClipboardList} accent="info" />
        <StatCard label="Attempted" value={myResults.length} icon={GraduationCap} accent="primary" />
        <StatCard label="Latest Score" value={latest ? `${latest.score}/${latest.total}` : "—"} icon={Award} accent="accent" />
        <StatCard label="Overall %" value={`${pct}%`} icon={TrendingUp} accent="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-semibold">Upcoming & Live exams</h3>
          <div className="space-y-3">
            {upcoming.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
                You're all caught up. No pending exams.
              </div>
            )}
            {upcoming.map((e) => (
              <Link key={e.id} to="/app/exams" className="flex items-center justify-between rounded-xl border border-border/50 bg-card/40 p-4 transition hover:border-primary/40 hover:bg-card/60">
                <div>
                  <div className="font-medium">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{e.subject} · {e.durationMin} min · {e.totalMarks} marks</div>
                </div>
                <StatusBadge status={e.status} />
              </Link>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="mb-4 font-display text-lg font-semibold">Performance</h3>
          <div className="text-xs text-muted-foreground">Aggregate score</div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="font-display text-4xl font-bold">{pct}%</div>
            <div className="text-xs text-muted-foreground">{totalScore}/{totalMax} marks</div>
          </div>
          <Progress value={pct} className="mt-4 h-2" />
          <div className="mt-6 space-y-2">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Recent results</div>
            {myResults.slice(0, 3).map((r) => {
              const exam = exams.find((e) => e.id === r.examId);
              return (
                <div key={r.id} className="flex items-center justify-between rounded-lg bg-card/40 px-3 py-2 text-sm">
                  <span className="truncate">{exam?.title ?? "Exam"}</span>
                  <span className={r.status === "Pass" ? "text-success" : "text-destructive"}>{r.score}/{r.total}</span>
                </div>
              );
            })}
            {myResults.length === 0 && <div className="text-sm text-muted-foreground">No attempts yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function QuickActions({ role }: { role: "admin" | "teacher" }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="mb-4 font-display text-lg font-semibold">Quick actions</h3>
      <div className="space-y-2">
        <Button asChild variant="outline" className="w-full justify-start">
          <Link to="/app/questions"><BookOpen className="mr-2 h-4 w-4" /> Manage Question Bank</Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start">
          <Link to="/app/exams"><ClipboardList className="mr-2 h-4 w-4" /> View Exams</Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start">
          <Link to="/app/results"><Trophy className="mr-2 h-4 w-4" /> Review Results</Link>
        </Button>
        {role === "admin" && (
          <Button asChild variant="outline" className="w-full justify-start">
            <Link to="/app/users"><Users className="mr-2 h-4 w-4" /> Manage Users</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

function avg(results: { score: number; total: number }[]) {
  if (results.length === 0) return 0;
  const total = results.reduce((a, r) => a + r.total, 0);
  const score = results.reduce((a, r) => a + r.score, 0);
  return total ? Math.round((score / total) * 100) : 0;
}
