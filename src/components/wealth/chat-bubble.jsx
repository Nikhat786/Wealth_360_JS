import {
  AlertCircle,
  ArrowRight,
  BadgeIndianRupee,
  Calculator,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  FileDown,
  FileText,
  Gauge,
  Headset,
  Layers,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import coachMark from "@/assets/coach-mark.png";
import { useApp } from "@/context/app-context";
import { downloadDashboardPdf } from "@/lib/rm-dashboard-export";

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────────── */

function ActionIcon({ name, className = "size-3.5 shrink-0" }) {
  switch (name) {
    case "ShieldCheck": return <ShieldCheck className={className} />;
    case "TrendingUp": return <TrendingUp className={className} />;
    case "Target": return <Target className={className} />;
    case "BadgeIndianRupee": return <BadgeIndianRupee className={className} />;
    case "Calculator": return <Calculator className={className} />;
    case "FileCheck": return <FileCheck className={className} />;
    case "FileText": return <FileText className={className} />;
    case "FileDown": return <FileDown className={className} />;
    case "Headset": return <Headset className={className} />;
    case "Gauge": return <Gauge className={className} />;
    case "PlusCircle": return <PlusCircle className={className} />;
    case "Layers": return <Layers className={className} />;
    case "MessageSquare": return <MessageSquare className={className} />;
    case "UserCheck": return <UserCheck className={className} />;
    case "Users": return <Users className={className} />;
    case "Sparkles": return <Sparkles className={className} />;
    default: return <Zap className={className} />;
  }
}

/** Extract score and grade from text like "57/100 (Grade B)" */
function parseScoreGrade(text) {
  const m = text.match(/(\d+)\s*\/\s*100.*?Grade\s+([A-F][+-]?)/i);
  if (m) return { score: parseInt(m[1], 10), grade: m[2] };
  return null;
}

/** Convert numeric score 0-100 to star count 1-5 (half-star precision) */
function scoreToStars(score) {
  return Math.round((score / 100) * 5 * 2) / 2;
}

/** Render filled / half / empty stars */
function StarRating({ score }) {
  const stars = scoreToStars(score);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = stars >= i;
        const half   = !filled && stars >= i - 0.5;
        return (
          <span key={i} className="relative inline-block size-4">
            <Star className="size-4 text-muted-foreground/30" />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? "100%" : "50%" }}>
                <Star className="size-4 fill-amber-400 text-amber-400" />
              </span>
            )}
          </span>
        );
      })}
      <span className="ml-1 text-xs font-semibold text-amber-500">{stars.toFixed(1)}</span>
    </div>
  );
}

function gradeColor(grade) {
  if (!grade) return "text-muted-foreground";
  const g = grade[0].toUpperCase();
  if (g === "A") return "text-emerald-500";
  if (g === "B") return "text-blue-500";
  if (g === "C") return "text-amber-500";
  return "text-rose-500";
}

/**
 * Parse raw LLM text into structured sections, follow-ups, and action buttons.
 */
function parseLLMResponse(raw) {
  const lines = raw
    .replace(/\\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const sections = [];
  const followUps = [];
  const actions = [];
  let inFollowUp = false;

  for (let line of lines) {
    // Extract [ACTION: Label | target] syntax
    const actionMatch = line.match(/\[ACTION:\s*([^|]+)\|\s*([^\]]+)\]/i);
    if (actionMatch) {
      actions.push({
        label: actionMatch[1].trim(),
        target: actionMatch[2].trim(),
        variant: actions.length === 0 ? "primary" : "secondary"
      });
      // Strip action trigger from readable line
      line = line.replace(/\[ACTION:\s*[^|]+\|\s*[^\]]+\]/gi, "").trim();
      if (!line) continue;
    }

    if (/^\*{0,2}follow.?up/i.test(line)) {
      inFollowUp = true;
      continue;
    }
    if (inFollowUp) {
      const clean = line.replace(/^[-*\d.]+\s*/, "").replace(/\*\*/g, "").trim();
      if (clean) followUps.push(clean);
      continue;
    }

    const headingMatch = line.match(/^\*{1,2}([^*]{2,50}:)\*{0,2}\s*$/);
    if (headingMatch) {
      sections.push({ type: "heading", content: headingMatch[1].replace(/:$/, "") });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const content = line.replace(/^[-*]\s+/, "").replace(/\*\*/g, "");
      sections.push({ type: "bullet", content });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const content = line.replace(/^\d+\.\s+/, "").replace(/\*\*/g, "");
      sections.push({ type: "bullet", content });
      continue;
    }

    sections.push({ type: "text", content: line });
  }

  return { sections, followUps, actions };
}

