import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  active: boolean;
};

export function LinkForm({
  initial,
  onSubmit,
  className,
  formId,
  hideSubmit,
}: {
  initial?: Partial<LinkItem>;
  onSubmit: (data: Omit<LinkItem, "id">) => void;
  className?: string;
  formId?: string;
  hideSubmit?: boolean;
}) {
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [url, setUrl] = React.useState(initial?.url ?? "");
  const [active, setActive] = React.useState(initial?.active ?? true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ title, url, active });
  }

  return (
    <form id={formId} className={cn("flex flex-col gap-4", className)} onSubmit={handleSubmit}>
      <Field>
        <FieldLabel htmlFor="link-title">Título</FieldLabel>
        <Input
          id="link-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título do link (ex: Portfólio)"
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="link-url">URL</FieldLabel>
        <Input
          id="link-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
        />
      </Field>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          <span>Ativo</span>
        </label>
        {!hideSubmit && <Button type="submit">Salvar</Button>}
      </div>
    </form>
  );
}
