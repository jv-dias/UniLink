import { apiClient } from '@/shared/api/client';
import type { PublicProfileDto, UserProfileDto, UpdateProfileDto } from '@/shared/types';

/**
 * Profile Service
 * Handles fetching and updating profile data
 */
export const profileService = {
  /**
   * Get public profile by username (no auth required)
   * @param username - The username to fetch
   * @returns Public profile data with links
   */
  async getByUsername(username: string): Promise<PublicProfileDto> {
    const response = await apiClient.get<PublicProfileDto>(`/Profile/${username}`);
    return response;
  },

  /**
   * Get current user's profile (requires auth)
   * @returns User's profile data
   */
  async getMyProfile(): Promise<UserProfileDto> {
    const response = await apiClient.get<UserProfileDto>('/Profile/me');
    return response;
  },

  /**
   * Update current user's profile (requires auth)
   * @param data - Profile data to update
   */
  async updateMyProfile(data: UpdateProfileDto): Promise<void> {
    await apiClient.put('/Profile/me', data);
  },
};
