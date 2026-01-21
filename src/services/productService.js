import { apiService, endpoints } from './api';

class ProductService {
  // Obtenir la liste des produits avec filtres et pagination
  async getProducts(filters = {}, page = 1, limit = 20) {
    try {
      const params = {
        page,
        limit,
        ...filters
      };

      const response = await apiService.get(endpoints.products.list, { params });
      return {
        success: true,
        data: response.products,
        pagination: response.pagination,
        total: response.total
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors du chargement des produits',
        data: [],
        pagination: {},
        total: 0
      };
    }
  }

  // Obtenir les détails d'un produit
  async getProduct(id) {
    try {
      const response = await apiService.get(endpoints.products.detail(id));
      return {
        success: true,
        data: response.product
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Produit introuvable',
        data: null
      };
    }
  }

  // Rechercher des produits
  async searchProducts(query, filters = {}, page = 1, limit = 20) {
    try {
      const params = {
        q: query,
        page,
        limit,
        ...filters
      };

      const response = await apiService.get(endpoints.search.products, { params });
      return {
        success: true,
        data: response.products,
        pagination: response.pagination,
        total: response.total,
        suggestions: response.suggestions
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors de la recherche',
        data: [],
        pagination: {},
        total: 0,
        suggestions: []
      };
    }
  }

  // Obtenir les catégories
  async getCategories() {
    try {
      const response = await apiService.get(endpoints.products.categories);
      return {
        success: true,
        data: response.categories
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors du chargement des catégories',
        data: []
      };
    }
  }

  // Obtenir les produits en vedette
  async getFeaturedProducts(limit = 8) {
    try {
      const response = await apiService.get(endpoints.products.featured, {
        params: { limit }
      });
      return {
        success: true,
        data: response.products
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors du chargement des produits vedette',
        data: []
      };
    }
  }

  // Obtenir les meilleures ventes
  async getBestsellers(limit = 8) {
    try {
      const response = await apiService.get(endpoints.products.bestsellers, {
        params: { limit }
      });
      return {
        success: true,
        data: response.products
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors du chargement des meilleures ventes',
        data: []
      };
    }
  }

  // Obtenir les avis d'un produit
  async getProductReviews(productId, page = 1, limit = 10) {
    try {
      const response = await apiService.get(endpoints.products.reviews(productId), {
        params: { page, limit }
      });
      return {
        success: true,
        data: response.reviews,
        pagination: response.pagination,
        stats: response.stats
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors du chargement des avis',
        data: [],
        pagination: {},
        stats: {}
      };
    }
  }

  // Ajouter un avis
  async addReview(productId, reviewData) {
    try {
      const response = await apiService.post(endpoints.products.reviews(productId), reviewData);
      return {
        success: true,
        data: response.review,
        message: 'Avis ajouté avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors de l\'ajout de l\'avis'
      };
    }
  }

  // Obtenir les produits similaires
  async getSimilarProducts(productId, limit = 4) {
    try {
      const response = await apiService.get(`${endpoints.products.detail(productId)}/similar`, {
        params: { limit }
      });
      return {
        success: true,
        data: response.products
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors du chargement des produits similaires',
        data: []
      };
    }
  }

  // Obtenir les suggestions de recherche
  async getSearchSuggestions(query) {
    try {
      const response = await apiService.get(endpoints.search.suggestions, {
        params: { q: query }
      });
      return {
        success: true,
        data: response.suggestions
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Obtenir les recherches populaires
  async getPopularSearches() {
    try {
      const response = await apiService.get(endpoints.search.popular);
      return {
        success: true,
        data: response.searches
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Signaler un produit
  async reportProduct(productId, reason, details = '') {
    try {
      await apiService.post(`${endpoints.products.detail(productId)}/report`, {
        reason,
        details
      });
      return {
        success: true,
        message: 'Signalement envoyé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors du signalement'
      };
    }
  }

  // Ajouter/retirer des favoris
  async toggleWishlist(productId) {
    try {
      const response = await apiService.post(`${endpoints.products.detail(productId)}/wishlist`);
      return {
        success: true,
        isInWishlist: response.isInWishlist,
        message: response.isInWishlist ? 'Ajouté aux favoris' : 'Retiré des favoris'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors de la modification des favoris'
      };
    }
  }

  // Obtenir les filtres disponibles pour une catégorie
  async getCategoryFilters(categoryId) {
    try {
      const response = await apiService.get(`${endpoints.products.categories}/${categoryId}/filters`);
      return {
        success: true,
        data: response.filters
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: {}
      };
    }
  }

  // Comparer des produits
  async compareProducts(productIds) {
    try {
      const response = await apiService.post(`${endpoints.products.list}/compare`, {
        productIds
      });
      return {
        success: true,
        data: response.comparison
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors de la comparaison',
        data: null
      };
    }
  }

  // Obtenir l'historique des prix
  async getPriceHistory(productId) {
    try {
      const response = await apiService.get(`${endpoints.products.detail(productId)}/price-history`);
      return {
        success: true,
        data: response.history
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }
}

export const productService = new ProductService();