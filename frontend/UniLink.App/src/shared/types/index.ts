// TypeScript types matching backend DTOs and models

// DTOs - Request types
export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateLinkDto {
  title: string;
  url: string;
}

export interface UpdateLinkDto {
  title: string;
  url: string;
  isActive: boolean;
}

export interface UpdateUserDto {
  username: string;
  email: string;
}

// DTOs - Response types
export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
}

export interface LinkDto {
  id: number;
  title: string;
  url: string;
  position: number;
  isActive: boolean;
}

// Models - Full entities
export interface User {
  id: number;
  username: string;
  email: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
}

export interface Link {
  id: number;
  userId: number;
  title: string;
  url: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  userId: number;
  displayName?: string;
  bio?: string;
  profilePictureUrl?: string;
}

// Public Profile Response
export interface PublicProfileDto {
  username: string;
  displayName: string;
  bio: string;
  profilePictureUrl: string;
  links: LinkDto[];
}

// User Profile (for authenticated user)
export interface UserProfileDto {
  displayName: string;
  bio: string;
  profilePictureUrl: string;
}

export interface UpdateProfileDto {
  displayName: string;
  bio: string;
  profilePictureUrl: string;
}

// Auth context state
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  plan: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}
