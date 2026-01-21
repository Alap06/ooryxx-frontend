import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  HeartIcon,
  ShoppingCartIcon,
  TruckIcon,
  ShieldCheckIcon,
  MagnifyingGlassPlusIcon,
  XMarkIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { productService } from '../services/productService';
import userService from '../services/userService';
import ErrorHandler from '../utils/errorHandler';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../context/CurrencyContext';
import CurrencySelector from '../components/common/CurrencySelector';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [adding, setAdding] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [question, setQuestion] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const { isAuthenticated } = useAuth();
  const { formatPrice: formatPriceCurrency } = useCurrency();

  useEffect(() => {
    loadProduct();
    loadReviews();
    checkWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProduct(id);
      setProduct(response.data || response.product);
    } catch (error) {
      ErrorHandler.handleApiError(error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const response = await userService.getWishlist();
      const wishlist = response.data || [];
      setInWishlist(wishlist.some(item => item._id === id));
    } catch (error) {
      // Silently fail if not authenticated
    }
  };

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await productService.getProductReviews(id);
      setReviews(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const addToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour ajouter au panier');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    try {
      setAdding(true);
      await userService.addToCart(id, quantity);
      toast.success('Produit ajouté au panier !');
    } catch (error) {
      ErrorHandler.handleApiError(error);
    } finally {
      setAdding(false);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour gérer vos favoris');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    try {
      if (inWishlist) {
        await userService.removeFromWishlist(id);
        setInWishlist(false);
        toast.success('Retiré de la wishlist');
      } else {
        await userService.addToWishlist(id);
        setInWishlist(true);
        toast.success('Ajouté à la wishlist');
      }
    } catch (error) {
      ErrorHandler.handleApiError(error);
    }
  };

  const buyNow = async () => {
    await addToCart();
    navigate('/cart');
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour poser une question');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    if (!question.trim()) {
      toast.error('Veuillez saisir votre question');
      return;
    }

    setSubmittingQuestion(true);
    try {
      // TODO: Implémenter l'API pour les questions
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Votre question a été envoyée !');
      setQuestion('');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la question');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour laisser un avis');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    if (rating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }

    if (!review.trim()) {
      toast.error('Veuillez saisir votre avis');
      return;
    }

    setSubmittingReview(true);
    try {
      await productService.addReview(id, { rating, comment: review });
      toast.success('Votre avis a été publié !');
      setRating(0);
      setReview('');
      loadProduct(); // Recharger pour afficher le nouvel avis
      loadReviews(); // Recharger la liste des avis
    } catch (error) {
      ErrorHandler.handleApiError(error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const nextImage = () => {
    if (product?.images?.length > 0) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images?.length > 0) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700">
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  const finalPrice = product.finalPrice || product.price * (1 - (product.discount?.percentage || 0) / 100);
  const images = product.images && product.images.length > 0 ? product.images : [product.image || '/api/placeholder/600/600'];
  const isInStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm text-neutral-600">
          <Link to="/" className="hover:text-primary-600">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary-600">Produits</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-lg shadow-sm p-8 mb-8">
          {/* Images Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 group">
              <img
                src={typeof images[selectedImage] === 'string' ? images[selectedImage] : images[selectedImage]?.url || '/api/placeholder/600/600'}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Zoom Button */}
              <button
                onClick={() => setZoomedImage(images[selectedImage])}
                className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white hover:scale-110"
                title="Zoom"
              >
                <MagnifyingGlassPlusIcon className="w-6 h-6 text-neutral-700" />
              </button>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                  >
                    <ChevronLeftIcon className="w-6 h-6 text-neutral-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                  >
                    <ChevronRightIcon className="w-6 h-6 text-neutral-700" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${selectedImage === idx ? 'border-primary-600' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                  >
                    <img
                      src={typeof img === 'string' ? img : img?.url || '/api/placeholder/100/100'}
                      alt={`Vue ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-neutral-900">{product.title}</h1>
                <CurrencySelector />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-warning-400' : 'text-neutral-300'}`}
                    />
                  ))}
                </div>
                <span className="text-neutral-600">
                  {product.rating?.toFixed(1) || '0.0'} ({product.reviewCount || product.reviewsCount || 0} avis)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-neutral-900">
                  {formatPriceCurrency(finalPrice)}
                </span>
                {product.discount?.percentage > 0 && (
                  <>
                    <span className="text-2xl text-neutral-400 line-through">
                      {formatPriceCurrency(product.price)}
                    </span>
                    <span className="bg-error-100 text-error-600 px-3 py-1 rounded-full font-semibold">
                      -{product.discount.percentage}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-b py-4">
              <p className="text-neutral-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {isInStock ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-success-500"></div>
                  <span className="text-success-600 font-medium">
                    En stock ({product.stock} disponibles)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-error-500"></div>
                  <span className="text-error-600 font-medium">Rupture de stock</span>
                </>
              )}
            </div>

            {/* Quantity */}
            {isInStock && (
              <div className="flex items-center gap-4">
                <label className="font-medium text-neutral-700">Quantité:</label>
                <div className="flex items-center border border-neutral-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-neutral-100 transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-16 text-center border-x border-neutral-300 py-2"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-neutral-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={addToCart}
                disabled={!isInStock || adding}
                className="flex-1 bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                Ajouter au panier
              </button>

              <button
                onClick={toggleWishlist}
                className={`p-4 rounded-lg border-2 transition ${inWishlist
                  ? 'border-error-500 bg-error-50 text-error-600'
                  : 'border-neutral-300 hover:border-neutral-400'
                  }`}
              >
                {inWishlist ? (
                  <HeartSolidIcon className="w-6 h-6" />
                ) : (
                  <HeartIcon className="w-6 h-6" />
                )}
              </button>
            </div>

            {isInStock && (
              <button
                onClick={buyNow}
                disabled={adding}
                className="w-full bg-success-600 text-white py-4 rounded-lg font-semibold hover:bg-success-700 transition"
              >
                Acheter maintenant
              </button>
            )}

            {/* Garanties */}
            <div className="bg-neutral-50 rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-3 text-neutral-700">
                <TruckIcon className="w-6 h-6 text-primary-600" />
                <span>Livraison gratuite</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-700">
                <ShieldCheckIcon className="w-6 h-6 text-success-600" />
                <span>Garantie 2 ans</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-700">
                <svg className="w-6 h-6 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Retour gratuit sous 14 jours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Questions sur ce produit
          </h2>

          {isAuthenticated ? (
            <form onSubmit={handleSubmitQuestion} className="mb-6">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Posez votre question sur ce produit..."
                className="w-full border border-neutral-300 rounded-lg p-4 min-h-[120px] focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                disabled={submittingQuestion}
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={submittingQuestion || !question.trim()}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition"
                >
                  {submittingQuestion ? 'Envoi...' : 'Envoyer la question'}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-info-50 border border-info-200 rounded-lg p-4 mb-6">
              <p className="text-info-800">
                Vous devez être <Link to="/login" className="font-semibold text-info-600 hover:text-info-700 underline">connecté</Link> pour poser une question.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-neutral-500 text-sm">Aucune question pour le moment. Soyez le premier à poser une question !</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Avis clients</h2>

          {isAuthenticated ? (
            <form onSubmit={handleSubmitReview} className="mb-8 border-b pb-8">
              <h3 className="text-lg font-semibold mb-4">Laisser un avis</h3>

              {/* Star Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Votre note
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <StarSolidIcon
                        className={`w-8 h-8 ${star <= (hoverRating || rating)
                          ? 'text-warning-400'
                          : 'text-neutral-300'
                          }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm text-neutral-600">
                      {rating} étoile{rating > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Votre avis
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Partagez votre expérience avec ce produit..."
                  className="w-full border border-neutral-300 rounded-lg p-4 min-h-[120px] focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  disabled={submittingReview}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingReview || rating === 0 || !review.trim()}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition"
                >
                  {submittingReview ? 'Publication...' : 'Publier l\'avis'}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-info-50 border border-info-200 rounded-lg p-4 mb-6">
              <p className="text-info-800">
                Vous devez être <Link to="/login" className="font-semibold text-info-600 hover:text-info-700 underline">connecté</Link> pour laisser un avis.
              </p>
            </div>
          )}

          {/* Existing Reviews - VISIBLE PAR TOUS */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-800">
              {reviews.length > 0 ? `${reviews.length} avis client${reviews.length > 1 ? 's' : ''}` : 'Aucun avis pour le moment'}
            </h3>

            {loadingReviews ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-neutral-500 mt-2">Chargement des avis...</p>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((reviewItem, index) => (
                <div key={index} className="border-b border-neutral-200 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {reviewItem.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-800">
                          {reviewItem.user?.name || 'Utilisateur'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarSolidIcon
                                key={i}
                                className={`w-4 h-4 ${i < reviewItem.rating ? 'text-warning-400' : 'text-neutral-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-neutral-500">
                            {new Date(reviewItem.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-neutral-700 leading-relaxed">
                    {reviewItem.comment}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 text-center py-8">
                Aucun avis pour le moment. {isAuthenticated ? 'Soyez le premier à laisser un avis !' : 'Connectez-vous pour être le premier à laisser un avis !'}
              </p>
            )}
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Caractéristiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 border-b">
                  <span className="font-medium text-neutral-700">{key}:</span>
                  <span className="text-neutral-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 bg-white/10 p-2 rounded-full hover:bg-white/20 transition"
          >
            <XMarkIcon className="w-8 h-8 text-white" />
          </button>
          <img
            src={typeof zoomedImage === 'string' ? zoomedImage : zoomedImage?.url}
            alt="Zoom"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
