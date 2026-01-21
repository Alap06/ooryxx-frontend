import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  CheckCircleIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import OoryxxLogo from '../common/OoryxxLogo';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    street: '',
    city: '',
    postalCode: '',
    password: '',
    confirmPassword: '',
    role: 'customer' // Par défaut: client standard
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Vérifier la force du mot de passe
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Mettre à jour la force du mot de passe
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);

      if (result.success) {
        toast.success('Inscription réussie ! Bienvenue sur Ooryxx 🎉', {
          position: 'top-center',
          autoClose: 2000,
        });
        setTimeout(() => navigate('/', { replace: true }), 500);
      } else {
        toast.error(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-neutral-200';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Faible';
    if (passwordStrength === 2) return 'Moyen';
    if (passwordStrength === 3) return 'Bon';
    return 'Fort';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 animate-fade-in">
        {/* En-tête avec Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <OoryxxLogo size="lg" showText={true} animated={true} />
          </div>
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">
            Rejoignez Ooryxx ! 🚀
          </h2>
          <p className="text-neutral-600">
            Créez votre compte en quelques secondes
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-neutral-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom et Prénom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Prénom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 sm:text-sm"
                    placeholder="John"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 sm:text-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Adresse email *
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

            {/* Téléphone */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 sm:text-sm"
                  placeholder="+216 XX XXX XXX"
                />
              </div>
            </div>

            {/* Adresse */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-neutral-400" />
                Adresse (optionnel)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <input
                    id="street"
                    name="street"
                    type="text"
                    value={formData.street}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 sm:text-sm"
                    placeholder="Rue, Avenue..."
                  />
                </div>
                <div>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 sm:text-sm"
                    placeholder="Ville"
                  />
                </div>
                <div>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 sm:text-sm"
                    placeholder="Code postal"
                  />
                </div>
              </div>
            </div>

            {/* Mot de passe */}
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

              {/* Indicateur de force du mot de passe */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength ? getPasswordStrengthColor() : 'bg-neutral-200'
                          }`}
                      />
                    ))}
                  </div>
                  {passwordStrength > 0 && (
                    <p className="text-xs text-neutral-600">
                      Force du mot de passe : <span className="font-medium">{getPasswordStrengthText()}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-1 text-green-600 text-xs">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Les mots de passe correspondent</span>
                </div>
              )}
            </div>

            {/* Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-0.5 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">
                J'accepte les{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500 font-medium">
                  Conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500 font-medium">
                  Politique de confidentialité
                </Link>
              </label>
            </div>

            {/* Bouton Inscription */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Inscription...</span>
                </div>
              ) : (
                "S'inscrire gratuitement"
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
          {/* Bouton Google */}
          <button
            type="button"
            onClick={() => toast.info('Connexion Google bientôt disponible')}
            className="flex items-center justify-center gap-3 px-4 py-3 border border-neutral-300 rounded-xl text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-200 font-medium w-full"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>

          {/* Séparateur */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">Vous avez déjà un compte ?</span>
            </div>
          </div>

          {/* Lien vers Connexion */}
          <Link
            to="/login"
            className="w-full flex justify-center py-3 px-4 border-2 border-primary-200 text-sm font-semibold rounded-xl text-primary-600 hover:bg-primary-50 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;