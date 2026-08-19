import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Fingerprint,
  Hash,
  GitBranch,
  Radar,
  BellRing,
  ArrowRight,
  User,
  FileText,
  Clock,
  MapPin,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dot, Pill } from "@/components/status";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ExamTraceX — Secure Every Exam Paper. Trace Every Step." },
      {
        name: "description",
        content:
          "ExamTraceX is an automated exam paper leak detection and chain of custody system: unique paper IDs, SHA-256 integrity, access monitoring and real-time alerts.",
      },
      { property: "og:title", content: "ExamTraceX — Exam Paper Leak Detection & Chain of Custody" },
      {
        property: "og:description",
        content:
          "Monitor paper access, track every transfer, detect suspicious activity and maintain a complete chain of custody.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: FileText, title: "Secure Paper Management", body: "Create, store and control exam papers inside a single hardened workflow with role-based access." },
  { icon: Fingerprint, title: "Unique Paper ID", body: "Every paper receives an immutable identifier used across transfers, logs and investigations." },
  { icon: Hash, title: "SHA-256 Integrity Verification", body: "A cryptographic fingerprint is generated at creation and re-verified on demand." },
  { icon: GitBranch, title: "Chain of Custody", body: "A complete, ordered timeline of who held the paper, when, where and what they did." },
  { icon: Radar, title: "Leak Detection", body: "Rule-based monitoring flags unauthorized access, repeated failures and off-hours activity." },
  { icon: BellRing, title: "Real-Time Alerts", body: "Severity-graded alerts route straight into the admin investigation console." },
];

const steps = ["CREATE", "SECURE", "TRANSFER", "MONITOR", "DETECT", "ALERT", "INVESTIGATE", "TAKE ACTION"];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <span className="font-display text-lg font-bold">
              ExamTrace<span className="text-primary">X</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#home" className="transition-colors hover:text-foreground">Home</a>
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#how" className="transition-colors hover:text-foreground">How It Works</a>
            <a href="#security" className="transition-colors hover:text-foreground">Security</a>
          </nav>
          <Button asChild size="sm" className="ml-auto md:ml-0">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </header>

      <section id="home" className="hero-bg border-b border-border">
        <div className="grid-bg">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
            <div>
              <Pill tone="info">
                <Lock className="size-3" /> Examination Security Platform
              </Pill>
              <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
                Secure Every Exam Paper.{" "}
                <span className="signal-text">Trace Every Step.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                ExamTraceX is an automated examination security system that monitors paper access,
                tracks every transfer, detects suspicious activity, and maintains a complete chain
                of custody.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/login">
                    Get Started <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/dashboard">View Demo</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2"><Dot tone="secure" pulse /> 24 papers monitored</span>
                <span className="inline-flex items-center gap-2"><Dot tone="warn" /> 4 open alerts</span>
                <span className="inline-flex items-center gap-2"><Dot tone="info" /> 18 authorized users</span>
              </div>
            </div>

            <DashboardIllustration />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-3xl font-bold">Built for examination integrity</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Six capabilities that turn an opaque paper handling process into a fully auditable,
          monitored pipeline.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="surface p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40"
            >
              <span className="grid size-11 place-items-center rounded-lg bg-primary/12 text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how" className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A single, linear security lifecycle — from paper creation to administrative action.
          </p>
          <div className="mt-10 grid gap-3 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s} className="surface relative p-5">
                <span className="mono text-xs text-primary">STEP {String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 font-display text-lg font-bold">{s}</p>
                <span className="absolute right-4 top-4 text-xs text-muted-foreground">↓</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="mx-auto max-w-6xl px-5 py-20">
        <div className="surface grid gap-8 p-8 lg:grid-cols-2 lg:p-10">
          <div>
            <h2 className="text-3xl font-bold">Every event is evidence</h2>
            <p className="mt-3 text-muted-foreground">
              Every important paper event is recorded with a complete, tamper-evident record:
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: User, k: "WHO", v: "Authenticated user & role" },
                { icon: FileText, k: "WHAT", v: "Action performed on the paper" },
                { icon: Clock, k: "WHEN", v: "Exact date and timestamp" },
                { icon: MapPin, k: "WHERE", v: "Location, device and IP" },
              ].map((x) => (
                <div key={x.k} className="rounded-lg border border-border bg-secondary/50 p-4">
                  <x.icon className="size-4 text-primary" />
                  <p className="mt-2 font-display text-sm font-bold tracking-wider">{x.k}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{x.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background p-6">
            <p className="mono text-xs text-muted-foreground">// integrity record</p>
            <pre className="mono mt-3 overflow-x-auto text-xs leading-relaxed text-muted-foreground">
{`paper_id   : EP001
subject    : Mathematics
sha256     : 8f3a92c41d7b0e5a...
integrity  : VERIFIED
custody    : 6 recorded events
last_event : SUSPICIOUS ACCESS
severity   : HIGH`}
            </pre>
            <div className="mt-5 flex gap-2">
              <Pill tone="secure"><Dot tone="secure" />INTEGRITY</Pill>
              <Pill tone="warn">MONITORED</Pill>
              <Pill tone="critical">ALERTING</Pill>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground">
          <span className="font-display font-bold text-foreground">ExamTraceX</span>
          <span>Secure Every Exam Paper. Trace Every Step.</span>
          <span className="mono text-xs">Hackathon prototype • demo data</span>
        </div>
      </footer>
    </div>
  );
}

function DashboardIllustration() {
  return (
    <div className="surface relative overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold">Security Dashboard</p>
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Dot tone="secure" pulse /> Live
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { k: "Papers", v: "24", tone: "info" as const },
          { k: "Active", v: "19", tone: "secure" as const },
          { k: "Alerts", v: "4", tone: "critical" as const },
        ].map((s) => (
          <div key={s.k} className="rounded-lg border border-border bg-secondary/40 p-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.k}</p>
            <p className="mt-1 font-display text-2xl font-bold">{s.v}</p>
            <Dot tone={s.tone} />
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {[
          { t: "EP001 created", tone: "secure" as const },
          { t: "EP001 transferred → Printing Staff", tone: "secure" as const },
          { t: "Suspicious access detected", tone: "warn" as const },
          { t: "EP003 marked compromised", tone: "critical" as const },
        ].map((r) => (
          <div key={r.t} className="flex items-center gap-3 rounded-lg border border-border bg-background/60 px-3 py-2 text-xs">
            <Dot tone={r.tone} />
            <span className="text-muted-foreground">{r.t}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-critical/40 bg-critical/10 p-3">
        <p className="font-display text-xs font-bold text-critical">🚨 POSSIBLE PAPER LEAK DETECTED</p>
        <p className="mono mt-1 text-[11px] text-muted-foreground">EP001 • Unauthorized Access • HIGH</p>
      </div>
    </div>
  );
}
