import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AlertStatusBadge, SeverityBadge } from "@/components/status";
import { Button } from "@/components/ui/button";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Security Alerts — ExamTraceX" },
      { name: "description", content: "Manage severity-graded exam paper security alerts: investigate suspicious access or resolve confirmed false positives." },
      { property: "og:title", content: "Security Alert Management — ExamTraceX" },
      { property: "og:description", content: "Every detection rule trigger, graded HIGH, MEDIUM or LOW." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AlertsPage,
});

function AlertsPage() {
  const alerts = useStore((s) => s.alerts);

  return (
    <DashboardLayout title="Alerts" subtitle="Security alerts raised by the leak detection engine">
      <div className="grid gap-4 lg:grid-cols-2">
        {alerts.map((a) => (
          <article key={a.id} className="surface p-5">
            <div className="flex flex-wrap items-center gap-2">
              <BellRing className="size-4 text-critical" />
              <span className="mono text-sm font-bold">{a.id}</span>
              <SeverityBadge severity={a.severity} />
              <AlertStatusBadge status={a.status} />
              <span className="mono ml-auto text-xs text-muted-foreground">{a.date} — {a.time}</span>
            </div>
            <p className="mt-3 font-display text-base font-semibold">{a.reason}</p>
            <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-3">
              <span>Paper: <span className="mono text-foreground">{a.paperId}</span></span>
              <span>User: <span className="text-foreground">{a.user}</span></span>
              <span>{a.rule}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link to="/investigate/$alertId" params={{ alertId: a.id }}>Investigate</Link>
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={a.status === "RESOLVED"}
                onClick={() => actions.resolveAlert(a.id)}
              >
                Resolve
              </Button>
            </div>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
}
