"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  type MotionValue,
} from "framer-motion"

type InfiniteGridProps = {
  className?: string
}

export const TheInfiniteGrid = ({ className }: InfiniteGridProps) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const gridOffsetX = useMotionValue(0)
  const gridOffsetY = useMotionValue(0)

  const speedX = 0.2
  const speedY = 0.2
  const tileSize = 40

  useEffect(() => {
    const setCenter = () => {
      mouseX.set(window.innerWidth / 2)
      mouseY.set(window.innerHeight / 2)
    }

    const handlePointerMove = (event: PointerEvent) => {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
    }

    setCenter()
    window.addEventListener("resize", setCenter)
    window.addEventListener("pointermove", handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener("resize", setCenter)
      window.removeEventListener("pointermove", handlePointerMove)
    }
  }, [mouseX, mouseY])

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + speedX) % tileSize)
    gridOffsetY.set((gridOffsetY.get() + speedY) % tileSize)
  })

  const maskImage = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, black, transparent)`

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 z-0 opacity-[0.05]">
        <GridPattern
          patternId="grid-pattern-base"
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          size={tileSize}
        />
      </div>

      <motion.div
        className="absolute inset-0 z-0 opacity-35"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern
          patternId="grid-pattern-active"
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          size={tileSize}
        />
      </motion.div>

      <div className="absolute inset-0 z-0">
        <div className="absolute right-[-12%] top-[-12%] h-[28%] w-[28%] rounded-full bg-orange-500/10 blur-[110px] dark:bg-orange-400/8" />
        <div className="absolute left-[-10%] bottom-[-14%] h-[30%] w-[30%] rounded-full bg-sky-500/10 blur-[120px] dark:bg-sky-400/8" />
      </div>
    </div>
  )
}

export const Component = TheInfiniteGrid

type GridPatternProps = {
  patternId: string
  offsetX: MotionValue<number>
  offsetY: MotionValue<number>
  size: number
}

const GridPattern = ({ patternId, offsetX, offsetY, size }: GridPatternProps) => {
  return (
    <svg className="h-full w-full">
      <defs>
        <motion.pattern
          id={patternId}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}
