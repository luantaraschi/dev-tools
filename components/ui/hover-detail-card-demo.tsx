"use client"

import { HoverDetailCard } from "@/components/ui/hover-detail-card"

export default function HoverDetailCardDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <HoverDetailCard
        title="Studio shots"
        subtitle="52 tiles"
        primaryButton={{
          text: "Go to collection",
          color: "bg-white/90",
          hoverColor: "hover:bg-white",
          textColor: "text-gray-900",
        }}
        secondaryButton={{
          text: "Edit rules",
          color: "bg-blue-600",
          hoverColor: "hover:bg-blue-700",
          textColor: "text-white",
        }}
        pills={{
          left: {
            text: "1x1",
            color: "bg-blue-100",
            textColor: "text-blue-800",
          },
          sparkle: {
            show: true,
            color: "bg-purple-100 text-purple-800",
          },
          right: {
            text: "Published",
            color: "bg-green-100",
            textColor: "text-green-800",
          },
        }}
        enableAnimations={true}
      />
    </div>
  )
}
