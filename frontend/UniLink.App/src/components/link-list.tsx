// React import not required for JSX, but we need state/hooks
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconPencil,
  IconTrash,
  IconEye,
  IconGripVertical,
  IconLink as IconLinkGlyph,
} from "@tabler/icons-react";
import { DragContainer } from "./drag-container";
import type { LinkItem } from "./link-form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Toggle } from "@/components/ui/toggle";

function getDomain(url: string) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getFaviconUrl(url: string) {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
  } catch {
    return "";
  }
}

export function LinkList({ items, onEdit, onDelete, onToggle, onReorder }: {
  items: LinkItem[];
  onEdit: (item: LinkItem) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onReorder: (newItems: LinkItem[]) => void;
}) {
  const [deleteTarget, setDeleteTarget] = React.useState<LinkItem | null>(null);

  return (
    <TooltipProvider delayDuration={0}>
      <DragContainer
        items={items}
        onReorder={onReorder}
        renderItem={(item, drag) => {
          const favicon = getFaviconUrl(item.url);
          const domain = getDomain(item.url);
          return (
            <div
              className="group flex items-center justify-between gap-4 rounded-lg border bg-card/70 p-3 shadow-xs transition-all hover:-translate-y-0.5 hover:bg-card hover:shadow-md"
            >
              <div className="flex items-center gap-3 min-w-0 cursor-grab active:cursor-grabbing" {...drag.listeners} {...drag.attributes}>
                <IconGripVertical className="text-muted-foreground/60" />
                {favicon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={favicon} alt="favicon" className="h-5 w-5" />
                ) : (
                  <IconLinkGlyph className="h-5 w-5 text-muted-foreground" />
                )}
                <div className="min-w-0">
                  <div className="font-medium truncate">{item.title}</div>
                  <div className="text-sm text-muted-foreground truncate">{domain}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={item.active ? "outline" : "outline"}
                  className={`hidden sm:inline-flex ${item.active ? "bg-emerald-500 text-white border-transparent" : ""}`}
                >
                  {item.active ? "Ativo" : "Inativo"}
                </Badge>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(item)} aria-label="Editar">
                      <IconPencil />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Editar</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(item)} aria-label="Remover">
                      <IconTrash />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remover</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      aria-label={item.active ? "Desativar" : "Ativar"}
                      pressed={item.active}
                      onPressedChange={() => onToggle(item.id)}
                      variant="outline"
                      size="sm"
                    >
                      {item.active ? "On" : "Off"}
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>{item.active ? "Desativar" : "Ativar"}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild aria-label="Visualizar">
                      <a href={item.url} target="_blank" rel="noreferrer">
                        <IconEye />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Visualizar</TooltipContent>
                </Tooltip>
              </div>
            </div>
          );
        }}
      />

      {/* Confirm delete modal */}
      <Sheet open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <SheetContent side="bottom" className="sm:max-w-md sm:mx-auto sm:rounded-t-lg">
          <SheetHeader>
            <SheetTitle>Remover link?</SheetTitle>
            <SheetDescription>
              {deleteTarget ? (
                <span>
                  Tem certeza que deseja remover "<strong>{deleteTarget.title}</strong>" ({getDomain(deleteTarget.url)})? Essa ação não pode ser desfeita.
                </span>
              ) : null}
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <div className="flex w-full items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deleteTarget) {
                    onDelete(deleteTarget.id);
                  }
                  setDeleteTarget(null);
                }}
              >
                Remover
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
