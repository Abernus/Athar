import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className, onClick, hover }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
        hover && "cursor-pointer transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-raised)]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-6", className)}>
      <h3 className="text-sm font-medium text-[var(--color-ink-secondary)] mb-3 uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}
