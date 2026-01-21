import api from './api';

/**
 * Service pour les questions produits (côté client)
 */
const productQuestionService = {
    /**
     * Poser une question sur un produit
     */
    createQuestion: async (productId, subject, message) => {
        try {
            const response = await api.post(`/products/${productId}/questions`, {
                subject,
                message
            });
            return response;
        } catch (error) {
            console.error('Erreur createQuestion:', error);
            throw error;
        }
    },

    /**
     * Obtenir les questions publiques d'un produit
     */
    getProductQuestions: async (productId, params = {}) => {
        try {
            const response = await api.get(`/products/${productId}/questions`, { params });
            return response;
        } catch (error) {
            console.error('Erreur getProductQuestions:', error);
            throw error;
        }
    },

    /**
     * Obtenir mes questions (client)
     */
    getMyQuestions: async (params = {}) => {
        try {
            const response = await api.get('/users/product-questions', { params });
            return response;
        } catch (error) {
            console.error('Erreur getMyQuestions:', error);
            throw error;
        }
    },

    /**
     * Obtenir une question spécifique
     */
    getQuestion: async (questionId) => {
        try {
            const response = await api.get(`/product-questions/${questionId}`);
            return response;
        } catch (error) {
            console.error('Erreur getQuestion:', error);
            throw error;
        }
    },

    /**
     * Répondre à une question
     */
    replyToQuestion: async (questionId, message) => {
        try {
            const response = await api.post(`/product-questions/${questionId}/reply`, { message });
            return response;
        } catch (error) {
            console.error('Erreur replyToQuestion:', error);
            throw error;
        }
    },

    /**
     * Fermer une question
     */
    closeQuestion: async (questionId) => {
        try {
            const response = await api.put(`/product-questions/${questionId}/close`);
            return response;
        } catch (error) {
            console.error('Erreur closeQuestion:', error);
            throw error;
        }
    }
};

export default productQuestionService;
