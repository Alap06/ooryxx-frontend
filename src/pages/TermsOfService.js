import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary-100 rounded-xl">
              <DocumentTextIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-800">
                Conditions Générales d'Utilisation
              </h1>
              <p className="text-neutral-600 mt-1">
                Dernière mise à jour : 18 novembre 2025
              </p>
            </div>
          </div>
          
          <p className="text-neutral-700 leading-relaxed">
            Bienvenue sur Ooryxx ! En accédant et en utilisant notre plateforme e-commerce, vous acceptez d'être lié par les présentes conditions générales d'utilisation.
          </p>
        </div>

        {/* Contenu des CGU */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">1.</span>
              Acceptation des Conditions
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                En accédant et en utilisant la plateforme Ooryxx, vous reconnaissez avoir lu, compris et accepté d'être lié par ces Conditions Générales d'Utilisation (CGU). Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
              </p>
              <p>
                Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications entreront en vigueur dès leur publication sur la plateforme. Votre utilisation continue de la plateforme après de telles modifications constitue votre acceptation des nouvelles conditions.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">2.</span>
              Inscription et Compte Utilisateur
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                <strong>2.1. Création de compte :</strong> Pour utiliser certains services de Ooryxx, vous devez créer un compte. Vous vous engagez à fournir des informations exactes, complètes et à jour lors de votre inscription.
              </p>
              <p>
                <strong>2.2. Sécurité du compte :</strong> Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités effectuées sous votre compte. Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte.
              </p>
              <p>
                <strong>2.3. Âge minimum :</strong> Vous devez avoir au moins 18 ans pour créer un compte et utiliser nos services. En créant un compte, vous confirmez que vous remplissez cette condition.
              </p>
              <p>
                <strong>2.4. Types de comptes :</strong> Ooryxx propose deux types de comptes :
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li><strong>Compte Client :</strong> Pour acheter des produits sur la plateforme</li>
                <li><strong>Compte Vendeur :</strong> Pour vendre des produits sur la plateforme (soumis à validation)</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">3.</span>
              Utilisation de la Plateforme
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                <strong>3.1. Usage autorisé :</strong> Vous acceptez d'utiliser Ooryxx uniquement à des fins légales et conformément aux présentes CGU.
              </p>
              <p>
                <strong>3.2. Interdictions :</strong> Il est strictement interdit de :
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li>Utiliser la plateforme pour toute activité illégale ou frauduleuse</li>
                <li>Publier du contenu offensant, diffamatoire ou portant atteinte aux droits d'autrui</li>
                <li>Tenter d'accéder à des zones non autorisées de la plateforme</li>
                <li>Interférer avec le fonctionnement normal de la plateforme</li>
                <li>Collecter des données personnelles d'autres utilisateurs sans autorisation</li>
                <li>Utiliser des robots, scripts ou autres moyens automatisés non autorisés</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">4.</span>
              Achats et Paiements
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                <strong>4.1. Commandes :</strong> En passant une commande, vous faites une offre d'achat. Toutes les commandes sont soumises à acceptation et à disponibilité des produits.
              </p>
              <p>
                <strong>4.2. Prix :</strong> Les prix affichés sont en dinars tunisiens (TND) et incluent toutes les taxes applicables. Nous nous réservons le droit de modifier les prix à tout moment.
              </p>
              <p>
                <strong>4.3. Paiement :</strong> Le paiement est exigible immédiatement lors de la commande. Nous acceptons les méthodes de paiement indiquées sur la plateforme.
              </p>
              <p>
                <strong>4.4. Sécurité des paiements :</strong> Toutes les transactions sont sécurisées et cryptées. Nous ne stockons jamais vos informations de carte bancaire complètes.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">5.</span>
              Livraison et Expédition
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                <strong>5.1. Zones de livraison :</strong> Nous livrons dans toute la Tunisie. Les délais de livraison varient selon votre localisation.
              </p>
              <p>
                <strong>5.2. Frais de livraison :</strong> Les frais de livraison sont calculés lors du passage de la commande et peuvent varier selon le poids, la taille et la destination.
              </p>
              <p>
                <strong>5.3. Délais :</strong> Les délais de livraison indiqués sont estimatifs. Ooryxx ne peut être tenu responsable des retards dus à des circonstances indépendantes de sa volonté.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">6.</span>
              Retours et Remboursements
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                <strong>6.1. Droit de rétractation :</strong> Conformément à la loi tunisienne sur la protection du consommateur, vous disposez d'un délai de 7 jours pour retourner un produit sans avoir à justifier de motif.
              </p>
              <p>
                <strong>6.2. Conditions de retour :</strong> Les produits doivent être retournés dans leur état d'origine, non utilisés et dans leur emballage d'origine.
              </p>
              <p>
                <strong>6.3. Remboursement :</strong> Le remboursement sera effectué dans un délai de 14 jours suivant la réception du produit retourné.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">7.</span>
              Propriété Intellectuelle
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                Tous les contenus présents sur la plateforme Ooryxx (textes, images, logos, marques, graphiques, etc.) sont la propriété exclusive d'Ooryxx ou de ses partenaires et sont protégés par les lois sur la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, distribution ou utilisation non autorisée de ces contenus est strictement interdite.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">8.</span>
              Limitation de Responsabilité
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                <strong>8.1.</strong> Ooryxx s'efforce de maintenir la plateforme accessible 24h/24 et 7j/7, mais ne peut garantir une disponibilité continue et ininterrompue.
              </p>
              <p>
                <strong>8.2.</strong> Ooryxx ne peut être tenu responsable des dommages indirects, accessoires ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser la plateforme.
              </p>
              <p>
                <strong>8.3.</strong> En tant que plateforme intermédiaire, Ooryxx n'est pas responsable de la qualité, de la conformité ou de la légalité des produits vendus par les vendeurs tiers.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">9.</span>
              Protection des Données
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                La collecte et le traitement de vos données personnelles sont régis par notre{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500 font-medium underline">
                  Politique de Confidentialité
                </Link>
                . En utilisant Ooryxx, vous consentez à la collecte et à l'utilisation de vos informations conformément à cette politique.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">10.</span>
              Résiliation
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                Nous nous réservons le droit de suspendre ou de résilier votre compte à tout moment et sans préavis si vous violez ces CGU ou si nous estimons que votre utilisation de la plateforme est préjudiciable à Ooryxx ou à d'autres utilisateurs.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">11.</span>
              Droit Applicable et Juridiction
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                Les présentes CGU sont régies par le droit tunisien. Tout litige relatif à l'interprétation ou à l'exécution de ces conditions sera soumis aux tribunaux compétents de Tunis, Tunisie.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">12.</span>
              Contact
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                Pour toute question concernant ces Conditions Générales d'Utilisation, vous pouvez nous contacter :
              </p>
              <div className="bg-neutral-50 rounded-xl p-6 mt-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="font-medium">Email :</span>
                    <a href="mailto:contact@ooryxx.tn" className="text-primary-600 hover:text-primary-500">
                      contact@ooryxx.tn
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="font-medium">Téléphone :</span>
                    <a href="tel:+21670123456" className="text-primary-600 hover:text-primary-500">
                      +216 70 123 456
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="font-medium">Adresse :</span>
                    <span>Tunis, Tunisie</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 bg-primary-50 border border-primary-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <ShieldCheckIcon className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">
                Votre confiance est notre priorité
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Nous nous engageons à respecter ces conditions et à vous offrir une expérience d'achat sécurisée et transparente. N'hésitez pas à nous contacter pour toute question ou préoccupation.
              </p>
            </div>
          </div>
        </div>

        {/* Bouton retour */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200 font-medium shadow-lg shadow-primary-500/30"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
