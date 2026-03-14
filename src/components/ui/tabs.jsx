import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center",
        "rounded-[var(--radius)] p-1",
        "bg-[#fff7ed] border border-[#fde3c8]",
        "text-[#78716c]",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap",
        "rounded-[calc(var(--radius)-2px)]",
        "px-3 py-1 text-sm font-semibold",
        "border border-transparent",
        "transition-all duration-150 outline-none",
        "text-[#78716c]",
        // Active state
        "data-[state=active]:bg-white data-[state=active]:text-[#9a3412]",
        "data-[state=active]:border-[#fde3c8]",
        "data-[state=active]:shadow-[0_1px_3px_rgba(234,88,12,0.12)]",
        // Hover on inactive
        "hover:text-[#44403c] hover:bg-[#ffedd5]",
        // Focus
        "focus-visible:ring-2 focus-visible:ring-[#f97316]/40 focus-visible:outline-none",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-40",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
