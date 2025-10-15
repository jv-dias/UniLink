import React from 'react';
import { useParams } from 'react-router-dom';
import { profileService } from '@/features/public-profile/services/profileService';
import { LinkButton } from '@/components/link-button';
import type { PublicProfileDto } from '@/shared/types';

export default function PublicProfile() {
	const { username } = useParams();
	const [data, setData] = React.useState<PublicProfileDto | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		async function loadProfile() {
			if (!username) {
				setError('Nome de usuário não fornecido');
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);
				const profileData = await profileService.getByUsername(username);
				setData(profileData);
			} catch (err: any) {
				console.error('Erro ao carregar perfil:', err);
				setError(err.message || 'Perfil não encontrado');
			} finally {
				setLoading(false);
			}
		}

		loadProfile();
	}, [username]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center">
					<div className="text-lg">Carregando...</div>
				</div>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background p-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-2">Perfil não encontrado</h1>
					<p className="text-muted-foreground">{error || 'O perfil que você está procurando não existe.'}</p>
				</div>
			</div>
		);
	}

	// Filter only active links
	const activeLinks = data.links.filter(link => link.isActive);

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-6">
			<div className="w-full max-w-md text-center">
				<div className="flex flex-col items-center gap-4">
					{data.profilePictureUrl ? (
						<div className="w-28 h-28 rounded-full overflow-hidden bg-muted flex items-center justify-center">
							<img 
								src={data.profilePictureUrl} 
								alt={data.displayName || data.username} 
								className="w-full h-full object-cover" 
							/>
						</div>
					) : (
						<div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center">
							<span className="text-4xl font-bold text-muted-foreground">
								{(data.displayName || data.username).charAt(0).toUpperCase()}
							</span>
						</div>
					)}
					<h1 className="text-2xl font-bold">{data.displayName || data.username}</h1>
					{data.bio && <p className="text-muted-foreground">{data.bio}</p>}
				</div>

				<div className="mt-6 space-y-3">
					{activeLinks.length > 0 ? (
						activeLinks.map((link) => (
							<LinkButton key={link.id} title={link.title} url={link.url} />
						))
					) : (
						<p className="text-muted-foreground">Nenhum link disponível</p>
					)}
				</div>

				<footer className="mt-8 text-sm text-muted-foreground">
					UniLink - Conectando você ao mundo
				</footer>
			</div>
		</div>
	);
}

