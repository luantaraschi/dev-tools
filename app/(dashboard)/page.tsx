import { BubbleText } from "@/components/ui/bubble-text"
import { ToolsSearch } from "@/components/tools/tools-search"
import { tools } from "@/lib/tools"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="h-1 w-10 rounded-full bg-primary" />
          <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Portfolio
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Welcome to{" "}
          <BubbleText
            text="Dev Tools"
            className="gradient-text-clean align-baseline"
            charClassName="leading-[1.1]"
            activeClassName="font-black text-transparent"
            neighborClassName="font-semibold text-transparent"
            secondNeighborClassName="font-medium text-transparent"
          />
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          A curated collection of{" "}
          <span className="font-semibold text-foreground">
            {tools.length} practical developer utilities
          </span>{" "}
          built by <span className="font-semibold text-foreground">Luan Taraschi</span> with Next.js, React, and Tailwind CSS. Click any card below to open the tool.
        </p>
      </div>

      <div className="flex flex-wrap gap-6 rounded-xl border border-border bg-muted/30 px-6 py-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
          <span className="font-medium text-foreground">{tools.length} tools available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[hsl(var(--info))]" />
          <span className="text-muted-foreground">Next.js 15 App Router</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[hsl(var(--warning))]" />
          <span className="text-muted-foreground">Tailwind CSS + Shadcn UI</span>
        </div>
      </div>

      <ToolsSearch />
    </div>
  )
}
