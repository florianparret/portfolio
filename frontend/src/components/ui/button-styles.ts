export type ButtonVariant = "primary" | "secondary" | "ghost";

export const buttonBaseStyles =
  "inline-flex items-center justify-center gap-2 rounded px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50";

export const buttonVariantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-foreground hover:bg-accent/90",
  secondary: "border-2 border-border text-foreground hover:border-accent",
  ghost: "text-muted hover:text-accent",
};

export function buttonClassName(variant: ButtonVariant = "primary", className = ""): string {
  return `${buttonBaseStyles} ${buttonVariantStyles[variant]} ${className}`.trim();
}
