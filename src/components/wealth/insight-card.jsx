


import { cn } from "@/lib/utils";












const toneMap = {
  gold: "bg-gold-soft text-gold-foreground",
  success: "bg-success-soft text-success",
  destructive: "bg-destructive-soft text-destructive",
  primary: "bg-secondary text-secondary-foreground"
};

export function InsightCard({
  title,
  headline,
  detail,
  icon: Icon,
  tone = "primary",
  children,
  footer,
  className
}) {
  return (
    <div className={cn("surface-card flex flex-col p-5", className)}>
      <div className="flex items-start gap-3">
        <span
          className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", toneMap[tone])}>
          
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {title}
          </p>
          <p className="font-display mt-1 text-lg font-semibold">{headline}</p>
        </div>
      </div>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{detail}</p>
      {children && <div className="mt-4">{children}</div>}
      {footer && <div className="mt-4 pt-1">{footer}</div>}
    </div>);

}