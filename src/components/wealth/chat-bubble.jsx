import { AlertCircle, CheckCircle2, ChevronRight, Star, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import coachMark from "@/assets/coach-mark.png";

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────────── */

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
 * Parse raw LLM text into structured sections.
 */
function parseLLMResponse(raw) {
  const lines = raw
    .replace(/\\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const sections = [];
  let followUps  = [];
  let inFollowUp = false;

  for (const line of lines) {
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

  return { sections, followUps };
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
  const { sections, followUps: parsedFollowUps } = parseLLMResponse(message.text);

  const allFollowUps = parsedFollowUps.length
    ? parsedFollowUps
    : (message.followUps || []);

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
