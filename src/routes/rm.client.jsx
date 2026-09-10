import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeIndianRupee,
  CheckCircle2,
  Clock,
  Gauge,
  Mail,
  Phone,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp } from
"lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/app-context";
import { formatINR, formatINRShort, formatPct, formatPlainPct } from "@/lib/format";
import { useRmRoster } from "@/lib/rm-clients";
import { cn } from "@/lib/utils";
import mark from "@/assets/wealth360-mark.png";

const palette = [
"var(--color-primary)",
"var(--color-gold)",
"var(--color-success)",
"var(--color-chart-4, #7c93b8)",
"var(--color-chart-5, #c8b273)",
"var(--color-muted-foreground)"];


export default function RmClientPage() {
  const { isRmSession, logoutRm } = useApp();
  const { clientId } = useParams();
  const navigate = useNavigate();
  const roster = useRmRoster();
  const [contacted, setContacted] = useState(false);
  const [outreachNote, setOutreachNote] = useState("");
  const [outreachLog, setOutreachLog] = useState([]);

  if (!isRmSession) return <Navigate to="/rm/login" replace />;

  const client = roster.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8fafc] p-6 text-center">
        <p className="font-display text-lg font-semibold">Client not found</p>
        <Button asChild variant="outline">
          <Link to="/rm/dashboard"><ArrowLeft className="mr-1.5 size-3.5" /> Back to dashboard</Link>
        </Button>
      </div>);

  }

  const isUp = (client.performance30d ?? 0) >= 0;
  const callPending = client.callRequested && !contacted;
  const allocation = client.assetAllocation ?? [];
  const totalAllocation = allocation.reduce((s, a) => s + a.value, 0);

  const logOutreach = () => {
    if (!outreachNote.trim()) return;
    setOutreachLog((prev) => [{ note: outreachNote.trim(), date: "Just now" }, ...prev]);
    setOutreachNote("");
  };

  const handleLogout = () => {
    logoutRm();
    void navigate("/rm/login");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-2.5">
          <img src={mark} alt="m.Stock WealthVerse" className="size-7" />
          <div>
            <p className="font-display text-sm font-bold">
              m.Stock <span className="text-primary">WealthVerse</span>
            </p>
            <p className="text-muted-foreground text-[10px] uppercase tracking-wide">RM Portal</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        <Link to="/rm/dashboard" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium">
          <ArrowLeft className="size-3.5" /> Back to book of business
        </Link>

        {/* Client header */}
        <div className="surface-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl font-bold sm:text-2xl">{client.name}</h1>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  client.tier === "UHNI" ? "bg-gold-soft text-gold-foreground" : "bg-primary/10 text-primary"
                )}>

                {client.tier}
              </span>
              {callPending &&
              <span className="bg-destructive/10 text-destructive rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Call requested
                </span>
              }
            </div>
            <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              {client.relationshipYears != null &&
              <span>{client.relationshipYears} yr relationship</span>
              }
              {client.phone && <span className="flex items-center gap-1"><Phone className="size-3" /> {client.phone}</span>}
              {client.email && <span className="flex items-center gap-1"><Mail className="size-3" /> {client.email}</span>}
              <span>Risk profile: {client.riskProfile ?? "Not assessed"}</span>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            {callPending &&
            <Button size="sm" onClick={() => setContacted(true)}>
                <Phone className="mr-1.5 size-3.5" /> Mark contacted
              </Button>
            }
          </div>
        </div>

        {/* Stat row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={BadgeIndianRupee} label="AUM" value={formatINRShort(client.aum || 0)} />
          <StatCard icon={Gauge} label="Wealth score" value={`${client.wealthScore ?? "—"}/100`} />
          <StatCard
            icon={isUp ? TrendingUp : TrendingDown}
            label="30d performance"
            value={typeof client.performance30d === "number" ? formatPct(client.performance30d) : "—"}
            tone={typeof client.performance30d === "number" && !isUp ? "alert" : "default"} />

          <StatCard icon={ShieldCheck} label="Protection status" value={client.insurance?.hasWill ? "Will on file" : "No will on file"} tone={client.insurance?.hasWill ? "default" : "alert"} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Wealth score breakdown */}
          {Array.isArray(client.scoreBreakdown) &&
          <section className="surface-card space-y-3 p-5">
              <p className="font-display text-sm font-semibold">Wealth score breakdown</p>
              <div className="space-y-2.5">
                {client.scoreBreakdown.map((p) =>
              <div key={p.key ?? p.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium">{p.label}</span>
                      <span className="num text-muted-foreground">{p.score}/100</span>
                    </div>
                    <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                      <div
                    className={cn("h-full rounded-full", p.score >= 70 ? "bg-success" : p.score >= 45 ? "bg-gold" : "bg-destructive")}
                    style={{ width: `${Math.min(100, Math.max(0, p.score))}%` }} />

                    </div>
                  </div>
              )}
              </div>
            </section>
          }

          {/* Asset allocation */}
          {allocation.length > 0 &&
          <section className="surface-card p-5">
              <p className="font-display text-sm font-semibold">Asset allocation</p>
              <div className="mt-2 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={2} stroke="none">
                      {allocation.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                    </Pie>
                    <Tooltip
                      formatter={(v) => formatINR(Number(v))}
                      contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)", fontSize: 12 }} />

                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1.5">
                {allocation.map((a, i) =>
              <li key={a.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full" style={{ background: palette[i % palette.length] }} />
                      {a.name}
                    </span>
                    <span className="num text-muted-foreground">
                      {formatINRShort(a.value)} · {formatPlainPct(totalAllocation > 0 ? a.value / totalAllocation * 100 : 0)}
                    </span>
                  </li>
              )}
              </ul>
            </section>
          }
        </div>

        {/* Goals */}
        {Array.isArray(client.goals) && client.goals.length > 0 &&
        <section className="surface-card space-y-3 p-5">
            <p className="font-display flex items-center gap-1.5 text-sm font-semibold"><Target className="size-4" /> Goal progress</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {client.goals.map((g, i) => {
                const pct = g.target > 0 ? Math.min(100, g.saved / g.target * 100) : 0;
                return (
                  <div key={i} className="bg-muted/40 rounded-xl border p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{g.name}</p>
                      <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold uppercase", g.onTrack ? "bg-success-soft text-success" : "bg-destructive/10 text-destructive")}>
                        {g.onTrack ? "On track" : "Off track"}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatINRShort(g.saved)} of {formatINRShort(g.target)} · target {g.targetYear}
                    </p>
                    <div className="bg-muted mt-2 h-1.5 w-full overflow-hidden rounded-full">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>);

              })}
            </div>
          </section>
        }

        {/* Protection & insurance */}
        {client.insurance &&
        <section className="surface-card space-y-3 p-5">
            <p className="font-display flex items-center gap-1.5 text-sm font-semibold">
              {client.insurance.hasWill ? <ShieldCheck className="size-4" /> : <ShieldAlert className="size-4" />} Protection & insurance
            </p>
            <div className="grid gap-3 text-xs sm:grid-cols-3">
              <div className="bg-muted/40 rounded-xl border p-3.5">
                <p className="text-muted-foreground uppercase">Life cover</p>
                <p className="num mt-1 text-sm font-semibold">{formatINRShort(client.insurance.lifeCover || 0)}</p>
              </div>
              <div className="bg-muted/40 rounded-xl border p-3.5">
                <p className="text-muted-foreground uppercase">Health cover</p>
                <p className="num mt-1 text-sm font-semibold">{formatINRShort(client.insurance.healthCover || 0)}</p>
              </div>
              <div className="bg-muted/40 rounded-xl border p-3.5">
                <p className="text-muted-foreground uppercase">Will on file</p>
                <p className="mt-1 text-sm font-semibold">{client.insurance.hasWill ? "Yes" : "No"}</p>
              </div>
            </div>
            {client.insurance.note &&
            <p className="text-muted-foreground text-xs leading-relaxed">{client.insurance.note}</p>
            }
          </section>
        }

        {/* Upsell opportunities */}
        {Array.isArray(client.upsell) && client.upsell.length > 0 &&
        <section className="surface-card space-y-3 p-5">
            <p className="text-primary flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
              <Sparkles className="size-3.5" /> Suggested upsell for this client
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {client.upsell.map((u, i) =>
            <div key={i} className="bg-muted/40 rounded-xl border p-3.5">
                  <p className="text-sm font-semibold">{u.title}</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{u.detail}</p>
                  <p className="text-primary mt-2 text-xs font-semibold">{u.potential}</p>
                </div>
            )}
            </div>
          </section>
        }

        {/* Relationship activity + log outreach */}
        <section className="surface-card space-y-4 p-5">
          <p className="font-display flex items-center gap-1.5 text-sm font-semibold"><Clock className="size-4" /> Relationship activity</p>
          <div className="space-y-2">
            <Textarea
              value={outreachNote}
              onChange={(e) => setOutreachNote(e.target.value)}
              placeholder="Log a note from this client interaction…"
              rows={2} />

            <Button size="sm" onClick={logOutreach} disabled={!outreachNote.trim()}>
              <CheckCircle2 className="mr-1.5 size-3.5" /> Log outreach
            </Button>
          </div>
          <ul className="space-y-2.5 border-t pt-4 text-xs">
            {[...outreachLog, ...client.activityLog ?? []].map((a, i) =>
            <li key={i} className="flex gap-3">
                <span className="text-muted-foreground w-20 shrink-0">{a.date}</span>
                <span>{a.note}</span>
              </li>
            )}
          </ul>
        </section>
      </main>
    </div>);

}

function StatCard({ icon: Icon, label, value, tone = "default" }) {
  return (
    <div className={cn("surface-card flex items-center gap-3 p-4", tone === "alert" && "border-destructive/30 bg-destructive/5")}>
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", tone === "alert" ? "bg-destructive/10 text-destructive" : "bg-secondary text-secondary-foreground")}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-muted-foreground text-[11px] font-medium uppercase">{label}</p>
        <p className="font-display mt-0.5 text-lg font-semibold">{value}</p>
      </div>
    </div>);

}
