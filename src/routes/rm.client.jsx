import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeIndianRupee,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  Gauge,
  Layers,
  Mail,
  MessageSquare,
  Phone,
  Printer,
  Send,
  Share2,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/app-context";
import { formatINR, formatINRShort, formatPct, formatPlainPct } from "@/lib/format";
import { useRmRoster } from "@/lib/rm-clients";
import {
  downloadDashboardPdf,
  downloadDashboardText,
  previewDashboardPdf
} from "@/lib/rm-dashboard-export";
import { cn } from "@/lib/utils";
import mark from "@/assets/wealth360-mark.png";
import { CoachPopover } from "@/components/wealth/coach-popover";

const palette = [
  "var(--color-primary)",
  "var(--color-gold)",
  "var(--color-success)",
  "var(--color-chart-4, #7c93b8)",
  "var(--color-chart-5, #c8b273)",
  "var(--color-muted-foreground)"];

/** Builds the list of report cards this client has available, derived from their existing data. */
function buildClientReports(client, outreachLog) {
  const allocation = client.assetAllocation ?? [];
  const goals = client.goals ?? [];
  const activityCount = (client.activityLog?.length ?? 0) + outreachLog.length;

  return [
    {
      id: "full-dashboard",
      title: "Complete 360° PDF Dossier",
      icon: Layers,
      period: "Consolidated Live",
      summary: `Full PDF export of AUM (${formatINRShort(client.aum || 0)}), Wealth Score, Drift, HLV Gap & Tax Opportunities`,
      available: true,
      isDossier: true
    },
    {
      id: "portfolio",
      title: "Portfolio Statement",
      icon: BadgeIndianRupee,
      period: "As of today",
      summary: allocation.length > 0 ?
        `${allocation.length} holdings · ${formatINRShort(client.aum || 0)} AUM` :
        "No holdings on file yet",
      available: allocation.length > 0
    },
    {
      id: "wealth-score",
      title: "Wealth Score Report",
      icon: Gauge,
      period: "Updated today",
      summary: Array.isArray(client.scoreBreakdown) ?
        `Overall score ${client.wealthScore ?? "—"}/100 across ${client.scoreBreakdown.length} pillars` :
        "Score not yet computed",
      available: Array.isArray(client.scoreBreakdown) && client.scoreBreakdown.length > 0
    },
    {
      id: "goals",
      title: "Goal Progress Report",
      icon: Target,
      period: "Quarterly",
      summary: goals.length > 0 ? `${goals.length} tracked goal${goals.length > 1 ? "s" : ""}` : "No goals defined yet",
      available: goals.length > 0
    },
    {
      id: "protection",
      title: "Protection & Insurance Review",
      icon: ShieldCheck,
      period: "Annual",
      summary: client.insurance?.hasWill ? "Will on file" : "Will missing",
      available: Boolean(client.insurance)
    },
    {
      id: "opportunities",
      title: "Advisory Opportunity Report",
      icon: Sparkles,
      period: "This month",
      summary: (client.upsell?.length ?? 0) > 0 ?
        `${client.upsell.length} opportunit${client.upsell.length > 1 ? "ies" : "y"} identified` :
        "No open opportunities",
      available: (client.upsell?.length ?? 0) > 0
    },
    {
      id: "activity",
      title: "Relationship Activity Report",
      icon: Clock,
      period: "Last 6 months",
      summary: `${activityCount} logged interaction${activityCount === 1 ? "" : "s"}`,
      available: activityCount > 0
    }];

}

