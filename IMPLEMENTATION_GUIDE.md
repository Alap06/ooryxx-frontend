# 📱 Guide d'Implémentation Frontend - Ooryxx E-commerce

## 🎯 Vue d'ensemble

Application React.js 18+ moderne et responsive pour une plateforme e-commerce multi-vendeurs avec support multilingue (FR/EN/AR) et thème personnalisable.

## 🏗️ Architecture du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── common/         # Composants communs (Header, Footer, etc.)
│   ├── auth/           # Composants d'authentification
│   ├── product/        # Composants produits
│   └── cart/           # Composants panier
├── pages/              # Pages de l'application
│   ├── Home.jsx        # Page d'accueil
│   ├── Products.jsx    # Catalogue produits
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Profile.jsx
│   ├── VendorDashboard.jsx
│   └── AdminPanel.jsx
├── context/            # Context API
│   ├── AuthContext.jsx    # Gestion authentification
│   ├── CartContext.jsx    # Gestion panier
│   └── ThemeContext.jsx   # Gestion thème
├── services/           # Services API
│   └── api.js          # Configuration Axios
├── i18n/              # Internationalisation
│   ├── config.js       # Configuration i18n
│   └── locales/        # Fichiers de traduction
│       ├── fr.json
│       ├── en.json
│       └── ar.json
├── utils/             # Utilitaires
├── hooks/             # Custom hooks
└── styles/            # Styles globaux
```

## ⚙️ Technologies Utilisées

### Core
- **React** 18.2.0 - Framework UI
- **React Router DOM** 7.9.1 - Routing
- **Axios** 1.11.0 - Requêtes HTTP
- **React Query** (@tanstack/react-query) - Gestion état serveur

### UI & Styling
- **TailwindCSS** 3.4.17 - Framework CSS
- **Material-UI** 7.3.2 - Composants UI
- **Lucide React** - Icônes modernes
- **Framer Motion** - Animations

### Forms & Validation
- **Formik** 2.4.6 - Gestion formulaires
- **Yup** 1.7.0 - Validation

### Autres
- **i18next** - Internationalisation
- **Socket.io-client** 4.8.1 - Temps réel
- **React Toastify** 11.0.5 - Notifications
- **React Helmet Async** 2.0.5 - Meta tags SEO
- **Swiper** 11.2.10 - Carrousels

## 🌍 Système Multilingue (i18n)

### Configuration

Le système i18n est configuré avec 3 langues :
- **Français (fr)** - Par défaut
- **English (en)**
- **العربية (ar)** - Avec support RTL

### Utilisation dans les composants

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.home')}</h1>
      <p>{t('home.hero.title')}</p>
    </div>
  );
}
```

### Composant de sélection de langue

```jsx
import LanguageSwitch from './components/common/LanguageSwitch';

// Dans votre Header
<LanguageSwitch />
```

### Support RTL pour l'arabe

Le système gère automatiquement la direction du texte :
- LTR (Left-to-Right) pour FR et EN
- RTL (Right-to-Left) pour AR

## 🎨 Système de Thème Personnalisable

### Palettes de couleurs disponibles

1. **Bleu Classique** (par défaut)
   - Primary: #3b82f6
   - Secondary: #6366f1
   - Accent: #f97316

2. **Océan**
   - Primary: #0ea5e9
   - Secondary: #06b6d4
   - Accent: #f59e0b

3. **Violet Moderne**
   - Primary: #8b5cf6
   - Secondary: #a78bfa
   - Accent: #ec4899

4. **Vert Nature**
   - Primary: #10b981
   - Secondary: #34d399
   - Accent: #f59e0b

5. **Mode Sombre**
   - Basculement automatique vers palette adaptée

### Utilisation du thème

```jsx
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { currentTheme, isDark, changeTheme, toggleDarkMode } = useTheme();
  
  return (
    <div>
      <button onClick={() => changeTheme('ocean')}>
        Thème Océan
      </button>
      <button onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
    </div>
  );
}
```

### Composant de sélection de thème

```jsx
import ThemeSwitch from './components/common/ThemeSwitch';

// Dans votre Header
<ThemeSwitch />
```

## 🔐 Authentification (AuthContext)

### Fonctionnalités
- Connexion / Inscription
- JWT Token management
- Refresh token automatique
- Persistance du statut d'authentification
- Gestion des rôles (client, vendeur, admin)

### Utilisation

```jsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return <div>Bienvenue {user.firstName}!</div>;
}
```

## 🛒 Gestion du Panier (CartContext)

### Fonctionnalités
- Ajout/Suppression d'articles
- Mise à jour des quantités
- Calcul automatique des totaux
- Persistance en localStorage
- Synchronisation avec le backend

### Utilisation

```jsx
import { useCart } from './context/CartContext';

function ProductCard({ product }) {
  const { addToCart, removeFromCart, cart } = useCart();
  
  return (
    <button onClick={() => addToCart(product)}>
      Ajouter au panier
    </button>
  );
}
```

## 📡 Services API

### Configuration Axios

Le service API est configuré avec :
- Base URL: `http://localhost:5000/api` (ou proxy)
- Intercepteurs pour JWT
- Gestion automatique des erreurs
- Refresh token automatique

### Utilisation

```jsx
import api from './services/api';

// GET
const products = await api.get('/products');

// POST
const newProduct = await api.post('/products', productData);

// PUT
const updated = await api.put(`/products/${id}`, updatedData);

// DELETE
await api.delete(`/products/${id}`);
```

## 📄 Structure des Pages

### 1. Page d'Accueil (Home)
- Hero section avec bannière
- Catégories principales
- Produits en vedette
- Nouveautés
- Produits tendances
- Recommendations personnalisées (VIP)

