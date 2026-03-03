"use client"

import { useCallback, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface GlowingEffectProps {
  blur?: number
  inactiveZone?: number
  proximity?: number
  spread?: number
  variant?: "default" | "white"
  glow?: boolean
  className?: string
  disabled?: boolean
  borderWidth?: number
}

export function GlowingEffect({
  blur = 0,
  inactiveZone = 0.7,
  proximity = 64,
  spread = 20,
  variant = "default",
  glow = false,
  className,
  borderWidth = 1,
  disabled = false,
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lastPosition = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>(0)

  const handleMove = useCallback(
    (e?: MouseEvent | { x: number; y: number }) => {
      if (!containerRef.current) return

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const element = containerRef.current
        if (!element) return

        const { left, top, width, height } = element.getBoundingClientRect()
        const mouseX = e?.x ?? lastPosition.current.x
        const mouseY = e?.y ?? lastPosition.current.y

        if (e) {
          lastPosition.current = { x: mouseX, y: mouseY }
        }

        const center = [left + width * 0.5, top + height * 0.5]
        const distanceFromCenter = Math.hypot(
          mouseX - center[0],
          mouseY - center[1]
        )
        const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone

        if (distanceFromCenter < inactiveRadius) {
          element.style.setProperty("--active", "0")
          return
        }

        const isActive =
          mouseX > left - proximity &&
          mouseX < left + width + proximity &&
          mouseY > top - proximity &&
          mouseY < top + height + proximity

        element.style.setProperty("--active", isActive ? "1" : "0")

        if (!isActive) return

        const currentAngle =
          parseFloat(element.style.getPropertyValue("--start")) || 0
        const targetAngle =
          (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
            Math.PI +
          90

        const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180
        const newAngle = currentAngle + angleDiff * 0.1

        element.style.setProperty("--start", String(newAngle))
      })
    },
    [inactiveZone, proximity]
  )

  useEffect(() => {
    if (disabled) return

    const handleMouseMove = (e: MouseEvent) => handleMove(e)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [disabled, handleMove])

  return (
    <div
      ref={containerRef}
      style={
        {
          "--blur": `${blur}px`,
          "--spread": spread,
          "--start": "0",
          "--active": "0",
          "--glowingeffect-border-width": `${borderWidth}px`,
          "--repeating-conic-gradient-times": "5",
          "--gradient":
            variant === "white"
              ? "repeating-conic-gradient(from calc(360deg / var(--repeating-conic-gradient-times) * var(--i,0)) at 50% 50%, #fff 0%, #fff calc(25% / var(--repeating-conic-gradient-times)))"
              : "conic-gradient(from calc(var(--start) * 1deg), #dd7ddf, #e46cbf, #a376ff, #4394e5, #1da462, #b3d45b, #e9a32b, #e45535, #dd7ddf)",
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300",
        glow && "opacity-100",
        variant === "white" && "invert mix-blend-lighten",
        "opacity-[calc(var(--active)*1)]",
        "before:absolute before:inset-[calc(-1*var(--glowingeffect-border-width))] before:rounded-[inherit]",
        "before:[background:conic-gradient(from_calc(var(--start)*1deg),transparent_0,var(--gradient)_30%,transparent_calc(10%+30%))]",
        "before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]",
        "before:[mask-composite:xor]",
        "before:p-(--glowingeffect-border-width)",
        blur > 0 && "before:blur-(--blur)",
        className
      )}
    />
  )
}
