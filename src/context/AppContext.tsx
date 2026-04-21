import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { seedExams, seedQuestions, seedResults, seedUsers } from "@/lib/seedData";
import type { Exam, Question, Result, Role, User } from "@/lib/types";

interface AppState {
  // auth
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => { ok: boolean; message?: string };
  loginAs: (role: Role) => void;
  logout: () => void;

  // data
  exams: Exam[];
  questions: Question[];
  results: Result[];

  // CRUD
  addQuestion: (q: Omit<Question, "id" | "createdBy">) => void;
  updateQuestion: (id: string, q: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  deleteExam: (id: string) => void;
  submitExam: (examId: string, answers: Record<string, number>) => Result;
}

const AppCtx = createContext<AppState | null>(null);

const QUICK_DEMO: Record<Role, string> = {
  admin: "u-admin",
  teacher: "u-teach1",
  student: "u-stu1",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [users] = useState<User[]>(seedUsers);
  const [exams, setExams] = useState<Exam[]>(seedExams);
  const [questions, setQuestions] = useState<Question[]>(seedQuestions);
  const [results, setResults] = useState<Result[]>(seedResults);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = useCallback(
    (email: string, password: string) => {
      const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase().trim());
      if (!u) return { ok: false, message: "No account found for that email." };
      if (password !== "password123") return { ok: false, message: "Incorrect password. Use password123 for the demo." };
      setCurrentUser(u);
      return { ok: true };
    },
    [users]
  );

  const loginAs = useCallback(
    (role: Role) => {
      const id = QUICK_DEMO[role];
      const u = users.find((x) => x.id === id) ?? null;
      setCurrentUser(u);
    },
    [users]
  );

  const logout = useCallback(() => setCurrentUser(null), []);

  const addQuestion = useCallback(
    (q: Omit<Question, "id" | "createdBy">) => {
      const id = `q-${Date.now()}`;
      setQuestions((prev) => [{ ...q, id, createdBy: currentUser?.id ?? "u-teach1" }, ...prev]);
    },
    [currentUser]
  );

  const updateQuestion = useCallback((id: string, patch: Partial<Question>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setExams((prev) => prev.map((e) => ({ ...e, questionIds: e.questionIds.filter((qid) => qid !== id) })));
  }, []);

  const deleteExam = useCallback((id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    setResults((prev) => prev.filter((r) => r.examId !== id));
  }, []);

  const submitExam = useCallback(
    (examId: string, answers: Record<string, number>) => {
      const exam = exams.find((e) => e.id === examId)!;
      let score = 0;
      let total = 0;
      exam.questionIds.forEach((qid) => {
        const q = questions.find((qq) => qq.id === qid);
        if (!q) return;
        total += q.marks;
        if (answers[qid] === q.correctIndex) score += q.marks;
      });
      const passMark = total * 0.4;
      const result: Result = {
        id: `r-${Date.now()}`,
        examId,
        studentId: currentUser?.id ?? "u-stu1",
        score,
        total,
        submittedAt: new Date().toISOString(),
        status: score >= passMark ? "Pass" : "Fail",
      };
      setResults((prev) => [result, ...prev.filter((r) => !(r.examId === examId && r.studentId === result.studentId))]);
      // mark exam completed for the demo
      setExams((prev) => prev.map((e) => (e.id === examId ? { ...e, status: "Completed" } : e)));
      return result;
    },
    [exams, questions, currentUser]
  );

  const value = useMemo<AppState>(
    () => ({
      currentUser,
      users,
      login,
      loginAs,
      logout,
      exams,
      questions,
      results,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      deleteExam,
      submitExam,
    }),
    [currentUser, users, login, loginAs, logout, exams, questions, results, addQuestion, updateQuestion, deleteQuestion, deleteExam, submitExam]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
