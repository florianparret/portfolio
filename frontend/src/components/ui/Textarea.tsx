import { forwardRef, type TextareaHTMLAttributes } from "react";

const styles =
  "rounded border-2 border-border bg-transparent px-3 py-2 text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = "", ...props }, ref) {
  return <textarea ref={ref} className={`${styles} ${className}`.trim()} {...props} />;
});
