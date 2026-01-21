import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowsUpDownIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import {
  getAllFeaturedProducts,
  createFeaturedProduct,
  updateFeaturedProduct,
  deleteFeaturedProduct,
  toggleFeaturedProduct,
  reorderFeaturedProducts
} from '../../services/featuredProductService';

// Palette de couleurs premium
const colors = {
  primary: '#e67d07',
  dark: '#121312',
  cream: '#fbfaf3',
  gold: '#ebbb83',
  gray: '#9f9f9f',
  light: '#ffefc8',
  charcoal: '#4a4b4a',
  bronze: '#cb8734'
};

const badgeOptions = ['Bestseller', 'Nouveau', 'Tendance', 'Exclusif', 'Promo', 'Limité', 'Top Vente'];

const FeaturedProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isReordering, setIsReordering] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    currency: 'DT',
    image: '',
    badge: 'Nouveau',
    rating: '4.5',
    reviewsCount: '0',
    productLink: '',
    displayOrder: '0',
    isActive: true,
    startDate: '',
    endDate: ''
  });

  // Charger les produits
  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllFeaturedProducts();
      if (response.success) {
        setProducts(response.data?.products || []);
      }
    } catch (err) {
      setError('Erreur lors du chargement des produits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      currency: 'DT',
      image: '',
      badge: 'Nouveau',
      rating: '4.5',
      reviewsCount: '0',
      productLink: '',
      displayOrder: '0',
      isActive: true,
      startDate: '',
      endDate: ''
    });
    setEditingProduct(null);
  };

  // Ouvrir le modal pour édition
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      originalPrice: product.originalPrice?.toString() || '',
      currency: product.currency || 'DT',
      image: product.image || '',
      badge: product.badge || 'Nouveau',
      rating: product.rating?.toString() || '4.5',
      reviewsCount: product.reviewsCount?.toString() || '0',
      productLink: product.productLink || '',
      displayOrder: product.displayOrder?.toString() || '0',
      isActive: product.isActive !== false,
      startDate: product.startDate ? new Date(product.startDate).toISOString().split('T')[0] : '',
      endDate: product.endDate ? new Date(product.endDate).toISOString().split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      rating: parseFloat(formData.rating),
      reviewsCount: parseInt(formData.reviewsCount),
      displayOrder: parseInt(formData.displayOrder),
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined
    };

    try {
      if (editingProduct) {
        await updateFeaturedProduct(editingProduct._id, productData);
        setSuccess('Produit mis à jour avec succès');
      } else {
        await createFeaturedProduct(productData);
        setSuccess('Produit créé avec succès');
      }
      setIsModalOpen(false);
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
    }

    setTimeout(() => setSuccess(null), 3000);
  };

  // Supprimer un produit
  const handleDelete = async (id) => {
    try {
      await deleteFeaturedProduct(id);
      setSuccess('Produit supprimé avec succès');
      setDeleteConfirm(null);
      loadProducts();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
    setTimeout(() => setSuccess(null), 3000);
  };

  // Activer/Désactiver un produit
  const handleToggle = async (id) => {
    try {
      await toggleFeaturedProduct(id);
      loadProducts();
    } catch (err) {
      setError(err.message || 'Erreur lors du changement de statut');
    }
  };

  // Réorganiser les produits (drag & drop simulé avec boutons)
  const moveProduct = async (index, direction) => {
    const newProducts = [...products];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newProducts.length) return;
    
    [newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]];
    
    setProducts(newProducts);
    setIsReordering(true);
    
    try {
      const reorderData = newProducts.map((p, i) => ({ id: p._id, displayOrder: i }));
      await reorderFeaturedProducts(reorderData);
    } catch (err) {
      setError('Erreur lors de la réorganisation');
      loadProducts(); // Recharger en cas d'erreur
    } finally {
      setIsReordering(false);
    }
  };

  // Calculer le pourcentage de réduction
  const calculateDiscount = (price, originalPrice) => {
    if (originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3" style={{ color: colors.dark }}>
            <SparklesIcon className="w-8 h-8" style={{ color: colors.primary }} />
            Produits en Vedette
          </h1>
          <p style={{ color: colors.gray }}>Gérez les produits affichés dans le slider Hero</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white shadow-lg"
          style={{ backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.bronze})` }}
        >
          <PlusIcon className="w-5 h-5" />
          Ajouter un Produit
        </motion.button>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 rounded-xl bg-red-100 text-red-700 flex items-center gap-2"
          >
            <ExclamationTriangleIcon className="w-5 h-5" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 rounded-xl bg-green-100 text-green-700 flex items-center gap-2"
          >
            <CheckIcon className="w-5 h-5" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="w-8 h-8 animate-spin" style={{ color: colors.primary }} />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <PhotoIcon className="w-16 h-16 mx-auto mb-4" style={{ color: colors.gray }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: colors.dark }}>Aucun produit en vedette</h3>
          <p style={{ color: colors.gray }}>Commencez par ajouter un produit pour le slider Hero</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="sm:w-48 h-48 sm:h-auto relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {!product.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold">Désactivé</span>
                    </div>
                  )}
                  {product.badge && (
                    <span
                      className="absolute top-2 left-2 px-2 py-1 rounded-full text-white text-xs font-bold"
                      style={{ backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.bronze})` }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: colors.dark }}>{product.name}</h3>
                        {product.description && (
                          <p className="text-sm mt-1 line-clamp-2" style={{ color: colors.gray }}>
                            {product.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-black" style={{ color: colors.primary }}>
                          {product.price?.toLocaleString()}
                        </span>
                        <span className="text-sm" style={{ color: colors.gray }}>{product.currency}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-3">
                      {product.originalPrice && (
                        <span className="text-sm px-2 py-1 rounded-full bg-red-100 text-red-600 font-medium">
                          -{calculateDiscount(product.price, product.originalPrice)}%
                        </span>
                      )}
                      <span className="text-sm px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                        ⭐ {product.rating}
                      </span>
                      <span className="text-sm px-2 py-1 rounded-full bg-gray-100" style={{ color: colors.charcoal }}>
                        Ordre: {product.displayOrder}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    {/* Reorder buttons */}
                    <div className="flex items-center gap-1 mr-2">
                      <button
                        onClick={() => moveProduct(index, 'up')}
                        disabled={index === 0 || isReordering}
                        className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      >
                        <ArrowsUpDownIcon className="w-4 h-4 rotate-180" style={{ color: colors.charcoal }} />
                      </button>
                      <button
                        onClick={() => moveProduct(index, 'down')}
                        disabled={index === products.length - 1 || isReordering}
                        className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      >
                        <ArrowsUpDownIcon className="w-4 h-4" style={{ color: colors.charcoal }} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleToggle(product._id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        product.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {product.isActive ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                      {product.isActive ? 'Actif' : 'Inactif'}
                    </button>

                    <button
                      onClick={() => openEditModal(product)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Modifier
                    </button>

                    <button
                      onClick={() => setDeleteConfirm(product._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Formulaire */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold" style={{ color: colors.dark }}>
                  {editingProduct ? 'Modifier le Produit' : 'Nouveau Produit en Vedette'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.charcoal }}>
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    placeholder="Ex: Montre Luxe Édition Or"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.charcoal }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    rows={2}
                    placeholder="Description courte du produit"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.charcoal }}>
                    URL de l'image *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mt-2 w-24 h-24 object-cover rounded-lg"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                </div>

                {/* Prix */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.charcoal }}>
                      Prix actuel *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      placeholder="999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.charcoal }}>
                      Prix original (barré)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      placeholder="1299"
                    />
                  </div>
                </div>

                {/* Badge et Rating */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.charcoal }}>
                      Badge
                    </label>
                    <select
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      {badgeOptions.map((badge) => (
                        <option key={badge} value={badge}>{badge}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.charcoal }}>
                      Note (0-5)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                </div>

                {/* Lien produit et Ordre */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.charcoal }}>
                      Lien vers produit
                    </label>
                    <input
                      type="text"
                      value={formData.productLink}
                      onChange={(e) => setFormData({ ...formData, productLink: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      placeholder="/products/123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.charcoal }}>
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                </div>

                {/* Dates de validité */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.charcoal }}>
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.charcoal }}>
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                </div>

                {/* Statut actif */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: colors.primary }}
                  />
                  <label htmlFor="isActive" className="text-sm font-medium" style={{ color: colors.charcoal }}>
                    Produit actif (visible dans le slider)
                  </label>
                </div>

                {/* Boutons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    style={{ color: colors.charcoal }}
                  >
                    Annuler
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-xl font-medium text-white shadow-lg"
                    style={{ backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.bronze})` }}
                  >
                    {editingProduct ? 'Mettre à jour' : 'Créer'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Confirmation Suppression */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: colors.dark }}>
                  Confirmer la suppression
                </h3>
                <p className="text-sm mb-6" style={{ color: colors.gray }}>
                  Cette action est irréversible. Le produit sera définitivement supprimé du slider.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeaturedProductsManagement;
