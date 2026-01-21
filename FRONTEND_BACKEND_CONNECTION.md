# 🔗 Guide de Connexion Frontend ↔ Backend

## 📋 Configuration Actuelle

### Backend
- **Port**: 5000
- **Base URL**: `http://localhost:5000`
- **API Base**: `http://localhost:5000/api`

### Frontend
- **Port**: 3000
- **URL**: `http://localhost:3000`
- **Proxy vers Backend**: Automatique via configuration

## ✅ 1. Vérifier le Fichier .env

### Frontend (.env)

Créez/Vérifiez `ooryxx-frontend/.env` :

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_STRIPE_KEY=your_stripe_key_here
```

### Backend (.env)

Vérifiez `ooryxx-backend/.env` :

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://ooryxx_db:5qYCF7KHBlxAM97y@ooryxxdb.bf7e27f.mongodb.net/ooryxx?retryWrites=true&w=majority&appName=ooryxxdb

# JWT Secrets
JWT_SECRET=mI2s*)fYNCAbfVsb)!uWKq6vwmQe(Xb5pL9#zR4@tH8$nK3&jM7^xC6%vB1
JWT_REFRESH_SECRET=gT5&hN9@wP3#sD7*fJ2!qL8$mK4^rX6)vC1%bZ0+yH3-aE9~iU7=oW2_nQ5
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

## ✅ 2. Configuration CORS Backend

Le fichier `ooryxx-backend/src/app.js` doit avoir :

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## ✅ 3. Utilisation du Service API Frontend

### Import du Service

```javascript
import { api, apiService, endpoints } from '../services/api';
```

### Exemples d'Utilisation

#### A. Authentification

```javascript
// Login
const handleLogin = async (email, password) => {
  try {
    const response = await apiService.post(endpoints.auth.login, {
      email,
      password
    });
    
    // Sauvegarder le token
    localStorage.setItem('token', response.token);
    apiService.setAuthToken(response.token);
    
    console.log('Utilisateur connecté:', response.user);
  } catch (error) {
    console.error('Erreur de connexion:', error.message);
  }
};

