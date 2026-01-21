import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary-100 rounded-xl">
              <LockClosedIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-800">
                Politique de Confidentialité
              </h1>
              <p className="text-neutral-600 mt-1">
                Dernière mise à jour : 18 novembre 2025
              </p>
            </div>
          </div>
          
          <p className="text-neutral-700 leading-relaxed">
            Chez Ooryxx, nous prenons la protection de vos données personnelles très au sérieux. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations.
          </p>
        </div>

        {/* Contenu de la politique */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">1.</span>
              Informations que nous collectons
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                <strong>1.1. Informations que vous nous fournissez :</strong>
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li><strong>Informations d'inscription :</strong> Nom, prénom, adresse email, mot de passe, numéro de téléphone</li>
                <li><strong>Informations de profil :</strong> Date de naissance, genre, préférences</li>
                <li><strong>Informations de paiement :</strong> Détails de carte bancaire (traités de manière sécurisée par nos prestataires de paiement)</li>
                <li><strong>Adresses de livraison :</strong> Adresses postales pour la livraison de vos commandes</li>
                <li><strong>Communications :</strong> Messages que vous nous envoyez via notre service client</li>
              </ul>
              
              <p className="mt-4">
                <strong>1.2. Informations collectées automatiquement :</strong>
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li><strong>Données de navigation :</strong> Adresse IP, type de navigateur, pages visitées, temps passé sur le site</li>
                <li><strong>Données de l'appareil :</strong> Type d'appareil, système d'exploitation, identifiants uniques</li>
                <li><strong>Cookies :</strong> Informations stockées par les cookies (voir section 7)</li>
                <li><strong>Localisation :</strong> Données de localisation approximatives basées sur votre adresse IP</li>
              </ul>
              
              <p className="mt-4">
                <strong>1.3. Informations provenant de tiers :</strong>
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li>Informations de profil public si vous vous connectez via Facebook ou Google</li>
                <li>Informations de vérification d'identité pour les vendeurs</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">2.</span>
              Comment nous utilisons vos informations
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>Nous utilisons vos informations personnelles pour :</p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li><strong>Fournir nos services :</strong> Traiter vos commandes, gérer votre compte, effectuer les livraisons</li>
                <li><strong>Améliorer notre plateforme :</strong> Analyser l'utilisation, développer de nouvelles fonctionnalités</li>
                <li><strong>Communication :</strong> Vous envoyer des confirmations de commande, des mises à jour, des newsletters (si vous y avez consenti)</li>
                <li><strong>Marketing personnalisé :</strong> Vous proposer des produits et offres adaptés à vos préférences</li>
                <li><strong>Sécurité :</strong> Détecter et prévenir la fraude, protéger nos utilisateurs</li>
                <li><strong>Service client :</strong> Répondre à vos questions et résoudre les problèmes</li>
                <li><strong>Conformité légale :</strong> Respecter nos obligations légales et réglementaires</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">3.</span>
              Base légale du traitement
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>Nous traitons vos données personnelles sur les bases légales suivantes :</p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li><strong>Exécution du contrat :</strong> Pour fournir les services que vous avez demandés</li>
                <li><strong>Consentement :</strong> Lorsque vous avez donné votre accord explicite (ex: newsletters)</li>
                <li><strong>Intérêt légitime :</strong> Pour améliorer nos services, assurer la sécurité, prévenir la fraude</li>
                <li><strong>Obligation légale :</strong> Pour respecter nos obligations légales (comptabilité, fiscalité)</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">4.</span>
              Partage de vos informations
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>Nous pouvons partager vos informations avec :</p>
              
              <p className="mt-4">
                <strong>4.1. Prestataires de services :</strong>
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li>Prestataires de paiement (pour traiter vos transactions)</li>
                <li>Services de livraison (pour expédier vos commandes)</li>
                <li>Services d'hébergement et de stockage de données</li>
                <li>Services d'analyse et de marketing</li>
                <li>Services de support client</li>
              </ul>
              
              <p className="mt-4">
                <strong>4.2. Vendeurs :</strong> Nous partageons les informations nécessaires (nom, adresse de livraison) avec les vendeurs pour qu'ils puissent traiter vos commandes.
              </p>
              
              <p className="mt-4">
                <strong>4.3. Autorités légales :</strong> Nous pouvons divulguer vos informations si requis par la loi ou pour protéger nos droits.
              </p>
              
              <p className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <strong>⚠️ Important :</strong> Nous ne vendons jamais vos données personnelles à des tiers à des fins marketing.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">5.</span>
              Sécurité de vos données
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :</p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li><strong>Cryptage SSL/TLS :</strong> Toutes les communications sont chiffrées</li>
                <li><strong>Sécurisation des paiements :</strong> Conformité PCI-DSS pour les transactions</li>
                <li><strong>Authentification sécurisée :</strong> Mots de passe hachés avec bcrypt</li>
                <li><strong>Accès restreint :</strong> Seul le personnel autorisé peut accéder aux données</li>
                <li><strong>Surveillance continue :</strong> Détection et prévention des intrusions</li>
                <li><strong>Sauvegardes régulières :</strong> Protection contre la perte de données</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">6.</span>
              Conservation des données
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>Nous conservons vos données personnelles aussi longtemps que nécessaire pour :</p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li>Fournir nos services et maintenir votre compte</li>
                <li>Respecter nos obligations légales (comptabilité, fiscalité)</li>
                <li>Résoudre les litiges et faire respecter nos accords</li>
              </ul>
              <p className="mt-4">
                Les données de compte sont conservées tant que votre compte est actif. Après suppression de votre compte, nous conservons certaines données pendant 5 ans conformément aux obligations comptables et fiscales.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">7.</span>
              Cookies et technologies similaires
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>Nous utilisons des cookies et technologies similaires pour :</p>
              
              <p className="mt-4">
                <strong>7.1. Cookies essentiels :</strong> Nécessaires au fonctionnement de la plateforme (authentification, panier)
              </p>
              
              <p className="mt-4">
                <strong>7.2. Cookies de performance :</strong> Analysent l'utilisation du site pour l'améliorer
              </p>
              
              <p className="mt-4">
                <strong>7.3. Cookies de marketing :</strong> Personnalisent les publicités et mesurent leur efficacité
              </p>
              
              <p className="mt-4">
                Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur. Notez que le refus de certains cookies peut affecter votre expérience.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">8.</span>
              Vos droits
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>Conformément à la loi tunisienne sur la protection des données personnelles, vous disposez des droits suivants :</p>
              
              <div className="bg-neutral-50 rounded-xl p-6 space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-2">✓ Droit d'accès</h4>
                  <p className="text-sm">Obtenir une copie de vos données personnelles</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-2">✓ Droit de rectification</h4>
                  <p className="text-sm">Corriger vos données inexactes ou incomplètes</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-2">✓ Droit à l'effacement</h4>
                  <p className="text-sm">Demander la suppression de vos données (sous certaines conditions)</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-2">✓ Droit à la limitation</h4>
                  <p className="text-sm">Restreindre le traitement de vos données</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-2">✓ Droit à la portabilité</h4>
                  <p className="text-sm">Recevoir vos données dans un format structuré</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-2">✓ Droit d'opposition</h4>
                  <p className="text-sm">S'opposer au traitement de vos données pour certaines finalités</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-2">✓ Droit de retrait du consentement</h4>
                  <p className="text-sm">Retirer votre consentement à tout moment</p>
                </div>
              </div>
              
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous à{' '}
                <a href="mailto:privacy@ooryxx.tn" className="text-primary-600 hover:text-primary-500 font-medium">
                  privacy@ooryxx.tn
                </a>
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">9.</span>
              Protection des mineurs
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                Notre plateforme n'est pas destinée aux personnes de moins de 18 ans. Nous ne collectons pas sciemment d'informations personnelles auprès de mineurs. Si vous êtes parent et que vous pensez que votre enfant nous a fourni des informations, contactez-nous immédiatement.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">10.</span>
              Transferts internationaux
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                Vos données sont principalement stockées en Tunisie. Si nous transférons des données vers d'autres pays, nous nous assurons qu'un niveau de protection adéquat est en place, conformément aux normes internationales.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-3">
              <span className="text-primary-600">11.</span>
              Modifications de la politique
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. Les modifications importantes seront communiquées par email ou via une notification sur la plateforme. La date de "Dernière mise à jour" en haut de cette page indique quand la politique a été révisée pour la dernière fois.
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
                Pour toute question concernant cette Politique de Confidentialité ou pour exercer vos droits, contactez-nous :
              </p>
              <div className="bg-neutral-50 rounded-xl p-6 mt-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="font-medium">Email (Protection des données) :</span>
                    <a href="mailto:privacy@ooryxx.tn" className="text-primary-600 hover:text-primary-500">
                      privacy@ooryxx.tn
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="font-medium">Email (Support) :</span>
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
                Votre vie privée est notre priorité
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée. Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter.
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

export default PrivacyPolicy;
