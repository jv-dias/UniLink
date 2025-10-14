import { apiClient } from '@/shared/api/client';
import type { LoginDto, LoginResponse, RegisterDto, RegisterResponse } from '@/shared/types';

// Decode JWT to extract user info
function decodeToken(token: string): { id: number; username: string } | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      id: parseInt(decoded.id),
      username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.username,
    };
  } catch {
    return null;
  }
}

export const authService = {
  async register(data: RegisterDto): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response;
  },

  async login(data: LoginDto): Promise<{ token: string; user: { id: number; username: string } }> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    
    // Store token
    apiClient.setToken(response.token);
    
    // Decode token to get user info
    const userInfo = decodeToken(response.token);
    
    if (!userInfo) {
      throw new Error('Token inválido');
    }

    return {
      token: response.token,
      user: userInfo,
    };
  },

  logout(): void {
    apiClient.clearToken();
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  getCurrentUser(): { id: number; username: string } | null {
    const token = this.getToken();
    if (!token) return null;
    return decodeToken(token);
  },
};
