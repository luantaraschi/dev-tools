import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { TheInfiniteGrid } from "@/components/ui/the-infinite-grid"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dev Tools • Luan Taraschi",
  description: "A dashboard of 10 useful developer tools by Luan Taraschi",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} relative min-h-svh`}>
        <ThemeProvider>
          <TheInfiniteGrid className="z-0" />
          <div className="relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
