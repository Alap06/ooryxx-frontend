import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon, HeartIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import userService from '../services/userService';
import ErrorHandler from '../utils/errorHandler';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await userService.getCart();
      setCart(response.data || response);
    } catch (error) {
      ErrorHandler.handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(true);
      await userService.updateCartItem(productId, newQuantity);
      await loadCart();
      toast.success('Quantité mise à jour');
    } catch (error) {
      ErrorHandler.handleApiError(error);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating(true);
      await userService.removeFromCart(productId);
      await loadCart();
      toast.success('Produit retiré du panier');
    } catch (error) {
      ErrorHandler.handleApiError(error);
    } finally {
      setUpdating(false);
    }
  };

  const moveToWishlist = async (productId) => {
    try {
      await userService.addToWishlist(productId);
      await removeItem(productId);
      toast.success('Produit ajouté à la wishlist');
    } catch (error) {
      ErrorHandler.handleApiError(error);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Voulez-vous vraiment vider votre panier ?')) return;
    
    try {
      setUpdating(true);
      await userService.clearCart();
      await loadCart();
      toast.success('Panier vidé');
    } catch (error) {
      ErrorHandler.handleApiError(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Panier</h1>
          {!isEmpty && (
            <button
              onClick={clearCart}
              disabled={updating}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
            >
              <TrashIcon className="w-5 h-5" />
              Vider le panier
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBagIcon className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Votre panier est vide</h2>
            <p className="text-gray-500 mb-6">Découvrez nos produits et ajoutez-en à votre panier</p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Continuer mes achats
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des articles */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const product = item.productId;
                if (!product) return null;

                return (
                  <div key={item._id || product._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                    <div className="flex gap-6">
                      {/* Image */}
                      <Link to={`/products/${product._id}`} className="flex-shrink-0">
                        <img
                          src={product.images?.[0] || '/placeholder.jpg'}
                          alt={product.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </Link>

                      {/* Détails */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <Link to={`/products/${product._id}`} className="hover:text-blue-600">
                            <h3 className="font-semibold text-lg text-gray-900">{product.title}</h3>
                          </Link>
                          <button
                            onClick={() => removeItem(product._id)}
                            disabled={updating}
                            className="text-gray-400 hover:text-red-600 transition"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Prix */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl font-bold text-gray-900">
                            {((product.price * (1 - product.discount / 100)) * item.quantity).toFixed(2)} DT
                          </span>
                          {product.discount > 0 && (
                            <>
                              <span className="text-gray-400 line-through">
                                {(product.price * item.quantity).toFixed(2)} DT
                              </span>
                              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                                -{product.discount}%
                              </span>
                            </>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          {/* Quantité */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(product._id, item.quantity - 1)}
                              disabled={updating || item.quantity <= 1}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              <MinusIcon className="w-5 h-5" />
                            </button>
                            <span className="px-4 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(product._id, item.quantity + 1)}
                              disabled={updating || item.quantity >= product.stock}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              <PlusIcon className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Wishlist */}
                          <button
                            onClick={() => moveToWishlist(product._id)}
                            disabled={updating}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                          >
                            <HeartIcon className="w-5 h-5" />
                            <span className="text-sm">Mettre de côté</span>
                          </button>
                        </div>

                        {/* Stock */}
                        {product.stock < 10 && product.stock > 0 && (
                          <p className="text-orange-600 text-sm mt-2">
                            Plus que {product.stock} en stock !
                          </p>
                        )}
                        {product.stock === 0 && (
                          <p className="text-red-600 text-sm mt-2 font-medium">
                            Rupture de stock
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Résumé */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-6">Résumé de la commande</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total ({items.length} article{items.length > 1 ? 's' : ''})</span>
                    <span className="font-medium">{cart?.estimatedTotal?.toFixed(2) || '0.00'} DT</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className="font-medium text-green-600">Gratuite</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{cart?.estimatedTotal?.toFixed(2) || '0.00'} DT</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  disabled={updating || items.some(item => !item.productId?.isActive || item.productId?.stock === 0)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition mb-3"
                >
                  Passer la commande
                </button>

                <Link
                  to="/products"
                  className="block w-full text-center border border-gray-300 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Continuer mes achats
                </Link>

                {/* Garanties */}
                <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Paiement 100% sécurisé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Livraison gratuite</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Retour sous 14 jours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

