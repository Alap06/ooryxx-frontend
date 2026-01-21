import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StarIcon, HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useCurrency } from '../../context/CurrencyContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product, showDiscount = false, className = "" }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { formatPrice: formatPriceCurrency } = useCurrency();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour ajouter au panier');
      navigate('/login', { state: { from: `/product/${product._id || product.id}` } });
      return;
    }

    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour ajouter aux favoris');
      navigate('/login', { state: { from: `/product/${product._id || product.id}` } });
      return;
    }

    setIsWishlisted(!isWishlisted);
  };

  // Use currency context for formatting
  const formatPrice = (price) => {
    return formatPriceCurrency(price);
  };

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} className="w-4 h-4 fill-warning-400 text-warning-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="w-4 h-4 text-neutral-300" />
          <StarIcon
            className="w-4 h-4 fill-warning-400 text-warning-400 absolute top-0 left-0 overflow-hidden"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-4 h-4 text-neutral-300" />
      );
    }

    return stars;
  };

  const getBadgeColor = (badge) => {
    switch (badge?.toLowerCase()) {
      case 'nouveau':
        return 'bg-info-500 text-white';
      case 'bestseller':
        return 'bg-success-500 text-white';
      case 'populaire':
        return 'bg-primary-500 text-white';
      case 'promo':
        return 'bg-accent-500 text-white';
      case 'solde':
        return 'bg-error-500 text-white';
      default:
        return 'bg-neutral-600 text-white';
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-100 cursor-pointer h-full flex flex-col ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product._id || product.id}`} className="flex-1 flex flex-col">
        {/* Image Container - Responsive avec aspect ratio */}
        <div className="relative overflow-hidden bg-neutral-50 aspect-square sm:aspect-[4/3] md:aspect-square">
          <img
            src={product.image || product.images?.[0]?.url || '/api/placeholder/300/300'}
            alt={product.name || product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />

          {/* Overlay avec actions rapides */}
          <div
            className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-3 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <button
              onClick={handleAddToCart}
              className="bg-white/90 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
              title="Ajouter au panier"
            >
              <ShoppingCartIcon className="w-5 h-5 text-neutral-700" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/product/${product._id || product.id}`);
              }}
              className="bg-white/90 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
              title="Voir les détails"
            >
              <EyeIcon className="w-5 h-5 text-neutral-700" />
            </button>
          </div>

          {/* Badge */}
          {product.badge && (
            <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getBadgeColor(product.badge)}`}>
              {product.badge}
            </div>
          )}

          {/* Réduction */}
          {showDiscount && product.discount && (
            <div className="absolute top-10 sm:top-14 right-2 sm:right-3 bg-error-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold">
              -{typeof product.discount === 'object' ? product.discount.percentage : product.discount}%
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white/80 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10"
            title="Ajouter aux favoris"
          >
            {isWishlisted ? (
              <HeartSolidIcon className="w-4 h-4 sm:w-5 sm:h-5 text-error-500" />
            ) : (
              <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" />
            )}
          </button>
        </div>

        {/* Contenu */}
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex-1 flex flex-col">
          {/* Nom du produit */}
          <h3 className="font-semibold text-sm sm:text-base text-neutral-800 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {product.title || product.name}
          </h3>

          {/* Évaluation */}
          <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
            <div className="flex items-center">
              {renderRating(product.rating || 0)}
            </div>
            <span className="text-xs sm:text-sm text-neutral-500">
              ({product.reviewCount || product.reviews || 0})
            </span>
          </div>

          {/* Prix */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 md:gap-3 mb-2 sm:mb-4 mt-auto">
            <span className="text-base sm:text-lg md:text-xl font-bold text-neutral-800">
              {formatPrice(product.finalPrice || product.price)}
            </span>
            {/* Afficher le prix original si différent du prix final ou si discount existe */}
            {(product.discount?.percentage > 0 || (product.price && product.finalPrice && product.price > product.finalPrice)) && (
              <span className="text-xs sm:text-sm text-neutral-400 line-through">
                {formatPrice(product.originalPrice || product.price)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-success-600 font-medium">
              En stock
            </span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] sm:text-xs text-neutral-500">Disponible</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Bouton d'ajout au panier (mobile) */}
      <div className="md:hidden p-3 sm:p-4 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-500 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-primary-600 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <ShoppingCartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="truncate">Ajouter au panier</span>
        </button>
      </div>

      {/* Animation de survol pour desktop */}
      <div
        className={`hidden md:block absolute bottom-0 left-0 right-0 bg-primary-500 text-white py-2.5 lg:py-3 px-4 lg:px-6 transform transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
      >
        <button
          onClick={handleAddToCart}
          className="w-full text-center font-semibold text-sm lg:text-base flex items-center justify-center gap-2 hover:text-primary-100 transition-colors duration-200"
        >
          <ShoppingCartIcon className="w-4 h-4 lg:w-5 lg:h-5" />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default ProductCard;