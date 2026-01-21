import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  XMarkIcon,
  ChevronDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import Loading from '../components/common/Loading';
import { useAuth } from '../hooks/useAuth';

const Products = () => {
  const [, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]); // Marques dynamiques
  const [ratingStats, setRatingStats] = useState({}); // Statistiques de notation
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isVIPCustomer } = useAuth();

  // États pour les filtres
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    inStock: searchParams.get('inStock') === 'true',
    onSale: searchParams.get('sale') === 'true',
    isNew: searchParams.get('filter') === 'new',
    isBestseller: searchParams.get('bestseller') === 'true',
    brand: searchParams.get('brand') || '',
    searchQuery: searchParams.get('search') || ''
  });

  // Options de tri
  const sortOptions = [
    { value: 'popularity', label: 'Popularité', vip: false },
    { value: 'price_asc', label: 'Prix croissant', vip: false },
    { value: 'price_desc', label: 'Prix décroissant', vip: false },
    { value: 'rating', label: 'Mieux notés', vip: false },
    { value: 'newest', label: 'Plus récents', vip: false },
    { value: 'name', label: 'Nom A-Z', vip: false },
    { value: 'vip_priority', label: '⭐ Priorité VIP', vip: true }
  ];

  // Charger les produits
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);

        // Construire l'URL avec les filtres
        const params = new URLSearchParams();
        params.append('limit', '1000'); // Augmenter pour charger plus de produits
        
        // Ajouter les filtres à l'URL pour le backend
        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.searchQuery) params.append('search', filters.searchQuery);
        if (filters.onSale) params.append('discount', 'true');
        if (filters.inStock) params.append('inStock', 'true');
        
        // Ajouter le tri
        let sortParam = '-createdAt';
        switch (sortBy) {
          case 'price_asc': sortParam = 'finalPrice'; break;
          case 'price_desc': sortParam = '-finalPrice'; break;
          case 'rating': sortParam = '-rating'; break;
          case 'name': sortParam = 'title'; break;
          case 'newest': sortParam = '-createdAt'; break;
          default: sortParam = '-reviewCount';
        }
        params.append('sort', sortParam);
        
        console.log('Loading products with params:', params.toString());

        // Appel API réel
        const response = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
        const data = await response.json();

        console.log('API Response:', data); // Debug

        let allProducts = [];
        
        // Extraire les produits de la réponse API
        if (data.success && data.data?.products) {
          allProducts = data.data.products;
        } else if (data.products) {
          allProducts = data.products;
        } else if (Array.isArray(data.data)) {
          allProducts = data.data;
        }

        console.log('Produits chargés depuis API:', allProducts.length);

        let filteredData = [...allProducts];

        // Filtrage côté client pour les filtres non supportés par l'API
        if (filters.brand) {
          filteredData = filteredData.filter(p => 
            p.brand?.toLowerCase() === filters.brand.toLowerCase() ||
            p.vendorId?.companyInfo?.name?.toLowerCase().includes(filters.brand.toLowerCase())
          );
        }

        if (filters.rating) {
          const minRating = parseFloat(filters.rating);
          filteredData = filteredData.filter(p => (p.rating || 0) >= minRating);
        }

        if (filters.inStock) {
          filteredData = filteredData.filter(p => 
            p.stock > 0 && p.status === 'active'
          );
        }

        if (filters.isNew) {
          filteredData = filteredData.filter(p => 
            p.isNew || p.featured || 
            p.badges?.includes('Nouveau') || 
            p.badges?.includes('new')
          );
        }

        if (filters.isBestseller) {
          filteredData = filteredData.filter(p => 
            p.isBestseller || 
            p.badges?.includes('Bestseller') ||
            (p.reviewCount && p.reviewCount > 20)
          );
        }

        // Filtres VIP
        if (!isVIPCustomer) {
          filteredData = filteredData.filter(p => !p.isVipExclusive);
        }

        // Extraire les marques uniques des produits
        const uniqueBrands = [...new Set(
          allProducts
            .map(p => p.brand || p.vendorId?.companyInfo?.name)
            .filter(Boolean)
        )].sort();
        setBrands(uniqueBrands);

        // Calculer les statistiques de notation
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
        allProducts.forEach(product => {
          const rating = Math.floor(product.rating || 0);
          [1, 2, 3, 4].forEach(minRating => {
            if (rating >= minRating) {
              ratingCounts[minRating]++;
            }
          });
        });
        setRatingStats(ratingCounts);

        // Calculer le nombre de produits par catégorie
        const categoryCounts = {};
        allProducts.forEach(product => {
          const catId = product.category?._id || product.category;
          if (catId) {
            categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
          }
        });

        // Mettre à jour les catégories avec les comptages réels
        setCategories(prevCategories => 
          prevCategories.map(cat => ({
            ...cat,
            count: categoryCounts[cat.id] || 0
          }))
        );

        setProducts(allProducts);
        setFilteredProducts(filteredData);
        setTotalProducts(filteredData.length);
        setTotalPages(Math.ceil(filteredData.length / 12));

      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        // En cas d'erreur, afficher un message
        setProducts([]);
        setFilteredProducts([]);
        setTotalProducts(0);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy, isVIPCustomer]);

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Charger les catégories depuis l'API
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        
        console.log('Categories API Response:', data); // Debug

        if (data.success && data.data?.length > 0) {
          // Mapper les catégories de l'API avec comptage de produits
          const apiCategories = data.data
            .filter(cat => !cat.parentId) // Seulement les catégories principales
            .map(cat => ({
              id: cat._id,
              name: cat.name,
              slug: cat.slug,
              count: cat.productCount || 0
            }));
          
          setCategories(apiCategories);
          
          console.log('Categories chargées:', apiCategories.length, 'catégories');
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  // Mettre à jour les paramètres URL
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== false) {
        params.set(key, value.toString());
      }
    });

    if (sortBy !== 'popularity') {
      params.set('sort', sortBy);
    }

    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }

    setSearchParams(params);
  }, [filters, sortBy, currentPage, setSearchParams]);

  // Gérer les changements de filtres
  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setCurrentPage(1);
  };

  // Réinitialiser les filtres
  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      inStock: false,
      onSale: false,
      isNew: false,
      isBestseller: false,
      brand: '',
      searchQuery: ''
    });
    setCurrentPage(1);
  };

  // Compter les filtres actifs
  const activeFiltersCount = Object.values(filters).filter(value =>
    value && value !== '' && value !== false
  ).length;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* En-tête avec titre et statistiques */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-neutral-800 mb-1 sm:mb-2 truncate">
                {filters.searchQuery ? `Résultats pour "${filters.searchQuery}"` :
                  filters.category ? categories.find(c => c.id === filters.category)?.name || 'Produits' :
                    'Tous les Produits'}
              </h1>
              <p className="text-sm sm:text-base text-neutral-600">
                {totalProducts} produit{totalProducts > 1 ? 's' : ''} trouvé{totalProducts > 1 ? 's' : ''}
                {isVIPCustomer && (
                  <span className="ml-2 text-warning-600 font-medium">
                    ⭐ Accès VIP activé
                  </span>
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-wrap sm:flex-nowrap">
              {/* Tri */}
              <div className="relative flex-1 sm:flex-none min-w-[140px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white border border-neutral-300 rounded-lg px-3 sm:px-4 py-2 pr-8 sm:pr-10 text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  {sortOptions
                    .filter(option => !option.vip || isVIPCustomer)
                    .map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
                <ChevronDownIcon className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              </div>

              {/* Mode d'affichage */}
              <div className="hidden sm:flex bg-white border border-neutral-300 rounded-lg p-0.5 sm:p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                  title="Vue grille"
                >
                  <Squares2X2Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                  title="Vue liste"
                >
                  <ListBulletIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Filtres mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-1.5 sm:gap-2 bg-primary-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm sm:text-base"
              >
                <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Filtres</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-accent-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filtres actifs */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-neutral-600 font-medium">Filtres actifs :</span>
              {filters.category && (
                <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                  {categories.find(c => c.id === filters.category)?.name}
                  <button
                    onClick={() => handleFilterChange({ category: '' })}
                    className="hover:text-primary-600"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.onSale && (
                <span className="inline-flex items-center gap-1 bg-error-100 text-error-800 px-3 py-1 rounded-full text-sm">
                  En promotion
                  <button
                    onClick={() => handleFilterChange({ onSale: false })}
                    className="hover:text-error-600"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-neutral-500 hover:text-neutral-700 underline"
              >
                Tout effacer
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8">
          {/* Sidebar avec filtres - Desktop */}
          <div className={`hidden lg:block w-72 xl:w-80 flex-shrink-0`}>
            <div className="sticky top-44 xl:top-48">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                categories={categories}
                brands={brands}
                ratingStats={ratingStats}
                isVIP={isVIPCustomer}
                totalProducts={totalProducts}
              />
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            {/* Grille de produits */}
            <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${viewMode === 'grid'
              ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
              : 'grid-cols-1'
              }`}>
              {filteredProducts
                .slice((currentPage - 1) * 12, currentPage * 12)
                .map(product => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    showDiscount={true}
                    className={viewMode === 'list' ? 'flex flex-row' : ''}
                  />
                ))}
            </div>

            {/* Aucun résultat */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">😔</span>
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-neutral-600 mb-6">
                  Essayez de modifier vos critères de recherche ou parcourez nos catégories.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-10 lg:mt-12 flex justify-center">
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2 sm:px-4 py-1.5 sm:py-2 border border-neutral-300 rounded-lg text-sm sm:text-base text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="hidden sm:inline">Précédent</span>
                    <span className="sm:hidden">←</span>
                  </button>

                  {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base ${currentPage === page
                          ? 'bg-primary-500 text-white'
                          : 'border border-neutral-300 text-neutral-600 hover:bg-neutral-100'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-2 sm:px-4 py-1.5 sm:py-2 border border-neutral-300 rounded-lg text-sm sm:text-base text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="hidden sm:inline">Suivant</span>
                    <span className="sm:hidden">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay filtres mobile */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowFilters(false)}>
          <div 
            className="fixed right-0 top-0 h-full w-full sm:w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-3 sm:p-4 border-b border-neutral-200 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold">Filtres</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1.5 sm:p-2 hover:bg-neutral-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 pb-24">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                categories={categories}
                brands={brands}
                ratingStats={ratingStats}
                isVIP={isVIPCustomer}
                totalProducts={totalProducts}
                mobile
              />
            </div>
            
            {/* Bouton appliquer mobile */}
            <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white border-t border-neutral-200 sm:hidden">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
              >
                Voir {totalProducts} résultats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
