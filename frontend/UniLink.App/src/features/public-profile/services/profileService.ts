import { apiClient } from '@/shared/api/client';
import type { PublicProfileDto } from '@/shared/types';

/**
 * Profile Service
 * Handles fetching public profile data by username
 * Note: This endpoint does not require authentication
 */
export const profileService = {
  /**
   * Get public profile by username
   * @param username - The username to fetch
   * @returns Public profile data with links
   */
  async getByUsername(username: string): Promise<PublicProfileDto> {
    // The API endpoint is /api/Profile/{username}
    const response = await apiClient.get<PublicProfileDto>(`/Profile/${username}`);
    return response;
  },
};
