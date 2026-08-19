import { createFileRoute, Link } from "@tanstack/react-router";
import { Radar, UserX, RefreshCcw, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AlertStatusBadge, Pill, SeverityBadge } from "@/components/status";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/leak-detection")({
  head: () => ({
    meta: [
      { title: "Leak Detection Center — ExamTraceX" },
      { name: "description", content: "Rule-based leak detection: unauthorized access, repeated failed attempts and unexpected access times, with every trigger listed." },
      { property: "og:title", content: "Leak Detection Center — ExamTraceX" },
      { property: "og:description", content: "Three security rules watch every exam paper access event." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeakDetection,
});

const rules = [
  {
    n: "RULE 1",
    icon: UserX,
    title: "Unauthorized Access",
    body: "A user without custody rights or an unrecognised device attempts to open a paper.",
    severity: "HIGH" as const,
  },
  {
    n: "RULE 2",
    icon: RefreshCcw,
    title: "Multiple Failed Access Attempts",
    body: "Three or more failed authentication attempts against the same paper within 10 minutes.",
    severity: "MEDIUM" as const,
  },
  {
    n: "RULE 3",
    icon: Clock,
    title: "Unexpected Access Time",
    body: "Access occurs outside the approved handling window (08:00–20:00) for a sealed paper.",
    severity: "HIGH" as const,
  },
];

function LeakDetection() {
  const alerts = useStore((s) => s.alerts);

  return (
    <DashboardLayout title="Leak Detection Center" subtitle="Rule-based monitoring of every exam paper access event">
      <div className="surface p-5">
        <p className="inline-flex items-center gap-2 font-display text-sm font-bold tracking-wider">
          <Radar className="size-4 text-primary" /> DETECTION RULES
        </p>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          The prototype detects suspicious behaviour using deterministic security rules. Each access
          event is evaluated against all three rules; a match raises a graded alert and writes to the
          chain of custody.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {rules.map((r) => (
            <div key={r.n} className="rounded-xl border border-border bg-secondary/40 p-5">
              <div className="flex items-center justify-between">
                <span className="mono text-xs text-primary">{r.n}</span>
                <SeverityBadge severity={r.severity} />
              </div>
              <p className="mt-3 inline-flex items-center gap-2 font-semibold">
                <r.icon className="size-4 text-primary" /> {r.title}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
              <Pill tone="secure" className="mt-4">MONITORING</Pill>
            </div>
          ))}
        </div>
      </div>

      <div className="surface mt-5 p-5">
        <p className="font-display text-sm font-bold tracking-wider text-critical">
          🚨 POSSIBLE LEAK DETECTED — TRIGGERED RULES
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2.5">Paper ID</th>
                <th className="px-3 py-2.5">User</th>
                <th className="px-3 py-2.5">Reason</th>
                <th className="px-3 py-2.5">Detection Time</th>
                <th className="px-3 py-2.5">Severity</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.id} className="border-b border-border/60 transition-colors hover:bg-secondary/40">
                  <td className="mono px-3 py-3 font-semibold text-primary">{a.paperId}</td>
                  <td className="px-3 py-3">{a.user}</td>
                  <td className="px-3 py-3 text-muted-foreground">{a.reason}</td>
                  <td className="mono px-3 py-3 text-xs text-muted-foreground">{a.date} — {a.time}</td>
                  <td className="px-3 py-3"><SeverityBadge severity={a.severity} /></td>
                  <td className="px-3 py-3"><AlertStatusBadge status={a.status} /></td>
                  <td className="px-3 py-3">
                    <Button asChild size="sm" variant="secondary">
                      <Link to="/investigate/$alertId" params={{ alertId: a.id }}>Investigate</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
