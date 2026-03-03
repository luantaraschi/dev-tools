import Link from "next/link"
import { type ReactNode } from "react"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  href: string
  title: string
  description: string
  icon: ReactNode
  className?: string
}

export function ToolCard({
  href,
  title,
  description,
  icon,
  className,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5",
        className
      )}
    >
      {/* Glowing border effect */}
      <GlowingEffect
        spread={40}
        proximity={80}
        inactiveZone={0.01}
        borderWidth={1.5}
      />

      {/* Icon container */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 transition-colors duration-300 group-hover:bg-primary/15">
        <div className="[&>svg]:h-6 [&>svg]:w-6">{icon}</div>
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      {/* Arrow indicator */}
      <div className="mt-auto flex items-center gap-1 text-xs font-medium text-muted-foreground/60 transition-colors duration-300 group-hover:text-primary">
        <span>Open tool</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
