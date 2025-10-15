import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { profileService } from "@/features/public-profile/services/profileService"
import { useAuth } from "@/features/auth/context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function PerfilPage() {
	const { user } = useAuth()
	const navigate = useNavigate()
	const [displayName, setDisplayName] = React.useState("")
	const [bio, setBio] = React.useState("")
	const [profilePictureUrl, setProfilePictureUrl] = React.useState("")
	const [loading, setLoading] = React.useState(true)
	const [saving, setSaving] = React.useState(false)
	const fileInputRef = React.useRef<HTMLInputElement>(null)

	React.useEffect(() => {
		async function loadProfile() {
			try {
				const data = await profileService.getMyProfile()
				setDisplayName(data.displayName || "")
				setBio(data.bio || "")
				setProfilePictureUrl(data.profilePictureUrl || "")
			} catch (err) {
				console.error("Erro ao carregar perfil:", err)
			} finally {
				setLoading(false)
			}
		}
		
		loadProfile()
	}, [])

	function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		const f = e.target.files?.[0]
		if (!f) return
		const reader = new FileReader()
		reader.onload = () => {
			setProfilePictureUrl(reader.result as string)
		}
		reader.readAsDataURL(f)
	}

	async function handleSave() {
		try {
			setSaving(true)
			const data = {
				displayName: displayName || "",
				bio: bio || "",
				profilePictureUrl: profilePictureUrl || "",
			}
			await profileService.updateMyProfile(data)
			alert("Perfil atualizado com sucesso!")
		} catch (err: any) {
			console.error("Erro ao salvar perfil:", err)
			alert("Erro ao salvar perfil: " + (err.message || "Tente novamente"))
		} finally {
			setSaving(false)
		}
	}

	function copyPublicLink() {
		if (!user?.username) return
		const url = `${window.location.origin}/public/${user.username}`
		navigator.clipboard.writeText(url)
		alert("Link copiado: " + url)
	}

	function handlePreview() {
		if (!user?.username) return
		navigate(`/public/${user.username}`)
	}

	if (loading) {
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
					<main className="min-h-[calc(100vh-5.5rem)] w-full px-6 py-8 flex items-center justify-center">
						<div>Carregando perfil...</div>
					</main>
				</SidebarInset>
			</SidebarProvider>
		)
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

				<main className="min-h-[calc(100vh-5.5rem)] w-full px-6 py-8">
					<div className="mx-auto w-full max-w-6xl">
						<h1 className="text-3xl font-semibold mb-6">Perfil do Usuário</h1>

						<div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-start">
							{/* Left: avatar & actions */}
							<div className="flex flex-col items-center gap-4">
								<Avatar className="h-36 w-36">
									{profilePictureUrl ? (
										<AvatarImage src={profilePictureUrl} alt={displayName || user?.username || "User"} />
									) : (
										<AvatarFallback>
											{displayName
												? displayName
														.trim()
														.split(/\s+/)
														.slice(0, 2)
														.map((n) => n.charAt(0).toUpperCase())
														.join("")
												: user?.username?.charAt(0).toUpperCase() || "U"}
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
									<label className="text-sm text-muted-foreground">Ou URL da imagem</label>
									<Input 
										value={profilePictureUrl} 
										onChange={(e) => setProfilePictureUrl(e.target.value)}
										placeholder="https://exemplo.com/foto.jpg"
									/>
								</div>

								<Button variant="ghost" onClick={() => setProfilePictureUrl("")}>Remover avatar</Button>
							</div>

							{/* Right: form */}
							<div className="md:col-span-2">
								<div className="flex flex-col gap-4">
									<div>
										<label className="block text-sm mb-1">Nome de exibição</label>
										<Input 
											value={displayName} 
											onChange={(e) => setDisplayName(e.target.value)}
											placeholder="Como você quer ser chamado"
										/>
										<p className="text-xs text-muted-foreground mt-1">
											Este nome será exibido na sua página pública
										</p>
									</div>

									<div>
										<label className="block text-sm mb-1">Biografia curta</label>
										<textarea
											value={bio}
											onChange={(e) => setBio(e.target.value)}
											className="w-full rounded-md border px-3 py-2 resize-none min-h-[96px]"
											placeholder="Conte um pouco sobre você..."
										/>
										<p className="text-xs text-muted-foreground mt-1">
											Uma breve descrição sobre você ou seu trabalho
										</p>
									</div>

									<div>
										<label className="block text-sm mb-1">Link público</label>
										<div className="flex gap-2">
											<Input 
												value={`${window.location.origin}/public/${user?.username || ""}`}
												readOnly
												className="bg-muted"
											/>
											<Button variant="outline" onClick={copyPublicLink}>
												Copiar link
											</Button>
										</div>
										<p className="text-xs text-muted-foreground mt-1">
											Este é o link que você pode compartilhar com outras pessoas
										</p>
									</div>

									<div className="flex gap-3 pt-2">
										<Button onClick={handleSave} disabled={saving}>
											{saving ? "Salvando..." : "Salvar perfil"}
										</Button>
										<Button variant="ghost" onClick={handlePreview}>
											Visualizar página pública
										</Button>
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

