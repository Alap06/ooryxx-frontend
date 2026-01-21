import { apiService, endpoints } from './api';

class AuthService {
  // Connexion
  async login(email, password) {
    try {
      const response = await apiService.post(endpoints.auth.login, {
        email,
        password
      });

      if (response.token) {
        apiService.setAuthToken(response.token);
        return {
          success: true,
          token: response.token,
          user: response.user
        };
      }

      return { success: false, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Erreur de connexion' 
      };
    }
  }

  // Inscription
  async register(userData) {
    try {
      const response = await apiService.post(endpoints.auth.register, userData);

      if (response.token) {
        apiService.setAuthToken(response.token);
        return {
          success: true,
          token: response.token,
          user: response.user
        };
      }

      return { success: false, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Erreur d\'inscription' 
      };
    }
  }

  // Récupérer l'utilisateur actuel
  async getCurrentUser() {
    try {
      const response = await apiService.get(endpoints.auth.profile);
      return response.user;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la récupération du profil');
    }
  }

  // Mettre à jour le profil
  async updateProfile(profileData) {
    try {
      const response = await apiService.put(endpoints.users.update, profileData);
      
      return {
        success: true,
        user: response.user
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Erreur de mise à jour' 
      };
    }
  }

  // Mot de passe oublié
  async forgotPassword(email) {
    try {
      const response = await apiService.post(endpoints.auth.forgotPassword, { email });
      
      return {
        success: true,
        message: response.message || 'Email de réinitialisation envoyé'
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Erreur lors de l\'envoi de l\'email' 
      };
    }
  }

  // Réinitialiser le mot de passe
  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post(endpoints.auth.resetPassword, {
        token,
        password: newPassword
      });
      
      return {
        success: true,
        message: response.message || 'Mot de passe réinitialisé avec succès'
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Erreur lors de la réinitialisation' 
      };
    }
  }

  // Déconnexion
  async logout() {
    try {
      await apiService.post(endpoints.auth.logout);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      apiService.setAuthToken(null);
    }
  }

  // Rafraîchir le token
  async refreshToken() {
    try {
      const response = await apiService.post(endpoints.auth.refresh);
      
      if (response.token) {
        apiService.setAuthToken(response.token);
        return {
          success: true,
          token: response.token
        };
      }

      return { success: false };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export const authService = new AuthService();