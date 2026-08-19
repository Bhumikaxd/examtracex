import { cn } from "@/lib/utils";
import type { PaperStatus } from "@/lib/store";

const base =
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider";

const tones = {
  secure: "border-secure/40 bg-secure/12 text-secure",
  warn: "border-warn/40 bg-warn/12 text-warn",
  critical: "border-critical/45 bg-critical/12 text-critical",
  info: "border-primary/40 bg-primary/12 text-primary",
  muted: "border-border bg-muted text-muted-foreground",
} as const;

export type ToneKey = keyof typeof tones;

export function Pill({
  tone = "muted",
  children,
  className,
}: {
  tone?: ToneKey;
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn(base, tones[tone], className)}>{children}</span>;
}

export function Dot({ tone = "secure", pulse }: { tone?: ToneKey; pulse?: boolean }) {
  const bg =
    tone === "secure"
      ? "bg-secure"
      : tone === "warn"
        ? "bg-warn"
        : tone === "critical"
          ? "bg-critical"
          : tone === "info"
            ? "bg-primary"
            : "bg-muted-foreground";
  return <span className={cn("inline-block size-2 rounded-full", bg, pulse && "pulse-dot")} />;
}

export function PaperStatusBadge({ status }: { status: PaperStatus }) {
  const tone: ToneKey = status === "ACTIVE" ? "secure" : status === "COMPROMISED" ? "warn" : "critical";
  return (
    <Pill tone={tone}>
      <Dot tone={tone} />
      {status}
    </Pill>
  );
}

export function ResultBadge({ result }: { result: "ALLOWED" | "SUSPICIOUS" | "BLOCKED" }) {
  const tone: ToneKey = result === "ALLOWED" ? "secure" : result === "SUSPICIOUS" ? "warn" : "critical";
  return (
    <Pill tone={tone}>
      <Dot tone={tone} />
      {result}
    </Pill>
  );
}

export function SeverityBadge({ severity }: { severity: "HIGH" | "MEDIUM" | "LOW" }) {
  const tone: ToneKey = severity === "HIGH" ? "critical" : severity === "MEDIUM" ? "warn" : "info";
  return <Pill tone={tone}>{severity}</Pill>;
}

export function AlertStatusBadge({ status }: { status: "OPEN" | "INVESTIGATING" | "RESOLVED" }) {
  const tone: ToneKey = status === "OPEN" ? "critical" : status === "INVESTIGATING" ? "warn" : "secure";
  return <Pill tone={tone}>{status}</Pill>;
}
