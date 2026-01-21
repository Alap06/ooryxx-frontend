import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShoppingBagIcon,
  ArrowRightIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BoltIcon
} from '@heroicons/react/24/solid';
import { getFeaturedProducts } from '../../services/featuredProductService';

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

// Produits par défaut si l'API échoue
const defaultProducts = [
  {
    _id: '1',
    name: "Montre Luxe Édition Or",
    price: 2499,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    badge: "Bestseller",
    rating: 4.9
  },
  {
    _id: '2',
    name: "Casque Audio Premium",
    price: 899,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    badge: "Nouveau",
    rating: 4.8
  },
  {
    _id: '3',
    name: "Smartphone Elite Pro",
    price: 3299,
    originalPrice: 4499,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    badge: "Tendance",
    rating: 5.0
  },
  {
    _id: '4',
    name: "Sac Designer Collection",
    price: 1899,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    badge: "Exclusif",
    rating: 4.7
  }
];

const HeroPremium = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState(defaultProducts);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);

  // Charger les produits en vedette depuis l'API
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await getFeaturedProducts();
        if (response.success && response.data?.products?.length > 0) {
          setFeaturedProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error loading featured products:', error);
        // Garder les produits par défaut
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const calculateDiscount = (price, originalPrice) => {
    if (originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  const currentProduct = featuredProducts[currentSlide];

  return (
    <section
      className="relative min-h-[450px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[550px] xl:min-h-[600px] overflow-hidden mt-[56px] sm:mt-[64px] lg:mt-[160px] xl:mt-[168px]"
      style={{ backgroundColor: colors.dark }}
    >
      {/* Background Animations */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -left-1/4 w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.primary}40, transparent)`,
            filter: 'blur(100px)'
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            x: [0, 100, 0],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/4 -right-1/4 w-3/4 h-3/4 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.bronze}40, transparent)`,
            filter: 'blur(100px)'
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.primary} 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-3 sm:space-y-4 md:space-y-5 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border mx-auto lg:mx-0"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(12px)'
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: colors.primary }}
                />
                <span
                  className="relative rounded-full h-2 w-2"
                  style={{ backgroundColor: colors.primary }}
                />
              </span>
              <span className="text-sm font-semibold tracking-wide" style={{ color: colors.gold }}>
                Collection Exclusive 2024
              </span>
            </motion.div>

            {/* Title */}
            <div>
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black leading-tight mb-2 sm:mb-3"
              >
                Shopping{' '}
                <span className="relative inline-block">
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.gold})`
                    }}
                  >
                    Premium
                  </span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="absolute bottom-1 sm:bottom-2 left-0 w-full h-2 sm:h-3 -z-10 origin-left"
                    style={{ backgroundColor: `${colors.primary}30` }}
                  />
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-base md:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed"
                style={{ color: colors.gray }}
              >
                Découvrez notre sélection exclusive de produits haut de gamme.
                <span className="font-semibold" style={{ color: colors.primary }}> Livraison gratuite</span> partout en Tunisie.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start"
            >
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group w-full sm:w-auto px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base shadow-2xl transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.bronze})`,
                    color: 'white'
                  }}
                >
                  Découvrir Maintenant
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start pt-2 sm:pt-3">
              {[
                { number: "10K+", label: "Produits", icon: ShoppingBagIcon },
                { number: "24h", label: "Livraison", icon: BoltIcon },
                { number: "4.9★", label: "Note", icon: StarIcon }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-default transition-all hover:scale-105"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: colors.primary }} />
                    <div>
                      <div className="text-base sm:text-lg md:text-xl font-bold text-white">{stat.number}</div>
                      <div className="text-[10px] sm:text-xs uppercase tracking-wider" style={{ color: colors.gray }}>
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right - Product Slider */}
          <div className="relative h-[320px] sm:h-[380px] md:h-[420px] lg:h-[450px] xl:h-[480px]">
            <AnimatePresence mode="wait">
              {currentProduct && (
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="relative h-full flex flex-col items-center justify-start pt-4">
                    {/* Glow Effect */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 blur-3xl rounded-full"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${colors.primary}30, ${colors.gold}30)`
                      }}
                    />

                    {/* Product Card */}
                    <Link to={`/products/${currentProduct._id}`} className="block">
                      <motion.div 
                        className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[360px] xl:max-w-[400px] group cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 border shadow-2xl transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(230,125,7,0.3)]"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderColor: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(20px)'
                          }}
                        >
                          {/* Badge */}
                          {currentProduct.badge && (
                            <div
                              className="absolute -top-2 sm:-top-3 left-3 sm:left-4 md:left-5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white font-bold text-[10px] sm:text-xs shadow-lg z-10"
                              style={{
                                backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.bronze})`
                              }}
                            >
                              {currentProduct.badge}
                            </div>
                          )}

                          {/* Product Image with Discount Badge inside */}
                          <div className="relative aspect-[4/3] mb-2 sm:mb-3 rounded-xl sm:rounded-2xl overflow-hidden bg-white/5">
                            <img
                              src={currentProduct.image}
                              alt={currentProduct.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Discount Badge - Inside image top right */}
                            {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price && (
                              <div
                                className="absolute top-2 right-2 sm:top-2 sm:right-2 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-black shadow-lg transform rotate-12"
                                style={{ backgroundColor: '#ef4444' }}
                              >
                                <div className="text-center">
                                  <div className="text-[10px] sm:text-xs md:text-sm leading-none">
                                    -{calculateDiscount(currentProduct.price, currentProduct.originalPrice)}%
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Hover Overlay with View Button */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileHover={{ y: 0, opacity: 1 }}
                                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold text-white text-xs sm:text-sm flex items-center gap-2 shadow-lg"
                                style={{
                                  backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.bronze})`
                                }}
                              >
                                <ArrowRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Voir Produit
                              </motion.div>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="space-y-1.5 sm:space-y-2">
                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white line-clamp-1 group-hover:text-orange-300 transition-colors">
                              {currentProduct.name}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                                    i < Math.floor(currentProduct.rating || 4.5)
                                      ? 'text-amber-400'
                                      : 'text-gray-400'
                                  }`}
                                  style={i < Math.floor(currentProduct.rating || 4.5) ? { fill: colors.gold } : {}}
                                />
                              ))}
                              <span className="text-white font-semibold text-[10px] sm:text-xs ml-1">
                                {currentProduct.rating || 4.5}
                              </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                              <span className="text-lg sm:text-xl md:text-2xl font-black text-white">
                                {currentProduct.price?.toLocaleString()}
                              </span>
                              {currentProduct.originalPrice && (
                                <span className="text-xs sm:text-sm line-through" style={{ color: colors.gray }}>
                                  {currentProduct.originalPrice?.toLocaleString()}
                                </span>
                              )}
                              <span className="text-[10px] sm:text-xs text-white">DT</span>
                            </div>

                            {/* Action Button */}
                            <motion.div
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="w-full py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm"
                              style={{
                                backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.bronze})`
                              }}
                            >
                              <ArrowRightIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              Voir Produit
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>

                    {/* Slider Controls - Below the card */}
                    {featuredProducts.length > 1 && (
                      <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 z-20">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={prevSlide}
                          className="p-1.5 sm:p-2 rounded-full transition-all"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(12px)'
                          }}
                        >
                          <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </motion.button>

                        <div className="flex gap-2">
                          {featuredProducts.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentSlide(idx)}
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: idx === currentSlide ? '2rem' : '0.5rem',
                                backgroundImage: idx === currentSlide
                                  ? `linear-gradient(to right, ${colors.primary}, ${colors.bronze})`
                                  : undefined,
                                backgroundColor: idx !== currentSlide ? 'rgba(255,255,255,0.3)' : undefined
                              }}
                            />
                          ))}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={nextSlide}
                          className="p-1.5 sm:p-2 rounded-full transition-all"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(12px)'
                          }}
                        >
                          <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPremium;
