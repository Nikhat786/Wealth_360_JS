


export function EmptyState({
  icon: Icon,
  title,
  description,
  action





}) {
  return (
    <div className="surface-card flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span className="bg-secondary text-secondary-foreground flex size-12 items-center justify-center rounded-2xl">
        <Icon className="size-6" />
      </span>
      <div className="space-y-1">
        <p className="font-display text-base font-semibold">{title}</p>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">{description}</p>
      </div>
      {action}
    </div>);

}