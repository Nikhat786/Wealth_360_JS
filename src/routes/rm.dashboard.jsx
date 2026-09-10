import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BadgeIndianRupee,
  BarChart3,
  Gauge,
  LogOut,
  Phone,
  PhoneCall,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users } from
"lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
import { formatINRShort, formatPct } from "@/lib/format";
import { useRmRoster } from "@/lib/rm-clients";
import { cn } from "@/lib/utils";
import mark from "@/assets/wealth360-mark.png";

const TIERS = ["All", "UHNI", "HNI"];
const SORTS = [
{ id: "aum", label: "AUM (highest)" },
{ id: "score", label: "Wealth score (lowest first)" },
{ id: "performance", label: "30d performance (worst first)" }];


export default function RmDashboardPage() {
  const { isRmSession, logoutRm } = useApp();
  const navigate = useNavigate();
  const roster = useRmRoster();
  const [tierFilter, setTierFilter] = useState("All");
  const [sortBy, setSortBy] = useState("aum");
  const [query, setQuery] = useState("");
  const [contactedIds, setContactedIds] = useState([]);

  if (!isRmSession) return <Navigate to="/rm/login" replace />;

  const totalAum = roster.reduce((s, c) => s + (c.aum || 0), 0);
  const avgScore = Math.round(roster.reduce((s, c) => s + (c.wealthScore || 0), 0) / roster.length);
  const pendingCalls = roster.filter((c) => c.callRequested && !contactedIds.includes(c.id));
  const atRiskClients = roster.filter((c) => (c.wealthScore ?? 100) < 55 || (c.performance30d ?? 0) < 0);

  const topOpportunities = roster.
  flatMap((c) => (c.upsell ?? []).map((u) => ({ ...u, clientId: c.id, clientName: c.name, tier: c.tier }))).
  sort((a, b) => (b.tier === "UHNI") - (a.tier === "UHNI")).
  slice(0, 4);

  const visibleRoster = useMemo(() => {
    let list = tierFilter === "All" ? roster : roster.filter((c) => c.tier === tierFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (sortBy === "aum") sorted.sort((a, b) => (b.aum || 0) - (a.aum || 0));
    if (sortBy === "score") sorted.sort((a, b) => (a.wealthScore || 0) - (b.wealthScore || 0));
    if (sortBy === "performance") sorted.sort((a, b) => (a.performance30d ?? 0) - (b.performance30d ?? 0));
    return sorted;
  }, [roster, tierFilter, query, sortBy]);

  const markContacted = (id) => setContactedIds((prev) => [...prev, id]);

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
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/wealthverse-business">
              <BarChart3 className="mr-1.5 size-3.5" /> Revenue Model
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1.5 size-3.5" /> Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Your book of business</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Every HNI/UHNI client, their call requests, performance, and where to upsell — in one place.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard icon={Users} label="Clients managed" value={roster.length} />
          <StatCard icon={PhoneCall} label="Pending call requests" value={pendingCalls.length} tone={pendingCalls.length > 0 ? "alert" : "default"} />
          <StatCard icon={BadgeIndianRupee} label="Total AUM" value={formatINRShort(totalAum)} />
          <StatCard icon={Gauge} label="Avg. wealth score" value={`${avgScore}/100`} />
          <StatCard icon={AlertTriangle} label="Clients at risk" value={atRiskClients.length} tone={atRiskClients.length > 0 ? "alert" : "default"} />
        </div>

        {/* Call requests */}
        {pendingCalls.length > 0 &&
        <section className="surface-card border-destructive/20 space-y-3 p-5">
            <p className="text-destructive text-xs font-semibold uppercase tracking-wide">
              {pendingCalls.length} client{pendingCalls.length > 1 ? "s" : ""} waiting on a call back
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {pendingCalls.map((c) =>
            <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl border p-3.5">
                  <button
                type="button"
                onClick={() => navigate(`/rm/client/${c.id}`)}
                className="min-w-0 text-left">

                    <p className="truncate text-sm font-semibold hover:underline">{c.name}</p>
                    <p className="text-muted-foreground text-xs">{c.tier} · {c.lastActivity}</p>
                  </button>
                  <Button size="sm" onClick={() => markContacted(c.id)} className="shrink-0">
                    <Phone className="mr-1.5 size-3.5" /> Mark contacted
                  </Button>
                </div>
            )}
            </div>
          </section>
        }

        {/* Top upsell opportunities across the book */}
        {topOpportunities.length > 0 &&
        <section className="surface-card space-y-3 p-5">
            <p className="text-primary flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
              <Sparkles className="size-3.5" /> Top upsell opportunities across your book
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {topOpportunities.map((o, i) =>
            <Link
              key={i}
              to={`/rm/client/${o.clientId}`}
              className="bg-muted/40 hover:bg-muted/70 block rounded-xl border p-3.5 transition-colors">

                  <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">{o.clientName}</p>
                  <p className="mt-1 text-sm font-semibold">{o.title}</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{o.detail}</p>
                  <p className="text-primary mt-2 text-xs font-semibold">{o.potential}</p>
                </Link>
            )}
            </div>
          </section>
        }

        {/* Roster */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-lg font-semibold">Client roster</p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search clients…"
                  className="w-40 rounded-xl border bg-white py-1.5 pl-8 pr-2.5 text-xs outline-none focus:border-primary sm:w-48" />

              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border bg-white px-2.5 py-1.5 text-xs font-medium outline-none focus:border-primary">

                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <div className="flex gap-1.5 rounded-xl border bg-white p-1 text-xs">
                {TIERS.map((t) =>
                <button
                  key={t}
                  type="button"
                  onClick={() => setTierFilter(t)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 font-semibold transition-all",
                    tierFilter === t ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}>

                    {t}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {visibleRoster.length === 0 &&
            <p className="text-muted-foreground p-6 text-center text-sm">No clients match this search.</p>
            }
            {visibleRoster.map((c) => {
              const wasContacted = contactedIds.includes(c.id);
              const isUp = (c.performance30d ?? 0) >= 0;
              return (
                <Link
                  key={c.id}
                  to={`/rm/client/${c.id}`}
                  className="surface-card hover:border-primary/40 flex flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center sm:gap-4">

                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{c.name}</p>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                          c.tier === "UHNI" ? "bg-gold-soft text-gold-foreground" : "bg-primary/10 text-primary"
                        )}>

                        {c.tier}
                      </span>
                      {c.callRequested && !wasContacted &&
                      <span className="bg-destructive/10 text-destructive rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                          Call requested
                        </span>
                      }
                    </div>
                    <p className="text-muted-foreground mt-0.5 truncate text-xs sm:mt-0">{c.portfolioNote}</p>
                  </div>

                  {Array.isArray(c.performanceHistory) &&
                  <div className="h-9 w-20 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={c.performanceHistory}>
                          <Line
                          type="monotone"
                          dataKey="value"
                          stroke={isUp ? "var(--color-success)" : "var(--color-destructive)"}
                          strokeWidth={2}
                          dot={false} />

                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  }

                  <div className="flex shrink-0 items-center gap-5 text-right">
                    <div>
                      <p className="text-muted-foreground text-[10px] uppercase">AUM</p>
                      <p className="num text-sm font-semibold">{formatINRShort(c.aum || 0)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px] uppercase">Score</p>
                      <p className="num text-sm font-semibold">{c.wealthScore ?? "—"}</p>
                    </div>
                    {typeof c.performance30d === "number" &&
                    <div>
                        <p className="text-muted-foreground text-[10px] uppercase">30d</p>
                        <p className={cn("num flex items-center justify-end gap-0.5 text-sm font-semibold", isUp ? "text-success" : "text-destructive")}>
                          {isUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                          {formatPct(c.performance30d)}
                        </p>
                      </div>
                    }
                    <ArrowRight className="text-muted-foreground size-4" />
                  </div>
                </Link>);

            })}
          </div>
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
