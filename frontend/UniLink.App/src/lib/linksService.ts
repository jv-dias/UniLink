import type { LinkItem } from '@/components/link-form';

let storage: LinkItem[] = [
  { id: '1', title: 'Portfólio', url: 'https://example.com/portfolio', active: true },
  { id: '2', title: 'YouTube', url: 'https://youtube.com/example', active: true },
  { id: '3', title: 'Contato', url: 'mailto:contato@example.com', active: true },
];

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const linksService = {
  async getAll() {
    console.log('linksService.getAll called');
    return Promise.resolve([...storage]);
  },
  async create(data: Omit<LinkItem, 'id'>) {
    const newItem: LinkItem = { id: makeId(), ...data };
    storage = [newItem, ...storage];
    console.log('linksService.create', newItem);
    return Promise.resolve(newItem);
  },
  async update(id: string, data: Partial<LinkItem>) {
    storage = storage.map((s) => (s.id === id ? { ...s, ...data } : s));
    console.log('linksService.update', id, data);
    return Promise.resolve(storage.find((s) => s.id === id));
  },
  async delete(id: string) {
    storage = storage.filter((s) => s.id !== id);
    console.log('linksService.delete', id);
    return Promise.resolve(true);
  },
  async reorder(newList: LinkItem[]) {
    storage = [...newList];
    console.log('linksService.reorder', newList.map((l) => l.id));
    return Promise.resolve(storage);
  },
  async getByUsername(username: string) {
    console.log('linksService.getByUsername', username);
    // Mock: return profile + links for username
    const profile = {
      username,
      name: username === 'gabriel' ? 'Gabriel Barros' : username,
      bio: 'Estudante e criador de conteúdo',
      avatar: '/avatars/user.jpg',
      theme: 'padrão',
    };
    // use storage as links (in real app filter by owner)
    const links = storage.map((s) => ({ ...s }));
    return Promise.resolve({ profile, links });
  },
};
