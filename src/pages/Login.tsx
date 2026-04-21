import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CULogo } from "@/components/CULogo";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Award, BookOpen, Clock, Copy, ShieldCheck, Sparkles, UserCog, Users } from "lucide-react";
import type { Role } from "@/lib/types";

const demoCreds = [
  { email: "student1@cu.edu.in", password: "password123", label: "Student — Aarav" },
  { email: "student2@cu.edu.in", password: "password123", label: "Student — Ishita" },
];

const roleCards: { role: Role; title: string; desc: string; icon: any; tone: string }[] = [
  { role: "admin", title: "Administrator", desc: "Manage exams, users & question bank", icon: ShieldCheck, tone: "from-fuchsia-500/30 to-indigo-500/10" },
  { role: "teacher", title: "Faculty", desc: "Create exams, build questions, review", icon: UserCog, tone: "from-amber-500/30 to-rose-500/10" },
  { role: "student", title: "Student", desc: "Take exams and track your progress", icon: Users, tone: "from-sky-500/30 to-violet-500/10" },
];

export default function Login() {
  const { login, loginAs } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("student1@cu.edu.in");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.ok) {
        toast({ title: "Welcome back", description: "Signed in to Chandigarh University Examination System." });
        navigate("/app");
      } else {
        toast({ title: "Sign in failed", description: res.message, variant: "destructive" });
      }
    }, 350);
  };

  const quickAccess = (role: Role) => {
    loginAs(role);
    toast({ title: `Demo session started`, description: `Continuing as ${role}.` });
    navigate("/app");
  };

  const fillCreds = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    toast({ title: "Credentials filled", description: e });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* decorative orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-accent/10 blur-3xl" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <CULogo />
        <div className="hidden items-center gap-2 rounded-full border border-border/50 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur md:flex">
          <Sparkles className="h-3.5 w-3.5 text-accent" /> Demo prototype — no real backend
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-4 md:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-12">
        {/* Hero / brand */}
        <section className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <Award className="h-3.5 w-3.5" /> Trusted by 150,000+ students
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            The official <span className="text-gradient">examination platform</span> of Chandigarh University.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Conduct, attempt, and evaluate exams with confidence. A unified workspace for administrators,
            faculty, and students — beautifully simple, exam-ready.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 md:max-w-lg">
            {[
              { icon: BookOpen, label: "Question Bank", value: "14+" },
              { icon: Clock, label: "Live Exams", value: "2" },
              { icon: Users, label: "Active Roles", value: "3" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-3 text-center">
                <s.icon className="mx-auto h-4 w-4 text-primary-glow" />
                <div className="mt-1 font-display text-xl font-bold">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Quick demo access</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {roleCards.map((r) => (
                <button
                  key={r.role}
                  onClick={() => quickAccess(r.role)}
                  className={`group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br ${r.tone} p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant`}
                >
                  <r.icon className="h-5 w-5 text-foreground/80" />
                  <div className="mt-3 font-medium">{r.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{r.desc}</div>
                  <ArrowRight className="absolute right-3 top-3 h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Login card */}
        <section className="flex items-center">
          <div className="glass-strong w-full rounded-2xl p-6 md:p-8">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold">Sign in</h2>
              <p className="mt-1 text-sm text-muted-foreground">Use your university credentials.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">University email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@cu.edu.in"
                  className="h-11 bg-card/60"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-card/60"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-gradient-primary font-medium shadow-elegant transition hover:opacity-95"
              >
                {loading ? "Signing in…" : "Sign in"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <div className="mt-6 rounded-xl border border-dashed border-border/70 bg-card/40 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-accent">
                <Sparkles className="h-3.5 w-3.5" /> Demo credentials
              </div>
              <div className="space-y-1.5">
                {demoCreds.map((c) => (
                  <button
                    key={c.email}
                    type="button"
                    onClick={() => fillCreds(c.email, c.password)}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-card/60"
                  >
                    <div>
                      <div className="font-medium">{c.email}</div>
                      <div className="text-xs text-muted-foreground">{c.label} · password: {c.password}</div>
                    </div>
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/40 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Chandigarh University · Examination Cell · Prototype
      </footer>
    </div>
  );
}
