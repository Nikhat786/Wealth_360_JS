import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, RotateCcw, Trash2 } from "lucide-react";
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
import { EmptyState } from "@/components/wealth/empty-state";
import { goalIcons } from "@/components/wealth/goal-card";
import { GoalFormDialog } from "@/components/wealth/goal-form-dialog";
import { ProgressRing } from "@/components/wealth/progress-ring";
import { SectionHeader } from "@/components/wealth/section-header";
import { StatTile } from "@/components/wealth/stat-tile";
import { useApp } from "@/context/app-context";
import { formatINR, formatINRShort } from "@/lib/format";
import { CURRENT_YEAR, projectGoal } from "@/lib/goal-math";
import { Target } from "lucide-react";


function GoalNotFound() {
  return (
    <AppShell>
      <EmptyState
        icon={Target}
        title="Goal not found"
        description="This goal no longer exists in your plan."
        action={
        <Button asChild>
            <Link to="/goals">Back to goals</Link>
          </Button>
        } />
      
    </AppShell>);

}

export default function GoalDetail() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const { goals, contributions, setContribution, updateGoal, removeGoal } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const goal = goals.find((g) => g.id === goalId);
  if (!goal) return <GoalNotFound />;

  const monthly = contributions[goal.id] ?? goal.monthlyContribution;
  const p = projectGoal(goal, monthly);
  const Icon = goalIcons[goal.icon] || Target;
  const years = Math.max(1, goal.targetYear - CURRENT_YEAR);

  const series = p.series;

  const handleDelete = () => {
    removeGoal(goal.id);
    void navigate("/goals");
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link to="/goals">
              <ArrowLeft className="mr-1.5 size-4" /> All goals
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil className="mr-1.5 size-3.5" /> Edit
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={handleDelete}>
              <Trash2 className="mr-1.5 size-3.5" /> Delete
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="bg-secondary text-secondary-foreground flex size-12 shrink-0 items-center justify-center rounded-2xl">
            <Icon className="size-6" />
          </span>
          <SectionHeader
            as="h1"
            title={goal.name}
            description={`${goal.priority} priority · target ${goal.targetYear}${goal.note ? ` · ${goal.note}` : ""}`} />

        </div>

        <GoalFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          initialGoal={goal}
          onSubmit={(patch) => updateGoal(goal.id, patch)} />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile tone="navy" label="Target" value={formatINRShort(goal.target)} />
          <StatTile label="Saved" value={formatINRShort(goal.saved)} />
          <StatTile
            label="Projected value"
            value={formatINRShort(Math.round(p.projected))}
            sub={p.onTrack ? "On track" : "Behind schedule"} />
          
          <StatTile
            label="Required monthly"
            value={formatINR(Math.round(p.requiredMonthly))}
            sub={`currently ${formatINR(monthly)}`} />
          
        </div>

        <div className="surface-card flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
          <ProgressRing value={p.fundedPct} size={96} strokeWidth={9} tone={p.onTrack ? "success" : "gold"} />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium">Monthly contribution</span>
              <span className="num text-sm font-semibold">{formatINR(monthly)}</span>
            </div>
            <Slider
              className="mt-3"
              value={[monthly]}
              min={0}
              max={Math.max(100000, goal.monthlyContribution * 3)}
              step={1000}
              onValueChange={(v) => setContribution(goal.id, v[0] ?? 0)} />
            
            <div className="mt-3 flex items-center gap-3">
              <p className="text-muted-foreground text-xs">
                Assumes {goal.expectedReturn}% annual returns over {years} years.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setContribution(goal.id, goal.monthlyContribution)}>
                
                <RotateCcw className="mr-1.5 size-3.5" /> Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="surface-card p-5">
          <SectionHeader title="Projection" description="Projected corpus against target." />
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis
                  tickFormatter={(v) => formatINRShort(v)}
                  tickLine={false}
                  axisLine={false}
                  width={64}
                  fontSize={11} />
                
                <Tooltip
                  formatter={(v) => formatINR(Number(v))}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                    fontSize: 12
                  }} />
                
                <Line
                  type="monotone"
                  dataKey="projected"
                  name="Projected"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  dot={false} />
                
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target"
                  stroke="var(--color-gold)"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false} />
                
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>);

}