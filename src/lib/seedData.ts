import type { Exam, Question, Result, User } from "./types";

export const seedUsers: User[] = [
  { id: "u-admin", name: "Dr. Anjali Mehra", email: "admin@cu.edu.in", role: "admin", avatarColor: "from-fuchsia-500 to-indigo-500", department: "Examination Cell" },
  { id: "u-teach1", name: "Prof. Rajeev Sharma", email: "rajeev@cu.edu.in", role: "teacher", avatarColor: "from-amber-500 to-rose-500", department: "Computer Science" },
  { id: "u-teach2", name: "Prof. Priya Kapoor", email: "priya@cu.edu.in", role: "teacher", avatarColor: "from-emerald-500 to-cyan-500", department: "Mathematics" },
  { id: "u-stu1", name: "Aarav Singh", email: "student1@cu.edu.in", role: "student", avatarColor: "from-sky-500 to-indigo-500", department: "B.E. CSE — 4th Sem" },
  { id: "u-stu2", name: "Ishita Verma", email: "student2@cu.edu.in", role: "student", avatarColor: "from-pink-500 to-violet-500", department: "B.E. ECE — 4th Sem" },
  { id: "u-stu3", name: "Karan Malhotra", email: "student3@cu.edu.in", role: "student", avatarColor: "from-teal-500 to-blue-500", department: "B.E. CSE — 4th Sem" },
];

