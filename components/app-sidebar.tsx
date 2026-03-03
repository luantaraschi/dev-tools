"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  type LucideIcon,
  Braces,
  Clock,
  FileText,
  ImageIcon,
  Key,
  LayoutDashboard,
  Minimize2,
  Palette,
  Pipette,
  QrCode,
  Scissors,
  Wrench,
} from "lucide-react"

import { tools } from "@/lib/tools"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const toolIcons: Record<string, LucideIcon> = {
  "time-converter": Clock,
  "password-generator": Key,
  "color-harmony": Palette,
  "color-palette-extractor": Pipette,
  "qr-generator": QrCode,
  "image-converter": ImageIcon,
  "bg-remover": Scissors,
  "image-compressor": Minimize2,
  "text-to-pdf": FileText,
  "json-formatter": Braces,
  "case-converter": FileText,
  "uuid-generator": Key,
  "box-shadow-glassmorphism": Minimize2,
  "mesh-gradient-generator": Palette,
  "image-ocr": ImageIcon,
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="Dev Tools"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Wrench className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Dev Tools</span>
                  <span className="truncate text-xs text-muted-foreground">
                    by Luan Taraschi
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/"}
                  tooltip="Home"
                >
                  <Link href="/">
                    <LayoutDashboard />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((tool) => {
                const Icon = toolIcons[tool.slug] ?? Wrench

                return (
                  <SidebarMenuItem key={tool.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === tool.href}
                      tooltip={tool.title}
                    >
                      <Link href={tool.href}>
                        <Icon />
                        <span>{tool.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <p className="px-2 py-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          © {new Date().getFullYear()} Dev Tools • Luan Taraschi
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
