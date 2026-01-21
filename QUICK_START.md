# 🚀 Guide de Démarrage Rapide - Ooryxx Frontend

## 📋 Prérequis

- Node.js 16+ installé
- npm ou yarn
- Backend Ooryxx en cours d'exécution (port 5000)

## ⚡ Installation Rapide

### 1. Installer les dépendances manquantes

```bash
cd ooryxx-frontend
npm install i18next react-i18next i18next-browser-languagedetector
npm install lucide-react
npm install --save-dev @types/react @types/react-dom
```

### 2. Vérifier package.json

Assurez-vous que toutes ces dépendances sont présentes :

```json
{
  "dependencies": {
    "axios": "^1.11.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.9.1",
    "react-toastify": "^11.0.5",
    "@mui/material": "^7.3.2",
    "@mui/icons-material": "^7.3.2",
    "formik": "^2.4.6",
    "yup": "^1.7.0",
    "swiper": "^11.2.10",
    "i18next": "^23.7.6",
    "react-i18next": "^13.5.0",
    "i18next-browser-languagedetector": "^7.2.0",
    "lucide-react": "^0.294.0"
  }
}
```

### 3. Configuration initiale

#### a) Créer le fichier .env

```bash
# Dans le dossier ooryxx-frontend
touch .env
```

Ajouter:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_STRIPE_KEY=your_stripe_key_here
```

#### b) Mettre à jour index.js

```jsx
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n/config'; // Ajouter cette ligne
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
```

#### c) Mettre à jour App.js

```jsx
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import VendorDashboard from './pages/VendorDashboard';
import AdminPanel from './pages/AdminPanel';

// Components
import Header from './components/common/Header';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App min-h-screen flex flex-col">
              <Header />
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/vendor" element={<VendorDashboard />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
              <Footer />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
```

### 4. Mettre à jour le Header avec les nouveaux composants

```jsx
// src/components/common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import LanguageSwitch from './LanguageSwitch';
import ThemeSwitch from './ThemeSwitch';
import { ShoppingCart, User, Search } from 'lucide-react';

function Header() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();

  const cartItemsCount = cart?.items?.length || 0;

  return (
    <header className="bg-white dark:bg-neutral-900 shadow-sm">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Ooryxx
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t('common.searchPlaceholder')}
                className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <LanguageSwitch />
            <ThemeSwitch />
            
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-neutral-700 dark:text-neutral-200" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <User className="w-6 h-6 text-neutral-700 dark:text-neutral-200" />
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-primary-600"
                >
                  {t('common.logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {t('common.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
```

### 5. Démarrer le serveur de développement

```bash
npm start
```

L'application devrait s'ouvrir sur `http://localhost:3000`

## 🎨 Tester les Fonctionnalités

### 1. Changer de Langue
- Cliquer sur le sélecteur de langue dans le header
- Choisir entre Français, English ou العربية
- L'interface s'adapte automatiquement

### 2. Changer de Thème
- Cliquer sur l'icône palette dans le header
- Choisir parmi les thèmes: Bleu, Océan, Violet, Vert
- Activer/désactiver le mode sombre

### 3. Navigation
- Page d'accueil: `/`
- Catalogue: `/products`
- Panier: `/cart`
- Profil: `/profile`
- Connexion: `/login`

## 🔧 Troubleshooting

### Erreur: Module not found

```bash
# Si des modules manquent
npm install
npm install --legacy-peer-deps  # Si conflit de dépendances
```

### Erreur: Cannot find module 'i18next'

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### Erreur: Cannot find module 'lucide-react'

```bash
npm install lucide-react
```

### Port 3000 déjà utilisé

```bash
# Changer le port dans package.json
"scripts": {
  "start": "PORT=3001 react-scripts start"
}
```

### CORS Error

Vérifier que le backend est configuré pour accepter les requêtes de `http://localhost:3000`:

```javascript
// Dans le backend - src/app.js
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

## 📱 Test sur Mobile

### Utiliser ngrok pour tester sur mobile

```bash
# Installer ngrok
npm install -g ngrok

# Exposer le serveur local
ngrok http 3000

# Utiliser l'URL fournie sur votre mobile
```

## ✅ Checklist de Vérification

- [ ] Backend démarré sur port 5000
- [ ] Frontend démarré sur port 3000
- [ ] Fichier .env créé et configuré
- [ ] Toutes les dépendances installées
- [ ] i18n configuré et fonctionnel
- [ ] Thème personnalisable actif
- [ ] Navigation entre pages fonctionnelle
- [ ] API calls fonctionnels

## 🚀 Prochaines Étapes

1. **Développer les pages manquantes**
   - Compléter toutes les vues
   - Ajouter les fonctionnalités métier

2. **Connecter aux APIs Backend**
   - Implémenter tous les appels API
   - Gérer les états de chargement
   - Gérer les erreurs

3. **Optimiser les Performances**
   - Lazy loading
   - Code splitting
   - Image optimization

4. **Tests**
   - Tests unitaires (Jest)
   - Tests d'intégration
   - Tests E2E (Cypress)

5. **Déploiement**
   - Build production
   - Configuration CDN
   - Monitoring

## 📚 Ressources

- [React Documentation](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Material-UI Docs](https://mui.com/)
- [React Router Docs](https://reactrouter.com/)

---

**Bon développement ! 🎉**
