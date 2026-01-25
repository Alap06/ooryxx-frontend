import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, StarIcon, FireIcon, TagIcon, TruckIcon, ShieldCheckIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import ProductCard from '../components/products/ProductCard';
import Logo from '../data/images/Logo.png';
import HeroPremium from '../components/home/HeroPremium';

// Helper function pour obtenir l'icône de catégorie
const getCategoryIcon = (categoryName) => {
  const name = categoryName?.toLowerCase() || '';
  if (name.includes('électronique') || name.includes('electronique')) return '📱';
  if (name.includes('mode') || name.includes('vêtement')) return '👗';
  if (name.includes('maison') || name.includes('déco')) return '🏠';
  if (name.includes('sport') || name.includes('loisir')) return '⚽';
  if (name.includes('beauté') || name.includes('santé')) return '💄';
  if (name.includes('auto') || name.includes('moto')) return '🚗';
  if (name.includes('alimentation') || name.includes('food')) return '🍔';
  return '🛍️';
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // Toutes les catégories avec sous-catégories
  const [maxDiscount, setMaxDiscount] = useState(70);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [saleEndDate, setSaleEndDate] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les produits depuis l'API directement
        const response = await fetch(`${process.env.REACT_APP_API_URL}/products?limit=20&sort=-rating`);
        const data = await response.json();

        console.log('Home Products API Response:', data); // Debug

        let products = [];
        if (data.success && data.data?.products?.length > 0) {
          products = data.data.products;
        } else if (data.products?.length > 0) {
          products = data.products;
        }

        if (products.length > 0) {
          setFeaturedProducts(products);
          // Filtrer les produits en promo
          const saleItems = products.filter(p => p.discount?.percentage > 0);
          setSaleProducts(saleItems.length > 0 ? saleItems.slice(0, 6) : products.slice(0, 6));

          // Calculer le pourcentage maximum de réduction
          if (saleItems.length > 0) {
            const maxDiscountValue = Math.max(...saleItems.map(p => p.discount?.percentage || 0));
            setMaxDiscount(maxDiscountValue > 0 ? maxDiscountValue : 70);

            // Calculer la date moyenne de fin des promotions
            const datesWithPromo = saleItems
              .filter(p => p.discount?.endDate)
              .map(p => new Date(p.discount.endDate).getTime());

            if (datesWithPromo.length > 0) {
              const avgDate = new Date(datesWithPromo.reduce((a, b) => a + b) / datesWithPromo.length);
              setSaleEndDate(avgDate);
            } else {
              // Par défaut, 24 heures si pas de date
              setSaleEndDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
            }
          }
        }

        // Charger les catégories depuis l'API
        const catResponse = await fetch(`${process.env.REACT_APP_API_URL}/categories`);
        const catData = await catResponse.json();

        if (catData.success && catData.data?.length > 0) {
          // Stocker toutes les catégories
          setAllCategories(catData.data);

          // Catégories principales pour la grille
          const mainCategories = catData.data
            .filter(cat => !cat.parentId)
            .map(cat => ({
              id: cat._id,
              name: cat.name,
              image: cat.image || "/api/placeholder/300/200",
              icon: getCategoryIcon(cat.name),
              count: `${cat.productCount || 0} produits`,
              subcategories: catData.data.filter(sub => sub.parentId === cat._id)
            }));
          setCategories(mainCategories);

          console.log('Categories chargées:', mainCategories.length, 'catégories principales');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mise à jour du compte à rebours
  useEffect(() => {
    if (!saleEndDate) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = saleEndDate.getTime() - now;

      if (distance < 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [saleEndDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Hero Section - Premium avec Slider */}
      <HeroPremium />

      {/* Section Services - Modern Design */}
      <section className="py-10 sm:py-12 md:py-16 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            <div className="group text-center p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl hover:bg-gradient-to-br hover:from-success-50 hover:to-info-50 transition-all duration-500 transform hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-success-200">
              <div className="relative inline-block mb-3 sm:mb-4 md:mb-6">
                <div className="absolute inset-0 bg-success-500/20 rounded-full blur-lg sm:blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <TruckIcon className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-success-500 mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-bold text-sm sm:text-base md:text-xl text-neutral-800 mb-1 sm:mb-2 md:mb-3 group-hover:text-success-600 transition-colors">
                Livraison Express
              </h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed hidden sm:block">
                Livraison en 24-48h partout en Tunisie avec suivi en temps réel
              </p>
              <div className="mt-2 sm:mt-4 text-[10px] sm:text-xs font-semibold text-success-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                En savoir plus →
              </div>
            </div>

            <div className="group text-center p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl hover:bg-gradient-to-br hover:from-primary-50 hover:to-secondary-50 transition-all duration-500 transform hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-primary-200">
              <div className="relative inline-block mb-3 sm:mb-4 md:mb-6">
                <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg sm:blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <ShieldCheckIcon className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-primary-500 mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-bold text-sm sm:text-base md:text-xl text-neutral-800 mb-1 sm:mb-2 md:mb-3 group-hover:text-primary-600 transition-colors">
                Paiement Sécurisé
              </h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed hidden sm:block">
                Transactions protégées par SSL avec cryptage de niveau bancaire
              </p>
              <div className="mt-2 sm:mt-4 text-[10px] sm:text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                En savoir plus →
              </div>
            </div>

            <div className="group text-center p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl hover:bg-gradient-to-br hover:from-accent-50 hover:to-warning-50 transition-all duration-500 transform hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-accent-200">
              <div className="relative inline-block mb-3 sm:mb-4 md:mb-6">
                <div className="absolute inset-0 bg-accent-500/20 rounded-full blur-lg sm:blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <HeartIcon className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-accent-500 mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-bold text-sm sm:text-base md:text-xl text-neutral-800 mb-1 sm:mb-2 md:mb-3 group-hover:text-accent-600 transition-colors">
                Satisfait ou Remboursé
              </h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed hidden sm:block">
                Garantie de satisfaction 30 jours sur tous nos produits
              </p>
              <div className="mt-2 sm:mt-4 text-[10px] sm:text-xs font-semibold text-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                En savoir plus →
              </div>
            </div>

            <div className="group text-center p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl hover:bg-gradient-to-br hover:from-warning-50 hover:to-accent-50 transition-all duration-500 transform hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-warning-200">
              <div className="relative inline-block mb-3 sm:mb-4 md:mb-6">
                <div className="absolute inset-0 bg-warning-500/20 rounded-full blur-lg sm:blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <StarIcon className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-warning-500 mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-bold text-sm sm:text-base md:text-xl text-neutral-800 mb-1 sm:mb-2 md:mb-3 group-hover:text-warning-600 transition-colors">
                Support Premium 24/7
              </h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed hidden sm:block">
                Service client réactif disponible jour et nuit pour vous aider
              </p>
              <div className="mt-2 sm:mt-4 text-[10px] sm:text-xs font-semibold text-warning-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                En savoir plus →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Produits en Solde - Ultra Modern */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-error-500 via-accent-500 to-warning-500 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNjAgMTAgTSAxMCAwIEwgMTAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header with Logo */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="relative group">
                {/* Conteneur glassmorphism avec fond blanc */}
                <div className="relative bg-white/15 backdrop-blur-2xl border-2 border-white/30 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 shadow-2xl">
                  {/* Animation de pulse sur le fond - dégradé blanc */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/10 to-transparent rounded-2xl sm:rounded-3xl animate-pulse"></div>

                  {/* Effet de lueur externe animée */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/30 to-white/20 rounded-2xl sm:rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Logo avec effet hover */}
                  <img
                    src={Logo}
                    alt="OORYXX"
                    className="relative h-16 sm:h-20 md:h-24 lg:h-28 w-auto drop-shadow-2xl z-10 transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center mb-4 sm:mb-6 space-x-2 sm:space-x-3">
              <div className="h-0.5 sm:h-1 w-8 sm:w-16 bg-white/50 rounded-full"></div>
              <div className="bg-white/20 backdrop-blur-md rounded-full px-3 sm:px-6 py-1.5 sm:py-2 flex items-center space-x-1.5 sm:space-x-2">
                <FireIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white animate-bounce" />
                <span className="text-white font-bold text-[10px] sm:text-sm uppercase tracking-wider">Ventes Flash</span>
              </div>
              <div className="h-0.5 sm:h-1 w-8 sm:w-16 bg-white/50 rounded-full"></div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-2 sm:mb-4 text-shadow-lg">
              Offres Exceptionnelles
            </h2>
            <p className="text-base sm:text-xl md:text-2xl text-white/90 font-semibold mb-2 sm:mb-4">
              Jusqu'à -{maxDiscount}% sur une sélection de produits
            </p>

            {/* Countdown Timer - Dynamique */}
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 mt-4 sm:mt-8">
              <div className="bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl px-3 sm:px-6 py-2 sm:py-4 text-center min-w-[60px] sm:min-w-[80px]">
                <div className="text-xl sm:text-2xl md:text-3xl font-black text-white tabular-nums">
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <div className="text-[8px] sm:text-xs text-white/80 uppercase">Heures</div>
              </div>
              <div className="text-white text-lg sm:text-2xl font-bold">:</div>
              <div className="bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl px-3 sm:px-6 py-2 sm:py-4 text-center min-w-[60px] sm:min-w-[80px]">
                <div className="text-xl sm:text-2xl md:text-3xl font-black text-white tabular-nums">
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <div className="text-[8px] sm:text-xs text-white/80 uppercase">Minutes</div>
              </div>
              <div className="text-white text-lg sm:text-2xl font-bold">:</div>
              <div className="bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl px-3 sm:px-6 py-2 sm:py-4 text-center min-w-[60px] sm:min-w-[80px]">
                <div className="text-xl sm:text-2xl md:text-3xl font-black text-white tabular-nums">
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
                <div className="text-[8px] sm:text-xs text-white/80 uppercase">Secondes</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-12">
            {saleProducts.map((product) => (
              <div key={product._id || product.id} className="transform hover:scale-[1.02] md:hover:scale-105 transition-all duration-300">
                <ProductCard product={product} showDiscount={true} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/products?sale=true"
              className="inline-flex items-center bg-white text-error-600 px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold sm:font-black text-sm sm:text-base md:text-xl hover:bg-neutral-100 active:scale-95 transition-all duration-300 shadow-2xl hover:shadow-white/50 hover:scale-105 md:hover:scale-110 transform"
            >
              <TagIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" />
              <span className="hidden sm:inline">Découvrir Toutes les Promos</span>
              <span className="sm:hidden">Voir les Promos</span>
              <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-2 sm:ml-3 animate-spin" style={{ animationDuration: '3s' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section Catégories - Modern Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-block mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider">
                Catégories Populaires
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black text-neutral-800 mb-2 sm:mb-4">
              Explorez Notre Univers
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-neutral-600 max-w-2xl mx-auto">
              Des milliers de produits organisés pour faciliter votre shopping
            </p>
          </div>

          {/* Grille scrollable avec toutes les catégories */}
          <div className="relative">
            {/* Container avec scroll horizontal */}
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex space-x-3 sm:space-x-4 md:space-x-6 min-w-max px-1">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="group relative bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 text-center hover:from-primary-500 hover:to-secondary-500 transition-all duration-500 shadow-md sm:shadow-lg hover:shadow-2xl transform hover:scale-105 md:hover:scale-110 hover:-rotate-1 md:hover:-rotate-2 overflow-hidden flex-shrink-0 w-32 sm:w-40 md:w-48"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Decorative circle */}
                    <div className="absolute -top-6 -right-6 sm:-top-10 sm:-right-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

                    <div className="relative z-10">
                      <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4 transform group-hover:scale-110 md:group-hover:scale-125 group-hover:rotate-6 md:group-hover:rotate-12 transition-all duration-300">
                        {category.icon}
                      </div>
                      <h3 className="font-semibold sm:font-bold text-xs sm:text-sm md:text-base text-neutral-800 mb-1 sm:mb-2 group-hover:text-white transition-colors line-clamp-2">
                        {category.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-neutral-500 group-hover:text-white/80 transition-colors">
                        {category.count}
                      </p>

                      {/* Nombre de sous-catégories */}
                      {category.subcategories && category.subcategories.length > 0 && (
                        <p className="text-[9px] sm:text-[10px] text-primary-600 group-hover:text-white/90 mt-1 font-medium">
                          {category.subcategories.length} sous-catégories
                        </p>
                      )}

                      {/* Hover effect arrow */}
                      <div className="mt-2 sm:mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                        <ChevronRightIcon className="w-5 h-5 text-white mx-auto animate-pulse" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Indicateur de scroll */}
            {categories.length > 6 && (
              <div className="text-center mt-4 text-sm text-neutral-500">
                <span className="inline-flex items-center space-x-2">
                  <span>← Faites défiler pour voir toutes les catégories →</span>
                </span>
              </div>
            )}
          </div>

          {/* View All Categories Button */}
          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <button className="border-2 border-primary-500 text-primary-600 px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-semibold sm:font-bold text-sm sm:text-base md:text-lg hover:bg-primary-500 hover:text-white active:scale-95 transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl transform hover:scale-105">
              Voir Toutes les Catégories
            </button>
          </div>
        </div>
      </section>

      {/* Section Produits Populaires */}
      <section className="py-10 sm:py-12 md:py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-neutral-800 mb-3 sm:mb-4">
              Produits Populaires
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-600">
              Les coups de cœur de nos clients
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10">
            <Link
              to="/products"
              className="inline-flex items-center bg-primary-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-primary-600 active:scale-95 transition-all duration-300 shadow-lg"
            >
              Voir tous les produits
              <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>



      {/* Brand Footer Section */}
      <section className="py-8 sm:py-10 md:py-12 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 sm:space-y-6 md:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img src={Logo} alt="OORYXX" className="h-8 sm:h-10 md:h-12 w-auto" />
              <div>
                <h3 className="font-bold text-base sm:text-lg md:text-xl">OORYXX</h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-neutral-400">Votre plateforme e-commerce premium en Tunisie</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-neutral-400">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">10K+</div>
                <div className="text-[10px] sm:text-xs md:text-sm">Produits</div>
              </div>
              <div className="h-6 sm:h-8 w-px bg-neutral-700"></div>
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">50K+</div>
                <div className="text-[10px] sm:text-xs md:text-sm">Clients</div>
              </div>
              <div className="h-6 sm:h-8 w-px bg-neutral-700"></div>
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">4.9★</div>
                <div className="text-[10px] sm:text-xs md:text-sm">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;