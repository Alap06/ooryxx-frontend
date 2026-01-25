import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  EnvelopeIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import OoryxxLogo from '../common/OoryxxLogo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailSent(true);
        toast.success('Email de réinitialisation envoyé ! 📧');
      } else {
        toast.error(data.message || 'Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };


  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <OoryxxLogo size="lg" showText={true} animated={true} />
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-neutral-100">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-neutral-800">
                  Email envoyé ! 📧
                </h2>
                <p className="text-neutral-600">
                  Nous avons envoyé un code de vérification à :
                </p>
                <p className="font-medium text-primary-600">{email}</p>
                <p className="text-sm text-neutral-500 mt-4">
                  Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
                </p>
                <p className="text-xs text-neutral-400 mt-2">
                  Si vous ne recevez pas l'email dans quelques minutes, vérifiez votre dossier spam.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  to="/reset-password"
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-lg shadow-primary-500/30"
                >
                  Entrer le code de vérification
                </Link>

                <Link
                  to="/login"
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border-2 border-neutral-200 text-sm font-medium rounded-xl text-neutral-700 hover:bg-neutral-50 transition-all duration-200"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Retour à la connexion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* En-tête */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <OoryxxLogo size="lg" showText={true} animated={true} />
          </div>
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">
            Mot de passe oublié ? 🔒
          </h2>
          <p className="text-neutral-600">
            Pas de problème ! Entrez votre email et nous vous enverrons un code de réinitialisation.
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 sm:text-sm"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            {/* Bouton Envoyer */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Envoi en cours...</span>
                </div>
              ) : (
                'Envoyer le code de réinitialisation'
              )}
            </button>
          </form>

          {/* Lien retour */}
          <Link
            to="/login"
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border-2 border-neutral-200 text-sm font-medium rounded-xl text-neutral-700 hover:bg-neutral-50 transition-all duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Retour à la connexion
          </Link>
        </div>

        {/* Info */}
        <p className="text-center text-xs text-neutral-500">
          Vous vous souvenez de votre mot de passe ?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
