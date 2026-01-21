import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * ProtectedRoute - Composant pour protéger les routes nécessitant une authentification
 * Redirige vers /login si l'utilisateur n'est pas connecté
 * Vérifie également les rôles pour les routes spécifiques (admin, vendor, livreur, moderator)
 */
const ProtectedRoute = ({ children, requireAuth = true, redirectTo = '/login' }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié et que la route nécessite une authentification
  if (requireAuth && !isAuthenticated) {
    // Sauvegarder l'URL actuelle pour rediriger après connexion
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si l'utilisateur est authentifié et tente d'accéder à une route publique (login/register)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Vérification des rôles pour les routes protégées
  if (isAuthenticated && user) {
    const path = location.pathname;

    // Routes Admin - uniquement pour les admins
    if (path.startsWith('/admin')) {
      if (user.role !== 'admin') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-red-50">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Accès refusé</h2>
              <p className="text-gray-600 mb-4">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
              <a href="/" className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Retour à l'accueil
              </a>
            </div>
          </div>
        );
      }
    }

    // Routes Vendor - uniquement pour les vendeurs et admins
    if (path.startsWith('/vendor')) {
      if (!['vendor', 'admin'].includes(user.role)) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-orange-50">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Espace Vendeur</h2>
              <p className="text-gray-600 mb-4">Cette section est réservée aux vendeurs approuvés.</p>
              <a href="/become-vendor" className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Devenir vendeur
              </a>
            </div>
          </div>
        );
      }
    }

    // Routes Moderator - uniquement pour les modérateurs et admins
    if (path.startsWith('/moderator')) {
      if (!['moderator', 'admin'].includes(user.role)) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-purple-50">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Espace Modérateur</h2>
              <p className="text-gray-600 mb-4">Cette section est réservée aux modérateurs.</p>
              <a href="/" className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Retour à l'accueil
              </a>
            </div>
          </div>
        );
      }
    }

    // Routes Livreur - uniquement pour les livreurs et admins
    if (path.startsWith('/livreur')) {
      if (!['livreur', 'admin'].includes(user.role)) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Espace Livreur</h2>
              <p className="text-gray-600 mb-4">Cette section est réservée aux livreurs OORYXX.</p>
              <a href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Retour à l'accueil
              </a>
            </div>
          </div>
        );
      }
    }
  }

  return children;
};

export default ProtectedRoute;

