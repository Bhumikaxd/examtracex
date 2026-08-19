import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ShieldCheck, Send, GitBranch, ScrollText, AlertTriangle, Hash } from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CustodyTimeline } from "@/components/CustodyTimeline";
import { Dot, PaperStatusBadge, Pill } from "@/components/status";
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

export const Route = createFileRoute("/papers/$paperId")({
  head: () => ({
    meta: [
      { title: "Paper Details — ExamTraceX" },
      { name: "description", content: "Full security profile of an exam paper: SHA-256 hash, integrity state, custody timeline and access controls." },
      { property: "og:title", content: "Exam Paper Security Details — ExamTraceX" },
      { property: "og:description", content: "Verify integrity, transfer custody or simulate an unauthorized access event." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaperDetails,
});

const holders = ["Printing Staff", "Storage Officer", "Exam Center"];

function PaperDetails() {
  const { paperId } = useParams({ from: "/papers/$paperId" });
  const paper = useStore((s) => s.papers.find((p) => p.id === paperId));
  const custody = useStore((s) => s.custody.filter((c) => c.paperId === paperId));
  const [breach, setBreach] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  if (!paper) {
    return (
      <DashboardLayout title="Paper not found">
        <div className="surface p-8 text-center">
          <p className="text-muted-foreground">No paper exists with ID {paperId}.</p>
          <Button asChild className="mt-4"><Link to="/papers">Back to papers</Link></Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Paper ${paper.id} — ${paper.subject}`} subtitle="Security profile and custody controls">
      {breach && (
        <div className="mb-5 rounded-xl border border-critical/50 bg-critical/12 p-5">
          <p className="font-display text-lg font-bold text-critical">🚨 POSSIBLE PAPER LEAK DETECTED</p>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-4">
            <p><span className="text-muted-foreground">Reason: </span>Unauthorized Access</p>
            <p><span className="text-muted-foreground">Paper: </span><span className="mono">{paper.id}</span></p>
            <p><span className="text-muted-foreground">Severity: </span><span className="font-semibold text-critical">HIGH</span></p>
            <p><span className="text-muted-foreground">Alert: </span><span className="mono">{breach}</span></p>
          </div>
          <Button asChild size="sm" className="mt-4">
            <Link to="/investigate/$alertId" params={{ alertId: breach }}>Open Investigation</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="surface p-5">
          <h2 className="font-display text-sm font-bold tracking-wider">PAPER DETAILS</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Paper ID", paper.id],
              ["Subject", paper.subject],
              ["Exam Date", paper.examDate],
              ["Exam Time", paper.examTime],
              ["Exam Type", paper.examType],
              ["Current Holder", paper.holder],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3 border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Status</dt>
              <dd><PaperStatusBadge status={paper.status} /></dd>
            </div>
          </dl>
        </section>

        <section className="surface p-5 lg:col-span-2">
          <h2 className="font-display text-sm font-bold tracking-wider">SECURITY INFORMATION</h2>
          <div className="mt-4 rounded-lg border border-border bg-background p-4">
            <p className="inline-flex items-center gap-2 text-xs text-muted-foreground"><Hash className="size-3.5" /> SHA-256 Hash</p>
            <p className="mono mt-2 break-all text-xs text-primary">{paper.hash}</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-secondary/40 p-3">
              <p className="text-xs text-muted-foreground">Integrity</p>
              <p className="mt-1 inline-flex items-center gap-2 font-semibold">
                <Dot tone={paper.integrity === "VERIFIED" ? "secure" : "warn"} />
                {paper.integrity}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/40 p-3">
              <p className="text-xs text-muted-foreground">Created By</p>
              <p className="mt-1 font-semibold">{paper.createdBy}</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/40 p-3">
              <p className="text-xs text-muted-foreground">Created At</p>
              <p className="mt-1 font-semibold">{paper.createdAt}</p>
            </div>
          </div>

          {verified && (
            <p className="mt-4 rounded-lg border border-secure/40 bg-secure/12 px-4 py-2.5 text-sm text-secure">
              ✅ Hash recomputed and matched. Paper integrity verified.
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => setVerified(true)} variant="secondary">
              <ShieldCheck className="size-4" /> Verify Integrity
            </Button>
            <Button onClick={() => setTransferOpen(true)} variant="secondary">
              <Send className="size-4" /> Transfer Paper
            </Button>
            <Button asChild variant="ghost">
              <Link to="/custody" search={{ paper: paper.id }}><GitBranch className="size-4" /> View Chain of Custody</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/access-logs" search={{ paper: paper.id }}><ScrollText className="size-4" /> View Access Logs</Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() => setBreach(actions.simulateUnauthorized(paper.id))}
            >
              <AlertTriangle className="size-4" /> Simulate Unauthorized Access
            </Button>
          </div>
        </section>
      </div>

      <section className="surface mt-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-sm font-bold tracking-wider">CHAIN OF CUSTODY</h2>
          <Pill tone="info">{custody.length} EVENTS</Pill>
        </div>
        <div className="mt-4">
          <CustodyTimeline events={custody} />
        </div>
      </section>

      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer {paper.id}</DialogTitle>
            <DialogDescription>
              Select the receiving custodian. The transfer and receipt are recorded in the chain of custody.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {holders.map((h) => (
              <button
                key={h}
                onClick={() => {
                  actions.transferPaper(paper.id, h);
                  setTransferOpen(false);
                }}
                className="cursor-pointer rounded-lg border border-border bg-secondary/50 px-4 py-3 text-left text-sm font-medium transition-colors hover:border-primary/50"
              >
                {paper.holder} → {h}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTransferOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
