import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../types/maxpay.types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  login: (username: string, role: 'Admin' | 'Contractor' | 'Department' | 'Dojo') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
      login: (username, role) =>
        set({
          user: { username, role, token: 'token_' + Date.now() },
          isAuthenticated: true,
        }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'maxpay_auth_storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
