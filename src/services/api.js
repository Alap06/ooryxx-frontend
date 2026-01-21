// Configuration de base pour les appels API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configuration des headers par défaut
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Classe pour gérer les erreurs API
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

// Service API principal
class ApiService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = null;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  // Définir le token d'authentification
  setAuthToken(token) {
    this.token = token;
  }

  // Obtenir les headers avec authentification
  getHeaders(customHeaders = {}) {
    const headers = { ...defaultHeaders, ...customHeaders };

    // Always get fresh token from localStorage to ensure sync
    const currentToken = this.token || localStorage.getItem('token');
    if (currentToken) {
      headers.Authorization = `Bearer ${currentToken}`;
    }

    return headers;
  }

  // Construire l'URL complète
  buildUrl(endpoint, params = {}) {
    // Ensure base URL ends without trailing slash and endpoint starts without leading slash for proper concatenation
    const base = this.baseURL.replace(/\/+$/, '');
    const path = endpoint.replace(/^\/+/, '');
    const fullUrl = `${base}/${path}`;
    const url = new URL(fullUrl);

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    return url.toString();
  }

  // Méthode générique pour les requêtes avec retry logic
  async request(method, endpoint, data = null, options = {}) {
    const { retryCount = 0 } = options;

    try {
      const { params = {}, headers: customHeaders = {}, ...fetchOptions } = options;

      const config = {
        method: method.toUpperCase(),
        headers: this.getHeaders(customHeaders),
        ...fetchOptions,
      };

      // Ajouter le body pour les requêtes POST, PUT, PATCH
      if (data && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
        if (data instanceof FormData) {
          // Pour FormData, ne pas définir Content-Type (le navigateur le fera automatiquement)
          delete config.headers['Content-Type'];
          config.body = data;
        } else {
          config.body = JSON.stringify(data);
        }
      }

      const url = this.buildUrl(endpoint, params);

      const response = await fetch(url, config);

      // Vérifier si la réponse est ok
      if (!response.ok) {
        let errorMessage = `Erreur HTTP ${response.status}`;
        let errorData = null;

        try {
          errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Si on ne peut pas parser le JSON, utiliser le statut HTTP
          errorMessage = this.getHttpErrorMessage(response.status);
        }

        throw new ApiError(errorMessage, response.status, errorData);
      }

      // Vérifier si la réponse contient du JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const jsonResponse = await response.json();
        // Retourner les données si c'est une réponse standardisée
        return jsonResponse.data !== undefined ? jsonResponse.data : jsonResponse;
      }

      return response;
    } catch (error) {
      // Retry logic pour les erreurs réseau
      if (error.status === 0 && retryCount < this.retryAttempts) {
        await this.delay(this.retryDelay * (retryCount + 1));
        return this.request(method, endpoint, data, { ...options, retryCount: retryCount + 1 });
      }

      if (error instanceof ApiError) {
        throw error;
      }

      // Erreur réseau ou autre
      throw new ApiError(
        error.message || 'Erreur de connexion au serveur',
        0,
        { originalError: error }
      );
    }
  }

  // Helper pour délai
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Messages d'erreur HTTP personnalisés
  getHttpErrorMessage(status) {
    const messages = {
      400: 'Requête invalide',
      401: 'Non authentifié',
      403: 'Accès refusé',
      404: 'Ressource non trouvée',
      409: 'Conflit de ressource',
      429: 'Trop de requêtes',
      500: 'Erreur serveur interne',
      502: 'Passerelle incorrecte',
      503: 'Service indisponible',
      504: 'Délai d\'attente de la passerelle',
    };
    return messages[status] || `Erreur HTTP ${status}`;
  }

  // Méthodes HTTP spécifiques
  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, null, options);
  }

  async post(endpoint, data = null, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  async put(endpoint, data = null, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  async patch(endpoint, data = null, options = {}) {
    return this.request('PATCH', endpoint, data, options);
  }

  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }

  // Upload de fichiers
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);

    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.post(endpoint, formData);
  }

  // Upload multiple de fichiers
  async uploadFiles(endpoint, files, additionalData = {}) {
    const formData = new FormData();

    if (Array.isArray(files)) {
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
    } else {
      formData.append('files', files);
    }

    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.post(endpoint, formData);
  }

  // Méthode pour gérer la pagination
  async getPaginated(endpoint, page = 1, limit = 20, options = {}) {
    const params = {
      page,
      limit,
      ...options.params
    };

    return this.get(endpoint, { ...options, params });
  }

  // Méthode pour les recherches
  async search(endpoint, query, filters = {}, options = {}) {
    const params = {
      q: query,
      ...filters,
      ...options.params
    };

    return this.get(endpoint, { ...options, params });
  }
}

// Instance globale du service API
const apiService = new ApiService();

// Initialiser le token depuis localStorage
const token = localStorage.getItem('token');
if (token) {
  apiService.setAuthToken(token);
}

