import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Wrench } from "lucide-react"
import { MigratedToolView } from "@/components/tools/migrated-tool-view"
import { getToolBySlug, tools } from "@/lib/tools"

type ToolPageProps = {
  params: Promise<{
    tool: string
  }>
}

export function generateStaticParams() {
  return tools.map((tool) => ({ tool: tool.slug }))
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool: toolSlug } = await params
  const tool = getToolBySlug(toolSlug)

  if (!tool) {
    notFound()
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary ring-1 ring-primary/20">
            <Wrench className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">
              {tool.title}
            </h1>
            <p className="text-sm text-muted-foreground">{tool.description}</p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            Integrated tool view with unified Dev Tools dashboard design.
          </p>
        </div>

        <div className="mt-4">
          <MigratedToolView slug={tool.slug} />
        </div>
      </section>
    </div>
  )
}
