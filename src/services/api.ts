import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.warn('VITE_API_URL is not set. API calls will fail.');
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses — auto-logout on expired tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const { logout, token } = useAuthStore.getState();
            if (token) {
                // Only toast and logout if there actually WAS a token (prevents spam for guests)
                logout();
                toast.error("Your session has expired. Log in again to save to the cloud.");
            }
        }
        return Promise.reject(error);
    }
);

export default api;
