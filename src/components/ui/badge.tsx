import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "custom";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border",
        variant === "default" && "bg-stone-100 text-stone-700 border-stone-200",
        variant === "outline" && "bg-transparent text-stone-600 border-stone-300",
        variant === "custom" && "",
        className
      )}
    >
      {children}
    </span>
  );
}
