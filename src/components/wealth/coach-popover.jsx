import { Bot, RefreshCw, Send, Sparkles, Trash2, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatBubble } from "@/components/wealth/chat-bubble";
import { useApp } from "@/context/app-context";
import { formatINRShort } from "@/lib/format";

const CUSTOMER_QUICK_PROMPTS = [
  "What is my biggest wealth blindspot?",
  "Should I repay my loan or invest?",
  "Am I on track for retirement?",
  "Review my protection and nominee gaps"
];

export function CoachPopover() {
  const {
    messages,
    sendMessage,
    clearChat,
    coachOpen,
    setCoachOpen,
    activeRmClient,
    setActiveRmClient,
    isTyping,
    isRmSession
  } = useApp();

  const [draft, setDraft] = useState("");
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length]);

  useEffect(() => {
    if (coachOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [coachOpen]);

  const submit = (text = draft) => {
    if (!text.trim() || isTyping) return;
    sendMessage(text, { client: activeRmClient });
    setDraft("");
  };

  const rmQuickPrompts = activeRmClient ? [
    `Advisory strategy for ${activeRmClient.name}`,
    `Portfolio rebalance proposal`,
    `Meeting talking points & agenda`,
    `Analyze HLV protection gap`
  ] : [
    "Overview of high-priority clients",
    "Identify AUM drift across roster",
    "Top upsell & protection opportunities"
  ];

  const quickPrompts = (activeRmClient || isRmSession) ? rmQuickPrompts : CUSTOMER_QUICK_PROMPTS;

  return (
    <>
      {coachOpen && (
        <section className="bg-card fixed right-4 bottom-20 z-50 flex h-[min(620px,calc(100vh-6.5rem))] w-[min(440px,calc(100vw-1.5rem))] flex-col rounded-3xl border border-primary/20 shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          {/* Header */}
          <header className="flex items-center gap-3 border-b bg-[#0c182b] text-white p-4 rounded-t-3xl">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-gold text-white shadow-sm">
              <Bot className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-white">
                  SHERU AI {activeRmClient ? "· RM Copilot" : ""}
                </p>
                <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold text-gold uppercase tracking-wider">
                  {activeRmClient ? "RM Mode" : "Wealth 360"}
                </span>
              </div>
              <p className="text-[11px] text-white/70 truncate">
                {activeRmClient
                  ? `Client: ${activeRmClient.name} (${activeRmClient.tier || "HNI"} · AUM ${formatINRShort(activeRmClient.aum || 0)})`
                  : "Continuous Wealth Advisory Engine"}
              </p>
            </div>

            {activeRmClient && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveRmClient(null)}
                title="Switch back to My Dashboard"
                className="text-white/70 hover:text-white hover:bg-white/10 size-8"
              >
                <RefreshCw className="size-3.5" />
              </Button>
            )}

            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                aria-label="Clear chat"
                className="text-white/70 hover:text-white hover:bg-white/10 size-8"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCoachOpen(false)}
              aria-label="Close SHERU"
              className="text-white/70 hover:text-white hover:bg-white/10 size-8"
            >
              <X className="size-4" />
            </Button>
          </header>

          {/* Active Client Context Banner (if in RM Copilot Mode) */}
          {activeRmClient && (
            <div className="flex items-center justify-between border-b bg-amber-500/10 px-4 py-2 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-1.5">
                <User className="size-3.5 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold">{activeRmClient.name}</span>
                <span className="text-[10px] text-muted-foreground">· Score {activeRmClient.wealthScore || 68}/100</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveRmClient(null)}
                className="text-[10px] font-semibold text-primary underline hover:text-primary/80"
              >
                Clear Client
              </button>
            </div>
          )}

          {/* Conversation stream */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="py-8 text-center space-y-2.5">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Bot className="size-6" />
                </span>
                <p className="text-sm font-bold text-foreground">
                  {activeRmClient ? `SHERU RM Copilot: ${activeRmClient.name}` : "Hi, I'm SHERU."}
                </p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  {activeRmClient
                    ? `I have synthesized the complete 360° dossier for client ${activeRmClient.name} (AUM: ${formatINRShort(activeRmClient.aum || 0)}). Ask me for advisory proposals, meeting agendas, or rebalancing strategies.`
                    : "I am guardrailed strictly to your Wealth 360 dashboard. Ask me about your Wealth Health score, portfolio allocation, liabilities, protection gaps, or retirement timeline."}
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatBubble key={message.id} message={message} onFollowUp={submit} />
              ))
            )}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <Bot className="size-3.5 text-primary animate-pulse" />
                <span className="animate-pulse">SHERU is analyzing complete dashboard context…</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5 border-t bg-muted/30 p-2.5">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => submit(prompt)}
                className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <form
            className="flex gap-2 border-t p-3 bg-card rounded-b-3xl"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <Input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={
                activeRmClient
                  ? `Ask SHERU Copilot about ${activeRmClient.name}...`
                  : "Ask SHERU about your dashboard..."
              }
              aria-label="Ask SHERU"
              className="text-xs"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!draft.trim() || isTyping}
              className="bg-primary text-primary-foreground size-9 shrink-0"
              aria-label="Send"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </section>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setCoachOpen(true)}
        className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0c182b] to-primary px-4 py-3 text-sm font-bold text-white shadow-xl ring-2 ring-white/20 transition-all hover:scale-105 active:scale-95"
      >
        <Bot className="size-4 text-gold animate-pulse" />
        <span>{activeRmClient || isRmSession ? "SHERU Copilot" : "Ask SHERU"}</span>
      </button>
    </>
  );
}