/** Renders a plain-text export of one report so an RM can save/share it outside the app. */
function reportToText(client, report, outreachLog) {
  const lines = [`${report.title} — ${client.name}`, `Generated: ${report.period}`, ""];
  const totalAllocation = (client.assetAllocation ?? []).reduce((s, a) => s + a.value, 0);

  switch (report.id) {
    case "full-dashboard":
      lines.push(
        `Consolidated AUM: ${formatINR(client.aum || 0)}`,
        `Wealth Health Score: ${client.wealthScore ?? "—"}/100`,
        `30d Return: ${client.performance30d != null ? (client.performance30d >= 0 ? "+" : "") + client.performance30d + "%" : "—"}`,
        `Holdings: ${(client.assetAllocation ?? []).length} asset classes`,
        `Goals: ${(client.goals ?? []).length} active goals`,
        `Protection: Life Cover ${formatINR(client.insurance?.lifeCover || 0)}, Health ${formatINR(client.insurance?.healthCover || 0)}, Will: ${client.insurance?.hasWill ? "Yes" : "No"}`
      );
      break;
    case "portfolio":
      lines.push(`Total AUM: ${formatINR(client.aum || 0)}`, "", "Asset allocation:");
      (client.assetAllocation ?? []).forEach((a) => {
        lines.push(`- ${a.name}: ${formatINR(a.value)} (${formatPlainPct(totalAllocation > 0 ? a.value / totalAllocation * 100 : 0)})`);
      });
      break;
    case "wealth-score":
      lines.push(`Overall score: ${client.wealthScore ?? "—"}/100`, "", "Pillar breakdown:");
      (client.scoreBreakdown ?? []).forEach((p) => lines.push(`- ${p.label}: ${p.score}/100`));
      break;
    case "goals":
      (client.goals ?? []).forEach((g) => {
        lines.push(`- ${g.name}: ${formatINR(g.saved)} of ${formatINR(g.target)} saved (target ${g.targetYear}) — ${g.onTrack ? "On track" : "Off track"}`);
      });
      break;
    case "protection":
      lines.push(
        `Life cover: ${formatINR(client.insurance?.lifeCover || 0)}`,
        `Health cover: ${formatINR(client.insurance?.healthCover || 0)}`,
        `Will on file: ${client.insurance?.hasWill ? "Yes" : "No"}`,
        client.insurance?.note ? `Note: ${client.insurance.note}` : ""
      );
      break;
    case "opportunities":
      (client.upsell ?? []).forEach((u) => lines.push(`- ${u.title}: ${u.detail} (${u.potential})`));
      break;
    case "activity":
      [...outreachLog, ...client.activityLog ?? []].forEach((a) => lines.push(`[${a.date}] ${a.note}`));
      break;
  }

  return lines.filter(Boolean).join("\n");
}

