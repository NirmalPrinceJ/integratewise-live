import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // IntegrateWise custom variants
        amber: "border-transparent bg-iw-amber/15 text-iw-amber",
        cyan: "border-transparent bg-iw-cyan/15 text-iw-cyan",
        green: "border-transparent bg-iw-green/15 text-iw-green",
        purple: "border-transparent bg-iw-purple/15 text-iw-purple",
        blue: "border-transparent bg-iw-blue/15 text-iw-blue",
        // Status variants
        critical: "border-transparent bg-red-500/15 text-red-400",
        medium: "border-transparent bg-yellow-500/15 text-yellow-400",
        low: "border-transparent bg-blue-500/15 text-blue-400",
        info: "border-transparent bg-gray-500/15 text-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
