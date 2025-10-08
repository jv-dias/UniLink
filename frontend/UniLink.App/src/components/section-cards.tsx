import { IconLink, IconArrowUpRight, IconUsers, IconSparkles } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
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

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de links</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalLinks}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconLink />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Links disponíveis</div>
          <div className="text-muted-foreground">Organize seus links e conteúdos</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Cliques hoje</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {clicksToday}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconArrowUpRight />
              +8%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Tendência das últimas 24h</div>
          <div className="text-muted-foreground">Acompanhe o desempenho dos seus links</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Seguidores ativos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeFollowers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Usuários engajados</div>
          <div className="text-muted-foreground">Interações dos seguidores</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Link mais clicado</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {topLink.title}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconSparkles />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">{topLink.clicks} cliques</div>
          <div className="text-muted-foreground">Visualizar link: <a href={topLink.url} className="underline">Abrir</a></div>
        </CardFooter>
      </Card>
    </div>
  )
}
