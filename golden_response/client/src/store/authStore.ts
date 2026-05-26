import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';
import type { ApiSuccess } from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  restaurantId?: string;
  addresses?: Address[];
  favoriteRestaurants?: Restaurant[];
}

export interface Address {
  _id?: string;
  label: string;
  building: string;
  floor: string;
  officeName: string;
  street: string;
  city: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface Restaurant {
  _id: string;
  name: string;
  slug: string;
  image: string;
  rating: number;
  cuisine: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post<unknown, ApiSuccess<{ user: User; token: string }>>('/auth/login', { email, password });
          localStorage.setItem('token', res.data.token);
          set({ user: res.data.user, token: res.data.token, isLoading: false });
        } catch (e) {
          set({ isLoading: false });
          throw e;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await api.post<unknown, ApiSuccess<{ user: User; token: string }>>('/auth/register', data);
          localStorage.setItem('token', res.data.token);
          set({ user: res.data.user, token: res.data.token, isLoading: false });
        } catch (e) {
          set({ isLoading: false });
          throw e;
        }
      },

      logout: async () => {
        try { await api.post('/auth/logout'); } catch { /* ignore */ }
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        const token = get().token || localStorage.getItem('token');
        if (!token) return;
        try {
          const res = await api.get<unknown, ApiSuccess<{ user: User }>>('/auth/me');
          set({ user: res.data.user });
        } catch {
          localStorage.removeItem('token');
          set({ user: null, token: null });
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({ token: s.token, user: s.user }),
    }
  )
);
