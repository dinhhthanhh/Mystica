import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export const authService = {
    async login(data: any) {
        const response = await api.post('/auth/login', data);
        const { user, accessToken, refreshToken } = response.data;
        localStorage.setItem('refreshToken', refreshToken);
        useAuthStore.getState().setAuth(user, accessToken);
        return response.data;
    },

    async register(data: any) {
        const response = await api.post('/auth/register', data);
        const { user, accessToken, refreshToken } = response.data;
        localStorage.setItem('refreshToken', refreshToken);
        useAuthStore.getState().setAuth(user, accessToken);
        return response.data;
    },

    async logout() {
        try {
            await api.post('/auth/logout');
        } finally {
            useAuthStore.getState().logout();
        }
    },

    async getMe() {
        const response = await api.get('/auth/me');
        useAuthStore.getState().setUser(response.data);
        return response.data;
    },

    setTokens(accessToken: string, refreshToken: string) {
        localStorage.setItem('refreshToken', refreshToken);
        useAuthStore.getState().setAuth(null, accessToken); // User will be fetched next
    }
};
