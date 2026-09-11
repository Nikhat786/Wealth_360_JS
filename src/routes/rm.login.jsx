import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/app-context";
import mark from "@/assets/wealth360-mark.png";

export default function RmLoginPage() {
  const { isRmSession, loginAsRm } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  if (isRmSession) return <Navigate to="/rm/dashboard" replace />;

  const submit = (e) => {
    e.preventDefault();
    loginAsRm();
    void navigate("/rm/dashboard");
  };

  return (
    <div className="bg-secondary/40 flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/wealth360" className="flex flex-col items-center gap-2 text-center transition-opacity hover:opacity-90" title="Go to WealthVerse Home">
            <img src={mark} alt="Mirae Asset WealthVerse" className="size-10" />
            <p className="font-display text-lg font-bold">
              Mirae Asset <span className="text-primary">WealthVerse</span>
            </p>
          </Link>
          <span className="text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <ShieldCheck className="size-3.5" /> Relationship Manager Portal
          </span>
        </div>

        <form onSubmit={submit} className="surface-card space-y-4 p-6">
          <div>
            <h1 className="font-display text-xl font-semibold">RM sign in</h1>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              Staff-only access to client books, revenue reporting, and upsell intelligence. This is a simulated login for the prototype — any details work.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rm-email">Work email</Label>
            <div className="relative">
              <UserRound className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                id="rm-email"
                type="email"
                className="pl-9"
                placeholder="kabir.sharma@mstock.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />

            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rm-password">Password</Label>
            <Input id="rm-password" type="password" placeholder="••••••••" />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Sign in <ArrowRight className="size-4" />
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-[11px]">
          Not a Relationship Manager? <a href="/" className="text-primary font-semibold hover:underline">Go to the client app</a>
        </p>
      </div>
    </div>);

}
