import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authApi } from '../api/auth';
import type { User } from '../types/user';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('adminToken'));
  const isAuthenticated = ref<boolean>(!!token.value);

  async function login(email: string, password: string) {
    const response = await authApi.login(email, password);

    // Verify user has admin role
    if (response.user.role !== 'admin') {
      throw new Error('Access denied. Admin privileges required.');
    }

    token.value = response.accessToken;
    user.value = response.user as User;
    isAuthenticated.value = true;
    localStorage.setItem('adminToken', response.accessToken);
  }

  function logout() {
    token.value = null;
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('adminToken');
  }

  async function loadProfile() {
    try {
      const profile = await authApi.getProfile();
      user.value = profile;
    } catch (error) {
      logout();
      throw error;
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    loadProfile,
  };
});

