"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Popover = ({ children }) => {
  return <div className="relative">{children}</div>
}

const PopoverTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button ref={ref} className={cn("inline-flex items-center justify-center", className)} {...props}>
      {children}
    </button>
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
