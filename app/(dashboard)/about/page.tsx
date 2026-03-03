import { FlaskConical, Github, Globe } from "lucide-react"
import packageJson from "@/package.json"

const repositoryUrl = "https://github.com/luantaraschi/dev-tools"
const releaseDate = "2026-03-03"

const reactVersion =
  packageJson.dependencies.react?.replace(/^[~^]/, "") ?? "Unknown"

const deploymentRows = [
  { label: "Version", value: `${packageJson.version} (${releaseDate})` },
  {
    label: "Repository",
    value: (
      <a
        href={repositoryUrl}
        target="_blank"
        rel="noreferrer"
        className="text-primary underline-offset-4 hover:underline"
      >
        {repositoryUrl}
      </a>
    ),
  },
  {
    label: "Privacy Policy",
    value: (
      <span className="text-muted-foreground">
        Not published yet for this project.
      </span>
    ),
  },
  {
    label: "Icon Credits",
    value: (
      <a
        href="https://lucide.dev/"
        target="_blank"
        rel="noreferrer"
        className="text-primary underline-offset-4 hover:underline"
      >
        Lucide
      </a>
    ),
  },
  { label: "React Version", value: reactVersion },
] as const

const contributors = [
  {
    name: "Luan Taraschi",
    href: "https://github.com/luantaraschi",
    icon: Github,
    label: "GitHub profile",
  },
] as const

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <section className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-2xl p-6 text-center shadow-sm sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Project Information
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="bg-linear-to-r from-[#0f172a] via-[#1d4ed8] to-[#0f766e] bg-clip-text text-transparent dark:from-[#f8fafc] dark:via-[#93c5fd] dark:to-[#5eead4]">
            Dev Tools
          </span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          A swiss-army toolkit for practical web development tasks.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-2xl shadow-sm">
        <header className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="rounded-lg bg-primary/10 p-2 text-primary ring-1 ring-primary/20 dark:ring-primary/30">
            <FlaskConical className="size-4" />
          </div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Latest Deployment
          </h2>
        </header>

        <dl>
          {deploymentRows.map((row) => (
            <div
              key={row.label}
              className="grid gap-2 border-b border-border px-5 py-4 text-sm last:border-b-0 sm:grid-cols-[210px_1fr] sm:items-center sm:gap-4"
            >
              <dt className="font-medium text-foreground">{row.label}</dt>
              <dd className="break-all text-muted-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-2xl p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-1 w-8 rounded-full bg-primary" />
          <h2 className="text-xl font-semibold tracking-tight text-card-foreground">
            Contributors
          </h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-muted/40 dark:bg-muted/20">
          {contributors.map((person, index) => {
            const Icon = person.icon

            return (
              <div
                key={person.name}
                className={`flex items-center justify-between gap-4 px-4 py-4 sm:px-5 ${
                  index > 0 ? "border-t border-border" : ""
                }`}
              >
                <p className="font-medium text-foreground">{person.name}</p>
                <a
                  href={person.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={person.label}
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card/60 backdrop-blur-2xl text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="size-4" />
                </a>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1">
            <Globe className="size-3.5" />
            Public repository
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1">
            Built with Next.js and React
          </span>
        </div>
      </section>
    </div>
  )
}
