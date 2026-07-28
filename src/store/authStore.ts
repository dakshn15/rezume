import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

interface AuthState {
    token: string | null;
    userId: string | null;
    userName: string | null;
    userEmail: string | null;
    setAuth: (token: string, userId: string, userName?: string, userEmail?: string) => void;
    fetchUserProfile: () => Promise<void>;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            userId: null,
            userName: null,
            userEmail: null,
            setAuth: (token, userId, userName, userEmail) => set({
                token,
                userId,
                userName: userName || null,
                userEmail: userEmail || null,
            }),
            fetchUserProfile: async () => {
                if (!get().token) return;
                try {
                    const response = await api.get('/auth/me');
                    const { userId, name, email } = response.data;
                    set({
                        userId,
                        userName: name || null,
                        userEmail: email || null,
                    });
                } catch (e) {
                    console.error('Failed to fetch user profile:', e);
                }
            },
            logout: () => {
                // Clear in-memory state
                set({ token: null, userId: null, userName: null, userEmail: null });
                // Also remove persisted storage so it doesn't rehydrate
                try {
                    localStorage.removeItem('auth-storage');
                    localStorage.removeItem('rezumely-last-saved-resume-id');
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
