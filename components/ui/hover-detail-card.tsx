/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

type CardButton = {
  text: string
  href?: string
  color?: string
  hoverColor?: string
  textColor?: string
}

interface HoverDetailCardProps {
  title?: string
  subtitle?: string
  images?: string[]
  className?: string
  primaryButton?: CardButton
  secondaryButton?: CardButton
  pills?: {
    left: {
      text: string
      color?: string
      textColor?: string
      icon?: React.ReactNode
    }
    sparkle?: {
      show: boolean
      color?: string
    }
    right: {
      text: string
      color?: string
      textColor?: string
    }
  }
  enableAnimations?: boolean
}

const defaultImages = [
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&h=120&fit=crop&auto=format&q=60",
  "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=120&h=120&fit=crop&auto=format&q=60",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&h=120&fit=crop&auto=format&q=60&flip=h",
  "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=120&h=120&fit=crop&auto=format&q=60&flip=h",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=120&fit=crop&auto=format&q=60",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=120&h=120&fit=crop&auto=format&q=60",
  "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=120&h=120&fit=crop&auto=format&q=60&sat=-100",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format&q=60",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=120&h=120&fit=crop&auto=format&q=60&flip=h",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&h=120&fit=crop&auto=format&q=60&sat=-50",
]

export function HoverDetailCard({
  title = "Studio shots",
  subtitle = "52 tiles",
  images = defaultImages,
  className,
  primaryButton = {
    text: "Go to collection",
    color: "bg-white/90",
    hoverColor: "hover:bg-white",
    textColor: "text-gray-900",
  },
  secondaryButton,
  pills = {
    left: { text: "1x1", color: "bg-blue-100", textColor: "text-blue-800" },
    sparkle: { show: true, color: "bg-purple-100 text-purple-800" },
    right: { text: "Published", color: "bg-green-100", textColor: "text-green-800" },
  },
  enableAnimations = true,
}: HoverDetailCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = enableAnimations && !shouldReduceMotion
  const hasImages = images.length > 0

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const imageVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  }

  const contentVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -25,
      scale: 0.95,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.6,
      },
    },
  }

  const bottomSectionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }

  const pillVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.9,
      filter: "blur(3px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 450,
        damping: 25,
        mass: 0.5,
      },
    },
  }

  const textVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 15,
      scale: 0.95,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.7,
      },
    },
  }

  const actionClass = (button: CardButton) =>
    cn(
      button.color,
      button.hoverColor,
      button.textColor,
      "cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
    )

  return (
    <motion.div
      className={cn("w-full", className)}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      variants={shouldAnimate ? containerVariants : undefined}
    >
      <motion.div
        className="relative overflow-hidden rounded-xl border border-border/60 bg-card/60 backdrop-blur-2xl shadow-lg transition-shadow duration-300 hover:shadow-xl"
        variants={shouldAnimate ? contentVariants : undefined}
      >
        {hasImages && (
          <motion.div
            className="relative border-b border-border/50 bg-muted/50 p-4"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            variants={shouldAnimate ? contentVariants : undefined}
          >
            <div className="relative grid grid-cols-5 gap-2">
              {images.slice(0, 10).map((src, index) => (
                <motion.div
                  key={`${src}-${index}`}
                  className="relative aspect-square overflow-hidden rounded-lg"
                  variants={shouldAnimate ? imageVariants : undefined}
                  animate={{
                    scale: isHovered ? 0.85 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                >
                  <img
                    src={src}
                    alt={`${title} ${index + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm"
                >
                  <div className="mx-auto flex gap-3">
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        delay: 0.1,
                      }}
                    >
                      {primaryButton.href ? (
                        <Link href={primaryButton.href} className={actionClass(primaryButton)}>
                          {primaryButton.text}
                        </Link>
                      ) : (
                        <button type="button" className={actionClass(primaryButton)}>
                          {primaryButton.text}
                        </button>
                      )}
                    </motion.div>
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        delay: 0.2,
                      }}
                    >
                      {secondaryButton && (secondaryButton.href ? (
                        <Link href={secondaryButton.href} className={actionClass(secondaryButton)}>
                          {secondaryButton.text}
                        </Link>
                      ) : (
                        <button type="button" className={actionClass(secondaryButton)}>
                          {secondaryButton.text}
                        </button>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div
          className="p-4"
          variants={shouldAnimate ? bottomSectionVariants : undefined}
        >
          <motion.div
            className="mb-3 flex items-center justify-between"
            variants={shouldAnimate ? contentVariants : undefined}
          >
            <motion.div
              className="flex items-center gap-2"
              variants={shouldAnimate ? bottomSectionVariants : undefined}
            >
              <motion.div
                className={cn(
                  pills.left.color,
                  pills.left.textColor,
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                )}
                variants={shouldAnimate ? pillVariants : undefined}
              >
                {pills.left.icon && <div className="h-3.5 w-3.5 [&>svg]:h-full [&>svg]:w-full">{pills.left.icon}</div>}
                {pills.left.text}
              </motion.div>
              {pills.sparkle?.show && (
                <motion.div
                  className={cn(pills.sparkle.color, "rounded-full p-2")}
                  variants={shouldAnimate ? pillVariants : undefined}
                  whileHover={
                    shouldAnimate
                      ? {
                          rotate: 15,
                          scale: 1.1,
                          transition: { type: "spring", stiffness: 400, damping: 25 },
                        }
                      : {}
                  }
                >
                  <Sparkles className="h-3 w-3" />
                </motion.div>
              )}
            </motion.div>
            <motion.div
              className={cn(
                pills.right.color,
                pills.right.textColor,
                "rounded-full px-3 py-1 text-xs font-medium"
              )}
              variants={shouldAnimate ? pillVariants : undefined}
            >
              {pills.right.text}
            </motion.div>
          </motion.div>

          <motion.div variants={shouldAnimate ? bottomSectionVariants : undefined}>
            <motion.h3
              className="mb-1 text-xl font-bold text-foreground"
              variants={shouldAnimate ? textVariants : undefined}
            >
              {title}
            </motion.h3>
            <motion.p
              className="line-clamp-2 text-sm text-muted-foreground"
              variants={shouldAnimate ? textVariants : undefined}
            >
              {subtitle}
            </motion.p>
          </motion.div>

          {!hasImages && (
            <div className="mt-4 flex flex-wrap gap-2">
              {primaryButton.href ? (
                <Link href={primaryButton.href} className={actionClass(primaryButton)}>
                  {primaryButton.text}
                </Link>
              ) : (
                <button type="button" className={actionClass(primaryButton)}>
                  {primaryButton.text}
                </button>
              )}
              {secondaryButton && (secondaryButton.href ? (
                <Link href={secondaryButton.href} className={actionClass(secondaryButton)}>
                  {secondaryButton.text}
                </Link>
              ) : (
                <button type="button" className={actionClass(secondaryButton)}>
                  {secondaryButton.text}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
