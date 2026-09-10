import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeIndianRupee,
  BarChart3,
  ChevronDown,
  Gauge,
  LogOut,
  Phone,
  PhoneCall,
  Sparkles,
  Users } from
"lucide-react";

import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
import { formatINRShort, formatPct } from "@/lib/format";
import { RM_CLIENT_ROSTER } from "@/lib/rm-clients";
import { cn } from "@/lib/utils";
import mark from "@/assets/wealth360-mark.png";

const TIERS = ["All", "UHNI", "HNI"];

export default function RmDashboardPage() {
  const { isRmSession, logoutRm, answers, score, totalAssets, sheruAdvisory } = useApp();
  const navigate = useNavigate();
  const [tierFilter, setTierFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [contactedIds, setContactedIds] = useState([]);

  if (!isRmSession) return <Navigate to="/rm/login" replace />;

  // The one client this prototype has real, live data for — everyone else in
  // the roster is illustrative sample data for a fuller book of business.
  const liveClient = {
    name: answers.name,
    tier: "HNI",
    aum: totalAssets,
    wealthScore: score.total,
    portfolioNote: sheruAdvisory[0]?.headline ?? "No immediate portfolio flags.",
    upsell: sheruAdvisory.slice(0, 2).map((item) => ({
      title: item.headline,
      detail: item.suggestedAction,
      potential: item.category
    }))
  };

  const roster = RM_CLIENT_ROSTER.map((c) => c.isLiveClient ? { ...c, ...liveClient } : c);
  const totalAum = roster.reduce((s, c) => s + (c.aum || 0), 0);
  const avgScore = Math.round(roster.reduce((s, c) => s + (c.wealthScore || 0), 0) / roster.length);
  const pendingCalls = roster.filter((c) => c.callRequested && !contactedIds.includes(c.id));
  const filteredRoster = tierFilter === "All" ? roster : roster.filter((c) => c.tier === tierFilter);

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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} label="Clients managed" value={roster.length} />
          <StatCard icon={PhoneCall} label="Pending call requests" value={pendingCalls.length} tone={pendingCalls.length > 0 ? "alert" : "default"} />
          <StatCard icon={BadgeIndianRupee} label="Total AUM" value={formatINRShort(totalAum)} />
          <StatCard icon={Gauge} label="Avg. wealth score" value={`${avgScore}/100`} />
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
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <p className="text-muted-foreground text-xs">{c.tier} · {c.lastActivity}</p>
                  </div>
                  <Button size="sm" onClick={() => markContacted(c.id)} className="shrink-0">
                    <Phone className="mr-1.5 size-3.5" /> Mark contacted
                  </Button>
                </div>
            )}
            </div>
          </section>
        }

        {/* Roster */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-lg font-semibold">Client roster</p>
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

          <div className="space-y-3">
            {filteredRoster.map((c) => {
              const isExpanded = c.id === expandedId;
              const wasContacted = contactedIds.includes(c.id);
              return (
                <div key={c.id} className="surface-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    className="flex w-full flex-col gap-3 p-4 text-left sm:flex-row sm:items-center sm:gap-4">

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
                          <p className={cn("num text-sm font-semibold", c.performance30d >= 0 ? "text-success" : "text-destructive")}>
                            {formatPct(c.performance30d)}
                          </p>
                        </div>
                      }
                      <ChevronDown className={cn("text-muted-foreground size-4 transition-transform", isExpanded && "rotate-180")} />
                    </div>
                  </button>

                  {isExpanded &&
                  <div className="border-t p-4 pt-4">
                      <p className="text-primary flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
                        <Sparkles className="size-3.5" /> Suggested upsell for this client
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {(c.upsell ?? []).map((u, i) =>
                      <div key={i} className="bg-muted/40 rounded-xl border p-3.5">
                            <p className="text-sm font-semibold">{u.title}</p>
                            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{u.detail}</p>
                            <p className="text-primary mt-2 text-xs font-semibold">{u.potential}</p>
                          </div>
                      )}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm">
                          Log outreach <ArrowRight className="ml-1 size-3.5" />
                        </Button>
                        {c.callRequested && !wasContacted &&
                      <Button size="sm" variant="outline" onClick={() => markContacted(c.id)}>
                            <Phone className="mr-1.5 size-3.5" /> Mark contacted
                          </Button>
                      }
                      </div>
                    </div>
                  }
                </div>);

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
