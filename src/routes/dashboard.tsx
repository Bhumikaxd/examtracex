import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ShieldCheck, AlertTriangle, Ban, BellRing, Users } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dot, Pill, SeverityBadge } from "@/components/status";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Security Dashboard — ExamTraceX" },
      { name: "description", content: "Live overview of exam paper security: totals, system status, recent alerts and custody activity." },
      { property: "og:title", content: "ExamTraceX Security Dashboard" },
      { property: "og:description", content: "Monitor papers, alerts and chain-of-custody activity in real time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const papers = useStore((s) => s.papers);
  const alerts = useStore((s) => s.alerts);
  const custody = useStore((s) => s.custody);
  const users = useStore((s) => s.users);

  const stats = [
    { label: "Total Papers", value: papers.length + 19, icon: FileText, tone: "info" as const },
    { label: "Active Papers", value: papers.filter((p) => p.status === "ACTIVE").length + 16, icon: ShieldCheck, tone: "secure" as const },
    { label: "Compromised Papers", value: papers.filter((p) => p.status === "COMPROMISED").length + 1, icon: AlertTriangle, tone: "warn" as const },
    { label: "Cancelled Papers", value: papers.filter((p) => p.status === "CANCELLED").length + 2, icon: Ban, tone: "critical" as const },
    { label: "Open Alerts", value: alerts.filter((a) => a.status !== "RESOLVED").length, icon: BellRing, tone: "critical" as const },
    { label: "Authorized Users", value: users.length + 12, icon: Users, tone: "info" as const },
  ];

  const recentAlerts = alerts.filter((a) => a.status !== "RESOLVED").slice(0, 3);
  const recentActivity = [...custody].reverse().slice(0, 6);

  return (
    <DashboardLayout title="ExamTraceX Security Dashboard" subtitle="Real-time examination integrity overview">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className="size-4 text-primary" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
            <Dot tone={s.tone} />
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section className="surface p-5">
          <h2 className="font-display text-sm font-bold tracking-wider">SYSTEM STATUS</h2>
          <p className="mt-3 inline-flex items-center gap-2 text-lg font-semibold text-secure">
            <Dot tone="secure" pulse /> Operational
          </p>
          <ul className="mt-4 space-y-2">
            {["Access Control", "Paper Integrity", "Chain of Custody", "Leak Detection"].map((k) => (
              <li key={k} className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm">
                <span className="text-muted-foreground">{k}</span>
                <Pill tone="secure">Active</Pill>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold tracking-wider">RECENT ALERTS</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/alerts">View all</Link>
            </Button>
          </div>
          <div className="mt-3 space-y-3">
            {recentAlerts.length === 0 && (
              <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No open alerts. All papers nominal.
              </p>
            )}
            {recentAlerts.map((a) => (
              <div key={a.id} className="rounded-xl border border-critical/35 bg-critical/8 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-sm font-bold text-critical">🚨 Possible Paper Leak</span>
                  <SeverityBadge severity={a.severity} />
                  <span className="mono ml-auto text-xs text-muted-foreground">{a.time}</span>
                </div>
                <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-3">
                  <span>Paper: <span className="mono text-foreground">{a.paperId}</span></span>
                  <span>Reason: <span className="text-foreground">{a.reason}</span></span>
                  <span>User: <span className="text-foreground">{a.user}</span></span>
                </div>
                <Button asChild size="sm" className="mt-3">
                  <Link to="/investigate/$alertId" params={{ alertId: a.id }}>Investigate</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="surface mt-5 p-5">
        <h2 className="font-display text-sm font-bold tracking-wider">RECENT ACTIVITY</h2>
        <ol className="mt-4 space-y-2">
          {recentActivity.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-sm">
              <Dot tone={e.tone} />
              <span className="mono text-xs text-primary">{e.paperId}</span>
              <span>{e.title.toLowerCase()}</span>
              {e.to && <span className="text-muted-foreground">→ {e.to}</span>}
              <span className="mono ml-auto text-xs text-muted-foreground">{e.date} — {e.time}</span>
            </li>
          ))}
        </ol>
      </section>
    </DashboardLayout>
  );
}
