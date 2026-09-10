
import { Bot, Headset, Send, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/wealth/app-shell";
import { ChatBubble } from "@/components/wealth/chat-bubble";

import { useApp } from "@/context/app-context";


export default function CoachPage() {
  const { messages, sendMessage, clearChat, score, setRmOpen, canAccessRM } = useApp();
  const [draft, setDraft] = useState("");
  const endRef = useRef(null);

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

  const submit = (text = draft) => {
    if (!text.trim()) return;
    sendMessage(text);
    setDraft("");
  };

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
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                AI Wealth Model
              </span>
            </div>
            <h1 className="font-display mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              SHERU · AI Wealth Guide
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Continuous advisory analyzing Income, Expenses, Debt, Protection, Tax & Goals.
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
                I continuously analyze your complete financial universe. Ask me about retirement shortfalls, loan prepayment vs investing, family protection gaps, or tax strategies.
              </p>
            </div> :

          messages.map((m) =>
          <ChatBubble key={m.id} message={m} onFollowUp={submit} />
          )
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

        {/* Sticky Input Bar */}
        <form
          className="sticky bottom-20 flex gap-2 rounded-2xl border bg-card p-2 shadow-lg lg:bottom-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}>
          
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask SHERU about your retirement, loans, tax, or protection..."
            aria-label="Message SHERU"
            className="border-0 bg-transparent focus-visible:ring-0 text-sm" />
          
          <Button type="submit" size="icon" className="bg-primary text-primary-foreground shrink-0" aria-label="Send">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </AppShell>);

}