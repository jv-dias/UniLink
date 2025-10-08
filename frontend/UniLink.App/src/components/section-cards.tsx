import {
  IconLink,
  IconArrowUpRight,
  IconUsers,
  IconSparkles,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import * as React from "react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  // mock Linktree-style data
  const totalLinks = 12
  const clicksToday = 243
  const activeFollowers = 1580
  const topLink = {
    title: "Portfólio",
    url: "https://example.com/portfolio",
    clicks: 98,
  }

  const CardStat = ({
    title,
    value,
    icon,
    sub,
    action,
    highlight = false,
  }: {
    title: string
    value: React.ReactNode
    icon: React.ElementType
    sub?: string
    action?: React.ReactNode
    highlight?: boolean
  }) => (
    <Card
      className={`@container/card transform transition hover:-translate-y-1 hover:shadow-lg duration-200 ${
        highlight ? "ring-1 ring-primary/20" : ""
      }`}
    >
      <CardHeader className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-sm"
            aria-hidden
          >
            {React.createElement(icon, { className: "h-6 w-6" })}
          </div>
          <div>
            <CardDescription className="text-sm">{title}</CardDescription>
            <CardTitle className="mt-1 text-2xl font-semibold tabular-nums">
              {value}
            </CardTitle>
          </div>
        </div>
        {action && <div className="self-start">{action}</div>}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="font-medium text-sm">{sub}</div>
      </CardFooter>
    </Card>
  )

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 xl:grid-cols-4 lg:px-6">
      <CardStat
        title="Total de links"
        value={totalLinks}
        icon={IconLink}
        sub="Links disponíveis para a sua página"
        action={<Badge>Ver</Badge>}
      />

      <CardStat
        title="Cliques hoje"
        value={clicksToday}
        icon={IconArrowUpRight}
        sub="Tendência nas últimas 24 horas"
        action={<Badge variant="outline">+8%</Badge>}
      />

      <CardStat
        title="Seguidores ativos"
        value={activeFollowers}
        icon={IconUsers}
        sub="Usuários engajados com seus links"
        action={<Badge variant="outline">Ativo</Badge>}
      />

      <CardStat
        title="Link mais clicado"
        value={topLink.title}
        icon={IconSparkles}
        sub={`${topLink.clicks} cliques — `}
        action={
          <a
            href={topLink.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary underline-offset-2 hover:underline"
          >
            Abrir
          </a>
        }
        highlight
      />
    </div>
  )
}
