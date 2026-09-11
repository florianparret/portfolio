import { forwardRef, type InputHTMLAttributes } from "react";

const styles =
  "rounded border-2 border-border bg-transparent px-3 py-2 text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return <input ref={ref} className={`${styles} ${className}`.trim()} {...props} />;
  },
);