function downloadReport(client, report, outreachLog) {
  const text = reportToText(client, report, outreachLog);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${client.name.replace(/\s+/g, "_")}_${report.id}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function RmClientPage() {
  const { isRmSession, logoutRm, discussWithSheru } = useApp();
  const { clientId } = useParams();
  const navigate = useNavigate();
  const roster = useRmRoster();
  const [contacted, setContacted] = useState(false);
  const [outreachNote, setOutreachNote] = useState("");
  const [outreachLog, setOutreachLog] = useState([]);
  const [openReportId, setOpenReportId] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const client = roster.find((c) => c.id === clientId);
  const reports = useMemo(() => client ? buildClientReports(client, outreachLog) : [], [client, outreachLog]);

  if (!isRmSession) return <Navigate to="/rm/login" replace />;

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
  const openReport = reports.find((r) => r.id === openReportId) ?? null;

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
        <Link to="/wealth360" className="flex items-center gap-2.5 transition-opacity hover:opacity-90" title="Go to WealthVerse Home">
          <img src={mark} alt="Mirae Asset WealthVerse" className="size-7" />
          <div>
            <p className="font-display text-sm font-bold">
              Mirae Asset <span className="text-primary">WealthVerse</span>
            </p>
            <p className="text-muted-foreground text-[10px] uppercase tracking-wide">RM Portal</p>
          </div>
        </Link>
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
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {callPending && (
              <Button size="sm" onClick={() => setContacted(true)}>
                <Phone className="mr-1.5 size-3.5" /> Mark contacted
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => discussWithSheru(`Analyze client ${client.name} (Tier: ${client.tier}, AUM: ${formatINRShort(client.aum || 0)}, Score: ${client.wealthScore || 68}/100): suggest priority advisory strategy and meeting talking points.`, { client, rmView: true })}
              className="border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 font-semibold gap-1.5"
              title="Open Sheru RM Copilot with complete client dossier"
            >
              <Sparkles className="size-3.5 text-gold animate-pulse" /> Discuss with SHERU
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => downloadDashboardPdf(client, outreachLog)}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
              title="Download print-ready 360° PDF wealth dossier directly"
            >
              <FileDown className="mr-1.5 size-3.5" /> Download PDF
            </Button>

            <Button
              size="sm"
              onClick={() => setShareModalOpen(true)}
              className="bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90"
              title="Share PDF dossier with client via WhatsApp, Email or Link"
            >
              <Share2 className="mr-1.5 size-3.5" /> Share PDF
            </Button>
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

        {/* Client reports */}
        <section className="surface-card space-y-3 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="font-display flex items-center gap-1.5 text-sm font-semibold">
              <FileText className="size-4 text-primary" /> Client reports & dashboard dossier
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShareModalOpen(true)}
              className="text-primary border-primary/20 hover:bg-primary/5 text-xs font-semibold self-start sm:self-auto"
            >
              <Share2 className="mr-1.5 size-3.5" /> Share Full Dossier
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((r) =>
              <div
                key={r.id}
                className={cn(
                  "flex flex-col justify-between gap-3 rounded-xl border p-3.5 transition-all",
                  r.isDossier ?
                    "border-primary/40 bg-gradient-to-br from-primary/[0.06] via-amber-500/[0.03] to-white shadow-xs" :
                    r.available ? "bg-muted/40" : "bg-muted/20 opacity-60"
                )}>

                <div className="flex items-start gap-2.5">
                  <span className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    r.isDossier ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground"
                  )}>
                    <r.icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-sm font-semibold truncate">{r.title}</p>
                      {r.isDossier &&
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[9px] font-bold text-primary uppercase">
                          Dossier
                        </span>
                      }
                    </div>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wide">{r.period}</p>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{r.summary}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={r.isDossier ? "default" : "outline"}
                    className={cn("flex-1", r.isDossier && "bg-primary text-primary-foreground font-semibold")}
                    disabled={!r.available}
                    onClick={() => setOpenReportId(r.id)}
                  >
                    View
                  </Button>
                  {r.isDossier ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShareModalOpen(true)}
                        title="Share PDF dossier with client"
                      >
                        <Share2 className="size-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadDashboardPdf(client, outreachLog)}
                        title="Download PDF dossier directly"
                      >
                        <FileDown className="size-3.5" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={!r.available}
                      onClick={() => downloadReport(client, r, outreachLog)}
                      title="Download report as text"
                    >
                      <Download className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

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

      <Dialog open={Boolean(openReport)} onOpenChange={(o) => !o && setOpenReportId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {openReport &&
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <openReport.icon className="size-4 text-primary" /> {openReport.title}
                </DialogTitle>
                <DialogDescription>{client.name} · {openReport.period}</DialogDescription>
              </DialogHeader>
              <ReportBody client={client} report={openReport} outreachLog={outreachLog} totalAllocation={totalAllocation} />
              <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                {openReport.isDossier ? (
                  <>
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground font-semibold"
                      onClick={() => downloadDashboardPdf(client, outreachLog)}
                    >
                      <FileDown className="mr-1.5 size-3.5" /> Download PDF Dossier
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setOpenReportId(null);
                        setShareModalOpen(true);
                      }}
                    >
                      <Share2 className="mr-1.5 size-3.5" /> Share PDF Dossier
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => downloadReport(client, openReport, outreachLog)}
                    >
                      <Download className="mr-1.5 size-3.5" /> Text Summary
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => downloadReport(client, openReport, outreachLog)}>
                    <Download className="mr-1.5 size-3.5" /> Download as text
                  </Button>
                )}
              </div>
            </>
          }
        </DialogContent>
      </Dialog>

      <ShareDashboardModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        client={client}
        outreachLog={outreachLog}
      />

      <CoachPopover />
    </div>);

}

