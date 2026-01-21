import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

/**
 * Composant pour protéger les routes par authentification et rôles
 * @param {ReactNode} children - Composant enfant à afficher si autorisé
 * @param {Array} allowedRoles - Rôles autorisés à accéder à cette route
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Vérification...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers login si non authentifié
  if (!isAuthenticated) {
    toast.warning('Veuillez vous connecter pour accéder à cette page', {
      position: 'top-center',
      autoClose: 3000,
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les rôles si spécifiés
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    toast.error('Accès non autorisé. Vous n\'avez pas les permissions nécessaires.', {
      position: 'top-center',
      autoClose: 4000,
    });
    return <Navigate to="/" replace />;
  }

  // Rendre le composant enfant si tout est OK
  return children;
};

export default ProtectedRoute;
