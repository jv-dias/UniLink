import React from 'react';
import { useParams } from 'react-router-dom';
import { linksService } from '@/lib/linksService';
import { LinkButton } from '@/components/link-button';

export default function PublicProfile() {
  const { username } = useParams();
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    if (!username) return;
    linksService.getByUsername(username).then(setData);
  }, [username]);

  if (!data) return <div className="p-6">Carregando...</div>;

  const { profile, links } = data;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground">{profile.bio}</p>
        </div>

        <div className="mt-6 space-y-3">
          {links.map((l: any) => (
            <LinkButton key={l.id} title={l.title} url={l.url} />
          ))}
        </div>

        <footer className="mt-8 text-sm text-muted-foreground">UniLink - Faculdade Exemplo</footer>
      </div>
    </div>
  );
}
