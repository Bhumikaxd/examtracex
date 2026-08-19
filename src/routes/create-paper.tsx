import { createFileRoute, Link } from "@tanstack/react-router";
import { FilePlus2, Upload, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PaperStatusBadge } from "@/components/status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { actions, type Paper } from "@/lib/store";

export const Route = createFileRoute("/create-paper")({
  head: () => ({
    meta: [
      { title: "Create Secure Paper — ExamTraceX" },
      { name: "description", content: "Register a new exam paper, generate its unique Paper ID and SHA-256 integrity hash, and open its chain of custody." },
      { property: "og:title", content: "Create Secure Exam Paper — ExamTraceX" },
      { property: "og:description", content: "Every new paper gets a unique ID, a SHA-256 fingerprint and a custody record." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreatePaper,
});

const types = ["Final Examination", "Mid-Term Examination", "Practical Examination", "Re-Examination"];

function CreatePaper() {
  const [subject, setSubject] = useState("Mathematics");
  const [examDate, setExamDate] = useState("2026-08-25");
  const [examTime, setExamTime] = useState("09:00");
  const [examType, setExamType] = useState(types[0]);
  const [fileName, setFileName] = useState("");
  const [created, setCreated] = useState<Paper | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = new Date(examDate);
    const paper = actions.createPaper({
      subject,
      examDate: Number.isNaN(d.getTime())
        ? examDate
        : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      examTime,
      examType: examType ?? types[0]!,
      ...(fileName ? { fileName } : {}),
    });
    setCreated(paper);
  };

  return (
    <DashboardLayout title="Create Exam Paper" subtitle="Register a paper and generate its security fingerprint">
      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={submit} className="surface p-6">
          <h2 className="inline-flex items-center gap-2 font-display text-sm font-bold tracking-wider">
            <FilePlus2 className="size-4 text-primary" /> PAPER DETAILS
          </h2>
          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Exam Date</Label>
                <Input id="date" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Exam Time</Label>
                <Input id="time" type="time" value={examTime} onChange={(e) => setExamTime(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Exam Type</Label>
              <select
                id="type"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Upload Question Paper</Label>
              <label
                htmlFor="file"
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-secondary/30 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-primary/50"
              >
                <Upload className="size-4 text-primary" />
                {fileName || "Choose an encrypted PDF to seal"}
              </label>
              <input
                id="file"
                type="file"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
            </div>
            <Button type="submit" size="lg" className="w-full">Create Secure Paper</Button>
          </div>
        </form>

        <div className="surface p-6">
          <h2 className="font-display text-sm font-bold tracking-wider">CREATION RESULT</h2>
          {!created ? (
            <p className="mt-5 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Submit the form to generate a Paper ID and SHA-256 hash.
            </p>
          ) : (
            <div className="mt-5">
              <p className="inline-flex items-center gap-2 rounded-lg border border-secure/40 bg-secure/12 px-4 py-2.5 font-display text-sm font-bold text-secure">
                <CheckCircle2 className="size-4" /> Paper Created Successfully
              </p>
              <dl className="mt-5 space-y-3 text-sm">
                <Row k="Paper ID"><span className="mono font-semibold text-primary">{created.id}</span></Row>
                <Row k="SHA-256 Hash"><span className="mono break-all text-xs">{created.hash}</span></Row>
                <Row k="Status"><PaperStatusBadge status={created.status} /></Row>
                <Row k="Created By">{created.createdBy}</Row>
                <Row k="Created At">{created.createdAt}</Row>
              </dl>
              <p className="mt-4 rounded-lg border border-border bg-secondary/40 px-4 py-2.5 text-xs text-muted-foreground">
                “Paper Created” has been added to the chain of custody.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild>
                  <Link to="/papers/$paperId" params={{ paperId: created.id }}>Open Paper</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/custody" search={{ paper: created.id }}>View Chain of Custody</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-2">
      <dt className="shrink-0 text-muted-foreground">{k}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
