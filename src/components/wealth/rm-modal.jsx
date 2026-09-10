import {
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Lock,
  Mail,
  MapPin,
  Phone,
  Star,
  Video } from
"lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle } from
"@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/app-context";
import { rm, rmSlots, rmTopics } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const modes = [
{ id: "call", label: "Phone call", icon: Phone },
{ id: "video", label: "Video call", icon: Video },
{ id: "branch", label: "Branch visit", icon: MapPin }];


export function RMModal() {
  const {
    rmOpen,
    setRmOpen,
    booking,
    setBooking,
    sheruIntelligence,
    score,
    canAccessRM,
    rmType,
    subscriptionTier,
    triggerUpgradeModal
  } = useApp();

  // Prioritize Sheru detected topics
  const combinedTopics = Array.from(
    new Set([...(sheruIntelligence?.rmTopics || []), ...rmTopics])
  );

  const [slot, setSlot] = useState(rmSlots[2]);
  const [topic, setTopic] = useState(
    sheruIntelligence?.rmTopics?.[0] || rmTopics[0]
  );
  const [mode, setMode] = useState("call");
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const close = () => {
    setRmOpen(false);
    setTimeout(() => setConfirmed(false), 200);
  };

  const confirm = () => {
    setBooking({ slot, topic, mode, note });
    setConfirmed(true);
  };

  const tierDeskInfo = {
    Basic: {
      desk: "Autonomous AI Desk",
      badge: "Sheru AI Guide",
      rmTitle: "AI Wealth Intelligence"
    },
    Premium: {
      desk: "Shared Wealth Advisory Desk",
      badge: "Shared RM Access",
      rmTitle: "Senior Wealth Specialist"
    },
    Elite: {
      desk: "Priority Private Wealth Desk",
      badge: "Dedicated RM",
      rmTitle: "Vice President - HNI Advisory"
    },
    Enterprise: {
      desk: "Multi-Family Office & Private Desk",
      badge: "Family Office Desk",
      rmTitle: "Managing Director - Family Office"
    }
  }[subscriptionTier || "Premium"];

  return (
    <Dialog open={rmOpen} onOpenChange={(o) => o ? setRmOpen(true) : close()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        {!canAccessRM ?
        <div className="py-6 px-2 text-center space-y-4">
            <span className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl">
              <Lock className="size-7" />
            </span>
            <DialogHeader>
              <DialogTitle className="text-center font-display text-xl">
                Unlock Relationship Manager
              </DialogTitle>
              <DialogDescription className="text-center text-xs max-w-sm mx-auto leading-relaxed">
                Human Relationship Manager sessions are reserved for Premium, Elite, and Enterprise members. Basic tier includes autonomous guidance via Sheru AI.
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-left text-xs space-y-2">
              <p className="font-semibold text-foreground">Unlocked with Premium (₹499/mo):</p>
              <p className="text-muted-foreground">• Quarterly portfolio consultations with a certified wealth specialist</p>
              <p className="text-muted-foreground">• Automated Account Aggregator portfolio import</p>
              <p className="text-muted-foreground">• Comprehensive Section 80C & 80D tax optimization</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
              className="flex-1 bg-primary text-primary-foreground font-semibold shadow-raised"
              onClick={() => {
                close();
                triggerUpgradeModal("Relationship Manager", "Premium");
              }}>
              
                Upgrade to Premium
              </Button>
              <Button variant="outline" className="flex-1 text-xs" onClick={close}>
                Continue with Sheru AI
              </Button>
            </div>
          </div> :
        confirmed ?
        <div className="py-4 text-center">
            <span className="bg-success-soft text-success mx-auto flex size-14 items-center justify-center rounded-2xl">
              <CheckCircle2 className="size-7" />
            </span>
            <DialogHeader className="mt-4">
              <DialogTitle className="text-center">Your meeting is booked</DialogTitle>
              <DialogDescription className="text-center">
                {rm.name} ({tierDeskInfo.desk}) will{" "}
                {mode === "branch" ? "meet you at the branch" : "reach out"} on {slot}.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-muted/60 mt-4 space-y-2 rounded-xl p-4 text-left text-sm">
              <Row label="Desk" value={tierDeskInfo.desk} />
              <Row label="Topic" value={topic} />
              <Row label="Mode" value={modes.find((m) => m.id === mode).label} />
              <Row label="When" value={slot} />
              {note && <Row label="Your note" value={note} />}
              <div className="mt-2 pt-2 border-t text-xs text-primary font-medium flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" /> Sheru AI briefing and net-worth metrics attached for your advisor.
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmed(false)}>
                Change details
              </Button>
              <Button className="flex-1" onClick={close}>
                Done
              </Button>
            </div>
          </div> :

        <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>Talk to your Relationship Manager</DialogTitle>
              </div>
              <DialogDescription className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {tierDeskInfo.badge}
                </span>
                <span>• {tierDeskInfo.desk}</span>
              </DialogDescription>
            </DialogHeader>

            {/* RM Profile Card with Tier Distinction */}
            <div className="gradient-navy text-navy-foreground shadow-raised flex items-start gap-3 rounded-xl p-4">
              <span className="bg-gold text-gold-foreground font-display flex size-12 shrink-0 items-center justify-center rounded-full text-base font-semibold">
                {rm.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1.5 font-semibold">
                    {rm.name}
                    <BadgeCheck className="text-gold size-4" />
                  </p>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-medium text-gold">
                    {tierDeskInfo.badge}
                  </span>
                </div>
                <p className="text-xs opacity-80">{tierDeskInfo.rmTitle}</p>
                <p className="mt-0.5 text-xs opacity-75">{rm.branch}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs opacity-85">
                  <span className="num flex items-center gap-1">
                    <Star className="text-gold size-3.5" /> {rm.rating}
                  </span>
                  <span>{rm.experience} experience</span>
                  <span>{rm.languages.join(" · ")}</span>
                </div>
              </div>
            </div>

            {/* Sheru AI Briefing Attached Banner */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs">
              <div className="flex items-center justify-between font-semibold text-foreground">
                <span className="flex items-center gap-1.5 text-primary">
                  <BadgeCheck className="size-4" /> Sheru AI Briefing Attached
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">Score: {score}/100</span>
              </div>
              <p className="mt-1 text-muted-foreground text-[11px] leading-relaxed">
                {sheruIntelligence?.detectedIssues?.length ?
              `Your RM will be briefed on: ${sheruIntelligence.detectedIssues.slice(0, 2).join(" and ")}.` :
              "Your portfolio health, risk score, and asset allocation summary will be pre-loaded."}
              </p>
            </div>

            <Field label="What would you like to discuss?">
              <div className="flex flex-wrap gap-2">
                {combinedTopics.map((t) => {
                const isRecommended = sheruIntelligence?.rmTopics?.includes(t);
                return (
                  <Chip key={t} active={t === topic} onClick={() => setTopic(t)}>
                      {t}
                      {isRecommended &&
                    <span className="ml-1 rounded-full bg-primary/20 px-1.5 py-0.2 text-[9px] text-primary">
                          AI Pick
                        </span>
                    }
                    </Chip>);

              })}
              </div>
            </Field>

            <Field label="How should you meet?">
              <div className="grid grid-cols-3 gap-2">
                {modes.map((m) =>
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-colors",
                  mode === m.id ?
                  "border-primary bg-secondary text-secondary-foreground" :
                  "hover:bg-muted/60"
                )}>
                
                    <m.icon className="size-4" />
                    {m.label}
                  </button>
              )}
              </div>
            </Field>

            <Field label="Pick a slot">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {rmSlots.map((s) =>
              <button
                key={s}
                type="button"
                onClick={() => setSlot(s)}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                  slot === s ?
                  "border-primary bg-secondary text-secondary-foreground" :
                  "hover:bg-muted/60"
                )}>
                
                    <Clock className="size-3.5" />
                    {s}
                  </button>
              )}
              </div>
            </Field>

            <Field label="Anything to add? (optional)">
              <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. I want to review Aarav's education plan before the fee hike."
              rows={3} />
            
            </Field>

            <div className="text-muted-foreground flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <Phone className="size-3.5" /> {rm.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="size-3.5" /> {rm.email}
              </span>
            </div>

            <Button className="w-full" onClick={confirm}>
              <CalendarCheck className="size-4" />
              Confirm {slot}
            </Button>
            {booking &&
          <p className="text-muted-foreground text-center text-xs">
                You already have a meeting on {booking.slot}. Confirming will replace it.
              </p>
          }
          </>
        }
      </DialogContent>
    </Dialog>);

}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {children}
    </div>);

}

function Chip({
  active,
  onClick,
  children




}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active ?
        "border-primary bg-secondary text-secondary-foreground" :
        "hover:bg-muted/60"
      )}>
      
      {children}
    </button>);

}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>);

}