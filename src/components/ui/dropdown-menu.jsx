import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function DropdownMenu({ ...props }) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }) {
  return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({ ...props }) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({ className, sideOffset = 6, ...props }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden p-1",
          "rounded-[calc(var(--radius)+2px)] border border-[#fde3c8]",
          "bg-white text-foreground",
          "shadow-[0_8px_24px_rgba(234,88,12,0.12),0_2px_8px_rgba(0,0,0,0.08)]",
          "origin-(--radix-dropdown-menu-content-transform-origin)",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({ ...props }) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuItem({ className, inset, variant = "default", ...props }) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2",
        "rounded-[calc(var(--radius)-2px)] px-2 py-1.5",
        "text-sm text-foreground outline-none",
        "transition-colors duration-100",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:text-[#a8a29e]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        "data-[inset]:pl-8",
        // Default hover
        "hover:bg-[#fff7ed] hover:text-[#9a3412] focus:bg-[#fff7ed] focus:text-[#9a3412]",
        // Destructive variant
        "data-[variant=destructive]:text-[#dc2626]",
        "data-[variant=destructive]:hover:bg-red-50 data-[variant=destructive]:focus:bg-red-50",
        "data-[variant=destructive]:hover:text-[#b91c1c] data-[variant=destructive]:focus:text-[#b91c1c]",
        "data-[variant=destructive]:[&_svg]:text-[#dc2626]",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({ className, children, checked, ...props }) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2",
        "rounded-[calc(var(--radius)-2px)] py-1.5 pr-2 pl-8",
        "text-sm text-foreground outline-none",
        "transition-colors duration-100",
        "hover:bg-[#fff7ed] hover:text-[#9a3412] focus:bg-[#fff7ed] focus:text-[#9a3412]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-3.5 text-[#ea580c]" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
}

function DropdownMenuRadioItem({ className, children, ...props }) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2",
        "rounded-[calc(var(--radius)-2px)] py-1.5 pr-2 pl-8",
        "text-sm text-foreground outline-none",
        "transition-colors duration-100",
        "hover:bg-[#fff7ed] hover:text-[#9a3412] focus:bg-[#fff7ed] focus:text-[#9a3412]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-[#ea580c] text-[#ea580c]" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({ className, inset, ...props }) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-xs font-semibold text-[#78716c] uppercase tracking-wide",
        "data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-[#fde3c8] -mx-1 my-1 h-px pointer-events-none", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({ className, ...props }) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ml-auto text-xs tracking-widest text-[#a8a29e]", className)}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default select-none items-center gap-2",
        "rounded-[calc(var(--radius)-2px)] px-2 py-1.5",
        "text-sm text-foreground outline-none",
        "transition-colors duration-100",
        "hover:bg-[#fff7ed] hover:text-[#9a3412] focus:bg-[#fff7ed] focus:text-[#9a3412]",
        "data-[state=open]:bg-[#fff7ed] data-[state=open]:text-[#9a3412]",
        "data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4 text-[#a8a29e]" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({ className, ...props }) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden p-1",
        "rounded-[calc(var(--radius)+2px)] border border-[#fde3c8]",
        "bg-white text-foreground",
        "shadow-[0_8px_24px_rgba(234,88,12,0.12),0_2px_8px_rgba(0,0,0,0.08)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
  DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
}
