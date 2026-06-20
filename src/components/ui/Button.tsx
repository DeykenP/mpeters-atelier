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
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-widest",
          {
            "bg-gold-500 text-stone-950 hover:bg-gold-600": variant === "primary",
            "border border-white/30 text-white hover:bg-white/10 hover:border-white": variant === "outline",
            "text-stone-300 hover:text-white": variant === "ghost",
            "h-12 px-8 py-2": size === "default",
            "h-9 px-4": size === "sm",
            "h-14 px-10 text-base": size === "lg",
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

export { Button }
