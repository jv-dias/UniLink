import { apiClient } from '@/shared/api/client';
import type { LinkDto, CreateLinkDto, UpdateLinkDto } from '@/shared/types';

export const linksService = {
  async getAll(): Promise<LinkDto[]> {
    return apiClient.get<LinkDto[]>('/links');
  },

  async create(data: CreateLinkDto): Promise<LinkDto> {
    return apiClient.post<LinkDto>('/links', data);
  },

  async update(id: number, data: UpdateLinkDto): Promise<void> {
    return apiClient.put<void>(`/links/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/links/${id}`);
  },

  async reorder(links: LinkDto[]): Promise<void> {
    // Update positions sequentially
    const updates = links.map((link) => {
      return this.update(link.id, {
        title: link.title,
        url: link.url,
        isActive: link.isActive,
      });
    });
    await Promise.all(updates);
  },
};
