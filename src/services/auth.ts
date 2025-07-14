import apiService, { ApiResponse } from './api';
import { User } from '../types/common';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  userType: string;
  password: string;
  confirmPassword: string;
  farmName?: string;
  location?: string;
  speciality?: string;
  experience?: string;
  description?: string;
  clinicName?: string;
  specialization?: string;
  licenseNumber?: string;
  availability?: string;
  shopName?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>('/auth/login', data);
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>('/auth/register', data);
  }

  async getProfile(token: string): Promise<ApiResponse<User>> {
    return apiService.get<User>('/auth/profile', token);
  }

  async updateProfile(data: Partial<User>, token: string): Promise<ApiResponse<User>> {
    return apiService.put<User>('/auth/profile', data, token);
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>(
      '/auth/change-password',
      { currentPassword, newPassword, confirmNewPassword },
      token
    );
  }

  async uploadAvatar(formData: FormData, token: string): Promise<ApiResponse<User>> {
    return apiService.upload<User>('/auth/upload-avatar', formData, token);
  }

  // Helper methods
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  removeUser(): void {
    localStorage.removeItem('user');
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
  }
}

export const authService = new AuthService();
export default authService; 