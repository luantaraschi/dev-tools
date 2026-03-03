"use client"

import { MigratedToolView } from "@/components/tools/migrated-tool-view"

type ToolRendererClientProps = {
  slug: string
}

export function ToolRendererClient({ slug }: ToolRendererClientProps) {
  return <MigratedToolView slug={slug} />
}
