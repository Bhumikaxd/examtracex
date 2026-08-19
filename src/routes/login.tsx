import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { actions } from "@/lib/store";
import { Pill } from "@/components/status";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — ExamTraceX Examination Security" },
      { name: "description", content: "Sign in to ExamTraceX or open a demo dashboard as Admin, Exam Officer, Printing Staff or Exam Center." },
      { property: "og:title", content: "Login — ExamTraceX" },
      { property: "og:description", content: "Secure access to the ExamTraceX examination security console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

const roles = ["Admin", "Exam Officer", "Printing Staff", "Exam Center"] as const;

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@examtracex.gov");
  const [password, setPassword] = useState("demo1234");

  const enter = (role: string) => {
    actions.setRole(role);
    router.navigate({ to: role === "Exam Officer" ? "/create-paper" : "/dashboard" });
  };

  return (
    <div className="hero-bg min-h-screen">
      <div className="grid-bg flex min-h-screen items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 flex items-center justify-center gap-2">
            <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <span className="font-display text-xl font-bold">
              ExamTrace<span className="text-primary">X</span>
            </span>
          </Link>

          <div className="surface p-7">
            <h1 className="text-2xl font-bold">Secure sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Access the examination security console.
            </p>

            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                enter("Admin");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" required />
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg">
                Sign In <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              DEMO ROLES
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => enter(r)}
                  className="cursor-pointer rounded-lg border border-border bg-secondary/50 px-3 py-3 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-secondary"
                >
                  {r}
                </button>
              ))}
            </div>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              <Pill tone="info">PROTOTYPE</Pill>
              <span className="ml-2">Demo roles open the dashboard instantly.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
