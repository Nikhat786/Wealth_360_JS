
import { ArrowRight, Check, Lock, MessageSquareText, Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { PillarNav } from "@/components/wealth/pillar-nav";
import { RecommendationGuardrails } from "@/components/wealth/recommendation-guardrails";
import { SectionHeader } from "@/components/wealth/section-header";

import { useApp } from "@/context/app-context";

import { formatINRShort } from "@/lib/format";
import { nominationAccounts } from "@/lib/wealth-extra";


export default function TransferPage() {
  const {
    answers,
    nominations,
    nominations_summary,
    setNominee,
    transferReadiness,
    docs,
    lifeCover,
    healthCover,
    canAccessEstatePlanning,
    canAccessAdvancedVault,
    triggerUpgradeModal,
    canAccessRM,
    discussWithSheru
  } = useApp();
  const [nominationOpen, setNominationOpen] = useState(false);
  const [willOpen, setWillOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(
    nominations_summary?.missing?.[0]?.id ?? nominationAccounts[0]?.id ?? "n1"
  );
  const [nominee, setNomineeDraft] = useState({
    name: answers?.familyMembers?.[0]?.name ?? "",
    relation: "Spouse",
    share: 100
  });
  const completedDocs = Object.values(docs || {}).filter(Boolean).length;
  const familyReadiness = Math.round(
    (transferReadiness + ((answers?.familyMembers?.length ?? 0) > 0 ? 20 : 0)) / 1.2
  );
  const nextAction =
  (nominations_summary?.missing?.length ?? 0) > 0 ?
  "Complete your missing nominations" :
  answers?.hasWill ?
  "Review your continuity plan" :
  "Start Will planning";
  const assets =
  (answers?.assets?.length ?? 0) > 0 ?
  answers?.assets ?? [] :
  nominationAccounts.map((account) => ({ id: account.id, name: account.name, currentValue: account.value }));

  const handleOpenWill = () => {
    if (!canAccessEstatePlanning) {
      triggerUpgradeModal("Digital Will & Succession Planning", "Elite");
      return;
    }
    setWillOpen(true);
  };

  const handleOpenVault = () => {
    if (!canAccessAdvancedVault) {
      triggerUpgradeModal("Family Wealth Vault (Advanced)", "Elite");
      return;
    }
    document.getElementById("vault")?.scrollIntoView({ behavior: "smooth" });
  };

  const saveNominee = () => {
    if (!nominee.name.trim()) return;
    setNominee(selectedAccount, nominee);
    setNominationOpen(false);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeader
            as="h1"
            title="Wealth Continuity"
            description="You've worked hard to build your wealth. Make sure the right people can access it, understand it and carry it forward." />
          <Button size="sm" variant="outline" onClick={() => discussWithSheru("Review my unnominated assets, digital will status, and estate transmission readiness.")}>
            <MessageSquareText className="mr-1.5 size-3.5" /> Discuss with SHERU
          </Button>
        </div>
        
        <PillarNav />

        <section className="gradient-navy text-navy-foreground shadow-raised rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-gold text-xs font-semibold tracking-wide uppercase">Your wealth has a future</p>
              <h2 className="font-display mt-2 text-3xl font-semibold">Is your family ready for it?</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-80">
                Your wealth is growing. Now make sure it can move smoothly to the people who matter.
              </p>
            </div>
            <div className="flex items-center gap-5">
              <div>
                <p className="text-gold text-xs font-semibold uppercase">Wealth Continuity</p>
                <p className="font-display mt-1 text-5xl font-semibold">
                  {transferReadiness}<span className="text-lg font-normal opacity-60"> / 100</span>
                </p>
              </div>
              <Button className="bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => setNominationOpen(true)}>
                Add nominee <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </section>

        <section>
          <SectionHeader
            title="Your continuity snapshot"
            description="A quick view of what is ready and what needs attention." />
          
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Snapshot label="Nomination" value={`${nominations_summary.covered}/${nominations_summary.total}`} status={nominations_summary.missing.length ? "Needs attention" : "Ready"} />
            <Snapshot label="Will" value={answers.hasWill ? "On record" : "Not created"} status={answers.hasWill ? "Ready" : "Needs attention"} />
            <Snapshot label="Beneficiaries" value={`${nominations_summary.covered} reviewed`} status="Indicative" />
            <Snapshot label="Family Vault" value={`${familyReadiness}/100`} status="Supporting readiness" />
            <Snapshot label="Contacts" value="2 added" status="Available" />
          </div>
        </section>

        <section className="surface-card flex flex-wrap items-center gap-4 border-gold/30 p-5">
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">Your next best action</p>
            <p className="mt-1 text-base font-semibold">{nextAction}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {nominations_summary.missing.length ? "Some recorded assets do not have complete nomination information." : "Keep your continuity plan current as your family and wealth change."}
            </p>
          </div>
          <Button onClick={() => nominations_summary.missing.length ? setNominationOpen(true) : handleOpenWill()}>
            Review plan <ArrowRight className="size-4" />
          </Button>
        </section>

        <section>
          <SectionHeader
            title="Protect your wealth beyond you"
            description="Simple actions that help your family understand and carry forward what you've built." />
          
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Action
              title="Add / update nominee"
              detail="Make sure your financial assets have the right nominee."
              label="Add nominee"
              onClick={() => setNominationOpen(true)} />
            
            <Action
              title="Create your Will"
              detail="Organise your wishes before speaking with a legal professional (Elite Plan)."
              label={answers.hasWill ? "Continue planning" : "Start Will planning"}
              locked={!canAccessEstatePlanning}
              onClick={handleOpenWill} />
            
            <Action
              title="Review beneficiaries"
              detail="Check who should receive your wealth and whether details are current."
              label="Review beneficiaries"
              onClick={() => setNominationOpen(true)} />
            
            <Action
              title="Family Wealth Vault"
              detail="Keep important financial information organised for your family."
              label="Open Family Vault"
              locked={!canAccessAdvancedVault}
              onClick={handleOpenVault} />
            
          </div>
        </section>

        {nominationOpen &&
        <NominationFlow
          accounts={nominations_summary.missing.length ? nominations_summary.missing : nominationAccounts}
          selected={selectedAccount}
          setSelected={setSelectedAccount}
          nominee={nominee}
          setNominee={setNomineeDraft}
          onSave={saveNominee}
          onClose={() => setNominationOpen(false)} />

        }
        {willOpen && <WillPlanning answers={answers} onClose={() => setWillOpen(false)} />}

        <section>
          <SectionHeader
            title="Where your wealth goes"
            description="An educational view of how recorded assets connect to nominees. Nomination does not determine legal ownership." />
          
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {assets.slice(0, 8).map((asset) => {
              const account = nominations[asset.id];
              return (
                <div key={asset.id} className="surface-card p-4">
                  <p className="truncate text-sm font-semibold">{asset.name}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{formatINRShort(asset.currentValue)}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className={account ? "bg-success-soft text-success" : "bg-gold-soft text-gold-foreground"}>
                      {account ? "Covered" : "Review"}
                    </span>
                    <ArrowRight className="text-muted-foreground size-3" />
                    <span>{account?.name ?? "Nominee missing"}</span>
                  </div>
                </div>);

            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <section className="surface-card p-5">
            <SectionHeader title="Transfer readiness check" description="Preparedness is built from small, reviewable steps." />
            <div className="mt-4 space-y-3">
              <CheckRow done={(answers?.familyMembers?.length ?? 0) > 0} text="Family information added" />
              <CheckRow done={lifeCover > 0 && healthCover > 0} text="Insurance information available" />
              <CheckRow done={completedDocs > 0} text="Important contacts and documents recorded" />
              <CheckRow done={(nominations_summary?.missing?.length ?? 0) === 0} text={`${nominations_summary?.missing?.length ?? 0} investments need nomination review`} />
              <CheckRow done={!!answers?.hasWill} text="Will information reviewed" />
            </div>
            <RecommendationGuardrails
              data={{
                why: "Some recorded assets do not have complete nomination or succession information.",
                considered: ["Recorded nominations", "Family members", "Will and document checklist"],
                missing: ["Legal arrangements outside Wealth360", "Informal family agreements", "Documents not recorded", "Changes made outside the application"],
                confidence: "Medium",
                freshness: "Based on your current demo information"
              }} />
            
          </section>
          <section className="surface-card p-5">
            <SectionHeader title="If I'm not around" description="Could someone you trust understand what to do with your financial life?" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Prepared title="They should know" items={["Investments", "Insurance", "Property"]} />
              <Prepared title="Who to contact" items={canAccessRM ? ["Relationship Manager", "Insurance contact"] : ["Family Nominee", "Insurance contact"]} />
              <Prepared title="What I've decided" items={[answers.hasWill ? "Will recorded" : "Will needs review", `${nominations_summary.covered} nominees recorded`]} />
              <Prepared title="What they can access" items={["Family Wealth Vault", "Financial summary"]} />
            </div>
          </section>
        </section>

        <section id="vault" className="surface-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">Family Wealth Vault</p>
              <h2 className="font-display mt-1 text-xl font-semibold">Family Readiness {familyReadiness}/100</h2>
              <p className="text-muted-foreground mt-1 text-sm">Organise what your family may need during an important moment.</p>
            </div>
            <Button variant="outline" onClick={handleOpenVault}>
              {!canAccessAdvancedVault && <Lock className="mr-1.5 size-3.5 text-gold" />} Open Family Vault <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <VaultProgress title="Financial" value={`${Math.min(6, answers.assets.length || 5)} / 6 reviewed`} />
            <VaultProgress title="Succession" value={`${nominations_summary.covered} / ${nominations_summary.total} complete`} />
            <VaultProgress title="Emergency" value="3 / 4 complete" />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <section className="surface-card p-5">
            <SectionHeader title="People to contact" description="Keep a clear reference for your family." />
            <div className="mt-4 space-y-3 text-sm">
              {canAccessRM &&
              <div className="flex items-center gap-3">
                  <Phone className="text-primary size-4" /> Relationship Manager <span className="text-muted-foreground ml-auto">Priya Menon</span>
                </div>
              }
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-primary size-4" /> Insurance contact <span className="text-muted-foreground ml-auto">Sample insurer</span>
              </div>
              <Button variant="ghost" size="sm">+ Add important contact</Button>
            </div>
          </section>
          <section className="surface-card p-5">
            <SectionHeader title="Last reviewed" description="Continuity information should not be created once and forgotten." />
            <p className="font-display mt-4 text-2xl font-semibold">Demo mode</p>
            <p className="text-muted-foreground mt-1 text-xs">Review recommended as family, assets and wishes change.</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={handleOpenWill}>Review continuity plan</Button>
          </section>
        </section>
      </div>
    </AppShell>);

}

function Snapshot({ label, value, status }) {return <div className="surface-card p-4"><p className="text-muted-foreground text-[11px] font-semibold uppercase">{label}</p><p className="mt-2 text-base font-semibold">{value}</p><p className="text-muted-foreground mt-1 text-[11px]">{status}</p></div>;}
function Action({
  title,
  detail,
  label,
  locked,
  onClick






}) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{title}</p>
        {locked &&
        <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold">
            <Lock className="size-2.5" /> Elite
          </span>
        }
      </div>
      <p className="text-muted-foreground mt-2 min-h-10 text-xs leading-relaxed">{detail}</p>
      <Button variant="outline" size="sm" className="mt-4" onClick={onClick}>
        {locked && <Lock className="mr-1.5 size-3 text-gold" />}
        {label} <ArrowRight className="size-3.5" />
      </Button>
    </div>);

}
function CheckRow({ done, text }) {return <div className="flex items-center gap-2 text-sm"><span className={done ? "bg-success-soft text-success flex size-6 items-center justify-center rounded-full" : "bg-gold-soft text-gold-foreground flex size-6 items-center justify-center rounded-full"}>{done ? <Check className="size-3.5" /> : "!"}</span>{text}</div>;}
function Prepared({ title, items }) {return <div><p className="text-muted-foreground text-[11px] font-semibold uppercase">{title}</p><ul className="mt-2 space-y-1 text-xs">{items.map((item) => <li key={item} className="flex items-center gap-2"><Check className="text-success size-3.5" />{item}</li>)}</ul></div>;}
function VaultProgress({ title, value }) {return <div className="bg-muted/50 rounded-xl p-3"><p className="text-sm font-semibold">{title}</p><p className="text-muted-foreground mt-1 text-xs">{value}</p></div>;}

function NominationFlow({ accounts, selected, setSelected, nominee, setNominee, onSave, onClose }) {
  return <div className="surface-card border-primary/30 bg-background fixed inset-x-4 top-20 z-50 mx-auto max-w-2xl p-5 shadow-raised sm:inset-x-auto"><div className="flex items-start justify-between gap-4"><div><p className="text-muted-foreground text-xs font-semibold uppercase">Demo nomination workflow · Step 1 of 3</p><h2 className="font-display mt-1 text-xl font-semibold">What would you like to nominate?</h2></div><Button variant="ghost" size="sm" onClick={onClose}>Close</Button></div><div className="mt-4 flex flex-wrap gap-2">{accounts.map((account) => <button key={account.id} type="button" onClick={() => setSelected(account.id)} className={`rounded-full border px-3 py-2 text-xs ${selected === account.id ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-muted"}`}>{account.name}</button>)}</div><div className="mt-5 border-t pt-5"><p className="text-muted-foreground text-xs font-semibold uppercase">Step 2 · Who should be your nominee?</p><div className="mt-3 grid gap-3 sm:grid-cols-3"><input className="border-input bg-background h-9 rounded-md border px-3 text-sm" value={nominee.name} onChange={(event) => setNominee({ ...nominee, name: event.target.value })} placeholder="Name" /><input className="border-input bg-background h-9 rounded-md border px-3 text-sm" value={nominee.relation} onChange={(event) => setNominee({ ...nominee, relation: event.target.value })} placeholder="Relationship" /><input className="border-input bg-background h-9 rounded-md border px-3 text-sm" type="number" value={nominee.share} onChange={(event) => setNominee({ ...nominee, share: Number(event.target.value) || 0 })} placeholder="Allocation %" /></div></div><div className="mt-5 flex items-center justify-between gap-3"><p className="text-muted-foreground text-xs">Step 3 · Review asset → nominee → status</p><Button onClick={onSave}>Confirm nomination information <Check className="size-4" /></Button></div></div>;
}

function WillPlanning({ answers, onClose }) {return <div className="surface-card border-primary/30 bg-background fixed inset-x-4 top-20 z-50 mx-auto max-w-2xl p-5 shadow-raised"><div className="flex items-start justify-between gap-4"><div><p className="text-muted-foreground text-xs font-semibold uppercase">Draft / planning summary</p><h2 className="font-display mt-1 text-xl font-semibold">Create your Will</h2></div><Button variant="ghost" size="sm" onClick={onClose}>Close</Button></div><p className="text-muted-foreground mt-3 text-sm">Organise your family, known assets and wishes before speaking with a legal professional.</p><div className="mt-5 grid gap-3 sm:grid-cols-3"><VaultProgress title="Family" value={`${answers?.familyMembers?.length ?? 0} people recorded`} /><VaultProgress title="Assets" value={`${answers?.assets?.length || 6} references available`} /><VaultProgress title="Wishes" value="Not captured yet" /></div><p className="text-muted-foreground mt-5 text-xs leading-relaxed">This planning experience is not a substitute for a legally executed Will or professional legal advice. It does not create a legally valid document.</p><Button className="mt-4" onClick={onClose}>Save draft summary</Button></div>;}