function ReportBody({ client, report, outreachLog, totalAllocation }) {
  switch (report.id) {
    case "full-dashboard":
      return (
        <div className="space-y-4 text-xs">
          <div className="rounded-xl border bg-muted/40 p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground uppercase text-[10px] font-bold">Consolidated AUM</span>
              <span className="font-display font-bold text-sm text-foreground">{formatINR(client.aum || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground uppercase text-[10px] font-bold">Wealth Health Score</span>
              <span className="font-bold text-emerald-600">{client.wealthScore ?? "—"}/100</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground uppercase text-[10px] font-bold">30d Performance</span>
              <span className={client.performance30d >= 0 ? "font-bold text-emerald-600" : "font-bold text-red-600"}>
                {client.performance30d != null ? (client.performance30d >= 0 ? "+" : "") + client.performance30d + "%" : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground uppercase text-[10px] font-bold">Estate Will</span>
              <span className="font-medium">{client.insurance?.hasWill ? "✅ On file" : "⚠️ Missing"}</span>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            This 360° dossier synthesizes all asset allocations, goals roadmap, health pillars, and advisory recommendations into a single shareable, printable package.
          </p>
        </div>);
    case "portfolio":
      return (
        <div className="space-y-2">
          <p className="text-sm">Total AUM: <span className="num font-semibold">{formatINR(client.aum || 0)}</span></p>
          <ul className="divide-y text-xs">
            {(client.assetAllocation ?? []).map((a) =>
              <li key={a.name} className="flex items-center justify-between py-2">
                <span>{a.name}</span>
                <span className="num text-muted-foreground">
                  {formatINR(a.value)} · {formatPlainPct(totalAllocation > 0 ? a.value / totalAllocation * 100 : 0)}
                </span>
              </li>
            )}
          </ul>
        </div>);

    case "wealth-score":
      return (
        <div className="space-y-2.5">
          <p className="text-sm">Overall score: <span className="num font-semibold">{client.wealthScore ?? "—"}/100</span></p>
          {(client.scoreBreakdown ?? []).map((p) =>
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
        </div>);

    case "goals":
      return (
        <ul className="space-y-2.5 text-xs">
          {(client.goals ?? []).map((g, i) => {
            const pct = g.target > 0 ? Math.min(100, g.saved / g.target * 100) : 0;
            return (
              <li key={i} className="rounded-xl border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{g.name}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold uppercase", g.onTrack ? "bg-success-soft text-success" : "bg-destructive/10 text-destructive")}>
                    {g.onTrack ? "On track" : "Off track"}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1">
                  {formatINRShort(g.saved)} of {formatINRShort(g.target)} · target {g.targetYear}
                </p>
                <div className="bg-muted mt-2 h-1.5 w-full overflow-hidden rounded-full">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </li>);

          })}
        </ul>);

    case "protection":
      return (
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/40 rounded-xl border p-3">
              <p className="text-muted-foreground uppercase">Life cover</p>
              <p className="num mt-1 text-sm font-semibold">{formatINRShort(client.insurance?.lifeCover || 0)}</p>
            </div>
            <div className="bg-muted/40 rounded-xl border p-3">
              <p className="text-muted-foreground uppercase">Health cover</p>
              <p className="num mt-1 text-sm font-semibold">{formatINRShort(client.insurance?.healthCover || 0)}</p>
            </div>
          </div>
          <p>Will on file: <span className="font-semibold">{client.insurance?.hasWill ? "Yes" : "No"}</span></p>
          {client.insurance?.note && <p className="text-muted-foreground leading-relaxed">{client.insurance.note}</p>}
        </div>);

    case "opportunities":
      return (
        <ul className="space-y-2.5 text-xs">
          {(client.upsell ?? []).map((u, i) =>
            <li key={i} className="bg-muted/40 rounded-xl border p-3">
              <p className="text-sm font-semibold">{u.title}</p>
              <p className="text-muted-foreground mt-1 leading-relaxed">{u.detail}</p>
              <p className="text-primary mt-1.5 font-semibold">{u.potential}</p>
            </li>
          )}
        </ul>);

    case "activity":
      return (
        <ul className="space-y-2.5 text-xs">
          {[...outreachLog, ...client.activityLog ?? []].map((a, i) =>
            <li key={i} className="flex gap-3">
              <span className="text-muted-foreground w-20 shrink-0">{a.date}</span>
              <span>{a.note}</span>
            </li>
          )}
        </ul>);

    default:
      return null;
  }
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

function ShareDashboardModal({ open, onOpenChange, client, outreachLog }) {
  const [copied, setCopied] = useState(false);
  const shareableUrl = `${window.location.origin}/wealth360/review?client=${client.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const emailSubject = encodeURIComponent(
    `Official WealthVerse 360° Financial Dossier (PDF) — Mirae Asset Private Wealth`
  );
  const emailBody = encodeURIComponent(
    `Dear ${client.name},\n\nPlease find your official Mirae Asset WealthVerse 360° Financial Dossier summary prepared by your Relationship Manager.\n\nKey Highlights:\n• Total Portfolio AUM: ${formatINR(client.aum || 0)}\n• 360° Wealth Health Score: ${client.wealthScore ?? "—"}/100\n• 30-Day Performance: ${client.performance30d != null ? (client.performance30d >= 0 ? "+" : "") + client.performance30d + "%" : "—"}\n• Protection Status: ${client.insurance?.hasWill ? "Will on file" : "Succession review recommended"}\n\nYou can access your live interactive client dashboard and download your verified PDF statement here:\n${shareableUrl}\n\nPlease feel free to reach out if you have any questions or would like to review upcoming asset allocations.\n\nWarm regards,\nKabir Sharma\nRelationship Manager, Private Wealth Advisory\nMirae Asset WealthVerse`
  );
  const mailtoUrl = `mailto:${client.email || ""}?subject=${emailSubject}&body=${emailBody}`;

  const waText = encodeURIComponent(
    `Hello ${client.name}, your official Mirae Asset WealthVerse 360° Wealth Dossier (PDF) is ready. Total AUM: ${formatINRShort(client.aum || 0)} with Wealth Score of ${client.wealthScore ?? "—"}/100. Review your portfolio and download the official PDF dossier here: ${shareableUrl}`
  );
  const whatsappUrl = `https://wa.me/${client.phone?.replace(/[^0-9]/g, "") || ""}?text=${waText}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Share2 className="size-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Client PDF Dossier Sharing</span>
          </div>
          <DialogTitle className="font-display text-xl font-bold">
            Share 360° PDF Dossier — {client.name}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Directly download the official print-ready PDF Wealth Dossier, preview high-res layouts, or share the secure link with {client.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Section 1: Official PDF Dossier Downloads */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
              1. Official PDF Wealth Dossier
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="flex flex-col justify-between rounded-xl border border-primary/25 bg-primary/[0.04] p-3.5 transition-all hover:border-primary/45 hover:bg-primary/[0.07]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileDown className="size-4" />
                    </span>
                    <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold uppercase">
                      Direct PDF
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-bold text-foreground">Download PDF Dossier</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    Launches instant print-to-PDF with complete 6-pillar diagnostics, drift analysis, HLV gap audit & RM action plan.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="mt-3 w-full bg-primary text-primary-foreground font-semibold"
                  onClick={() => downloadDashboardPdf(client, outreachLog)}
                >
                  <FileDown className="mr-1.5 size-3.5" /> Download PDF Now
                </Button>
              </div>

              <div className="flex flex-col justify-between rounded-xl border p-3.5 bg-slate-50 hover:bg-slate-100/80 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <Printer className="size-4" />
                    </span>
                    <span className="rounded-full bg-slate-200 text-slate-700 px-2 py-0.5 text-[9px] font-semibold uppercase">
                      Print View
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-bold text-foreground">Preview & Print PDF</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    Opens formatted multi-page printable dossier in a dedicated window with instant 1-click Save-as-PDF.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={() => previewDashboardPdf(client, outreachLog)}
                >
                  <Printer className="mr-1.5 size-3.5" /> Open Print View
                </Button>
              </div>
            </div>
          </div>

          {/* Section 2: Direct Share Options */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
              2. Share PDF & Dossier Directly
            </p>
            <div className="space-y-2.5">
              {/* WhatsApp */}
              <div className="flex items-center justify-between gap-3 rounded-xl border p-3 bg-white">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <MessageSquare className="size-3.5 text-emerald-600" />
                    <span>Share via WhatsApp</span>
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground mt-0.5">
                    {client.phone ? `Pre-composed PDF dossier note to ${client.phone}` : "No phone number on file"}
                  </p>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  disabled={!client.phone}
                  className="shrink-0 text-xs text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 border-emerald-200"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-1.5 size-3 text-emerald-600" /> WhatsApp
                  </a>
                </Button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between gap-3 rounded-xl border p-3 bg-white">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Mail className="size-3.5 text-primary" />
                    <span>Share via Email</span>
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground mt-0.5">
                    {client.email ? `Official PDF dossier email to ${client.email}` : "No email on file"}
                  </p>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  disabled={!client.email}
                  className="shrink-0 text-xs"
                >
                  <a href={mailtoUrl}>
                    <Send className="mr-1.5 size-3" /> Email Client
                  </a>
                </Button>
              </div>

              {/* Copy Shareable Link */}
              <div className="flex items-center justify-between gap-3 rounded-xl border p-3 bg-white">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <ExternalLink className="size-3.5 text-blue-600" />
                    <span>Copy Client Portal Link</span>
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground mt-0.5 font-mono">
                    {shareableUrl}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={copied ? "default" : "outline"}
                  onClick={handleCopy}
                  className={`shrink-0 text-xs transition-all ${copied ? "bg-emerald-600 text-white" : ""
                    }`}
                >
                  {copied ? (
                    <>
                      <Check className="mr-1.5 size-3" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 size-3" /> Copy Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Section 3: CRM Text Summary */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs">
            <div>
              <p className="font-semibold text-slate-800">Compact CRM Text Summary</p>
              <p className="text-[11px] text-slate-500">Download formatted plain text file for CRM audit trails</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => downloadDashboardText(client, outreachLog)}>
              <Download className="mr-1.5 size-3.5 text-slate-600" /> Download (.txt)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
