
import { Bot, Headset, Send, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { ChatBubble } from "@/components/wealth/chat-bubble";

import { useApp } from "@/context/app-context";


export default function CoachPage() {
  const { messages, sendMessage, clearChat, score, setRmOpen, canAccessRM, isTyping } = useApp();
  const [draft, setDraft] = useState("");
  const endRef     = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea to fit content (min 1 row, max 8 rows)
  const autoResize = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const lineH  = parseInt(getComputedStyle(ta).lineHeight, 10) || 20;
    const maxH   = lineH * 8;
    ta.style.height = Math.min(ta.scrollHeight, maxH) + "px";
    ta.style.overflowY = ta.scrollHeight > maxH ? "auto" : "hidden";
  }, []);

  const prompts = [
  "What is my biggest wealth blindspot?",
  "How do I optimize my loan repayment?",
  "What is my FIRE timeline?",
  "How can I save more tax this year?",
  "Explain my Wealth Continuity gaps",
  "How does Account Aggregator work?",
  ...(canAccessRM ? ["Prepare notes for my Human RM"] : ["What are my dynamic next best actions?"])];


  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const submit = useCallback((text = draft) => {
    if (!text.trim()) return;
    sendMessage(text);
    setDraft("");
    // reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "hidden";
    }
  }, [draft, sendMessage]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary uppercase">
                <Bot className="size-3.5" /> Advisory Engine
              </span>
              <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Guardrailed to Dashboard
              </span>
            </div>
            <h1 className="font-display mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              SHERU · AI Wealth Guide
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Dedicated AI Relationship Manager guardrailed strictly to your Wealth 360 dashboard data.
            </p>
          </div>

          <div className="flex gap-2">
            {canAccessRM &&
            <Button variant="outline" size="sm" onClick={() => setRmOpen(true)} className="text-xs">
                <Headset className="mr-1.5 size-3.5" /> Book Human RM
              </Button>
            }
            {messages.length > 0 &&
            <Button variant="ghost" size="sm" onClick={clearChat} className="text-xs">
                <Trash2 className="mr-1.5 size-3.5" /> Clear
              </Button>
            }
          </div>
        </div>

        {/* Chat History Canvas */}
        <div className="surface-card min-h-[55vh] space-y-4 rounded-3xl border p-4 sm:p-6 shadow-sm">
          {messages.length === 0 ?
          <div className="py-12 text-center space-y-3">
              <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0c182b] to-primary text-white shadow-md">
                <Bot className="size-8" />
              </span>
              <h2 className="font-display text-lg font-bold text-foreground">
                Hi Rahul, I&apos;m SHERU.
              </h2>
              <p className="mx-auto max-w-md text-xs text-muted-foreground leading-relaxed">
                I am guardrailed strictly to your personal Wealth 360 dashboard. Ask me about your Wealth Health score, retirement roadmap, loan prepayment vs investing, protection gaps, or tax strategies.
              </p>
            </div> :

          messages.map((m) =>
          <ChatBubble key={m.id} message={m} onFollowUp={submit} />
          )
          }

          {/* Typing indicator — shown while LLM is responding */}
          {isTyping &&
          <div className="flex items-end gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0c182b] to-primary text-white">
                <Bot className="size-3.5" />
              </span>
              <div className="surface-card rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-muted-foreground border shadow-sm">
                <span className="flex items-center gap-1">
                  <span className="text-xs font-medium text-primary mr-1">SHERU</span>
                  <span style={{ display: "inline-flex", gap: "3px", alignItems: "center" }}>
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "currentColor",
                          animation: `sheru-bounce 1s ${delay}ms infinite ease-in-out`
                        }}
                      />
                    ))}
                  </span>
                </span>
              </div>
            </div>
          }

          <div ref={endRef} />
        </div>

        {/* Prompt Suggestions */}
        <div className="flex flex-wrap gap-2">
          {prompts.map((s) =>
          <button
            key={s}
            onClick={() => submit(s)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-colors">
            
              {s}
            </button>
          )}
        </div>

        {/* ── Smart multi-line chat input ── */}
        <div className="sticky bottom-20 flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-lg lg:bottom-4 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={draft}
            disabled={isTyping}
            onChange={(e) => {
              setDraft(e.target.value);
              autoResize();
            }}
            onKeyDown={(e) => {
              // Shift+Enter → insert newline (default behaviour, just resize)
              if (e.key === "Enter" && e.shiftKey) {
                setTimeout(autoResize, 0);
                return;
              }
              // Plain Enter → send
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!isTyping) submit();
              }
            }}
            placeholder={isTyping ? "SHERU is thinking…" : "Ask SHERU about your dashboard — score, loans, tax, retirement, protection…\n(Shift + Enter for new line)"}
            aria-label="Message SHERU"
            style={{
              resize: "none",
              overflowY: "hidden",
              minHeight: "2.25rem",
              lineHeight: "1.5rem",
            }}
            className="flex-1 bg-transparent text-sm leading-6 placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-60 px-2 py-1.5" />

          {/* Character hint */}
          <div className="flex shrink-0 flex-col items-center gap-1 self-end">
            {draft.length > 0 && !isTyping && (
              <span className="text-[10px] text-muted-foreground/50 num">
                {draft.length}
              </span>
            )}
            <Button
              type="button"
              size="icon"
              disabled={isTyping || !draft.trim()}
              onClick={() => submit()}
              className="bg-primary text-primary-foreground shrink-0 disabled:opacity-40 transition-all"
              aria-label="Send">
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>);

}