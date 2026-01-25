// Service pour gérer les produits en vedette (slider Hero)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper pour les headers avec authentification
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Récupérer les produits en vedette (public)
export const getFeaturedProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/featured-products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la récupération des produits en vedette');
    }

    return data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// Admin: Récupérer tous les produits en vedette
export const getAllFeaturedProducts = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/featured-products/admin?${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la récupération des produits');
    }

    return data;
  } catch (error) {
    console.error('Error fetching all featured products:', error);
    throw error;
  }
};

// Admin: Récupérer un produit par ID
export const getFeaturedProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/featured-products/admin/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Produit non trouvé');
    }

    return data;
  } catch (error) {
    console.error('Error fetching featured product:', error);
    throw error;
  }
};

// Admin: Créer un produit en vedette
export const createFeaturedProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/featured-products/admin`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la création du produit');
    }

    return data;
  } catch (error) {
    console.error('Error creating featured product:', error);
    throw error;
  }
};

// Admin: Mettre à jour un produit en vedette
export const updateFeaturedProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/featured-products/admin/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la mise à jour du produit');
    }

    return data;
  } catch (error) {
    console.error('Error updating featured product:', error);
    throw error;
  }
};

// Admin: Supprimer un produit en vedette
export const deleteFeaturedProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/featured-products/admin/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la suppression du produit');
    }

    return data;
  } catch (error) {
    console.error('Error deleting featured product:', error);
    throw error;
  }
};

// Admin: Activer/Désactiver un produit
export const toggleFeaturedProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/featured-products/admin/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors du changement de statut');
    }

    return data;
  } catch (error) {
    console.error('Error toggling featured product:', error);
    throw error;
  }
};

// Admin: Réorganiser l'ordre des produits
export const reorderFeaturedProducts = async (products) => {
  try {
    const response = await fetch(`${API_BASE_URL}/featured-products/admin/reorder`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ products })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la réorganisation');
    }

    return data;
  } catch (error) {
    console.error('Error reordering featured products:', error);
    throw error;
  }
};

const featuredProductService = {
  getFeaturedProducts,
  getAllFeaturedProducts,
  getFeaturedProductById,
  createFeaturedProduct,
  updateFeaturedProduct,
  deleteFeaturedProduct,
  toggleFeaturedProduct,
  reorderFeaturedProducts
};

export default featuredProductService;
