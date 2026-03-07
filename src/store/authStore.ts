import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    userId: string | null;
    setAuth: (token: string, userId: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            userId: null,
            setAuth: (token, userId) => set({ token, userId }),
            logout: () => {
                // Clear in-memory state
                set({ token: null, userId: null });
                // Also remove persisted storage so it doesn't rehydrate
                try {
                    localStorage.removeItem('auth-storage');
                } catch (e) {
                    // ignore
                }
            },
            isAuthenticated: () => !!get().token,
        }),
        {
            name: 'auth-storage',
        }
    )
);
