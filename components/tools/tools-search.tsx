"use client"

import { useState } from "react"
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
  Dices,
  Percent,
  Search,
  X,
} from "lucide-react"
import { type ReactNode } from "react"
import { ToolCard } from "@/components/tool-card"
import { tools, type ToolCategory } from "@/lib/tools"

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
  "case-converter": <FileText />,
  "uuid-generator": <Key />,
  "box-shadow-glassmorphism": <Minimize2 />,
  "mesh-gradient-generator": <Palette />,
  "image-ocr": <ImageIcon />,
  "random-drawer": <Dices />,
  "percentage-calculator": <Percent />,
}

const CATEGORIES: ToolCategory[] = [
  "Formatters & Text",
  "Images & Colors",
  "Generators & Utilities",
  "CSS & Design",
  "Calculators & Math",
]

export function ToolsSearch() {
  const [query, setQuery] = useState("")

  const trimmed = query.trim().toLowerCase()

  const filteredTools = trimmed
    ? tools.filter(
        (t) =>
          t.title.toLowerCase().includes(trimmed) ||
          t.description.toLowerCase().includes(trimmed) ||
          t.category.toLowerCase().includes(trimmed)
      )
    : null

  return (
    <div className="flex flex-col gap-8">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools…"
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Search results */}
      {filteredTools ? (
        filteredTools.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              {filteredTools.length} result{filteredTools.length !== 1 ? "s" : ""} for{" "}
              <span className="font-medium text-foreground">&ldquo;{query.trim()}&rdquo;</span>
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.href}
                  href={tool.href}
                  title={tool.title}
                  description={tool.description}
                  icon={toolIcons[tool.slug] ?? <Wrench />}
                  status={tool.status}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Search className="size-10 text-muted-foreground/40" />
            <p className="text-base font-medium text-foreground">No tools found</p>
            <p className="text-sm text-muted-foreground">
              Try a different keyword or{" "}
              <button
                onClick={() => setQuery("")}
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                clear the search
              </button>
              .
            </p>
          </div>
        )
      ) : (
        /* Default categorized view */
        <div className="flex flex-col gap-12">
          {CATEGORIES.map((category) => {
            const categoryTools = tools.filter((t) => t.category === category)
            if (categoryTools.length === 0) return null

            return (
              <div key={category}>
                <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground/80 border-b border-border pb-2">
                  {category}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryTools.map((tool) => (
                    <ToolCard
                      key={tool.href}
                      href={tool.href}
                      title={tool.title}
                      description={tool.description}
                      icon={toolIcons[tool.slug] ?? <Wrench />}
                      status={tool.status}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
