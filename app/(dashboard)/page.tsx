import {
  Braces,
  Clock,
  FileText,
  ImageIcon,
  Key,
  Minimize2,
  Palette,
  Pipette,
  QrCode,
  Scissors,
  Wrench,
} from "lucide-react"
import { type ReactNode } from "react"
import { ToolCard } from "@/components/tool-card"
import { tools } from "@/lib/tools"

const toolIcons: Record<string, ReactNode> = {
  "time-converter": <Clock />,
  "password-generator": <Key />,
  "color-harmony": <Palette />,
  "color-palette-extractor": <Pipette />,
  "qr-generator": <QrCode />,
  "image-converter": <ImageIcon />,
  "bg-remover": <Scissors />,
  "image-compressor": <Minimize2 />,
  "text-to-pdf": <FileText />,
  "json-formatter": <Braces />,
}

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
          <span className="bg-linear-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Dev Tools
          </span>
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          A curated collection of{" "}
          <span className="font-semibold text-foreground">
            10 practical developer utilities
          </span>{" "}
          built by <span className="font-semibold text-foreground">Luan Taraschi</span> with Next.js, React, and Tailwind CSS. Click any card below to open the tool.
        </p>
      </div>

      <div className="flex flex-wrap gap-6 rounded-xl border border-border bg-muted/30 px-6 py-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-foreground">10 tools available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">Next.js 15 App Router</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-violet-500" />
          <span className="text-muted-foreground">Tailwind CSS + Shadcn UI</span>
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
          All Tools
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard
              key={tool.href}
              href={tool.href}
              title={tool.title}
              description={tool.description}
              icon={toolIcons[tool.slug] ?? <Wrench />}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
