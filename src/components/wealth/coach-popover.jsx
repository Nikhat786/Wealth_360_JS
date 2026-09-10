import { Bot, Send, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatBubble } from "@/components/wealth/chat-bubble";
import { useApp } from "@/context/app-context";

const QUICK_PROMPTS = [
"Am I on track for retirement?",
"Should I repay my loan or invest?",
"How much insurance do I need?",
"What is my FIRE timeline?"];


export function CoachPopover() {
  const { messages, sendMessage, clearChat } = useApp();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length]);

  const submit = (text = draft) => {
    if (!text.trim()) return;
    sendMessage(text);
    setDraft("");
  };

  return (
    <>
      {open &&
      <section className="bg-card fixed right-4 bottom-20 z-50 flex h-[min(580px,calc(100vh-7rem))] w-[min(410px,calc(100vw-2rem))] flex-col rounded-3xl border border-primary/20 shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          {/* Header */}
          <header className="flex items-center gap-3 border-b bg-[#0c182b] text-white p-4 rounded-t-3xl">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-gold text-white shadow-sm">
              <Bot className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-white">SHERU AI</p>
                <span className="rounded-full bg-white/15 px-1.5 py-0.2 text-[9px] font-semibold text-gold uppercase">
                  WealthVerse AI
                </span>
              </div>
              <p className="text-[11px] text-white/70 truncate">
                Continuous Wealth Advisory Engine
              </p>
            </div>
            {messages.length > 0 &&
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            aria-label="Clear chat"
            className="text-white/70 hover:text-white hover:bg-white/10 size-8">
            
                <Trash2 className="size-4" />
              </Button>
          }
            <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            aria-label="Close SHERU"
            className="text-white/70 hover:text-white hover:bg-white/10 size-8">
            
              <X className="size-4" />
            </Button>
          </header>

          {/* Conversation stream */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 ?
          <div className="py-8 text-center space-y-2">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Bot className="size-6" />
                </span>
                <p className="text-sm font-bold text-foreground">
                  Hi, I&apos;m SHERU.
                </p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  I continuously analyze your income, liabilities, protection, and retirement goals. Ask me what to do next.
                </p>
              </div> :

          messages.map((message) =>
          <ChatBubble key={message.id} message={message} onFollowUp={submit} />
          )
          }
            <div ref={endRef} />
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5 border-t bg-muted/30 p-2.5">
            {QUICK_PROMPTS.map((prompt) =>
          <button
            key={prompt}
            type="button"
            onClick={() => submit(prompt)}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors">
            
                {prompt}
              </button>
          )}
          </div>

          {/* Input bar */}
          <form
          className="flex gap-2 border-t p-3 bg-card rounded-b-3xl"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}>
          
            <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask SHERU anything..."
            aria-label="Ask SHERU"
            className="text-xs" />
          
            <Button type="submit" size="icon" className="bg-primary text-primary-foreground size-9 shrink-0" aria-label="Send">
              <Send className="size-4" />
            </Button>
          </form>
        </section>
      }

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0c182b] to-primary px-4 py-3 text-sm font-bold text-white shadow-xl ring-2 ring-white/20 transition-all hover:scale-105 active:scale-95">
        
        <Bot className="size-4 text-gold animate-pulse" />
        <span>Ask SHERU</span>
      </button>
    </>);

}