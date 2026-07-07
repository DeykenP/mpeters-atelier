import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-[10px] font-medium transition-all duration-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-[0.3em]",
          {
            "bg-stone-950 text-ivory hover:bg-stone-800": variant === "primary",
            "border border-stone-300 text-stone-900 hover:border-stone-950": variant === "outline",
            "text-stone-500 hover:text-stone-900": variant === "ghost",
            "h-13 px-10": size === "default",
            "h-10 px-6": size === "sm",
            "h-14 px-12": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

/**
 * Understated text link used for luxury CTAs — a hairline underline that
 * thickens on hover. Preferred over boxed buttons for secondary actions.
 */
function TextLink({
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "inline-block text-[11px] uppercase tracking-[0.3em] pb-1.5 border-b border-current/30 hover:border-current transition-colors duration-500",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}

export { Button, TextLink }
