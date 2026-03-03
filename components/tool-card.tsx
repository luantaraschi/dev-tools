import { type ReactNode } from "react"
import { HoverDetailCard } from "@/components/ui/hover-detail-card"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  href: string
  title: string
  description: string
  icon: ReactNode
  className?: string
  status?: "Ready" | "WIP"
}

export function ToolCard({
  href,
  title,
  description,
  icon,
  className,
  status = "Ready",
}: ToolCardProps) {
  return (
    <div className={cn("group relative", className)}>
      <div className="relative h-full rounded-xl border-[0.75px] border-border p-1 md:p-1.5">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <HoverDetailCard
          className="relative"
          title={title}
          subtitle={description}
          images={[]}
          primaryButton={{
            text: "Open tool",
            href,
            color: "bg-primary/90 flex-1 text-center",
            hoverColor: "hover:bg-primary",
            textColor: "text-primary-foreground",
          }}
          pills={{
            left: {
              text: "Dev Tool",
              icon: icon,
              color: "bg-primary/15",
              textColor: "text-primary",
            },
            sparkle: {
              show: true,
              color: "bg-muted text-foreground/80",
            },
            right: status === "WIP" ? {
              text: "WIP",
              color: "bg-amber-100/80 dark:bg-amber-500/20",
              textColor: "text-amber-700 dark:text-amber-300 font-semibold",
            } : {
              text: "Ready",
              color: "bg-emerald-100/80 dark:bg-emerald-500/20",
              textColor: "text-emerald-700 dark:text-emerald-300 font-semibold",
            },
          }}
        />
      </div>
    </div>
  )
}
