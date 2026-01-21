import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Charger le panier depuis le localStorage au démarrage
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    };

    loadCart();
  }, []);

  // Sauvegarder le panier dans le localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier:', error);
    }
  }, [cartItems]);

  // Ajouter un produit au panier
  const addToCart = async (product, quantity = 1, options = {}) => {
    // Si l'utilisateur est connecté, envoyer au backend
    if (user) {
      try {
        setIsLoading(true);
        const productId = product._id || product.id;

        // Importer dynamiquement pour éviter les dépendances circulaires
        const userService = (await import('../services/userService')).default;
        const { toast } = await import('react-toastify');

        await userService.addToCart(productId, quantity, options);

        // Recharger le panier depuis le backend
        const cartResponse = await userService.getCart();
        const backendCart = cartResponse.data;

        // Convertir le format backend vers le format frontend
        const formattedItems = backendCart.items.map(item => ({
          id: item.productId._id || item.productId,
          name: item.productId.title || item.productId.name,
          price: item.productId.finalPrice || item.productId.price,
          originalPrice: item.productId.price,
          image: item.productId.images?.[0]?.url || item.productId.image,
          quantity: item.quantity,
          options: item.selectedVariants || {},
          vendorId: item.productId.vendorId,
          addedAt: item.addedAt
        }));

        setCartItems(formattedItems);
        toast.success('Produit ajouté au panier !');
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        const { toast } = await import('react-toastify');
        toast.error('Erreur lors de l\'ajout au panier');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Pour les utilisateurs non connectés, utiliser localStorage
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => (item.id === (product._id || product.id)) && JSON.stringify(item.options) === JSON.stringify(options)
      );

      if (existingItemIndex > -1) {
        // Le produit existe déjà, augmenter la quantité
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Nouveau produit, l'ajouter au panier
        return [...prevItems, {
          id: product._id || product.id,
          name: product.title || product.name,
          price: product.finalPrice || product.price,
          originalPrice: product.price || product.originalPrice,
          image: product.images?.[0]?.url || product.image,
          quantity,
          options,
          vendorId: product.vendorId,
          addedAt: new Date().toISOString()
        }];
      }
    });

    // Afficher une notification de succès
    showNotification('Produit ajouté au panier', 'success');
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = async (itemId, newQuantity, options = {}) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, options);
      return;
    }

    // Si connecté, mettre à jour sur le backend
    if (user) {
      try {
        setIsLoading(true);
        const userService = (await import('../services/userService')).default;
        await userService.updateCartItem(itemId, newQuantity);

        // Recharger le panier
        const cartResponse = await userService.getCart();
        const backendCart = cartResponse.data;
        const formattedItems = backendCart.items.map(item => ({
          id: item.productId._id || item.productId,
          name: item.productId.title || item.productId.name,
          price: item.productId.finalPrice || item.productId.price,
          originalPrice: item.productId.price,
          image: item.productId.images?.[0]?.url || item.productId.image,
          quantity: item.quantity,
          options: item.selectedVariants || {},
          vendorId: item.productId.vendorId,
          addedAt: item.addedAt
        }));
        setCartItems(formattedItems);
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Pour les utilisateurs non connectés
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId && JSON.stringify(item.options) === JSON.stringify(options)) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Supprimer un produit du panier
  const removeFromCart = async (itemId, options = {}) => {
    // Si connecté, supprimer du backend
    if (user) {
      try {
        setIsLoading(true);
        const userService = (await import('../services/userService')).default;
        await userService.removeFromCart(itemId);

        // Recharger le panier
        const cartResponse = await userService.getCart();
        const backendCart = cartResponse.data;
        const formattedItems = backendCart.items.map(item => ({
          id: item.productId._id || item.productId,
          name: item.productId.title || item.productId.name,
          price: item.productId.finalPrice || item.productId.price,
          originalPrice: item.productId.price,
          image: item.productId.images?.[0]?.url || item.productId.image,
          quantity: item.quantity,
          options: item.selectedVariants || {},
          vendorId: item.productId.vendorId,
          addedAt: item.addedAt
        }));
        setCartItems(formattedItems);
        showNotification('Produit supprimé du panier', 'info');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Pour les utilisateurs non connectés
    setCartItems(prevItems =>
      prevItems.filter(item =>
        !(item.id === itemId && JSON.stringify(item.options) === JSON.stringify(options))
      )
    );

    showNotification('Produit supprimé du panier', 'info');
  };

  // Vider le panier
  const clearCart = async () => {
    // Si connecté, vider sur le backend
    if (user) {
      try {
        setIsLoading(true);
        const userService = (await import('../services/userService')).default;
        await userService.clearCart();
        setCartItems([]);
        showNotification('Panier vidé', 'info');
      } catch (error) {
        console.error('Erreur lors du vidage du panier:', error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Pour les utilisateurs non connectés
    setCartItems([]);
    showNotification('Panier vidé', 'info');
  };

  // Calculer le total du panier
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculer le nombre total d'articles
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculer les économies totales
  const getTotalSavings = () => {
    return cartItems.reduce((total, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return total + ((item.originalPrice - item.price) * item.quantity);
      }
      return total;
    }, 0);
  };

  // Obtenir les articles groupés par vendeur
  const getItemsByVendor = () => {
    const groupedItems = cartItems.reduce((acc, item) => {
      const vendorId = item.vendorId || 'unknown';
      if (!acc[vendorId]) {
        acc[vendorId] = [];
      }
      acc[vendorId].push(item);
      return acc;
    }, {});

    return groupedItems;
  };

  // Calculer les frais de livraison
  const getShippingCost = () => {
    const total = getCartTotal();
    const freeShippingThreshold = 100; // 100 DT pour livraison gratuite

    if (total >= freeShippingThreshold) {
      return 0;
    }

    // Frais de livraison par vendeur
    const vendors = Object.keys(getItemsByVendor());
    return vendors.length * 7; // 7 DT par vendeur
  };

  // Vérifier si un produit est dans le panier
  const isInCart = (productId, options = {}) => {
    return cartItems.some(item =>
      item.id === productId && JSON.stringify(item.options) === JSON.stringify(options)
    );
  };

  // Obtenir la quantité d'un produit dans le panier
  const getItemQuantity = (productId, options = {}) => {
    const item = cartItems.find(item =>
      item.id === productId && JSON.stringify(item.options) === JSON.stringify(options)
    );
    return item ? item.quantity : 0;
  };

  // Synchroniser le panier avec le serveur (si l'utilisateur est connecté)
  const syncCartWithServer = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      // Ici, vous pourriez implémenter la synchronisation avec l'API
      // const response = await cartService.syncCart(cartItems);
      console.log('Synchronisation du panier avec le serveur...');
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction utilitaire pour afficher des notifications
  const showNotification = (message, type = 'info') => {
    // Ici, vous pourriez utiliser une librairie de notifications comme react-hot-toast
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  // Appliquer un code promo
  const applyPromoCode = (code) => {
    // Ici, vous pourriez valider le code promo avec l'API
    console.log(`Application du code promo: ${code}`);
    return { success: true, discount: 10, message: 'Code promo appliqué avec succès' };
  };

  // Estimer le temps de livraison
  const getEstimatedDeliveryTime = () => {
    return '2-3 jours ouvrés';
  };

  const value = {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getTotalSavings,
    getItemsByVendor,
    getShippingCost,
    isInCart,
    getItemQuantity,
    syncCartWithServer,
    applyPromoCode,
    getEstimatedDeliveryTime
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};