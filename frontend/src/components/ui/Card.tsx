import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function Card({ interactive = false, className = "", ...props }: CardProps) {
  const interactiveStyles = interactive
    ? "transition-all hover:-translate-y-0.5 hover:border-accent/60"
    : "";

  return (
    <div
      className={`rounded border-2 border-border bg-foreground/[0.02] p-6 ${interactiveStyles} ${className}`.trim()}
      {...props}
    />
  );
}
