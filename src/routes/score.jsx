
import { RotateCcw } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
"recharts";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AppShell } from "@/components/wealth/app-shell";
import { PillarBar } from "@/components/wealth/pillar-bar";
import { PillarNav } from "@/components/wealth/pillar-nav";
import { ScoreGauge } from "@/components/wealth/score-gauge";
import { SectionHeader } from "@/components/wealth/section-header";
import { useApp } from "@/context/app-context";
import { formatINR } from "@/lib/format";
import { scoreHistory } from "@/lib/mock-data";


export default function ScorePage() {
  const { score, whatIfScore, whatIf, setWhatIf, resetWhatIf, whatIfActive, scoreInputs } =
  useApp();

  const shown = whatIfActive ? whatIfScore : score;

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          as="h1"
          title="Financial Health"
          description="One indicative view of how your financial position is doing today, and what can improve next." />
        

        <PillarNav />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_1fr]">
          <div className="surface-card flex flex-col items-center gap-3 p-6">
            <ScoreGauge
              score={shown.total}
              grade={shown.grade}
              gradeLabel={shown.gradeLabel}
              size={210}
              {...whatIfActive ? { compareTo: score.total } : {}} />
            
            <p className="text-muted-foreground text-center text-xs">
              {whatIfActive ?
              `Simulated — your live score is ${score.total}.` :
              "Up 10 points over the last six months."}
            </p>
          </div>

          <div className="surface-card p-5">
            <SectionHeader title="Score history" description="March to August 2025." />
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis domain={[40, 100]} tickLine={false} axisLine={false} width={32} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      fontSize: 12
                    }} />
                  
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }} />
                  
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div>
          <SectionHeader title="Why is this score?" description="The supporting pillars explain what is shaping your Financial Health." />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {shown.pillars.map((p) =>
            <div key={p.key} className="surface-card p-4">
                <PillarBar pillar={p} />
                <p className="text-muted-foreground mt-3 text-xs">{p.tip}</p>
              </div>
            )}
          </div>
        </div>

        <div className="surface-card p-5">
          <SectionHeader
            title="What-if simulator"
            description="Move a slider to see your score respond live."
            action={
            whatIfActive ?
            <Button variant="outline" size="sm" onClick={resetWhatIf}>
                  <RotateCcw className="mr-1.5 size-3.5" /> Reset
                </Button> :
            undefined
            } />
          
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <SliderRow
              label="Monthly investment"
              value={whatIf.monthlyInvestment ?? scoreInputs.monthlyInvestment}
              min={0}
              max={200000}
              step={2000}
              format={formatINR}
              onChange={(v) => setWhatIf({ monthlyInvestment: v })} />
            
            <SliderRow
              label="Monthly EMI"
              value={whatIf.monthlyEmi ?? scoreInputs.monthlyEmi}
              min={0}
              max={150000}
              step={1000}
              format={formatINR}
              onChange={(v) => setWhatIf({ monthlyEmi: v })} />
            
            <SliderRow
              label="Emergency fund (months of expenses)"
              value={Math.round(whatIf.emergencyMonths ?? scoreInputs.emergencyMonths)}
              min={0}
              max={12}
              step={1}
              format={(v) => `${v} months`}
              onChange={(v) => setWhatIf({ emergencyMonths: v })} />
            
            <SliderRow
              label="Life cover (× annual income)"
              value={Math.round(whatIf.lifeCoverMultiple ?? scoreInputs.lifeCoverMultiple)}
              min={0}
              max={20}
              step={1}
              format={(v) => `${v}x`}
              onChange={(v) => setWhatIf({ lifeCoverMultiple: v })} />
            
          </div>
        </div>
      </div>
    </AppShell>);

}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange








}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="num text-sm font-semibold">{format(value)}</span>
      </div>
      <Slider
        className="mt-3"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0] ?? min)} />
      
    </div>);

}