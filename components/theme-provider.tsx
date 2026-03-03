"use client"

import type { ReactNode } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type AppThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="devtools-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
