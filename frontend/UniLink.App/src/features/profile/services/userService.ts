import { apiClient } from '@/shared/api/client';
import type { UpdateUserDto, Page } from '@/shared/types';

export const userService = {
  async updateUser(id: number, data: UpdateUserDto): Promise<void> {
    return apiClient.put<void>(`/users/${id}`, data);
  },

  async deleteUser(id: number): Promise<void> {
    return apiClient.delete<void>(`/users/${id}`);
  },

  // Page/Profile methods (if you have endpoints for pages)
  async getPage(userId: number): Promise<Page | null> {
    try {
      return await apiClient.get<Page>(`/pages/${userId}`);
    } catch {
      return null;
    }
  },

  async updatePage(userId: number, data: Partial<Page>): Promise<void> {
    return apiClient.put<void>(`/pages/${userId}`, data);
  },
};

// Legacy compatibility - keep existing localStorage-based profile methods
// for features that don't have backend endpoints yet
interface LocalProfile {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  theme: string;
  username: string;
}

const STORAGE_KEY = 'user_profile';

const defaultProfile: LocalProfile = {
  name: 'Gabriel Barros',
  email: 'gabriel@exemplo.com',
  bio: 'Estudante e criador de conteúdo',
  avatar: '/avatars/user.jpg',
  theme: 'padrão',
  username: 'gabriel',
};

export const localProfileService = {
  async getProfile(): Promise<LocalProfile> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return { ...defaultProfile };
  },

  async updateProfile(data: Partial<LocalProfile>): Promise<void> {
    const current = await this.getProfile();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
};
