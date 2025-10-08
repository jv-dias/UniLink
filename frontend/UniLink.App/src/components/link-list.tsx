// React import not required with automatic JSX runtime
import { Button } from "@/components/ui/button";
import { IconPencil, IconTrash, IconEye, IconSwitchHorizontal } from "@tabler/icons-react";
import { DragContainer } from "./drag-container";
import type { LinkItem } from "./link-form";

export function LinkList({ items, onEdit, onDelete, onToggle, onReorder }: {
  items: LinkItem[];
  onEdit: (item: LinkItem) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onReorder: (newItems: LinkItem[]) => void;
}) {
  return (
    <div>
      <DragContainer items={items} onReorder={onReorder} renderItem={(item) => (
        <div className="flex items-center justify-between gap-4 p-3 rounded border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-sm">{item.title.charAt(0)}</div>
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-muted-foreground">{item.url}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}><IconPencil /></Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}><IconTrash /></Button>
            <Button variant="ghost" size="sm" onClick={() => onToggle(item.id)}><IconSwitchHorizontal /></Button>
            <Button variant="ghost" size="sm" onClick={() => console.log('Preview', item)}><IconEye /></Button>
          </div>
        </div>
      )} />
    </div>
  );
}
