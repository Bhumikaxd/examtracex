import { useSyncExternalStore } from "react";

export type PaperStatus = "ACTIVE" | "COMPROMISED" | "CANCELLED";
export type Tone = "secure" | "warn" | "critical" | "info";

export interface Paper {
  id: string;
  subject: string;
  examDate: string;
  examTime: string;
  examType: string;
  createdBy: string;
  createdAt: string;
  hash: string;
  status: PaperStatus;
  integrity: "VERIFIED" | "UNVERIFIED";
  lastActivity: string;
  holder: string;
}

export interface CustodyEvent {
  id: string;
  paperId: string;
  title: string;
  date: string;
  time: string;
  user: string;
  location: string;
  from?: string | undefined;
  to?: string | undefined;
  note?: string | undefined;
  tone: Tone;
}

export interface AccessLog {
  id: string;
  paperId: string;
  user: string;
  action: string;
  date: string;
  time: string;
  result: "ALLOWED" | "SUSPICIOUS" | "BLOCKED";
  device: string;
}

export interface SecurityAlert {
  id: string;
  paperId: string;
  reason: string;
  rule: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  user: string;
  date: string;
  time: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
}

export interface AppUser {
  name: string;
  email: string;
  role: string;
  status: "ACTIVE" | "SUSPENDED";
  lastActivity: string;
}

export interface State {
  papers: Paper[];
  custody: CustodyEvent[];
  logs: AccessLog[];
  alerts: SecurityAlert[];
  users: AppUser[];
  role: string | null;
}

const HEX = "0123456789abcdef";
export function makeHash(seed = "") {
  let out = "";
  for (let i = 0; i < 64; i++) {
    const n = Math.floor((Math.random() * 16 + seed.charCodeAt(i % Math.max(seed.length, 1)) || 0) % 16);
    out += HEX[Number.isNaN(n) ? Math.floor(Math.random() * 16) : n];
  }
  return out;
}

