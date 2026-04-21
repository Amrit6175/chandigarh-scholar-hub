// Types for the entire prototype.
export type Role = "admin" | "teacher" | "student";
export type ExamStatus = "Upcoming" | "Live" | "Completed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
  department?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  createdBy: string; // user id
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  description: string;
  durationMin: number;
  totalMarks: number;
  date: string; // ISO
  status: ExamStatus;
  questionIds: string[];
  createdBy: string;
}

export interface Result {
  id: string;
  examId: string;
  studentId: string;
  score: number;
  total: number;
  submittedAt: string;
  status: "Pass" | "Fail";
}
