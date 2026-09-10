import { Check } from "lucide-react";


import { cn } from "@/lib/utils";
import coachMark from "@/assets/coach-mark.png";

export function ChatBubble({
  message,
  onFollowUp



}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm">
          {message.text}
        </div>
      </div>);

  }

  return (
    <div className="flex gap-3">
      <img
        src={coachMark}
        alt=""
        className="bg-secondary size-8 shrink-0 rounded-full object-cover" />
      
      <div className="min-w-0 flex-1 space-y-3">
        <p className="text-sm leading-relaxed">{message.text}</p>
        {message.bullets &&
        <ul className="space-y-2">
            {message.bullets.map((b) =>
          <li key={b} className="flex gap-2 text-sm leading-relaxed">
                <Check className="text-success mt-0.5 size-4 shrink-0" />
                <span>{b}</span>
              </li>
          )}
          </ul>
        }
        {message.followUps && message.followUps.length > 0 &&
        <div className="flex flex-wrap gap-2 pt-1">
            {message.followUps.map((f) =>
          <button
            key={f}
            type="button"
            onClick={() => onFollowUp(f)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              "hover:bg-muted/60"
            )}>
            
                {f}
              </button>
          )}
          </div>
        }
      </div>
    </div>);

}