function RichText({ text, className }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <span className={className}>
      {parts.map((p, i) =>
        i % 2 === 1
          ? <strong key={i} className="font-semibold text-foreground">{p}</strong>
          : <span key={i}>{p}</span>
      )}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Rich LLM response renderer
───────────────────────────────────────────────────────────────────────────── */
function RichAssistantMessage({ message, onFollowUp }) {
  const navigate = useNavigate();
  const { setRmOpen, activeRmClient } = useApp();
  const { sections, followUps: parsedFollowUps, actions: parsedActions } = parseLLMResponse(message.text);

  const allFollowUps = parsedFollowUps.length
    ? parsedFollowUps
    : (message.followUps || []);

  // Determine actions: from parsed tags, explicit message.actions, or derive smart defaults
  let allActions = parsedActions.length > 0 ? parsedActions : (message.actions || []);
  if (allActions.length === 0) {
    const textLower = (message.text || "").toLowerCase();
    if (textLower.includes("client") || textLower.includes("dossier") || textLower.includes("roster") || textLower.includes("copilot")) {
      allActions = [
        { label: "Download 360° PDF Dossier", target: "action:export_dossier", icon: "FileDown", variant: "primary" },
        { label: "Log Client Outreach Note", target: "action:log_outreach", icon: "MessageSquare" },
        { label: "View Client Profile", target: "action:view_client", icon: "UserCheck" }
      ];
    } else if (textLower.includes("protect") || textLower.includes("insur") || textLower.includes("term") || textLower.includes("cover") || textLower.includes("health")) {
      allActions = [
        { label: "Review Protection Gaps", target: "/protect", icon: "ShieldCheck", variant: "primary" },
        { label: "Book Human RM Review", target: "action:open_rm", icon: "Headset" }
      ];
    } else if (textLower.includes("loan") || textLower.includes("debt") || textLower.includes("emi") || textLower.includes("prepay")) {
      allActions = [
        { label: "Review Loan Prepayment", target: "/debt", icon: "BadgeIndianRupee", variant: "primary" },
        { label: "Calculate Prepay Savings", target: "/debt", icon: "Calculator" }
      ];
    } else if (textLower.includes("rebalance") || textLower.includes("portfolio") || textLower.includes("allocation") || textLower.includes("drift") || textLower.includes("stock")) {
      allActions = [
        { label: "Rebalance Portfolio", target: "/portfolio", icon: "TrendingUp", variant: "primary" },
        { label: "Deploy Idle Cash", target: "/portfolio", icon: "Zap" }
      ];
    } else if (textLower.includes("retire") || textLower.includes("goal") || textLower.includes("corpus") || textLower.includes("education")) {
      allActions = [
        { label: "Explore Goals Roadmap", target: "/goals", icon: "Target", variant: "primary" },
        { label: "Boost Monthly SIP", target: "/portfolio", icon: "PlusCircle" }
      ];
    } else if (textLower.includes("nominee") || textLower.includes("will") || textLower.includes("transfer") || textLower.includes("estate")) {
      allActions = [
        { label: "Update Missing Nominees", target: "/transfer", icon: "FileCheck", variant: "primary" },
        { label: "Draft Digital Will", target: "/transfer", icon: "FileText" }
      ];
    } else if (textLower.includes("tax") || textLower.includes("80c") || textLower.includes("80d") || textLower.includes("nps")) {
      allActions = [
        { label: "Explore Tax Headroom", target: "/portfolio", icon: "Sparkles", variant: "primary" },
        { label: "Book RM Advisory", target: "action:open_rm", icon: "Headset" }
      ];
    } else {
      allActions = [
        { label: "Review 6-Pillar Score", target: "/score", icon: "Gauge", variant: "primary" },
        { label: "Book RM Consultation", target: "action:open_rm", icon: "Headset" }
      ];
    }
  }

  const handleActionClick = (act) => {
    const target = act.target || act.href || act.action;
    if (target === "action:open_rm" || act.action === "open_rm") {
      setRmOpen(true);
      return;
    }
    if (target === "action:export_dossier" || act.action === "export_dossier") {
      const targetClient = activeRmClient || {
        name: "Rahul Mehta",
        tier: "HNI",
        aum: 7540000,
        wealthScore: 68,
        riskProfile: "Moderate Aggressive",
        assetAllocation: [
          { name: "Stocks", value: 2850000 },
          { name: "Mutual Funds", value: 1420000 },
          { name: "Fixed Deposits", value: 600000 },
          { name: "Gold/SGB", value: 350000 },
          { name: "Real Estate", value: 1800000 },
          { name: "EPF/PPF/NPS", value: 520000 }
        ]
      };
      downloadDashboardPdf(targetClient, []);
      return;
    }
    if (target === "action:log_outreach" || act.action === "log_outreach") {
      navigate(activeRmClient?.id ? `/rm/client/${activeRmClient.id}` : "/rm/dashboard");
      return;
    }
    if (target === "action:view_client" || act.action === "view_client") {
      navigate(activeRmClient?.id ? `/rm/client/${activeRmClient.id}` : "/rm/dashboard");
      return;
    }
    if (typeof target === "string" && target.startsWith("/")) {
      navigate(target);
      return;
    }
    if (act.prompt) {
      onFollowUp(act.prompt);
    }
  };

  const firstText  = sections.find((s) => s.type === "text");
  const scoreGrade = firstText ? parseScoreGrade(firstText.content) : null;

  const textSections = sections.filter((s) => s.type === "text");

  // Group bullets under their preceding heading
  const grouped = [];
  let currentGroup = null;
  for (const s of sections) {
    if (s.type === "heading") {
      currentGroup = { heading: s.content, bullets: [] };
      grouped.push(currentGroup);
    } else if (s.type === "bullet" && currentGroup) {
      currentGroup.bullets.push(s.content);
    } else if (s.type === "bullet" && !currentGroup) {
      if (!grouped.length || grouped[grouped.length - 1].heading !== "__orphan__") {
        currentGroup = { heading: "__orphan__", bullets: [] };
        grouped.push(currentGroup);
      }
      grouped[grouped.length - 1].bullets.push(s.content);
    }
  }

  return (
    <div className="min-w-0 flex-1 space-y-3">

      {scoreGrade && (
        <div className="rounded-2xl border bg-gradient-to-br from-card to-muted/40 p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Wealth Health Score
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-foreground num">
                  {scoreGrade.score}
                </span>
                <span className="text-sm text-muted-foreground">/100</span>
                <span className={cn("text-xl font-bold", gradeColor(scoreGrade.grade))}>
                  Grade {scoreGrade.grade}
                </span>
              </div>
              <StarRating score={scoreGrade.score} />
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="relative h-24 w-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute bottom-0 w-full rounded-full bg-gradient-to-t from-primary to-primary/60 transition-all duration-700"
                  style={{ height: scoreGrade.score + "%" }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{scoreGrade.score}%</span>
            </div>
          </div>
        </div>
      )}

      {textSections.map((s, i) => (
        <p key={i} className="text-sm leading-relaxed text-foreground/90">
          <RichText text={s.content} />
        </p>
      ))}

      {!grouped.length && message.bullets && message.bullets.length > 0 && (
        <div className="space-y-2">
          {message.bullets.map((b, i) => (
            <div key={i} className="flex gap-3 rounded-xl border bg-card px-3 py-2.5 shadow-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <span className="text-sm leading-relaxed">{b}</span>
            </div>
          ))}
        </div>
      )}

      {grouped.map((group, gi) => (
        <div key={gi} className="space-y-2">
          {group.heading !== "__orphan__" && (
            <div className="flex items-center gap-2">
              <TrendingUp className="size-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {group.heading}
              </p>
            </div>
          )}
          <div className="space-y-1.5">
            {group.bullets.map((b, bi) => {
              const isAlert = /low|gap|risk|miss|short/i.test(b);
              return (
                <div
                  key={bi}
                  className={cn(
                    "flex gap-3 rounded-xl border px-3 py-2.5 shadow-sm transition-all",
                    isAlert
                      ? "border-amber-200/60 bg-amber-50/40 dark:border-amber-700/30 dark:bg-amber-900/10"
                      : "border-border bg-card"
                  )}>
                  {isAlert
                    ? <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    : <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  }
                  <span className="text-sm leading-relaxed">
                    <RichText text={b} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Immediate Dashboard Actions */}
      {allActions.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border/50">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Sparkles className="size-3 text-gold" /> Immediate Dashboard Actions
          </p>
          <div className="flex flex-wrap gap-2">
            {allActions.map((act, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleActionClick(act)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]",
                  act.variant === "primary"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                )}>
                <ActionIcon name={act.icon} />
                <span>{act.label}</span>
                <ArrowRight className="size-3 opacity-70" />
              </button>
            ))}
          </div>
        </div>
      )}

      {allFollowUps.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Ask me next
          </p>
          <div className="flex flex-wrap gap-2">
            {allFollowUps.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onFollowUp(f)}
                className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-all hover:border-primary/60 hover:bg-primary/10">
                {f}
                <ChevronRight className="size-3" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Public export
───────────────────────────────────────────────────────────────────────────── */
export function ChatBubble({ message, onFollowUp }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <img
        src={coachMark}
        alt=""
        className="bg-secondary size-8 shrink-0 rounded-full object-cover" />
      <RichAssistantMessage message={message} onFollowUp={onFollowUp} />
    </div>
  );
}
