import api from '@/lib/api';

export const tarotService = {
    async getDecks() {
        const response = await api.get('/tarot/decks');
        return response.data;
    },

    async getDeckBySlug(slug: string) {
        const response = await api.get(`/tarot/decks/${slug}`);
        return response.data;
    },

    async createReading(data: { deckSlug: string; spreadType: string; question?: string }) {
        const response = await api.post('/tarot/readings', data);
        return response.data;
    },

    async getReadingHistory() {
        const response = await api.get('/tarot/readings/history');
        return response.data;
    }
};
