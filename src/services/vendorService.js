import api from './api';

/**
 * Service pour les opérations vendeur
 * Note: api.get/post/put/delete returns parsed JSON directly (not axios-style response.data)
 */
const vendorService = {
  /**
   * Récupérer les données du dashboard
   */
  getDashboard: async () => {
    try {
      const response = await api.get('/vendor/dashboard');
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur getDashboard:', error);
      throw error;
    }
  },

  /**
   * Récupérer tous les produits du vendeur
   */
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/vendor/products', { params });
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur getProducts:', error);
      throw error;
    }
  },

  /**
   * Créer un nouveau produit
   */
  createProduct: async (productData) => {
    try {
      const response = await api.post('/vendor/products', productData);
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur createProduct:', error);
      throw error;
    }
  },

  /**
   * Import bulk de produits (CSV)
   */
  bulkImportProducts: async (products) => {
    try {
      const response = await api.post('/vendor/products/bulk', { products });
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur bulkImportProducts:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un produit
   */
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/vendor/products/${productId}`, productData);
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur updateProduct:', error);
      throw error;
    }
  },

  /**
   * Supprimer un produit
   */
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/vendor/products/${productId}`);
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur deleteProduct:', error);
      throw error;
    }
  },

  /**
   * Récupérer toutes les commandes
   */
  getOrders: async (params = {}) => {
    try {
      const response = await api.get('/vendor/orders', { params });
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur getOrders:', error);
      throw error;
    }
  },

  /**
   * Récupérer les détails d'une commande
   */
  getOrderDetails: async (orderId) => {
    try {
      const response = await api.get(`/vendor/orders/${orderId}`);
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur getOrderDetails:', error);
      throw error;
    }
  },

  /**
   * Confirmer une commande
   */
  confirmOrder: async (orderId) => {
    try {
      const response = await api.put(`/vendor/orders/${orderId}/confirm`);
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur confirmOrder:', error);
      throw error;
    }
  },

  /**
   * Annuler une commande
   */
  cancelOrder: async (orderId, reason) => {
    try {
      const response = await api.put(`/vendor/orders/${orderId}/cancel`, { reason });
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur cancelOrder:', error);
      throw error;
    }
  },

  /**
   * Marquer une commande comme expédiée
   */
  shipOrder: async (orderId, shippingData) => {
    try {
      const response = await api.put(`/vendor/orders/${orderId}/ship`, shippingData);
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur shipOrder:', error);
      throw error;
    }
  },

  /**
   * Récupérer les analytics
   */
  getAnalytics: async (period = 'month') => {
    try {
      const response = await api.get('/vendor/analytics', {
        params: { period }
      });
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur getAnalytics:', error);
      throw error;
    }
  },

  /**
   * Upload d'images de produit
   */
  uploadProductImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post('/vendor/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur uploadProductImages:', error);
      throw error;
    }
  },

  // ============== COUPONS ==============

  /**
   * Récupérer tous les coupons du vendeur
   */
  getCoupons: async (params = {}) => {
    try {
      const response = await api.get('/vendor/coupons', { params });
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur getCoupons:', error);
      throw error;
    }
  },

  /**
   * Récupérer un coupon par ID
   */
  getCouponById: async (couponId) => {
    try {
      const response = await api.get(`/vendor/coupons/${couponId}`);
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur getCouponById:', error);
      throw error;
    }
  },

  /**
   * Créer un coupon
   */
  createCoupon: async (couponData) => {
    try {
      const response = await api.post('/vendor/coupons', couponData);
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur createCoupon:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un coupon
   */
  updateCoupon: async (couponId, couponData) => {
    try {
      const response = await api.put(`/vendor/coupons/${couponId}`, couponData);
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur updateCoupon:', error);
      throw error;
    }
  },

  /**
   * Supprimer un coupon
   */
  deleteCoupon: async (couponId) => {
    try {
      const response = await api.delete(`/vendor/coupons/${couponId}`);
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur deleteCoupon:', error);
      throw error;
    }
  },

  /**
   * Activer/Désactiver un coupon
   */
  toggleCouponStatus: async (couponId) => {
    try {
      const response = await api.put(`/vendor/coupons/${couponId}/toggle`);
      return response; // api returns parsed JSON directly
    } catch (error) {
      console.error('Erreur toggleCouponStatus:', error);
      throw error;
    }
  },

  // ============== PRODUCT QUESTIONS ==============

  /**
   * Récupérer les questions pour le vendeur
   */
  getProductQuestions: async (params = {}) => {
    try {
      const response = await api.get('/vendor/product-questions', { params });
      return response;
    } catch (error) {
      console.error('Erreur getProductQuestions:', error);
      throw error;
    }
  },

  /**
   * Récupérer une question spécifique
   */
  getProductQuestion: async (questionId) => {
    try {
      const response = await api.get(`/product-questions/${questionId}`);
      return response;
    } catch (error) {
      console.error('Erreur getProductQuestion:', error);
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
  }
};

export default vendorService;
