

import { cn } from "@/lib/utils";









export function SectionHeader({
  title,
  description,
  action,
  className,
  as: Tag = "h2"
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
      <div className="space-y-1">
        <Tag
          className={cn(
            "font-semibold",
            Tag === "h1" ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
          )}>
          
          {title}
        </Tag>
        {description &&
        <p className="text-muted-foreground max-w-2xl text-sm">{description}</p>
        }
      </div>
      {action}
    </div>);

}