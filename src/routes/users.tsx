import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Pill } from "@/components/status";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Authorized Users — ExamTraceX" },
      { name: "description", content: "Manage the authorized custodians of exam papers: admins, exam officers, printing staff and exam centers." },
      { property: "og:title", content: "User Management — ExamTraceX" },
      { property: "og:description", content: "Role-based access control across the examination pipeline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const users = useStore((s) => s.users);

  return (
    <DashboardLayout title="Users" subtitle="Authorized custodians and their access roles">
      <div className="surface overflow-x-auto p-5">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2.5">Name</th>
              <th className="px-3 py-2.5">Email</th>
              <th className="px-3 py-2.5">Role</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b border-border/60 transition-colors hover:bg-secondary/40">
                <td className="px-3 py-3 font-medium">{u.name}</td>
                <td className="mono px-3 py-3 text-xs text-muted-foreground">{u.email}</td>
                <td className="px-3 py-3"><Pill tone="info">{u.role}</Pill></td>
                <td className="px-3 py-3">
                  <Pill tone={u.status === "ACTIVE" ? "secure" : "critical"}>{u.status}</Pill>
                </td>
                <td className="mono px-3 py-3 text-xs text-muted-foreground">{u.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
