import React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { userService } from '@/lib/userService';

export default function PerfilPage() {
  const [profile, setProfile] = React.useState<any>(null);
  const [name, setName] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [avatar, setAvatar] = React.useState('');
  const [theme, setTheme] = React.useState('padrão');
  const [username, setUsername] = React.useState('');

  React.useEffect(() => {
    userService.getProfile().then((p) => {
      setProfile(p);
      setName(p.name);
      setBio(p.bio);
      setAvatar(p.avatar);
      setTheme(p.theme);
      setUsername(p.username);
    });
  }, []);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(f);
  }

  async function handleSave() {
    const data = { name, bio, avatar, theme, username };
    await userService.updateProfile(data);
    alert('Perfil salvo (simulado)');
  }

  function copyPublicLink() {
    const url = `https://meulink.com/${username}`;
    navigator.clipboard.writeText(url);
    alert('Link copiado: ' + url);
  }

  if (!profile) return null;

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
          <div className="max-w-3xl mx-auto bg-card/60 backdrop-blur rounded-lg p-6 shadow-md">
            <h1 className="text-2xl font-bold mb-4">Perfil do Usuário</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <label className="text-sm text-muted-foreground">Fazer upload de avatar</label>
                <input type="file" accept="image/*" onChange={handleFile} />
                <label className="text-sm text-muted-foreground">Ou URL do avatar</label>
                <Input value={avatar} onChange={(e) => setAvatar(e.target.value)} />
              </div>

              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm">Nome</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm">Biografia curta</label>
                    <Input value={bio} onChange={(e) => setBio(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm">Tema da página</label>
                    <select className="w-full rounded-md border px-3 py-1" value={theme} onChange={(e) => setTheme(e.target.value)}>
                      <option value="padrão">Padrão</option>
                      <option value="escuro">Escuro</option>
                      <option value="claro">Claro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm">Usuário (para link público)</label>
                    <div className="flex gap-2">
                      <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                      <Button variant="outline" onClick={copyPublicLink}>Copiar link</Button>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleSave}>Salvar perfil</Button>
                    <Button variant="ghost" onClick={() => alert('Preview público (simulado)')}>Visualizar página pública</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
