import apiService from './api';

/**
 * Service pour gérer les APIs utilisateur
 */
class UserService {
  // ==================== PROFIL ====================
  
  async getProfile() {
    return apiService.get('/users/profile');
  }

  async updateProfile(data) {
    return apiService.put('/users/profile', data);
  }

  async changePassword(currentPassword, newPassword) {
    return apiService.put('/users/profile/password', {
      currentPassword,
      newPassword
    });
  }

  // ==================== ADRESSES ====================
  
  async getAddresses() {
    return apiService.get('/users/addresses');
  }

  async addAddress(addressData) {
    return apiService.post('/users/addresses', addressData);
  }

  async updateAddress(addressId, addressData) {
    return apiService.put(`/users/addresses/${addressId}`, addressData);
  }

  async deleteAddress(addressId) {
    return apiService.delete(`/users/addresses/${addressId}`);
  }

  // ==================== PANIER ====================
  
  async getCart() {
    return apiService.get('/users/cart');
  }

  async addToCart(productId, quantity = 1, selectedVariants = {}) {
    return apiService.post('/users/cart', {
      productId,
      quantity,
      selectedVariants
    });
  }

  async updateCartItem(productId, quantity) {
    return apiService.put(`/users/cart/${productId}`, { quantity });
  }

  async removeFromCart(productId) {
    return apiService.delete(`/users/cart/${productId}`);
  }

  async clearCart() {
    return apiService.delete('/users/cart');
  }

  // ==================== WISHLIST ====================
  
  async getWishlist() {
    return apiService.get('/users/wishlist');
  }

  async addToWishlist(productId) {
    return apiService.post(`/users/wishlist/${productId}`);
  }

  async removeFromWishlist(productId) {
    return apiService.delete(`/users/wishlist/${productId}`);
  }

  // ==================== COMMANDES ====================
  
  async getOrders(status = null, page = 1, limit = 10) {
    const params = { page, limit };
    if (status) params.status = status;
    return apiService.get('/users/orders', { params });
  }

  async getOrderById(orderId) {
    return apiService.get(`/users/orders/${orderId}`);
  }

  async cancelOrder(orderId) {
    return apiService.put(`/users/orders/${orderId}/cancel`);
  }

  // ==================== STATISTIQUES ====================
  
  async getUserStats() {
    return apiService.get('/users/stats');
  }
}

const userService = new UserService();
export default userService;

