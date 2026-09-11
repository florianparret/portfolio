import type { HTMLAttributes } from "react";

export function Badge({
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent ${className}`.trim()}
      {...props}
    />
  );
}
