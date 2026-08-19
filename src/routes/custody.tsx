import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CustodyTimeline } from "@/components/CustodyTimeline";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/custody")({
  validateSearch: (search: Record<string, unknown>) => ({
    paper: typeof search["paper"] === "string" ? search["paper"] : "EP001",
  }),
  head: () => ({
    meta: [
      { title: "Chain of Custody — ExamTraceX" },
      { name: "description", content: "A complete vertical timeline of every exam paper movement, handover and access event with user, time and location." },
      { property: "og:title", content: "Complete Chain of Custody — ExamTraceX" },
      { property: "og:description", content: "Every important movement and access event is recorded." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CustodyPage,
});

function CustodyPage() {
  const { paper } = Route.useSearch();
  const navigate = useNavigate({ from: "/custody" });
  const papers = useStore((s) => s.papers);
  const events = useStore((s) => s.custody.filter((c) => c.paperId === paper));

  return (
    <DashboardLayout title="Complete Chain of Custody" subtitle="Every important movement and access event is recorded.">
      <div className="surface p-5">
        <div className="flex flex-wrap gap-2">
          {papers.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate({ search: { paper: p.id } })}
              className={cn(
                "mono cursor-pointer rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground",
                paper === p.id && "border-primary/50 bg-primary/12 text-primary",
              )}
            >
              {p.id} · {p.subject}
            </button>
          ))}
        </div>
        <div className="mt-6">
          <CustodyTimeline events={events} />
        </div>
      </div>
    </DashboardLayout>
  );
}
