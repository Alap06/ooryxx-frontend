import React from 'react';
import { WifiIcon, ArrowPathIcon, HomeIcon, SignalSlashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Logo from '../data/images/Logo.png';

const NetworkError = ({
  error = null,
  onRetry = null,
  title = "Problème de connexion",
  message = "Impossible de se connecter au serveur"
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const getErrorDetails = () => {
    if (!error) return null;

    if (error.status === 0) {
      return {
        icon: <SignalSlashIcon className="w-16 h-16" />,
        title: "Pas de connexion Internet",
        description: "Vérifiez votre connexion réseau et réessayez",
        color: "error"
      };
    }

    if (error.status >= 500) {
      return {
        icon: <WifiIcon className="w-16 h-16" />,
        title: "Serveur indisponible",
        description: "Nos serveurs rencontrent des difficultés. Veuillez réessayer dans quelques instants.",
        color: "warning"
      };
    }

    if (error.status === 404) {
      return {
        icon: <SignalSlashIcon className="w-16 h-16" />,
        title: "Ressource introuvable",
        description: "La ressource demandée n'existe pas ou a été déplacée",
        color: "info"
      };
    }

    if (error.status === 403) {
      return {
        icon: <SignalSlashIcon className="w-16 h-16" />,
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource",
        color: "error"
      };
    }

    if (error.status === 401) {
      return {
        icon: <SignalSlashIcon className="w-16 h-16" />,
        title: "Non authentifié",
        description: "Votre session a expiré. Veuillez vous reconnecter.",
        color: "warning"
      };
    }

    return {
      icon: <WifiIcon className="w-16 h-16" />,
      title: title,
      description: message,
      color: "error"
    };
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-neutral-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative z-10">
              <img
                src={Logo}
                alt="OORYXX"
                className="h-16 w-auto mx-auto mb-6 drop-shadow-2xl"
              />

              <div className={`inline-block bg-white/20 backdrop-blur-md rounded-full p-6 mb-6`}>
                <div className="text-white animate-pulse">
                  {errorDetails?.icon || <WifiIcon className="w-16 h-16" />}
                </div>
              </div>

              <h1 className="text-4xl font-black mb-2">
                {errorDetails?.title || title}
              </h1>
              <p className="text-xl text-white/90">
                {errorDetails?.description || message}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Error code si disponible */}
            {error?.status && (
              <div className="bg-neutral-100 rounded-xl p-4 mb-6 text-center">
                <div className="text-neutral-500 text-sm mb-1">Code d'erreur</div>
                <div className="text-3xl font-black text-neutral-800">
                  {error.status}
                </div>
                {error.message && (
                  <div className="text-sm text-neutral-600 mt-2">
                    {error.message}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={handleRetry}
                className="flex items-center justify-center space-x-2 bg-primary-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ArrowPathIcon className="w-6 h-6" />
                <span>Réessayer</span>
              </button>

              <Link
                to="/"
                className="flex items-center justify-center space-x-2 bg-secondary-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <HomeIcon className="w-6 h-6" />
                <span>Retour à l'accueil</span>
              </Link>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-info-50 to-primary-50 rounded-xl p-6">
              <h3 className="font-bold text-neutral-800 mb-4 flex items-center">
                <WifiIcon className="w-5 h-5 mr-2 text-info-600" />
                Conseils de dépannage
              </h3>
              <ul className="space-y-3 text-neutral-700">
                <li className="flex items-start space-x-3">
                  <span className="text-primary-500 font-bold text-lg">•</span>
                  <span>Vérifiez votre connexion Internet</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-primary-500 font-bold text-lg">•</span>
                  <span>Désactivez temporairement votre VPN ou proxy</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-primary-500 font-bold text-lg">•</span>
                  <span>Videz le cache de votre navigateur</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-primary-500 font-bold text-lg">•</span>
                  <span>Essayez avec un autre navigateur</span>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="mt-6 text-center border-t border-neutral-200 pt-6">
              <p className="text-neutral-600 mb-3">
                Le problème persiste ?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="mailto:support@ooryxx.com"
                  className="text-primary-600 hover:text-primary-700 font-semibold underline"
                >
                  Contacter le support
                </a>
                <span className="hidden sm:block text-neutral-400">•</span>
                <a
                  href="/help"
                  className="text-primary-600 hover:text-primary-700 font-semibold underline"
                >
                  Centre d'aide
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Status info */}
        <div className="mt-6 text-center text-sm text-neutral-600">
          <p>État du serveur: {error?.status >= 500 ? '🔴 Indisponible' : '🟢 En ligne'}</p>
        </div>
      </div>
    </div>
  );
};

export default NetworkError;