// Intercepteur pour gérer l'authentification automatiquement
const originalRequest = apiService.request.bind(apiService);
apiService.request = async function (method, endpoint, data = null, options = {}) {
  try {
    return await originalRequest(method, endpoint, data, options);
  } catch (error) {
    // Si l'erreur est 401 (Unauthorized), supprimer le token et rediriger vers login
    // SAUF pour les routes publiques comme les produits
    if (error.status === 401) {
      const publicRoutes = ['/products', '/auth/login', '/auth/register'];
      const isPublicRoute = publicRoutes.some(route => endpoint.includes(route));

      if (!isPublicRoute) {
        localStorage.removeItem('token');
        apiService.setAuthToken(null);

        // Rediriger vers la page de connexion
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    throw error;
  }
};

// Endpoints spécifiques pour l'application
export const endpoints = {
  // Authentification
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    profile: '/auth/profile',
  },

  // Produits
  products: {
    list: '/products',
    detail: (id) => `/products/${id}`,
    search: '/products/search',
    categories: '/products/categories',
    featured: '/products/featured',
    bestsellers: '/products/bestsellers',
    sale: '/products/sale',
    reviews: (id) => `/products/${id}/reviews`,
  },

  // Panier
  cart: {
    get: '/cart',
    add: '/cart/add',
    update: '/cart/update',
    remove: '/cart/remove',
    clear: '/cart/clear',
    sync: '/cart/sync',
  },

  // Commandes
  orders: {
    list: '/orders',
    detail: (id) => `/orders/${id}`,
    create: '/orders',
    update: (id) => `/orders/${id}`,
    cancel: (id) => `/orders/${id}/cancel`,
    track: (id) => `/orders/${id}/track`,
  },

  // Utilisateurs
  users: {
    profile: '/users/profile',
    update: '/users/profile',
    addresses: '/users/addresses',
    wishlist: '/users/wishlist',
    notifications: '/users/notifications',
  },

  // Vendeurs
  vendors: {
    register: '/vendors/register',
    profile: '/vendors/profile',
    products: '/vendors/products',
    orders: '/vendors/orders',
    analytics: '/vendors/analytics',
  },

  // Administration
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    vendors: '/admin/vendors',
    products: '/admin/products',
    orders: '/admin/orders',
    analytics: '/admin/analytics',
    settings: '/admin/settings',
  },

  // Paiements
  payments: {
    methods: '/payments/methods',
    process: '/payments/process',
    verify: '/payments/verify',
    refund: '/payments/refund',
  },

  // Recherche et filtres
  search: {
    products: '/search/products',
    suggestions: '/search/suggestions',
    popular: '/search/popular',
  },

  // Notifications
  notifications: {
    list: '/notifications',
    markRead: (id) => `/notifications/${id}/read`,
    markAllRead: '/notifications/mark-all-read',
    preferences: '/notifications/preferences',
  },

  // Support
  support: {
    tickets: '/support/tickets',
    create: '/support/tickets',
    messages: (id) => `/support/tickets/${id}/messages`,
  },

  // Upload
  upload: {
    image: '/upload/image',
    images: '/upload/images',
    document: '/upload/document',
  },

  // Reclamations
  reclamations: {
    list: '/reclamations',
    my: '/reclamations/my',
    create: '/reclamations',
    detail: (id) => `/reclamations/${id}`,
    updateStatus: (id) => `/reclamations/${id}/status`,
  }
};

// Fonctions utilitaires pour les appels API fréquents
export const api = {
  // Obtenir la liste des produits avec filtres
  getProducts: (filters = {}, page = 1, limit = 20) => {
    return apiService.getPaginated(endpoints.products.list, page, limit, { params: filters });
  },

  // Rechercher des produits
  searchProducts: (query, filters = {}, page = 1, limit = 20) => {
    return apiService.search(endpoints.search.products, query, { ...filters, page, limit });
  },

  // Obtenir les détails d'un produit
  getProduct: (id) => {
    return apiService.get(endpoints.products.detail(id));
  },

  // Obtenir les avis d'un produit
  getProductReviews: (id, page = 1, limit = 10) => {
    return apiService.getPaginated(endpoints.products.reviews(id), page, limit);
  },

  // Obtenir les catégories
  getCategories: () => {
    return apiService.get(endpoints.products.categories);
  },

  // Gestion du panier
  cart: {
    get: () => apiService.get(endpoints.cart.get),
    add: (productId, quantity = 1, options = {}) =>
      apiService.post(endpoints.cart.add, { productId, quantity, options }),
    update: (itemId, quantity) =>
      apiService.put(endpoints.cart.update, { itemId, quantity }),
    remove: (itemId) =>
      apiService.delete(endpoints.cart.remove, { params: { itemId } }),
    clear: () => apiService.post(endpoints.cart.clear),
  },

  // Gestion des commandes
  orders: {
    list: (page = 1, limit = 10) =>
      apiService.getPaginated(endpoints.orders.list, page, limit),
    get: (id) => apiService.get(endpoints.orders.detail(id)),
    create: (orderData) => apiService.post(endpoints.orders.create, orderData),
    track: (id) => apiService.get(endpoints.orders.track(id)),
  },

  // Upload de fichiers
  upload: {
    image: (file, metadata = {}) =>
      apiService.uploadFile(endpoints.upload.image, file, metadata),
    images: (files, metadata = {}) =>
      apiService.uploadFiles(endpoints.upload.images, files, metadata),
  }
};

export { apiService, ApiError };
export default apiService;