// Register
const handleRegister = async (userData) => {
  try {
    const response = await apiService.post(endpoints.auth.register, userData);
    localStorage.setItem('token', response.token);
    apiService.setAuthToken(response.token);
  } catch (error) {
    console.error('Erreur d\'inscription:', error.message);
  }
};
```

#### B. Produits

```javascript
// Liste des produits
const fetchProducts = async () => {
  try {
    const products = await api.getProducts({ category: 'electronics' }, 1, 20);
    console.log('Produits:', products);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};

// Détails d'un produit
const fetchProduct = async (productId) => {
  try {
    const product = await api.getProduct(productId);
    console.log('Produit:', product);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};

// Recherche de produits
const searchProducts = async (query) => {
  try {
    const results = await api.searchProducts(query, {}, 1, 20);
    console.log('Résultats:', results);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};
```

#### C. Panier

```javascript
// Ajouter au panier
const addToCart = async (productId, quantity = 1) => {
  try {
    const result = await api.cart.add(productId, quantity);
    console.log('Ajouté au panier:', result);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};

// Obtenir le panier
const getCart = async () => {
  try {
    const cart = await api.cart.get();
    console.log('Panier:', cart);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};

// Mettre à jour la quantité
const updateCartItem = async (itemId, quantity) => {
  try {
    const result = await api.cart.update(itemId, quantity);
    console.log('Mis à jour:', result);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};

// Supprimer du panier
const removeFromCart = async (itemId) => {
  try {
    await api.cart.remove(itemId);
    console.log('Supprimé du panier');
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};
```

#### D. Commandes

```javascript
// Créer une commande
const createOrder = async (orderData) => {
  try {
    const order = await api.orders.create({
      items: orderData.items,
      shippingAddress: orderData.address,
      paymentMethod: orderData.paymentMethod
    });
    console.log('Commande créée:', order);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};

// Liste des commandes
const fetchOrders = async () => {
  try {
    const orders = await api.orders.list(1, 10);
    console.log('Commandes:', orders);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};

// Suivi de commande
const trackOrder = async (orderId) => {
  try {
    const tracking = await api.orders.track(orderId);
    console.log('Suivi:', tracking);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};
```

#### E. Upload de Fichiers

```javascript
// Upload d'une image
const uploadImage = async (file) => {
  try {
    const result = await api.upload.image(file, {
      category: 'product',
      alt: 'Product image'
    });
    console.log('Image uploadée:', result.url);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};

// Upload multiple
const uploadMultiple = async (files) => {
  try {
    const result = await api.upload.images(files);
    console.log('Images uploadées:', result.urls);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};
```

## ✅ 4. Utilisation dans les Contexts

### AuthContext

```javascript
import { apiService, endpoints } from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    try {
      const response = await apiService.post(endpoints.auth.login, {
        email,
        password
      });
      
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      apiService.setAuthToken(response.token);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    apiService.setAuthToken(null);
  };

  // ... reste du code
};
```

### CartContext

```javascript
import { api } from '../services/api';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const syncWithServer = async () => {
    try {
      const serverCart = await api.cart.get();
      setCartItems(serverCart.items);
    } catch (error) {
      console.error('Erreur de synchronisation:', error);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const result = await api.cart.add(product.id, quantity);
      setCartItems(result.items);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ... reste du code
};
```

## ✅ 5. Démarrage des Serveurs

### Terminal 1 - Backend

```bash
cd ooryxx-backend
npm run dev
```

**Sortie attendue:**
```
➡️  Serveur démarré sur le port 5000
➡️  Environnement: development
MongoDB connecté: ooryxxdb.bf7e27f.mongodb.net
```

### Terminal 2 - Frontend

```bash
cd ooryxx-frontend
npm start
```

**Sortie attendue:**
```
Compiled successfully!

You can now view ooryxx-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

## ✅ 6. Test de la Connexion

### A. Test Manuel avec cURL

```bash
# Test du backend
curl http://localhost:5000/health

# Test d'un endpoint API
curl http://localhost:5000/api/products
```

### B. Test depuis le Frontend

Créez un fichier de test `src/tests/apiTest.js` :

```javascript
import { api, apiService, endpoints } from '../services/api';

export const testConnection = async () => {
  console.log('🧪 Test de connexion Frontend → Backend');
  
  try {
    // Test 1: Health check
    console.log('Test 1: Health check...');
    const health = await apiService.get('/health');
    console.log('✅ Backend actif:', health);
    
    // Test 2: Produits
    console.log('Test 2: Récupération des produits...');
    const products = await api.getProducts();
    console.log('✅ Produits récupérés:', products.length, 'produits');
    
    // Test 3: Catégories
    console.log('Test 3: Récupération des catégories...');
    const categories = await api.getCategories();
    console.log('✅ Catégories récupérées:', categories.length, 'catégories');
    
    console.log('🎉 Tous les tests sont passés!');
    return true;
  } catch (error) {
    console.error('❌ Erreur de test:', error.message);
    return false;
  }
};
```

Appelez la fonction dans un composant :

```javascript
import { useEffect } from 'react';
import { testConnection } from './tests/apiTest';

function App() {
  useEffect(() => {
    testConnection();
  }, []);
  
  return <div>...</div>;
}
```

## ✅ 7. Gestion des Erreurs

### Intercepteur Global

Le service API gère automatiquement :
- ✅ Erreurs 401 (Unauthorized) → Redirection vers /login
- ✅ Erreurs réseau → Message d'erreur approprié
- ✅ Timeout des requêtes
- ✅ Refresh automatique du token

### Affichage des Erreurs

```javascript
import { toast } from 'react-toastify';

const fetchData = async () => {
  try {
    const data = await api.getProducts();
    setProducts(data);
  } catch (error) {
    toast.error(error.message || 'Une erreur est survenue');
  }
};
```

## ✅ 8. Endpoints Disponibles

### Tous les endpoints configurés :

```javascript
// Authentification
endpoints.auth.login              → POST /api/auth/login
endpoints.auth.register           → POST /api/auth/register
endpoints.auth.logout             → POST /api/auth/logout

// Produits
endpoints.products.list           → GET /api/products
endpoints.products.detail(id)     → GET /api/products/:id
endpoints.products.search         → GET /api/products/search

// Panier
endpoints.cart.get                → GET /api/cart
endpoints.cart.add                → POST /api/cart/add
endpoints.cart.update             → PUT /api/cart/update
endpoints.cart.remove             → DELETE /api/cart/remove

// Commandes
endpoints.orders.list             → GET /api/orders
endpoints.orders.detail(id)       → GET /api/orders/:id
endpoints.orders.create           → POST /api/orders

// Utilisateurs
endpoints.users.profile           → GET /api/users/profile
endpoints.users.update            → PUT /api/users/profile
endpoints.users.addresses         → GET /api/users/addresses

// Et bien plus...
```

## 🐛 Troubleshooting

### Erreur: CORS Policy

**Problème**: `Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution**: Vérifier la configuration CORS dans `backend/src/app.js`

### Erreur: Network Error

**Problème**: `Error: Network Error`

**Solutions**:
1. Vérifier que le backend est démarré
2. Vérifier l'URL dans le .env
3. Vérifier les ports (5000 et 3000)

### Erreur: 401 Unauthorized

**Problème**: Requêtes rejetées avec 401

**Solutions**:
1. Vérifier que le token est bien sauvegardé
2. Vérifier que le token est valide
3. Se reconnecter si nécessaire

## 📊 Checklist de Connexion

- [ ] Backend démarré sur port 5000
- [ ] Frontend démarré sur port 3000
- [ ] Fichier .env configuré (backend)
- [ ] Fichier .env configuré (frontend)
- [ ] CORS configuré dans le backend
- [ ] MongoDB Atlas connecté
- [ ] Test de health check réussi
- [ ] Test d'un endpoint API réussi
- [ ] Authentification fonctionnelle
- [ ] Panier synchronisé avec le backend

## 🎯 Résumé

### Architecture Complète

```
┌─────────────────────────────────────────┐
│         FRONTEND (Port 3000)            │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   React Components               │  │
│  │   ↓                              │  │
│  │   Contexts (Auth, Cart)          │  │
│  │   ↓                              │  │
│  │   Services API (api.js)          │  │
│  └──────────────────────────────────┘  │
└─────────────────┬───────────────────────┘
                  │ HTTP/HTTPS
                  │ (CORS enabled)
                  ↓
┌─────────────────────────────────────────┐
│         BACKEND (Port 5000)             │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   Express Routes                 │  │
│  │   ↓                              │  │
│  │   Controllers                    │  │
│  │   ↓                              │  │
│  │   Mongoose Models                │  │
│  │   ↓                              │  │
│  │   MongoDB Atlas                  │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Votre application est maintenant prête à communiquer entre le frontend et le backend ! 🎉**

---

**Besoin d'aide?** Consultez ce guide à chaque fois que vous avez un doute sur la connexion Frontend-Backend.
