import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AlertTriangle, Ban, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CustodyTimeline } from "@/components/CustodyTimeline";
import { AlertStatusBadge, Dot, PaperStatusBadge, ResultBadge, SeverityBadge } from "@/components/status";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/investigate/$alertId")({
  head: () => ({
    meta: [
      { title: "Investigation Console — ExamTraceX" },
      { name: "description", content: "Investigate a security alert: alert detail, paper profile, recent access history, chain of custody and administrative actions." },
      { property: "og:title", content: "Alert Investigation — ExamTraceX" },
      { property: "og:description", content: "Mark a paper compromised, cancel it, or resolve the alert after review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Investigation,
});

function Investigation() {
  const { alertId } = useParams({ from: "/investigate/$alertId" });
  const alert = useStore((s) => s.alerts.find((a) => a.id === alertId));
  const paper = useStore((s) => s.papers.find((p) => p.id === alert?.paperId));
  const logs = useStore((s) => s.logs.filter((l) => l.paperId === alert?.paperId).slice(0, 6));
  const custody = useStore((s) => s.custody.filter((c) => c.paperId === alert?.paperId));
  const [cancelOpen, setCancelOpen] = useState(false);
  const [banner, setBanner] = useState<"compromised" | "cancelled" | "resolved" | null>(null);

  useEffect(() => {
    if (alertId) actions.investigateAlert(alertId);
  }, [alertId]);

  if (!alert || !paper) {
    return (
      <DashboardLayout title="Investigation">
        <div className="surface p-8 text-center">
          <p className="text-muted-foreground">Alert {alertId} not found.</p>
          <Button asChild className="mt-4"><Link to="/alerts">Back to alerts</Link></Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Investigation — ${alert.id}`} subtitle={`Paper ${paper.id} • ${alert.reason}`}>
      {banner === "compromised" && (
        <div className="mb-5 rounded-xl border border-warn/50 bg-warn/12 p-5">
          <p className="font-display text-lg font-bold text-warn">⚠️ PAPER COMPROMISED</p>
          <p className="mt-1 text-sm text-muted-foreground">This paper has been flagged as potentially leaked.</p>
        </div>
      )}
      {banner === "cancelled" && (
        <div className="mb-5 rounded-xl border border-critical/50 bg-critical/12 p-5">
          <p className="font-display text-lg font-bold text-critical">❌ PAPER CANCELLED</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Status: CANCELLED — the cancellation is now the latest chain of custody event.
          </p>
        </div>
      )}
      {banner === "resolved" && (
        <div className="mb-5 rounded-xl border border-secure/50 bg-secure/12 p-5">
          <p className="font-display text-lg font-bold text-secure">✅ ALERT RESOLVED</p>
          <p className="mt-1 text-sm text-muted-foreground">The alert has been closed by the administrator.</p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface p-5">
          <h2 className="font-display text-sm font-bold tracking-wider">ALERT DETAILS</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row k="Alert ID"><span className="mono">{alert.id}</span></Row>
            <Row k="Paper ID"><span className="mono text-primary">{alert.paperId}</span></Row>
            <Row k="Reason">{alert.reason}</Row>
            <Row k="Rule">{alert.rule}</Row>
            <Row k="Severity"><SeverityBadge severity={alert.severity} /></Row>
            <Row k="Time">{alert.date} — {alert.time}</Row>
            <Row k="User">{alert.user}</Row>
            <Row k="Status"><AlertStatusBadge status={alert.status} /></Row>
          </dl>
        </section>

        <section className="surface p-5">
          <h2 className="font-display text-sm font-bold tracking-wider">PAPER DETAILS</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row k="Subject">{paper.subject}</Row>
            <Row k="Exam Date">{paper.examDate}</Row>
            <Row k="Current Status"><PaperStatusBadge status={paper.status} /></Row>
            <Row k="Integrity">
              <span className="inline-flex items-center gap-2">
                <Dot tone={paper.integrity === "VERIFIED" ? "secure" : "warn"} />
                {paper.integrity}
              </span>
            </Row>
            <Row k="SHA-256"><span className="mono break-all text-xs">{paper.hash.slice(0, 24)}…</span></Row>
          </dl>
        </section>
      </div>

      <section className="surface mt-5 p-5">
        <h2 className="font-display text-sm font-bold tracking-wider">RECENT ACCESS HISTORY</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2.5">User</th>
                <th className="px-3 py-2.5">Action</th>
                <th className="px-3 py-2.5">Date</th>
                <th className="px-3 py-2.5">Time</th>
                <th className="px-3 py-2.5">Result</th>
                <th className="px-3 py-2.5">Device / IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-border/60">
                  <td className="px-3 py-3">{l.user}</td>
                  <td className="px-3 py-3 text-muted-foreground">{l.action}</td>
                  <td className="px-3 py-3 text-muted-foreground">{l.date}</td>
                  <td className="mono px-3 py-3 text-xs text-muted-foreground">{l.time}</td>
                  <td className="px-3 py-3"><ResultBadge result={l.result} /></td>
                  <td className="mono px-3 py-3 text-xs text-muted-foreground">{l.device}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="surface mt-5 p-5">
        <h2 className="font-display text-sm font-bold tracking-wider">CHAIN OF CUSTODY</h2>
        <div className="mt-4">
          <CustodyTimeline events={custody} />
        </div>
      </section>

      <div className="surface mt-5 flex flex-wrap gap-2 p-5">
        <Button
          variant="secondary"
          disabled={paper.status !== "ACTIVE"}
          onClick={() => {
            actions.markCompromised(paper.id);
            setBanner("compromised");
          }}
        >
          <AlertTriangle className="size-4" /> Mark as Compromised
        </Button>
        <Button variant="destructive" disabled={paper.status === "CANCELLED"} onClick={() => setCancelOpen(true)}>
          <Ban className="size-4" /> Cancel Paper
        </Button>
        <Button
          variant="outline"
          disabled={alert.status === "RESOLVED"}
          onClick={() => {
            actions.resolveAlert(alert.id);
            setBanner("resolved");
          }}
        >
          <CheckCircle2 className="size-4" /> Resolve Alert
        </Button>
      </div>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to cancel {paper.id}?</DialogTitle>
            <DialogDescription>
              Cancellation will mark this examination paper as CANCELLED and record the action in the
              chain of custody.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCancelOpen(false)}>Go Back</Button>
            <Button
              variant="destructive"
              onClick={() => {
                actions.cancelPaper(paper.id);
                setCancelOpen(false);
                setBanner("cancelled");
              }}
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-2">
      <dt className="shrink-0 text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}