function nowParts() {
  const d = new Date();
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

let uid = 0;
const nid = (p: string) => `${p}-${Date.now().toString(36)}-${uid++}`;

const paper = (
  id: string,
  subject: string,
  examDate: string,
  examTime: string,
  status: PaperStatus,
  lastActivity: string,
  holder: string,
): Paper => ({
  id,
  subject,
  examDate,
  examTime,
  examType: "Final Examination",
  createdBy: "Exam Officer",
  createdAt: "19 Aug 2026",
  hash: "8f3a92" + makeHash(subject).slice(6),
  status,
  integrity: status === "COMPROMISED" ? "UNVERIFIED" : "VERIFIED",
  lastActivity,
  holder,
});

let state: State = {
  papers: [
    paper("EP001", "Mathematics", "25 Aug 2026", "09:00 AM", "COMPROMISED", "19 Aug 2026 — 12:15 PM", "Storage Officer"),
    paper("EP002", "Physics", "26 Aug 2026", "09:00 AM", "ACTIVE", "19 Aug 2026 — 11:20 AM", "Printing Staff"),
    paper("EP003", "Chemistry", "27 Aug 2026", "01:00 PM", "CANCELLED", "18 Aug 2026 — 04:40 PM", "Examination Office"),
    paper("EP004", "Computer Science", "28 Aug 2026", "09:00 AM", "ACTIVE", "19 Aug 2026 — 10:05 AM", "Exam Officer"),
    paper("EP005", "English", "29 Aug 2026", "11:00 AM", "ACTIVE", "19 Aug 2026 — 09:45 AM", "Exam Center"),
  ],
  custody: [
    {
      id: "C1", paperId: "EP001", title: "PAPER CREATED", date: "19 Aug 2026", time: "09:00 AM",
      user: "Exam Officer", location: "Examination Office", tone: "secure",
    },
    {
      id: "C2", paperId: "EP001", title: "PAPER TRANSFERRED", date: "19 Aug 2026", time: "10:00 AM",
      user: "Exam Officer", location: "Printing Center", from: "Exam Officer", to: "Printing Staff", tone: "secure",
    },
    {
      id: "C3", paperId: "EP001", title: "PAPER RECEIVED", date: "19 Aug 2026", time: "10:15 AM",
      user: "Printing Staff", location: "Printing Center", tone: "secure",
    },
    {
      id: "C4", paperId: "EP001", title: "PAPER TRANSFERRED", date: "19 Aug 2026", time: "12:00 PM",
      user: "Printing Staff", location: "Secure Storage", from: "Printing Staff", to: "Storage Officer", tone: "secure",
    },
    {
      id: "C5", paperId: "EP001", title: "SUSPICIOUS ACCESS", date: "19 Aug 2026", time: "12:15 PM",
      user: "Unknown User", location: "Unknown", note: "Access attempt from unrecognised device.", tone: "warn",
    },
    {
      id: "C6", paperId: "EP001", title: "ALERT GENERATED", date: "19 Aug 2026", time: "12:16 PM",
      user: "ExamTraceX Engine", location: "Security Core", note: "Possible unauthorized access detected.", tone: "critical",
    },
    {
      id: "C7", paperId: "EP002", title: "PAPER CREATED", date: "19 Aug 2026", time: "09:30 AM",
      user: "Exam Officer", location: "Examination Office", tone: "secure",
    },
    {
      id: "C8", paperId: "EP002", title: "PAPER TRANSFERRED", date: "19 Aug 2026", time: "11:20 AM",
      user: "Exam Officer", location: "Printing Center", from: "Exam Officer", to: "Printing Staff", tone: "secure",
    },
    {
      id: "C9", paperId: "EP003", title: "PAPER CANCELLED", date: "18 Aug 2026", time: "04:40 PM",
      user: "Admin User", location: "Examination Office", note: "Cancelled after confirmed integrity breach.", tone: "critical",
    },
  ],
  logs: [
    { id: "L1", paperId: "EP001", user: "Exam Officer", action: "VIEW", date: "19 Aug 2026", time: "10:00 AM", result: "ALLOWED", device: "Desktop • 10.2.4.11" },
    { id: "L2", paperId: "EP001", user: "Printing Staff", action: "VIEW", date: "19 Aug 2026", time: "11:00 AM", result: "ALLOWED", device: "Desktop • 10.2.7.31" },
    { id: "L3", paperId: "EP001", user: "Unknown User", action: "ACCESS ATTEMPT", date: "19 Aug 2026", time: "11:05 AM", result: "BLOCKED", device: "Unknown • 45.83.12.207" },
    { id: "L4", paperId: "EP002", user: "Printing Staff", action: "DOWNLOAD", date: "19 Aug 2026", time: "11:20 AM", result: "ALLOWED", device: "Desktop • 10.2.7.31" },
    { id: "L5", paperId: "EP004", user: "Exam Officer", action: "VIEW", date: "19 Aug 2026", time: "10:05 AM", result: "ALLOWED", device: "Laptop • 10.2.4.19" },
    { id: "L6", paperId: "EP005", user: "Exam Center", action: "VIEW", date: "19 Aug 2026", time: "09:45 AM", result: "ALLOWED", device: "Tablet • 10.4.1.8" },
    { id: "L7", paperId: "EP003", user: "Unknown User", action: "ACCESS ATTEMPT", date: "18 Aug 2026", time: "11:58 PM", result: "SUSPICIOUS", device: "Unknown • 91.14.55.2" },
  ],
  alerts: [
    { id: "ALERT-001", paperId: "EP001", reason: "Unauthorized Access", rule: "RULE 1 — Unauthorized Access", severity: "HIGH", user: "Unknown", date: "19 Aug 2026", time: "10:35 AM", status: "OPEN" },
    { id: "ALERT-002", paperId: "EP002", reason: "Multiple Failed Access Attempts", rule: "RULE 2 — Multiple Failed Access Attempts", severity: "MEDIUM", user: "Printing Staff", date: "19 Aug 2026", time: "11:42 AM", status: "OPEN" },
    { id: "ALERT-003", paperId: "EP003", reason: "Unexpected Access Time", rule: "RULE 3 — Unexpected Access Time", severity: "HIGH", user: "Unknown", date: "18 Aug 2026", time: "11:58 PM", status: "OPEN" },
    { id: "ALERT-004", paperId: "EP005", reason: "Unexpected Access Time", rule: "RULE 3 — Unexpected Access Time", severity: "LOW", user: "Exam Center", date: "18 Aug 2026", time: "10:12 PM", status: "OPEN" },
  ],
  users: [
    { name: "Admin User", email: "admin@examtracex.gov", role: "Admin", status: "ACTIVE", lastActivity: "19 Aug 2026 — 12:20 PM" },
    { name: "Exam Officer", email: "officer@examtracex.gov", role: "Exam Officer", status: "ACTIVE", lastActivity: "19 Aug 2026 — 12:02 PM" },
    { name: "Printing Staff", email: "printing@examtracex.gov", role: "Printing Staff", status: "ACTIVE", lastActivity: "19 Aug 2026 — 11:20 AM" },
    { name: "Exam Center Officer", email: "center@examtracex.gov", role: "Exam Center", status: "ACTIVE", lastActivity: "19 Aug 2026 — 09:45 AM" },
    { name: "Storage Officer", email: "storage@examtracex.gov", role: "Printing Staff", status: "ACTIVE", lastActivity: "19 Aug 2026 — 12:00 PM" },
    { name: "Ravi Menon", email: "ravi.menon@examtracex.gov", role: "Exam Center", status: "SUSPENDED", lastActivity: "17 Aug 2026 — 06:10 PM" },
  ],
  role: null,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const set = (fn: (s: State) => State) => {
  state = fn(state);
  emit();
};

export const store = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get: () => state,
};

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(state),
    () => selector(state),
  );
}

