import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useMemo } from "react"
import { useLocation } from "react-router-dom"

function friendlyTitle(pathname: string) {
  const map: Record<string, string> = {
    "/": "Página Inicial",
    "/admin/dashboard": "Painel",
    "/admin/links": "Meus Links",
    "/admin/profile": "Perfil",
    "/auth/login": "Entrar",
    "/auth/register": "Registrar",
  }

  // exact or prefix matches
  for (const key of Object.keys(map)) {
    if (pathname === key || pathname.startsWith(key + "/") || pathname.startsWith(key + "?")) {
      return map[key]
    }
  }

  // fallback: create a readable name from the last segment (deepest)
  const seg = pathname.split("/").filter(Boolean)
  if (seg.length === 0) return "Página"
  const first = seg[seg.length - 1]
  // turn kebab-case or camelCase into Title Case
  const title = first
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase())
  return title
}

export function SiteHeader() {
  const { pathname } = useLocation()

  const title = useMemo(() => friendlyTitle(pathname), [pathname])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
