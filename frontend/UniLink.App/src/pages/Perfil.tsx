import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { userService } from "@/lib/userService"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"


export default function PerfilPage() {
  const [profile, setProfile] = React.useState<any>(null)
  const [name, setName] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [avatar, setAvatar] = React.useState("")
  const [theme, setTheme] = React.useState("padrão")
  const [username, setUsername] = React.useState("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    userService.getProfile().then((p) => {
      setProfile(p)
      setName(p.name)
      setBio(p.bio)
      setAvatar(p.avatar)
      setTheme(p.theme)
      setUsername(p.username)
    })
  }, [])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      setAvatar(reader.result as string)
    }
    reader.readAsDataURL(f)
  }

  async function handleSave() {
    const data = { name, bio, avatar, theme, username }
    await userService.updateProfile(data)
    // use a nicer notification later (sonner)
    alert("Perfil salvo (simulado)")
  }

  function copyPublicLink() {
    const url = `https://meulink.com/${username}`
    navigator.clipboard.writeText(url)
    alert("Link copiado: " + url)
  }

  if (!profile) return null

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

        <main className="min-h-[calc(100vh-5.5rem)] w-full px-6 py-8">
          <div className="mx-auto w-full max-w-6xl">
            <h1 className="text-3xl font-semibold mb-6">Perfil do Usuário</h1>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-start">
              {/* Left: avatar & actions */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-36 w-36">
                  {avatar ? (
                    <AvatarImage src={avatar} alt={name} />
                  ) : (
                    <AvatarFallback>
                      {name
                        ? name
                            .trim()
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((n) => n.charAt(0).toUpperCase())
                            .join("")
                        : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="w-full flex flex-col items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Fazer upload de avatar
                  </Button>
                </div>

                <div className="w-full">
                  <label className="text-sm text-muted-foreground">Ou URL do avatar</label>
                  <Input value={avatar} onChange={(e) => setAvatar(e.target.value)} />
                </div>

                <Button variant="ghost" onClick={() => setAvatar("")}>Remover avatar</Button>
              </div>

              {/* Right: form */}
              <div className="md:col-span-2">
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm mb-1">Nome</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Biografia curta</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full rounded-md border px-3 py-2 resize-none min-h-[96px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Tema da página</label>
                      <select
                        className="w-full rounded-md border px-3 py-2"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                      >
                        <option value="padrão">Padrão</option>
                        <option value="escuro">Escuro</option>
                        <option value="claro">Claro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Usuário (para link público)</label>
                      <div className="flex gap-2">
                        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                        <Button variant="outline" onClick={copyPublicLink}>
                          Copiar link
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleSave}>Salvar perfil</Button>
                    <Button variant="ghost" onClick={() => alert("Preview público (simulado)")}>Visualizar página pública</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
