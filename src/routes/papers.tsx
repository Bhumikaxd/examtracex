import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PaperStatusBadge } from "@/components/status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore, type PaperStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/papers")({
  head: () => ({
    meta: [
      { title: "Exam Papers — ExamTraceX" },
      { name: "description", content: "Search and filter every registered exam paper with status, creator and last recorded activity." },
      { property: "og:title", content: "Exam Papers Registry — ExamTraceX" },
      { property: "og:description", content: "All tracked exam papers with integrity status and custody shortcuts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PapersPage,
});

const filters = ["ALL", "ACTIVE", "COMPROMISED", "CANCELLED"] as const;

function PapersPage() {
  const papers = useStore((s) => s.papers);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("ALL");

  const rows = useMemo(
    () =>
      papers.filter((p) => {
        const matchesQuery = `${p.id} ${p.subject} ${p.createdBy}`.toLowerCase().includes(q.toLowerCase());
        const matchesFilter = filter === "ALL" || p.status === (filter as PaperStatus);
        return matchesQuery && matchesFilter;
      }),
    [papers, q, filter],
  );

  return (
    <DashboardLayout title="Exam Papers" subtitle="Every registered examination paper and its current security state">
      <div className="surface p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search paper ID or subject..." className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "cursor-pointer rounded-md border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground",
                  filter === f && "border-primary/50 bg-primary/12 text-primary",
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <Button asChild size="sm">
            <Link to="/create-paper">Create Paper</Link>
          </Button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2.5">Paper ID</th>
                <th className="px-3 py-2.5">Subject</th>
                <th className="px-3 py-2.5">Exam Date</th>
                <th className="px-3 py-2.5">Created By</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Last Activity</th>
                <th className="px-3 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-border/60 transition-colors hover:bg-secondary/40">
                  <td className="mono px-3 py-3 font-semibold text-primary">{p.id}</td>
                  <td className="px-3 py-3">{p.subject}</td>
                  <td className="px-3 py-3 text-muted-foreground">{p.examDate}</td>
                  <td className="px-3 py-3 text-muted-foreground">{p.createdBy}</td>
                  <td className="px-3 py-3"><PaperStatusBadge status={p.status} /></td>
                  <td className="mono px-3 py-3 text-xs text-muted-foreground">{p.lastActivity}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Button asChild size="sm" variant="secondary">
                        <Link to="/papers/$paperId" params={{ paperId: p.id }}>View</Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link to="/custody" search={{ paper: p.id }}>Chain of Custody</Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link to="/access-logs" search={{ paper: p.id }}>Access Logs</Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-muted-foreground">No papers match this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
