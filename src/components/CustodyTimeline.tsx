import { CheckCircle2, AlertTriangle, ShieldAlert, MapPin, User, ArrowRight } from "lucide-react";
import type { CustodyEvent } from "@/lib/store";
import { cn } from "@/lib/utils";

const toneMap = {
  secure: { ring: "border-secure/50 bg-secure/12 text-secure", line: "bg-secure/30", Icon: CheckCircle2 },
  warn: { ring: "border-warn/50 bg-warn/12 text-warn", line: "bg-warn/30", Icon: AlertTriangle },
  critical: { ring: "border-critical/50 bg-critical/12 text-critical", line: "bg-critical/30", Icon: ShieldAlert },
  info: { ring: "border-primary/50 bg-primary/12 text-primary", line: "bg-primary/30", Icon: CheckCircle2 },
} as const;

export function CustodyTimeline({ events }: { events: CustodyEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No custody events recorded for this paper yet.
      </p>
    );
  }

  return (
    <ol className="relative">
      {events.map((e, i) => {
        const t = toneMap[e.tone];
        const last = i === events.length - 1;
        return (
          <li key={e.id} className="relative flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <span className={cn("grid size-10 shrink-0 place-items-center rounded-full border", t.ring)}>
                <t.Icon className="size-5" />
              </span>
              {!last && <span className={cn("mt-1 w-px flex-1", t.line)} />}
            </div>
            <div className="min-w-0 flex-1 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-display text-sm font-bold tracking-wide">{e.title}</h4>
                <span className="mono text-xs text-muted-foreground">
                  {e.date} — {e.time}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <User className="size-3.5" /> {e.user}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> {e.location}
                </span>
                <span className="mono text-[11px] text-muted-foreground/80">Paper {e.paperId}</span>
              </div>
              {(e.from || e.to) && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-2.5 py-1 text-xs">
                  <span>{e.from}</span>
                  <ArrowRight className="size-3.5 text-primary" />
                  <span>{e.to}</span>
                </div>
              )}
              {e.note && <p className="mt-2 text-xs text-muted-foreground">{e.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
