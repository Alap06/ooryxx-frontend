import React from 'react';
import { Link } from 'react-router-dom';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import OoryxxLogo from './OoryxxLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: {
      title: 'À propos',
      links: [
        { name: 'Qui sommes-nous', href: '/about' },
        { name: 'Nos engagements', href: '/commitments' },
        { name: 'Carrières', href: '/careers' },
        { name: 'Presse', href: '/press' },
        { name: 'Investisseurs', href: '/investors' }
      ]
    },
    customer: {
      title: 'Service Client',
      links: [
        { name: 'Centre d\'aide', href: '/help' },
        { name: 'Nous contacter', href: '/contact' },
        { name: 'Suivi de commande', href: '/track-order' },
        { name: 'Retours & Échanges', href: '/returns' },
        { name: 'Garanties', href: '/warranty' },
        { name: 'FAQ', href: '/faq' }
      ]
    },
    shopping: {
      title: 'Achat & Vente',
      links: [
        { name: 'Comment acheter', href: '/how-to-buy' },
        { name: 'Devenir vendeur', href: '/become-seller' },
        { name: 'Programme d\'affiliation', href: '/affiliate' },
        { name: 'Cartes cadeaux', href: '/gift-cards' },
        { name: 'Codes promo', href: '/promo-codes' }
      ]
    },
    legal: {
      title: 'Légal',
      links: [
        { name: 'Conditions générales', href: '/terms' },
        { name: 'Politique de confidentialité', href: '/privacy' },
        { name: 'Politique de cookies', href: '/cookies' },
        { name: 'Mentions légales', href: '/legal' },
        { name: 'RGPD', href: '/gdpr' }
      ]
    }
  };

  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'PayPal', icon: '🅿️' },
    { name: 'USDT', icon: '₿' },
    { name: 'Poste Tunisienne', icon: '📮' }
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: '📘' },
    { name: 'Instagram', href: '#', icon: '📷' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'LinkedIn', href: '#', icon: '💼' },
    { name: 'YouTube', href: '#', icon: '📺' },
    { name: 'TikTok', href: '#', icon: '🎵' }
  ];

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <OoryxxLogo size="lg" variant="transparent" darkMode={true} />
            </div>

            <p className="text-neutral-400 mb-6 max-w-md">
              Découvrez des millions de produits de qualité, livrés rapidement et en toute sécurité.
              Une expérience d'achat exceptionnelle vous attend.
            </p>

            {/* Informations de contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-primary-400" />
                <span className="text-neutral-300">+216 70 123 456</span>
              </div>
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-primary-400" />
                <span className="text-neutral-300">contact@ooryxx.tn</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-primary-400" />
                <span className="text-neutral-300">Tunis, Tunisie</span>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Suivez-nous</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                    title={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Liens de navigation */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-lg mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-neutral-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Section newsletter */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-heading font-bold mb-4">
              Restez informé de nos dernières offres
            </h3>
            <p className="text-primary-100 mb-6">
              Recevez nos newsletters et bénéficiez d'offres exclusives
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-4 focus:ring-white/20 focus:outline-none text-neutral-800"
              />
              <button className="bg-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors duration-200">
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section avantages */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success-500/20 rounded-xl flex items-center justify-center">
                <TruckIcon className="w-6 h-6 text-success-400" />
              </div>
              <div>
                <h4 className="font-semibold">Livraison Rapide</h4>
                <p className="text-neutral-400 text-sm">24-48h partout en Tunisie</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h4 className="font-semibold">Paiement Sécurisé</h4>
                <p className="text-neutral-400 text-sm">Transactions 100% sécurisées</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center">
                <HeartIcon className="w-6 h-6 text-accent-400" />
              </div>
              <div>
                <h4 className="font-semibold">Satisfait ou Remboursé</h4>
                <p className="text-neutral-400 text-sm">Garantie 30 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section méthodes de paiement */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold mb-3">Méthodes de paiement acceptées</h4>
              <div className="flex items-center gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="w-12 h-8 bg-white rounded-lg flex items-center justify-center"
                    title={method.name}
                  >
                    <span className="text-lg">{method.icon}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-neutral-400">
              <span>🔒 Site sécurisé SSL</span>
              <span>✅ Certifié e-commerce</span>
              <span>🇹🇳 Made in Tunisia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section copyright */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
            <div className="flex items-center gap-4">
              <span>© {currentYear} Ooryxx. Tous droits réservés.</span>
              <span>•</span>
              <span>Développé avec ❤️ en Tunisie</span>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/terms" className="hover:text-white transition-colors">
                Conditions
              </Link>
              <Link to="/privacy" className="hover:text-white transition-colors">
                Confidentialité
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour en haut */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 hover:scale-110 transition-all duration-200 z-40"
        title="Retour en haut"
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer;