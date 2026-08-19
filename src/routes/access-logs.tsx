import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ResultBadge } from "@/components/status";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/access-logs")({
  validateSearch: (search: Record<string, unknown>) => ({
    paper: typeof search["paper"] === "string" ? search["paper"] : "ALL",
  }),
  head: () => ({
    meta: [
      { title: "Access Logs — ExamTraceX" },
      { name: "description", content: "Immutable access log of every view, download and blocked attempt against exam papers, with device and IP detail." },
      { property: "og:title", content: "Exam Paper Access Logs — ExamTraceX" },
      { property: "og:description", content: "Who accessed which paper, when, from where and with what result." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccessLogsPage,
});

function AccessLogsPage() {
  const { paper } = Route.useSearch();
  const navigate = useNavigate({ from: "/access-logs" });
  const logs = useStore((s) => s.logs);
  const papers = useStore((s) => s.papers);
  const [q, setQ] = useState("");

  const rows = logs.filter(
    (l) =>
      (paper === "ALL" || l.paperId === paper) &&
      `${l.paperId} ${l.user} ${l.action} ${l.device}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <DashboardLayout title="Access Logs" subtitle="Every access attempt recorded with user, device and result">
      <div className="surface p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search user, action or IP..." className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            {["ALL", ...papers.map((p) => p.id)].map((id) => (
              <button
                key={id}
                onClick={() => navigate({ search: { paper: id } })}
                className={cn(
                  "mono cursor-pointer rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground",
                  paper === id && "border-primary/50 bg-primary/12 text-primary",
                )}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2.5">Paper ID</th>
                <th className="px-3 py-2.5">User</th>
                <th className="px-3 py-2.5">Action</th>
                <th className="px-3 py-2.5">Date</th>
                <th className="px-3 py-2.5">Time</th>
                <th className="px-3 py-2.5">Result</th>
                <th className="px-3 py-2.5">Device / IP</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-b border-border/60 transition-colors hover:bg-secondary/40">
                  <td className="mono px-3 py-3 font-semibold text-primary">{l.paperId}</td>
                  <td className="px-3 py-3">{l.user}</td>
                  <td className="px-3 py-3 text-muted-foreground">{l.action}</td>
                  <td className="px-3 py-3 text-muted-foreground">{l.date}</td>
                  <td className="mono px-3 py-3 text-xs text-muted-foreground">{l.time}</td>
                  <td className="px-3 py-3"><ResultBadge result={l.result} /></td>
                  <td className="mono px-3 py-3 text-xs text-muted-foreground">{l.device}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-muted-foreground">No access events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