export const seedQuestions: Question[] = [
  // DSA
  { id: "q1", text: "What is the time complexity of binary search on a sorted array of n elements?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctIndex: 1, subject: "Data Structures", difficulty: "Easy", marks: 2, createdBy: "u-teach1" },
  { id: "q2", text: "Which data structure uses LIFO ordering?", options: ["Queue", "Stack", "Heap", "Graph"], correctIndex: 1, subject: "Data Structures", difficulty: "Easy", marks: 2, createdBy: "u-teach1" },
  { id: "q3", text: "Worst-case complexity of QuickSort is:", options: ["O(n log n)", "O(n^2)", "O(log n)", "O(n)"], correctIndex: 1, subject: "Data Structures", difficulty: "Medium", marks: 3, createdBy: "u-teach1" },
  // OS
  { id: "q4", text: "Which scheduling algorithm can cause starvation?", options: ["FCFS", "Round Robin", "Priority Scheduling", "SJF (preemptive only)"], correctIndex: 2, subject: "Operating Systems", difficulty: "Medium", marks: 3, createdBy: "u-teach1" },
  { id: "q5", text: "A deadlock requires which of the following conditions?", options: ["Mutual Exclusion only", "Hold and Wait only", "All four Coffman conditions", "Preemption"], correctIndex: 2, subject: "Operating Systems", difficulty: "Medium", marks: 3, createdBy: "u-teach1" },
  { id: "q6", text: "Virtual memory is implemented using:", options: ["Paging/Segmentation", "Cache only", "Registers", "BIOS"], correctIndex: 0, subject: "Operating Systems", difficulty: "Easy", marks: 2, createdBy: "u-teach1" },
  // Math
  { id: "q7", text: "The derivative of sin(x) with respect to x is:", options: ["cos(x)", "-cos(x)", "-sin(x)", "tan(x)"], correctIndex: 0, subject: "Mathematics", difficulty: "Easy", marks: 2, createdBy: "u-teach2" },
  { id: "q8", text: "∫ 1/x dx equals:", options: ["ln|x| + C", "1/x^2 + C", "x + C", "e^x + C"], correctIndex: 0, subject: "Mathematics", difficulty: "Easy", marks: 2, createdBy: "u-teach2" },
  { id: "q9", text: "Eigenvalues of a 2x2 identity matrix are:", options: ["0, 0", "1, 1", "1, -1", "2, 0"], correctIndex: 1, subject: "Mathematics", difficulty: "Medium", marks: 3, createdBy: "u-teach2" },
  // DBMS
  { id: "q10", text: "Which normal form removes transitive dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], correctIndex: 2, subject: "DBMS", difficulty: "Medium", marks: 3, createdBy: "u-teach1" },
  { id: "q11", text: "ACID stands for:", options: ["Atomicity, Consistency, Isolation, Durability", "Availability, Consistency, Integrity, Durability", "Atomicity, Concurrency, Isolation, Distribution", "None"], correctIndex: 0, subject: "DBMS", difficulty: "Easy", marks: 2, createdBy: "u-teach1" },
  { id: "q12", text: "A primary key cannot be:", options: ["Unique", "Indexed", "NULL", "Numeric"], correctIndex: 2, subject: "DBMS", difficulty: "Easy", marks: 2, createdBy: "u-teach1" },
  // Networks
  { id: "q13", text: "Which layer of OSI handles routing?", options: ["Data Link", "Network", "Transport", "Session"], correctIndex: 1, subject: "Networks", difficulty: "Easy", marks: 2, createdBy: "u-teach1" },
  { id: "q14", text: "TCP is a ___ protocol.", options: ["Connectionless", "Connection-oriented", "Stateless", "Broadcast"], correctIndex: 1, subject: "Networks", difficulty: "Easy", marks: 2, createdBy: "u-teach1" },
];

const today = new Date();
const day = (offset: number) => new Date(today.getTime() + offset * 86400000).toISOString();

export const seedExams: Exam[] = [
  {
    id: "e1",
    title: "Data Structures — Mid Semester",
    subject: "Data Structures",
    description: "Covers arrays, linked lists, stacks, queues, trees, and complexity analysis.",
    durationMin: 30,
    totalMarks: 7,
    date: day(2),
    status: "Live",
    questionIds: ["q1", "q2", "q3"],
    createdBy: "u-teach1",
  },
  {
    id: "e2",
    title: "Operating Systems Quiz",
    subject: "Operating Systems",
    description: "Process scheduling, deadlocks, memory management.",
    durationMin: 25,
    totalMarks: 8,
    date: day(5),
    status: "Upcoming",
    questionIds: ["q4", "q5", "q6"],
    createdBy: "u-teach1",
  },
  {
    id: "e3",
    title: "Engineering Mathematics — II",
    subject: "Mathematics",
    description: "Calculus and Linear Algebra fundamentals.",
    durationMin: 40,
    totalMarks: 7,
    date: day(7),
    status: "Upcoming",
    questionIds: ["q7", "q8", "q9"],
    createdBy: "u-teach2",
  },
  {
    id: "e4",
    title: "DBMS Foundations",
    subject: "DBMS",
    description: "Normalization, transactions, keys, ACID properties.",
    durationMin: 30,
    totalMarks: 7,
    date: day(-3),
    status: "Completed",
    questionIds: ["q10", "q11", "q12"],
    createdBy: "u-teach1",
  },
  {
    id: "e5",
    title: "Computer Networks Quick Test",
    subject: "Networks",
    description: "OSI model, TCP/IP, routing basics.",
    durationMin: 20,
    totalMarks: 4,
    date: day(-7),
    status: "Completed",
    questionIds: ["q13", "q14"],
    createdBy: "u-teach1",
  },
  {
    id: "e6",
    title: "DSA Practice Sprint",
    subject: "Data Structures",
    description: "Quick recap test before placements.",
    durationMin: 15,
    totalMarks: 4,
    date: day(1),
    status: "Live",
    questionIds: ["q1", "q2"],
    createdBy: "u-teach1",
  },
];

export const seedResults: Result[] = [
  { id: "r1", examId: "e4", studentId: "u-stu1", score: 6, total: 7, submittedAt: day(-3), status: "Pass" },
  { id: "r2", examId: "e5", studentId: "u-stu1", score: 3, total: 4, submittedAt: day(-7), status: "Pass" },
  { id: "r3", examId: "e4", studentId: "u-stu2", score: 4, total: 7, submittedAt: day(-3), status: "Pass" },
  { id: "r4", examId: "e5", studentId: "u-stu2", score: 2, total: 4, submittedAt: day(-7), status: "Pass" },
  { id: "r5", examId: "e4", studentId: "u-stu3", score: 2, total: 7, submittedAt: day(-3), status: "Fail" },
];
