import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Pill } from "@/components/status";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Security Settings — ExamTraceX" },
      { name: "description", content: "Configure detection rules, alert routing and integrity verification behaviour for the examination security system." },
      { property: "og:title", content: "Security Settings — ExamTraceX" },
      { property: "og:description", content: "Tune detection rules and alerting for exam paper protection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const toggles = [
  { k: "rule1", label: "Rule 1 — Unauthorized Access detection", def: true },
  { k: "rule2", label: "Rule 2 — Multiple failed access attempts", def: true },
  { k: "rule3", label: "Rule 3 — Unexpected access time", def: true },
  { k: "hash", label: "Re-verify SHA-256 hash on every transfer", def: true },
  { k: "email", label: "Email admins on HIGH severity alerts", def: false },
];

function SettingsPage() {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(toggles.map((t) => [t.k, t.def])),
  );

  return (
    <DashboardLayout title="Settings" subtitle="Detection rules, integrity checks and alert routing">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface p-5">
          <h2 className="font-display text-sm font-bold tracking-wider">SECURITY CONTROLS</h2>
          <div className="mt-4 space-y-3">
            {toggles.map((t) => (
              <div key={t.k} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary/40 px-4 py-3">
                <Label htmlFor={t.k} className="text-sm font-normal text-muted-foreground">{t.label}</Label>
                <Switch
                  id={t.k}
                  checked={state[t.k]}
                  onCheckedChange={(v) => setState((s) => ({ ...s, [t.k]: v }))}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="font-display text-sm font-bold tracking-wider">SYSTEM INFORMATION</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Environment", "Hackathon Prototype"],
              ["Hash Algorithm", "SHA-256"],
              ["Custody Ledger", "Append-only (in-memory demo)"],
              ["Handling Window", "08:00 — 20:00"],
              ["Data Source", "Mock demo data"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <Pill tone="secure" className="mt-5">ALL CONTROLS OPERATIONAL</Pill>
        </section>
      </div>
    </DashboardLayout>
  );
}
