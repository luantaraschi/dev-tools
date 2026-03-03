"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type BubbleTextProps = {
  text?: string
  className?: string
  charClassName?: string
  activeClassName?: string
  neighborClassName?: string
  secondNeighborClassName?: string
}

export function BubbleText({
  text = "Bubbbbbbbble text",
  className,
  charClassName,
  activeClassName,
  neighborClassName,
  secondNeighborClassName,
}: BubbleTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <span
      onMouseLeave={() => setHoveredIndex(null)}
      className={cn("inline-flex select-none whitespace-nowrap", className)}
    >
      {text.split("").map((char, idx) => {
        const distance =
          hoveredIndex !== null ? Math.abs(hoveredIndex - idx) : null

        let classes = cn(
          "inline-block cursor-default transition-all duration-300 ease-in-out",
          charClassName
        )

        switch (distance) {
          case 0:
            classes = cn(classes, "font-black text-indigo-50", activeClassName)
            break
          case 1:
            classes = cn(classes, "font-medium text-indigo-200", neighborClassName)
            break
          case 2:
            classes = cn(classes, "font-light", secondNeighborClassName)
            break
          default:
            break
        }

        return (
          <span
            key={`${char}-${idx}`}
            onMouseEnter={() => setHoveredIndex(idx)}
            className={classes}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        )
      })}
    </span>
  )
}
