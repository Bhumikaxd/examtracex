import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  FilePlus2,
  GitBranch,
  ScrollText,
  BellRing,
  Radar,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { actions, useStore } from "@/lib/store";
import { Dot } from "@/components/status";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/papers", label: "Exam Papers", icon: FileText },
  { to: "/create-paper", label: "Create Paper", icon: FilePlus2 },
  { to: "/custody", label: "Chain of Custody", icon: GitBranch },
  { to: "/access-logs", label: "Access Logs", icon: ScrollText },
  { to: "/leak-detection", label: "Leak Detection", icon: Radar },
  { to: "/alerts", label: "Alerts", icon: BellRing },
  { to: "/users", label: "Users", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const role = useStore((s) => s.role) ?? "Admin";
  const openAlerts = useStore((s) => s.alerts.filter((a) => a.status !== "RESOLVED").length);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <Link to="/" className="flex items-center gap-2 px-5 py-5">
          <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
            <ShieldCheck className="size-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-sidebar-foreground">
            ExamTrace<span className="text-primary">X</span>
          </span>
        </Link>
        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  active && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <item.icon className={cn("size-4", active && "text-primary")} />
                {item.label}
                {item.label === "Alerts" && openAlerts > 0 && (
                  <span className="ml-auto rounded-md bg-critical/20 px-1.5 py-0.5 text-[11px] font-bold text-critical">
                    {openAlerts}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => {
            actions.setRole(null);
            router.navigate({ to: "/login" });
          }}
          className="m-3 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-critical"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border bg-background/85 px-5 py-4 backdrop-blur">
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-lg font-semibold">{title}</h1>
            {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
            <Dot tone="secure" pulse />
            <span className="text-muted-foreground">System Operational</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
            <span className="grid size-6 place-items-center rounded-md bg-primary/15 text-[11px] font-bold text-primary">
              {role.slice(0, 1)}
            </span>
            <span className="text-xs font-medium">{role}</span>
          </div>
        </header>
        <main className="flex-1 p-5">{children}</main>
      </div>
    </div>
  );
}
