import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Award, BarChart3, Target, Trophy } from "lucide-react";

export default function Results() {
  const { currentUser, results, exams, users } = useApp();
  if (!currentUser) return null;

  const visible = useMemo(() => {
    if (currentUser.role === "student") return results.filter((r) => r.studentId === currentUser.id);
    return results;
  }, [results, currentUser]);

  const totalScore = visible.reduce((a, r) => a + r.score, 0);
  const totalMax = visible.reduce((a, r) => a + r.total, 0);
  const avgPct = totalMax ? Math.round((totalScore / totalMax) * 100) : 0;
  const passes = visible.filter((r) => r.status === "Pass").length;
  const passRate = visible.length ? Math.round((passes / visible.length) * 100) : 0;
  const top = [...visible].sort((a, b) => b.score / b.total - a.score / a.total)[0];

  // simple distribution buckets
  const buckets = [0, 20, 40, 60, 80, 100];
  const dist = buckets.slice(0, -1).map((b, i) => {
    const lo = b, hi = buckets[i + 1];
    const count = visible.filter((r) => {
      const p = (r.score / Math.max(1, r.total)) * 100;
      return p >= lo && p < (hi === 100 ? 101 : hi);
    }).length;
    return { range: `${lo}-${hi}%`, count };
  });
  const maxBucket = Math.max(1, ...dist.map((d) => d.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {currentUser.role === "student" ? "My Results" : "Results"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {currentUser.role === "student"
            ? "Your performance across attempted exams."
            : "Aggregate performance across all students and exams."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Submissions" value={visible.length} icon={Trophy} accent="primary" />
        <StatCard label="Average %" value={`${avgPct}%`} icon={BarChart3} accent="info" />
        <StatCard label="Pass Rate" value={`${passRate}%`} icon={Target} accent="success" />
        <StatCard label="Top Score" value={top ? `${top.score}/${top.total}` : "—"} icon={Award} accent="accent" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Table */}
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-semibold">Exam-wise results</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>Exam</TableHead>
                  {currentUser.role !== "student" && <TableHead>Student</TableHead>}
                  <TableHead>Score</TableHead>
                  <TableHead className="w-[180px]">Performance</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">No results yet.</TableCell></TableRow>
                )}
                {visible.map((r) => {
                  const exam = exams.find((e) => e.id === r.examId);
                  const stu = users.find((u) => u.id === r.studentId);
                  const pct = Math.round((r.score / Math.max(1, r.total)) * 100);
                  return (
                    <TableRow key={r.id} className="border-border/40">
                      <TableCell>
                        <div className="font-medium">{exam?.title ?? "Exam"}</div>
                        <div className="text-xs text-muted-foreground">{exam?.subject}</div>
                      </TableCell>
                      {currentUser.role !== "student" && (
                        <TableCell className="text-sm">{stu?.name ?? "—"}</TableCell>
                      )}
                      <TableCell className="font-mono">{r.score}/{r.total}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={pct} className="h-1.5" />
                          <span className="w-10 text-xs text-muted-foreground">{pct}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={r.status === "Pass" ? "bg-success/15 text-success hover:bg-success/20" : "bg-destructive/15 text-destructive hover:bg-destructive/20"}>
                          {r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Distribution */}
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 font-display text-lg font-semibold">Score distribution</h3>
          <div className="space-y-3">
            {dist.map((d) => (
              <div key={d.range}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{d.range}</span>
                  <span className="font-medium">{d.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-card/60">
                  <div
                    className="h-full rounded-full bg-gradient-primary transition-all"
                    style={{ width: `${(d.count / maxBucket) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
