import React, { Component } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon, BugAntIcon } from '@heroicons/react/24/outline';
import Logo from '../data/images/Logo.png';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log l'erreur à un service de monitoring (ex: Sentry)
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // Ici vous pouvez envoyer l'erreur à un service de monitoring
    const errorLog = {
      message: error.toString(),
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Sauvegarder dans localStorage pour debug
    try {
      const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      existingErrors.push(errorLog);
      // Garder seulement les 10 dernières erreurs
      localStorage.setItem('app_errors', JSON.stringify(existingErrors.slice(-10)));
    } catch (e) {
      console.error('Impossible de sauvegarder l\'erreur:', e);
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  copyErrorDetails = () => {
    const { error, errorInfo } = this.state;
    const errorText = `
Error: ${error?.toString()}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
    `.trim();

    navigator.clipboard.writeText(errorText).then(() => {
      alert('Détails de l\'erreur copiés dans le presse-papiers');
    });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorCount } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-gradient-to-br from-error-50 via-white to-warning-50 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            {/* Card principale */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-error-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-error-500 to-warning-500 p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <img src={Logo} alt="OORYXX" className="h-12 w-auto drop-shadow-lg" />
                    <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                      <span className="text-sm font-bold">Erreur #{errorCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
                      <ExclamationTriangleIcon className="w-12 h-12 animate-pulse" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-black mb-2">Oups ! Une erreur s'est produite</h1>
                      <p className="text-lg text-white/90">
                        Nous nous excusons pour ce désagrément
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-8">
                {/* Message d'erreur principal */}
                <div className="bg-error-50 border-l-4 border-error-500 rounded-lg p-6 mb-6">
                  <div className="flex items-start space-x-3">
                    <BugAntIcon className="w-6 h-6 text-error-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-error-900 mb-2">
                        Message d'erreur
                      </h3>
                      <p className="text-error-800 font-mono text-sm break-words">
                        {error?.toString() || 'Erreur inconnue'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={this.handleReload}
                    className="flex items-center justify-center space-x-2 bg-primary-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                    <span>Recharger</span>
                  </button>

                  <button
                    onClick={this.handleReset}
                    className="flex items-center justify-center space-x-2 bg-secondary-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                    <span>Réessayer</span>
                  </button>

                  <button
                    onClick={this.handleGoHome}
                    className="flex items-center justify-center space-x-2 bg-success-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-success-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <HomeIcon className="w-5 h-5" />
                    <span>Accueil</span>
                  </button>
                </div>

                {/* Détails techniques (développement uniquement) */}
                {isDevelopment && (
                  <div className="border-t border-neutral-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-neutral-800">
                        Détails techniques
                      </h3>
                      <button
                        onClick={this.copyErrorDetails}
                        className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Copier les détails
                      </button>
                    </div>

                    {/* Stack trace */}
                    <div className="bg-neutral-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4">
                      <pre className="text-xs font-mono whitespace-pre-wrap">
                        {error?.stack}
                      </pre>
                    </div>

                    {/* Component stack */}
                    {errorInfo?.componentStack && (
                      <div className="bg-neutral-900 text-yellow-400 p-4 rounded-lg overflow-x-auto">
                        <h4 className="text-sm font-bold mb-2 text-white">Component Stack:</h4>
                        <pre className="text-xs font-mono whitespace-pre-wrap">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Informations supplémentaires */}
                <div className="mt-6 bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4">
                    Que faire maintenant ?
                  </h3>
                  <ul className="space-y-3 text-neutral-700">
                    <li className="flex items-start space-x-3">
                      <span className="text-primary-500 font-bold">1.</span>
                      <span>Essayez de recharger la page en cliquant sur "Recharger"</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-primary-500 font-bold">2.</span>
                      <span>Si le problème persiste, retournez à l'accueil</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-primary-500 font-bold">3.</span>
                      <span>Contactez notre support technique si l'erreur se répète</span>
                    </li>
                  </ul>
                </div>

                {/* Support contact */}
                <div className="mt-6 text-center">
                  <p className="text-neutral-600 mb-2">Besoin d'aide ?</p>
                  <a
                    href="mailto:support@ooryxx.com"
                    className="text-primary-600 hover:text-primary-700 font-semibold underline"
                  >
                    Contactez notre support
                  </a>
                </div>
              </div>
            </div>

            {/* Footer info */}
            <div className="mt-6 text-center text-sm text-neutral-600">
              <p>
                Erreur survenue le {new Date().toLocaleString('fr-FR')}
              </p>
              <p className="mt-1">
                URL: <span className="font-mono text-xs">{window.location.href}</span>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
