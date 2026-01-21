import { toast } from 'react-toastify';

/**
 * Classe pour gérer les erreurs de manière centralisée
 */
export class ErrorHandler {
  /**
   * Gère les erreurs API
   */
  static handleApiError(error, options = {}) {
    const {
      showToast = true,
      logToConsole = true,
      customMessage = null,
      onError = null,
    } = options;

    // Log en console si activé
    if (logToConsole) {
      console.error('API Error:', error);
    }

    // Déterminer le message d'erreur
    let errorMessage = customMessage || this.getErrorMessage(error);

    // Afficher une notification toast si activé
    if (showToast) {
      this.showErrorToast(errorMessage, error.status);
    }

    // Callback personnalisé
    if (onError && typeof onError === 'function') {
      onError(error);
    }

    // Sauvegarder l'erreur pour analytics
    this.logError(error);

    return {
      message: errorMessage,
      status: error.status,
      data: error.data,
    };
  }

  /**
   * Obtenir le message d'erreur approprié
   */
  static getErrorMessage(error) {
    if (!error) return 'Une erreur inconnue s\'est produite';

    // Erreurs réseau
    if (error.status === 0 || error.message === 'Erreur de connexion') {
      return 'Impossible de se connecter au serveur. Vérifiez votre connexion Internet.';
    }

    // Erreurs d'authentification
    if (error.status === 401) {
      return 'Votre session a expiré. Veuillez vous reconnecter.';
    }

    // Erreurs de permission
    if (error.status === 403) {
      return 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.';
    }

    // Ressource non trouvée
    if (error.status === 404) {
      return 'La ressource demandée n\'a pas été trouvée.';
    }

    // Erreurs de validation
    if (error.status === 400) {
      if (error.data?.errors && Array.isArray(error.data.errors)) {
        return error.data.errors.join(', ');
      }
      return error.data?.message || 'Données invalides. Veuillez vérifier vos informations.';
    }

    // Erreurs de conflit
    if (error.status === 409) {
      return error.data?.message || 'Cette ressource existe déjà.';
    }

    // Erreurs serveur
    if (error.status >= 500) {
      return 'Le serveur rencontre des difficultés. Veuillez réessayer plus tard.';
    }

    // Rate limiting
    if (error.status === 429) {
      return 'Trop de requêtes. Veuillez patienter avant de réessayer.';
    }

    // Message personnalisé de l'API
    if (error.data?.message) {
      return error.data.message;
    }

    // Message par défaut
    return error.message || 'Une erreur s\'est produite. Veuillez réessayer.';
  }

  /**
   * Afficher une notification toast
   */
  static showErrorToast(message, status) {
    const toastConfig = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    if (status >= 500) {
      toast.error(message, { ...toastConfig, autoClose: 7000 });
    } else if (status === 401) {
      toast.warning(message, toastConfig);
    } else {
      toast.error(message, toastConfig);
    }
  }

  /**
   * Logger l'erreur pour analytics
   */
  static logError(error) {
    try {
      const errorLog = {
        message: error.message,
        status: error.status,
        data: error.data,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      // Sauvegarder dans localStorage
      const existingLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      existingLogs.push(errorLog);
      
      // Garder seulement les 50 derniers logs
      const recentLogs = existingLogs.slice(-50);
      localStorage.setItem('error_logs', JSON.stringify(recentLogs));

      // Vous pouvez aussi envoyer à un service d'analytics ici
      // analytics.trackError(errorLog);
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }

  /**
   * Gère les erreurs de validation de formulaire
   */
  static handleValidationError(errors, setFieldError) {
    if (Array.isArray(errors)) {
      errors.forEach(error => {
        if (typeof error === 'string') {
          toast.error(error);
        } else if (error.field && error.message) {
          if (setFieldError) {
            setFieldError(error.field, error.message);
          }
          toast.error(`${error.field}: ${error.message}`);
        }
      });
    } else if (typeof errors === 'object') {
      Object.keys(errors).forEach(field => {
        const message = errors[field];
        if (setFieldError) {
          setFieldError(field, message);
        }
        toast.error(`${field}: ${message}`);
      });
    } else {
      toast.error(errors.toString());
    }
  }

  /**
   * Créer un wrapper pour les appels async avec gestion d'erreur
   */
  static async withErrorHandling(asyncFunction, options = {}) {
    try {
      return await asyncFunction();
    } catch (error) {
      this.handleApiError(error, options);
      throw error;
    }
  }

  /**
   * Obtenir les logs d'erreur
   */
  static getErrorLogs() {
    try {
      return JSON.parse(localStorage.getItem('error_logs') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Effacer les logs d'erreur
   */
  static clearErrorLogs() {
    localStorage.removeItem('error_logs');
  }

  /**
   * Exporter les logs d'erreur
   */
  static exportErrorLogs() {
    const logs = this.getErrorLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-logs-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

/**
 * Hook personnalisé pour gérer les erreurs
 */
export const useErrorHandler = () => {
  const handleError = (error, options = {}) => {
    return ErrorHandler.handleApiError(error, options);
  };

  const handleValidationError = (errors, setFieldError) => {
    return ErrorHandler.handleValidationError(errors, setFieldError);
  };

  return {
    handleError,
    handleValidationError,
    getErrorLogs: ErrorHandler.getErrorLogs,
    clearErrorLogs: ErrorHandler.clearErrorLogs,
    exportErrorLogs: ErrorHandler.exportErrorLogs,
  };
};

export default ErrorHandler;
