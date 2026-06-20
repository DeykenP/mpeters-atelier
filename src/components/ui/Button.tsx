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
          "inline-flex items-center justify-center whitespace-nowrap text-[10px] font-medium transition-all duration-500 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 uppercase tracking-[0.25em]",
          {
            "bg-stone-950 text-white hover:bg-stone-800": variant === "primary",
            "border border-stone-300 text-stone-900 hover:border-stone-950": variant === "outline",
            "text-stone-500 hover:text-stone-900": variant === "ghost",
            "h-14 px-10 py-4": size === "default",
            "h-10 px-6": size === "sm",
            "h-16 px-12 text-[11px]": size === "lg",
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
