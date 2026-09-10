
import { scoreTone } from "@/lib/score";
import { cn } from "@/lib/utils";

const toneClass = {
  success: "bg-success",
  gold: "bg-gold",
  destructive: "bg-destructive"
};

const toneText = {
  success: "text-success",
  gold: "text-gold-foreground",
  destructive: "text-destructive"
};

export function PillarBar({ pillar, showSummary = true }) {
  const tone = scoreTone(pillar.score);
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium">{pillar.label}</p>
        <p className={cn("num text-sm font-semibold", toneText[tone])}>{pillar.score}</p>
      </div>
      <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full transition-all duration-500", toneClass[tone])}
          style={{ width: `${pillar.score}%` }} />
        
      </div>
      {showSummary &&
      <p className="text-muted-foreground text-xs leading-relaxed">{pillar.summary}</p>
      }
    </div>);

}