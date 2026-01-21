import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import OoryxxLogo from '../common/OoryxxLogo';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success(`Bienvenue sur Ooryxx ! 🎉`, {
          position: 'top-center',
          autoClose: 2000,
        });

        // Get user from localStorage to determine redirect
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        // Role-based redirect
        let redirectPath = from;
        if (user && user.role) {
          switch (user.role) {
            case 'admin':
              redirectPath = '/admin';
              break;
            case 'vendor':
              redirectPath = '/vendor';
              break;
            case 'moderator':
              redirectPath = '/moderator';
              break;
            case 'livreur':
              redirectPath = '/livreur';
              break;
            default:
              // For customers, use the original path or profile
              redirectPath = from === '/' ? '/profile' : from;
          }
        }

        setTimeout(() => navigate(redirectPath, { replace: true }), 500);
      } else {
        toast.error(result.error || 'Identifiants incorrects');
      }
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const result = await loginWithGoogle(credentialResponse.credential);

      if (result.success) {
        toast.success(`Bienvenue sur Ooryxx ! 🎉`, {
          position: 'top-center',
          autoClose: 2000,
        });

        const user = result.user;

        // Role-based redirect
        let redirectPath = from;
        if (user && user.role) {
          switch (user.role) {
            case 'admin':
              redirectPath = '/admin';
              break;
            case 'vendor':
              redirectPath = '/vendor';
              break;
            case 'moderator':
              redirectPath = '/moderator';
              break;
            case 'livreur':
              redirectPath = '/livreur';
              break;
            default:
              redirectPath = from === '/' ? '/profile' : from;
          }
        }

        setTimeout(() => navigate(redirectPath, { replace: true }), 500);
      } else {
        toast.error(result.error || 'Erreur de connexion Google');
      }
    } catch (error) {
      toast.error('Erreur lors de la connexion Google');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login error
  const handleGoogleError = () => {
    toast.error('Connexion Google échouée. Veuillez réessayer.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* En-tête avec Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <OoryxxLogo size="lg" showText={true} animated={true} />
          </div>
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">
            Bon retour ! 👋
          </h2>
          <p className="text-neutral-600">
            Connectez-vous à votre compte Ooryxx
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-neutral-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 sm:text-sm"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Options supplémentaires */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                  Se souvenir de moi
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton Connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Connexion...</span>
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">Ou continuer avec</span>
            </div>
          </div>

          {/* Bouton de connexion Google */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              text="continue_with"
              shape="rectangular"
              size="large"
              width="300"
              theme="outline"
              locale="fr"
            />
          </div>

          {/* Séparateur */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">Nouveau sur Ooryxx ?</span>
            </div>
          </div>

          {/* Lien vers Inscription */}
          <Link
            to="/register"
            className="w-full flex justify-center py-3 px-4 border-2 border-primary-200 text-sm font-semibold rounded-xl text-primary-600 hover:bg-primary-50 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
          >
            Créer un compte gratuitement
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-500">
          En vous connectant, vous acceptez nos{' '}
          <Link to="/terms" className="text-primary-600 hover:text-primary-500">
            Conditions d'utilisation
          </Link>{' '}
          et notre{' '}
          <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
            Politique de confidentialité
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;