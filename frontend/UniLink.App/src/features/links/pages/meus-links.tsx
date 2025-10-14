import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { LinkList } from "@/components/link-list";
import { LinkForm } from "@/components/link-form";
import { linksService } from "@/features/links/services/linksService";
import type { LinkDto } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MeusLinksPage() {
  const [links, setLinks] = React.useState<LinkDto[]>([]);
  const [editing, setEditing] = React.useState<LinkDto | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  React.useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    try {
      const data = await linksService.getAll();
      setLinks(data);
    } catch (err: any) {
      console.error("Erro ao carregar links:", err);
    }
  }

	async function handleCreate(data: Omit<LinkDto, "id">) {
		const newItem = await linksService.create(data);
		setLinks((s) => [newItem, ...s]);
		setShowForm(false);
	}

	async function handleUpdate(id: number, data: Partial<LinkDto>) {
		const item = links.find((l) => l.id === id);
		if (!item) return;
		
		// UpdateLinkDto requires all fields, so merge with existing data
		const updateData = {
			title: data.title ?? item.title,
			url: data.url ?? item.url,
			isActive: data.isActive ?? item.isActive,
		};
		
		await linksService.update(id, updateData);
		setLinks((s) => s.map((l) => (l.id === id ? { ...l, ...data } : l)));
		setEditing(null);
	}

	async function handleDelete(id: number) {
		await linksService.delete(id);
		setLinks((s) => s.filter((l) => l.id !== id));
	}

	async function handleToggle(id: number) {
		const item = links.find((l) => l.id === id);
		if (!item) return;
		
		// UpdateLinkDto requires all fields
		const updateData = {
			title: item.title,
			url: item.url,
			isActive: !item.isActive,
		};
		
		await linksService.update(id, updateData);
		setLinks((s) => s.map((l) => (l.id === id ? { ...l, isActive: !l.isActive } : l)));
	}

	async function handleReorder(newItems: LinkDto[]) {
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

					<LinkList
						items={links}
						onEdit={(item) => setEditing(item)}
						onDelete={handleDelete}
						onToggle={handleToggle}
						onReorder={handleReorder}
					/>

					{/* Add Link Modal */}
					<Dialog open={showForm} onOpenChange={setShowForm}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Adicionar novo link</DialogTitle>
							</DialogHeader>
							<div className="p-4 pt-0">
								<LinkForm onSubmit={(data) => handleCreate(data)} className="mt-2" formId="create-link-form" hideSubmit />
							</div>
							<DialogFooter>
								<div className="flex w-full justify-end gap-2">
									<Button variant="outline" onClick={() => setShowForm(false)}>Fechar</Button>
									<Button type="submit" form="create-link-form">Salvar</Button>
								</div>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					{/* Edit Link Modal */}
					<Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Editar link</DialogTitle>
							</DialogHeader>
							<div className="p-4 pt-0">
								{editing && (
									<LinkForm
										initial={editing}
										onSubmit={(data) => handleUpdate(editing.id, data)}
										className="mt-2"
										formId="edit-link-form"
										hideSubmit
									/>
								)}
							</div>
							<DialogFooter>
								<div className="flex w-full justify-end gap-2">
									<Button variant="outline" onClick={() => setEditing(null)}>Fechar</Button>
									<Button type="submit" form="edit-link-form">Salvar</Button>
								</div>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

