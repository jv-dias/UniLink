import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { LinkList } from "@/components/link-list";
import { LinkForm } from "@/components/link-form";
import { linksService } from "@/lib/linksService";
import type { LinkItem } from "@/components/link-form";
import { Button } from "@/components/ui/button";

export default function MeusLinksPage() {
  const [links, setLinks] = React.useState<LinkItem[]>([]);
  const [editing, setEditing] = React.useState<LinkItem | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  React.useEffect(() => {
    linksService.getAll().then(setLinks);
  }, []);

  async function handleCreate(data: Omit<LinkItem, "id">) {
    const newItem = await linksService.create(data);
    setLinks((s) => [newItem, ...s]);
    setShowForm(false);
  }

  async function handleUpdate(id: string, data: Partial<LinkItem>) {
    await linksService.update(id, data);
    setLinks((s) => s.map((l) => (l.id === id ? { ...l, ...data } : l)));
    setEditing(null);
  }

  async function handleDelete(id: string) {
    await linksService.delete(id);
    setLinks((s) => s.filter((l) => l.id !== id));
  }

  async function handleToggle(id: string) {
    const item = links.find((l) => l.id === id);
    if (!item) return;
    await linksService.update(id, { active: !item.active });
    setLinks((s) => s.map((l) => (l.id === id ? { ...l, active: !l.active } : l)));
  }

  async function handleReorder(newItems: LinkItem[]) {
    await linksService.reorder(newItems);
    setLinks(newItems);
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Gerenciador de Links</h2>
            <div className="flex gap-2">
              <Button onClick={() => setShowForm((s) => !s)}>Adicionar novo link</Button>
              <Button variant="outline" onClick={() => console.log('Preview page')}>Visualizar página pública</Button>
            </div>
          </div>

          {showForm && (
            <div className="mb-4">
              <LinkForm onSubmit={handleCreate} />
            </div>
          )}

          <LinkList
            items={links}
            onEdit={(item) => setEditing(item)}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onReorder={handleReorder}
          />

          {editing && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Editar link</h3>
              <LinkForm initial={editing} onSubmit={(data) => handleUpdate(editing.id, data)} />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
