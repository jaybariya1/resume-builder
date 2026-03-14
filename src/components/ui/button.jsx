import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // ── Base ──────────────────────────────────────────────────────────────────
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-semibold tracking-[-0.01em] text-sm",
    "rounded-[var(--radius)]",
    "transition-all duration-150 ease-out",
    "select-none cursor-pointer",
    "outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    "active:scale-[0.97]",
  ].join(" "),
  {
    variants: {
      variant: {

        // ── Primary — orange gradient, warm glow on hover ──────────────────
        default: [
          "bg-gradient-to-b from-orange-400 to-orange-500",
          "text-white",
          "shadow-[0_1px_0_0_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.18)]",
          "hover:from-orange-400 hover:to-orange-600",
          "hover:shadow-[0_4px_14px_rgba(249,115,22,0.45)]",
          "hover:-translate-y-px",
          "active:translate-y-0 active:shadow-none",
          "active:from-orange-600 active:to-orange-600",
        ].join(" "),

        // ── Secondary — warm cream, subtle depth ───────────────────────────
        secondary: [
          "bg-gradient-to-b from-[#fff7ed] to-[#ffedd5]",
          "text-orange-700",
          "border border-orange-200",
          "shadow-[0_1px_0_0_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.9)]",
          "hover:from-white hover:to-[#fff7ed]",
          "hover:border-orange-300",
          "hover:text-orange-800",
          "hover:-translate-y-px",
          "hover:shadow-[0_3px_10px_rgba(249,115,22,0.18)]",
          "active:translate-y-0 active:from-[#ffedd5] active:to-[#fed7aa]",
        ].join(" "),

        // ── Outline — clean border, fills on hover ─────────────────────────
        outline: [
          "bg-transparent",
          "text-foreground",
          "border border-border",
          "shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
          "hover:bg-secondary hover:text-orange-700 hover:border-orange-300",
          "hover:shadow-[0_2px_8px_rgba(249,115,22,0.12)]",
          "hover:-translate-y-px",
          "active:translate-y-0 active:bg-accent active:border-orange-400",
        ].join(" "),

        // ── Ghost — invisible until hover ──────────────────────────────────
        ghost: [
          "bg-transparent text-muted-foreground",
          "border border-transparent",
          "hover:bg-secondary hover:text-orange-700 hover:border-transparent",
          "active:bg-accent",
        ].join(" "),

        // ── Destructive — confident red ────────────────────────────────────
        destructive: [
          "bg-gradient-to-b from-red-500 to-red-600",
          "text-white",
          "shadow-[0_1px_0_0_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.15)]",
          "hover:from-red-500 hover:to-red-700",
          "hover:shadow-[0_4px_14px_rgba(239,68,68,0.4)]",
          "hover:-translate-y-px",
          "active:translate-y-0 active:shadow-none",
          "focus-visible:ring-red-500",
        ].join(" "),

        // ── Link — text-only, underline on hover ───────────────────────────
        link: [
          "bg-transparent text-primary",
          "underline-offset-4 hover:underline",
          "h-auto p-0",
          "shadow-none active:scale-100",
        ].join(" "),

        // ── AI — special sparkle variant for generate buttons ──────────────
        ai: [
          "relative overflow-hidden",
          "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600",
          "text-white",
          "shadow-[0_2px_12px_rgba(249,115,22,0.45),inset_0_1px_0_rgba(255,255,255,0.2)]",
          "hover:shadow-[0_4px_20px_rgba(249,115,22,0.6)]",
          "hover:-translate-y-px",
          "active:translate-y-0",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/15 before:to-white/0",
          "before:translate-x-[-100%] before:hover:translate-x-[100%] before:transition-transform before:duration-500",
        ].join(" "),

        // ── Warm — muted amber, softer than primary ────────────────────────
        warm: [
          "bg-amber-100 text-amber-800",
          "border border-amber-200",
          "shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
          "hover:bg-amber-200 hover:border-amber-300 hover:text-amber-900",
          "hover:-translate-y-px",
          "active:translate-y-0 active:bg-amber-200",
        ].join(" "),
      },

      size: {
        xs:      "h-7  px-2.5 text-xs   rounded-md gap-1",
        sm:      "h-8  px-3   text-xs   rounded-[calc(var(--radius)-2px)] gap-1.5",
        default: "h-9  px-4   text-sm   gap-2",
        lg:      "h-11 px-6   text-base gap-2 rounded-[calc(var(--radius)+2px)]",
        xl:      "h-12 px-8   text-base gap-2.5 rounded-[calc(var(--radius)+4px)] tracking-[-0.02em]",
        icon:    "size-9 rounded-[var(--radius)]",
        "icon-sm": "size-8 rounded-[calc(var(--radius)-2px)]",
        "icon-lg": "size-11 rounded-[calc(var(--radius)+2px)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