export const actions = {
  setRole(role: string | null) {
    set((s) => ({ ...s, role }));
  },

  createPaper(input: { subject: string; examDate: string; examTime: string; examType: string; fileName?: string }) {
    const num = state.papers.length + 1;
    const id = `EP${String(num).padStart(3, "0")}`;
    const { date, time } = nowParts();
    const p: Paper = {
      id,
      subject: input.subject,
      examDate: input.examDate,
      examTime: input.examTime,
      examType: input.examType,
      createdBy: "Exam Officer",
      createdAt: date,
      hash: "8f3a92" + makeHash(input.subject).slice(6),
      status: "ACTIVE",
      integrity: "VERIFIED",
      lastActivity: `${date} — ${time}`,
      holder: "Exam Officer",
    };
    set((s) => ({
      ...s,
      papers: [p, ...s.papers],
      custody: [
        ...s.custody,
        {
          id: nid("C"), paperId: id, title: "PAPER CREATED", date, time,
          user: "Exam Officer", location: "Examination Office",
          note: input.fileName ? `Uploaded: ${input.fileName}` : undefined, tone: "secure",
        },
      ],
      logs: [
        { id: nid("L"), paperId: id, user: "Exam Officer", action: "CREATE", date, time, result: "ALLOWED", device: "Desktop • 10.2.4.11" },
        ...s.logs,
      ],
    }));
    return p;
  },

  transferPaper(paperId: string, to: string) {
    const { date, time } = nowParts();
    const p = state.papers.find((x) => x.id === paperId);
    const from = p?.holder ?? "Exam Officer";
    const location = to === "Printing Staff" ? "Printing Center" : to === "Storage Officer" ? "Secure Storage" : "Exam Center";
    set((s) => ({
      ...s,
      papers: s.papers.map((x) => (x.id === paperId ? { ...x, holder: to, lastActivity: `${date} — ${time}` } : x)),
      custody: [
        ...s.custody,
        { id: nid("C"), paperId, title: "PAPER TRANSFERRED", date, time, user: from, location, from, to, tone: "secure" },
        { id: nid("C"), paperId, title: "PAPER RECEIVED", date, time, user: to, location, tone: "secure" },
      ],
      logs: [
        { id: nid("L"), paperId, user: from, action: "TRANSFER", date, time, result: "ALLOWED", device: "Desktop • 10.2.4.11" },
        ...s.logs,
      ],
    }));
  },

  simulateUnauthorized(paperId: string) {
    const { date, time } = nowParts();
    const alertId = `ALERT-${String(state.alerts.length + 1).padStart(3, "0")}`;
    set((s) => ({
      ...s,
      papers: s.papers.map((x) => (x.id === paperId ? { ...x, lastActivity: `${date} — ${time}` } : x)),
      logs: [
        { id: nid("L"), paperId, user: "Unknown User", action: "ACCESS ATTEMPT", date, time, result: "BLOCKED", device: "Unknown • 45.83.12.207" },
        ...s.logs,
      ],
      custody: [
        ...s.custody,
        { id: nid("C"), paperId, title: "SUSPICIOUS ACCESS", date, time, user: "Unknown User", location: "Unknown", note: "Unauthorized access attempt blocked.", tone: "warn" },
        { id: nid("C"), paperId, title: "ALERT GENERATED", date, time, user: "ExamTraceX Engine", location: "Security Core", note: "Possible unauthorized access detected.", tone: "critical" },
      ],
      alerts: [
        { id: alertId, paperId, reason: "Unauthorized Access", rule: "RULE 1 — Unauthorized Access", severity: "HIGH", user: "Unknown", date, time, status: "OPEN" },
        ...s.alerts,
      ],
    }));
    return alertId;
  },

  markCompromised(paperId: string) {
    const { date, time } = nowParts();
    set((s) => ({
      ...s,
      papers: s.papers.map((x) =>
        x.id === paperId ? { ...x, status: "COMPROMISED" as PaperStatus, integrity: "UNVERIFIED" as const, lastActivity: `${date} — ${time}` } : x,
      ),
      custody: [
        ...s.custody,
        { id: nid("C"), paperId, title: "MARKED COMPROMISED", date, time, user: "Admin User", location: "Examination Office", note: "This paper has been flagged as potentially leaked.", tone: "critical" },
      ],
    }));
  },

  cancelPaper(paperId: string) {
    const { date, time } = nowParts();
    set((s) => ({
      ...s,
      papers: s.papers.map((x) => (x.id === paperId ? { ...x, status: "CANCELLED" as PaperStatus, lastActivity: `${date} — ${time}` } : x)),
      custody: [
        ...s.custody,
        { id: nid("C"), paperId, title: "PAPER CANCELLED", date, time, user: "Admin User", location: "Examination Office", note: "Examination paper cancelled by administrator.", tone: "critical" },
      ],
    }));
  },

  resolveAlert(alertId: string) {
    set((s) => ({ ...s, alerts: s.alerts.map((a) => (a.id === alertId ? { ...a, status: "RESOLVED" as const } : a)) }));
  },

  investigateAlert(alertId: string) {
    set((s) => ({ ...s, alerts: s.alerts.map((a) => (a.id === alertId && a.status === "OPEN" ? { ...a, status: "INVESTIGATING" as const } : a)) }));
  },
};
