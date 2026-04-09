import { cn } from "@/lib/utils";

interface SectionListProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionList({ children, className }: SectionListProps) {
  return (
    <div className={cn("divide-y divide-[var(--color-border)]", className)}>
      {children}
    </div>
  );
}

export function SectionListItem({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "py-3 first:pt-0 last:pb-0",
        onClick && "cursor-pointer hover:bg-[var(--color-surface-sunken)] -mx-2 px-2 rounded",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