### 2. Catalogue Produits (Products)
- Filtres avancés (prix, marque, catégorie, note)
- Tri (prix, popularité, nouveauté)
- Pagination / Infinite scroll
- Vue grille / liste
- Responsive

### 3. Détail Produit (ProductDetail)
- Galerie d'images avec zoom
- Description détaillée
- Spécifications
- Avis clients
- Produits similaires
- Ajout au panier
- Partage social

### 4. Panier (Cart)
- Liste des articles
- Modification des quantités
- Suppression d'articles
- Calcul des totaux
- Codes promo
- Bouton checkout

### 5. Checkout (Processus en étapes)
- **Étape 1**: Informations de livraison
- **Étape 2**: Méthode de paiement
- **Étape 3**: Vérification commande
- **Étape 4**: Confirmation

### 6. Profil Utilisateur (Profile)
- Informations personnelles
- Adresses de livraison
- Historique des commandes
- Liste de souhaits
- Paramètres du compte

### 7. Dashboard Vendeur (VendorDashboard)
- Statistiques (ventes, commandes, produits)
- Graphiques de performance
- Gestion des produits
- Gestion des commandes
- Réponses aux avis

### 8. Panel Admin (AdminPanel)
- Dashboard général
- Gestion utilisateurs
- Gestion vendeurs
- Gestion catalogue
- Modération avis
- Paramètres du site

## 🎨 Composants Réutilisables

### Header
```jsx
<Header>
  - Logo
  - Recherche intelligente
  - Navigation
  - Panier (avec nombre d'articles)
  - Profil utilisateur
  - Sélection langue
  - Sélection thème
</Header>
```

### ProductCard
```jsx
<ProductCard product={product}>
  - Image produit
  - Nom & prix
  - Note moyenne
  - Badge (nouveau, promo)
  - Bouton ajout panier
  - Wishlist
</ProductCard>
```

### LoadingSpinner
```jsx
<LoadingSpinner size="md" color="primary" />
```

### Pagination
```jsx
<Pagination 
  currentPage={page}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
```

### NotificationToast
```jsx
import { toast } from 'react-toastify';

toast.success('Produit ajouté au panier!');
toast.error('Erreur lors de l\'ajout');
```

## 🚀 Démarrage du Projet

### Installation

```bash
cd ooryxx-frontend
npm install
```

### Configuration

Créer un fichier `.env` :

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_KEY=your_stripe_key
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Démarrage en développement

```bash
npm start
```

### Build pour production

```bash
npm run build
```

## 🔧 Configuration Additionnelle

### Intégrer i18n dans App.js

```jsx
import './i18n/config';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      {/* Le reste de votre app */}
    </I18nextProvider>
  );
}
```

### Mise à jour du Header

```jsx
// Dans components/common/Header.jsx
import LanguageSwitch from './LanguageSwitch';
import ThemeSwitch from './ThemeSwitch';
import { useTranslation } from 'react-i18next';

function Header() {
  const { t } = useTranslation();
  
  return (
    <header>
      {/* ... */}
      <LanguageSwitch />
      <ThemeSwitch />
      {/* ... */}
    </header>
  );
}
```

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile */
@media (min-width: 640px) { }   /* sm */

/* Tablet */
@media (min-width: 768px) { }   /* md */

/* Desktop */
@media (min-width: 1024px) { }  /* lg */

/* Large Desktop */
@media (min-width: 1280px) { }  /* xl */
```

### Utilisation dans Tailwind

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsive grid */}
</div>
```

## 🎯 Fonctionnalités Avancées

### 1. Recherche Intelligente
- Autocomplétion
- Suggestions en temps réel
- Recherche par catégorie
- Filtres dynamiques

### 2. Panier Persistant
- Sauvegarde en localStorage
- Synchronisation avec backend
- Récupération après déconnexion

### 3. Système de Recommandations
- Basé sur l'historique
- Produits similaires
- Personnalisation selon niveau VIP

### 4. Anonymat Client-Vendeur
- Codes de livraison
- Pas d'échange d'informations personnelles
- Communication via plateforme

### 5. Notifications en Temps Réel
- Socket.io pour notifications live
- Toast pour feedback utilisateur
- Badge de notifications

## 🛠️ Best Practices

### 1. Performance
- Lazy loading des composants
- Lazy loading des images
- Code splitting
- Memoization avec React.memo
- useMemo et useCallback

### 2. SEO
- React Helmet pour meta tags dynamiques
- Structure HTML sémantique
- Alt text pour images
- URLs descriptives

### 3. Accessibilité
- ARIA labels
- Navigation au clavier
- Contraste des couleurs
- Screen reader friendly

### 4. Sécurité
- Validation côté client
- Sanitization des inputs
- HTTPS only
- XSS protection

## 📦 Scripts Disponibles

```bash
npm start          # Démarrage dev server
npm run build      # Build production
npm test           # Lancer les tests
npm run lint       # Linter le code
npm run format     # Formatter le code
```

## 🐛 Debugging

### React DevTools
- Extension browser pour inspecter composants
- Voir l'état et les props

### Redux DevTools (si Redux utilisé)
- Inspecter le store
- Time travel debugging

## 📞 Support & Contact

Pour toute question ou problème :
- Email: support@ooryxx.com
- Documentation: https://docs.ooryxx.com
- GitHub Issues: https://github.com/ooryxx/frontend/issues

## 📝 TODO

- [ ] Implémenter tous les controllers backend
- [ ] Créer les tests unitaires
- [ ] Optimiser les performances
- [ ] Ajouter Progressive Web App (PWA)
- [ ] Implémenter Analytics
- [ ] Ajouter ChatBot support client

---

**Version**: 1.0.0  
**Dernière mise à jour**: {{DATE}}  
**Maintenu par**: Équipe Ooryxx
