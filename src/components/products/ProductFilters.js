import React, { useState, useEffect, useMemo } from 'react';
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  StarIcon,
  XMarkIcon,
  SparklesIcon,
  TagIcon,
  FireIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const ProductFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  categories = [],
  brands = [],
  ratingStats = {},
  isVIP = false,
  mobile = false,
  totalProducts = 0
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    features: false,
    brand: false
  });

  const [brandSearch, setBrandSearch] = useState('');
  const [priceInputs, setPriceInputs] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  });

  useEffect(() => {
    setPriceInputs({
      min: filters.minPrice || '',
      max: filters.maxPrice || ''
    });
  }, [filters.minPrice, filters.maxPrice]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filterNameOrObject, value) => {
    if (typeof filterNameOrObject === 'object') {
      onFilterChange(filterNameOrObject);
    } else {
      onFilterChange({ [filterNameOrObject]: value });
    }
  };

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return brands;
    return brands.filter(brand =>
      brand.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [brands, brandSearch]);

  const priceRanges = [
    { label: 'Moins de 100 DT', min: 0, max: 100, icon: '💰' },
    { label: '100 - 300 DT', min: 100, max: 300, icon: '💵' },
    { label: '300 - 500 DT', min: 300, max: 500, icon: '💴' },
    { label: '500 - 1000 DT', min: 500, max: 1000, icon: '💎' },
    { label: 'Plus de 1000 DT', min: 1000, max: null, icon: '👑' }
  ];

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'minPrice' || key === 'maxPrice') {
      return value && value !== '';
    }
    return value && value !== '' && value !== false;
  }).length;

  const FilterSection = ({ title, section, icon, badge, children }) => (
    <div className={`border-b border-neutral-100 last:border-b-0 transition-all duration-300 ${expandedSections[section] ? 'pb-4 mb-4' : 'pb-3 mb-3'
      }`}>
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left group py-2 hover:bg-neutral-50 rounded-lg px-2 -mx-2 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
            {title}
          </span>
          {badge && (
            <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 text-neutral-400 group-hover:text-primary-500 transition-all duration-300 ${expandedSections[section] ? 'rotate-180' : ''
            }`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${expandedSections[section] ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}>
        {children}
      </div>
    </div>
  );

  const RatingStars = ({ rating, size = 'sm' }) => {
    const sizeClasses = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarSolid key={star} className={`${sizeClasses} text-amber-400`} />
          ) : (
            <StarIcon key={star} className={`${sizeClasses} text-neutral-300`} />
          )
        ))}
      </div>
    );
  };

  const RadioOption = ({ name, value, checked, onChange, children, className = '' }) => (
    <label className={`flex items-center cursor-pointer group p-2.5 rounded-xl transition-all duration-200 ${checked
        ? 'bg-primary-100/60 backdrop-blur-sm border-2 border-primary-300/50 shadow-lg shadow-primary-100/30'
        : 'hover:bg-white/60 hover:backdrop-blur-sm border-2 border-transparent hover:border-neutral-200/50 hover:shadow-md'
      } ${className}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${checked
          ? 'border-primary-500 bg-primary-500'
          : 'border-neutral-300 group-hover:border-primary-400'
        }`}>
        {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      <div className="ml-3 flex-1">{children}</div>
    </label>
  );

  const CheckboxOption = ({ checked, onChange, children, className = '', variant = 'default' }) => {
    const variants = {
      default: checked ? 'bg-primary-100/60 backdrop-blur-sm border-primary-300/50 shadow-lg shadow-primary-100/30' : 'hover:bg-white/60 hover:backdrop-blur-sm border-transparent hover:border-neutral-200/50',
      success: checked ? 'bg-success-100/60 backdrop-blur-sm border-success-300/50 shadow-lg shadow-success-100/30' : 'hover:bg-white/60 hover:backdrop-blur-sm border-transparent hover:border-neutral-200/50',
      warning: checked ? 'bg-warning-100/60 backdrop-blur-sm border-warning-300/50 shadow-lg shadow-warning-100/30' : 'hover:bg-white/60 hover:backdrop-blur-sm border-transparent hover:border-neutral-200/50',
      accent: checked ? 'bg-accent-100/60 backdrop-blur-sm border-accent-300/50 shadow-lg shadow-accent-100/30' : 'hover:bg-white/60 hover:backdrop-blur-sm border-transparent hover:border-neutral-200/50',
    };

    const checkVariants = {
      default: checked ? 'bg-primary-500 border-primary-500' : 'border-neutral-300',
      success: checked ? 'bg-success-500 border-success-500' : 'border-neutral-300',
      warning: checked ? 'bg-warning-500 border-warning-500' : 'border-neutral-300',
      accent: checked ? 'bg-accent-500 border-accent-500' : 'border-neutral-300',
    };

    return (
      <label className={`flex items-center cursor-pointer group p-2.5 rounded-xl transition-all duration-200 border-2 ${variants[variant]} ${className}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${checkVariants[variant]}`}>
          {checked && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div className="ml-3 flex-1">{children}</div>
      </label>
    );
  };

  const applyCustomPrice = () => {
    handleFilterChange({
      minPrice: priceInputs.min,
      maxPrice: priceInputs.max
    });
  };

  return (
    <div className={`bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden ${mobile ? 'max-h-[80vh] overflow-y-auto' : ''
      }`}>
      {/* En-tête avec gradient et glass */}
      <div className="bg-gradient-to-r from-primary-500/90 to-secondary-500/90 backdrop-blur-md p-4 sm:p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Filtres</h3>
              {totalProducts > 0 && (
                <p className="text-white/80 text-sm">{totalProducts} produits</p>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <span className="bg-white/90 backdrop-blur-sm text-primary-600 text-xs px-2.5 py-1 rounded-full font-bold animate-pulse shadow-lg">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-all font-medium border border-white/20"
            >
              <XMarkIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Effacer</span>
            </button>
          )}
        </div>
      </div>

      {/* Contenu des filtres */}
      <div className="p-4 sm:p-5">
        {/* Statut VIP */}
        {isVIP && (
          <div className="bg-gradient-to-r from-amber-50/80 to-yellow-50/80 backdrop-blur-sm border border-amber-200/50 rounded-xl p-4 mb-5 relative overflow-hidden shadow-lg shadow-amber-100/50">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200/40 rounded-full -mr-10 -mt-10 blur-xl" />
            <div className="relative flex items-center gap-3">
              <div className="bg-amber-100 rounded-full p-2">
                <SparklesIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="font-bold text-amber-800">Client VIP</span>
                <p className="text-xs text-amber-700 mt-0.5">
                  Accès aux exclusivités premium
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Catégories */}
        <FilterSection
          title="Catégories"
          section="category"
          icon="📁"
          badge={categories.length > 0 ? categories.length : null}
        >
          <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-hide">
            <RadioOption
              name="category"
              value=""
              checked={!filters.category || filters.category === ''}
              onChange={() => handleFilterChange('category', '')}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700">Toutes les catégories</span>
              </div>
            </RadioOption>

            {categories.length > 0 ? (
              categories.map(category => (
                <RadioOption
                  key={category.id || category._id}
                  name="category"
                  value={category.id || category._id}
                  checked={filters.category === (category.id || category._id)}
                  onChange={() => handleFilterChange('category', category.id || category._id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-700">{category.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${(category.count || 0) > 0
                        ? 'text-primary-700 bg-primary-100'
                        : 'text-neutral-400 bg-neutral-100'
                      }`}>
                      {category.count || 0}
                    </span>
                  </div>
                </RadioOption>
              ))
            ) : (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                <span className="ml-2 text-sm text-neutral-500">Chargement...</span>
              </div>
            )}
          </div>
        </FilterSection>

        {/* Prix */}
        <FilterSection title="Prix" section="price" icon="💰">
          <div className="space-y-1 mb-4">
            <RadioOption
              name="priceRange"
              value=""
              checked={!filters.minPrice && !filters.maxPrice}
              onChange={() => handleFilterChange({ minPrice: '', maxPrice: '' })}
            >
              <span className="text-sm font-medium text-neutral-700">Tous les prix</span>
            </RadioOption>

            {priceRanges.map((range, index) => (
              <RadioOption
                key={index}
                name="priceRange"
                value={`${range.min}-${range.max}`}
                checked={
                  filters.minPrice === range.min.toString() &&
                  (range.max ? filters.maxPrice === range.max.toString() : !filters.maxPrice)
                }
                onChange={() => handleFilterChange({
                  minPrice: range.min.toString(),
                  maxPrice: range.max ? range.max.toString() : ''
                })}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{range.icon}</span>
                  <span className="text-sm text-neutral-700">{range.label}</span>
                </div>
              </RadioOption>
            ))}
          </div>

          {/* Prix personnalisé */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-neutral-200/50 shadow-inner">
            <p className="text-xs font-semibold text-neutral-600 mb-2 uppercase tracking-wide">
              Prix personnalisé
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceInputs.min}
                  onChange={(e) => setPriceInputs(prev => ({ ...prev, min: e.target.value }))}
                  onBlur={applyCustomPrice}
                  onKeyDown={(e) => e.key === 'Enter' && applyCustomPrice()}
                  className="w-full px-3 py-2 text-sm bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300/50 focus:bg-white transition-all shadow-sm"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400">DT</span>
              </div>
              <span className="text-neutral-400 font-bold">-</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="Max"
                  value={priceInputs.max}
                  onChange={(e) => setPriceInputs(prev => ({ ...prev, max: e.target.value }))}
                  onBlur={applyCustomPrice}
                  onKeyDown={(e) => e.key === 'Enter' && applyCustomPrice()}
                  className="w-full px-3 py-2 text-sm bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300/50 focus:bg-white transition-all shadow-sm"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400">DT</span>
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Note client */}
        <FilterSection title="Note client" section="rating" icon="⭐">
          <div className="space-y-1">
            <RadioOption
              name="rating"
              value=""
              checked={!filters.rating || filters.rating === ''}
              onChange={() => handleFilterChange('rating', '')}
            >
              <span className="text-sm font-medium text-neutral-700">Toutes les notes</span>
            </RadioOption>

            {[4, 3, 2, 1].map(rating => (
              <RadioOption
                key={rating}
                name="rating"
                value={rating.toString()}
                checked={filters.rating === rating.toString()}
                onChange={() => handleFilterChange('rating', rating.toString())}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={rating} />
                    <span className="text-sm text-neutral-600">et plus</span>
                  </div>
                  {ratingStats[rating] !== undefined && (
                    <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {ratingStats[rating]}
                    </span>
                  )}
                </div>
              </RadioOption>
            ))}
          </div>
        </FilterSection>

        {/* Marques */}
        {brands.length > 0 && (
          <FilterSection
            title="Marques"
            section="brand"
            icon="🏷️"
            badge={brands.length}
          >
            {brands.length > 5 && (
              <div className="relative mb-3">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Rechercher une marque..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300/50 focus:bg-white transition-all shadow-sm"
                />
              </div>
            )}

            <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
              <RadioOption
                name="brand"
                value=""
                checked={!filters.brand || filters.brand === ''}
                onChange={() => handleFilterChange('brand', '')}
              >
                <span className="text-sm font-medium text-neutral-700">Toutes les marques</span>
              </RadioOption>

              {filteredBrands.map(brand => (
                <RadioOption
                  key={brand}
                  name="brand"
                  value={brand}
                  checked={filters.brand === brand}
                  onChange={() => handleFilterChange('brand', brand)}
                >
                  <span className="text-sm text-neutral-700">{brand}</span>
                </RadioOption>
              ))}

              {filteredBrands.length === 0 && brandSearch && (
                <p className="text-sm text-neutral-500 italic p-2 text-center">
                  Aucune marque trouvée
                </p>
              )}
            </div>
          </FilterSection>
        )}

        {/* Fonctionnalités */}
        <FilterSection title="Fonctionnalités" section="features" icon="✨">
          <div className="space-y-2">
            <CheckboxOption
              checked={filters.inStock || false}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              variant="success"
            >
              <div className="flex items-center gap-2">
                <ShoppingBagIcon className="w-4 h-4 text-success-600" />
                <span className="text-sm text-neutral-700 font-medium">En stock seulement</span>
              </div>
            </CheckboxOption>

            <CheckboxOption
              checked={filters.onSale || false}
              onChange={(e) => handleFilterChange('onSale', e.target.checked)}
              variant="accent"
            >
              <div className="flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-accent-600" />
                <span className="text-sm text-neutral-700 font-medium">En promotion</span>
              </div>
            </CheckboxOption>

            <CheckboxOption
              checked={filters.isNew || false}
              onChange={(e) => handleFilterChange('isNew', e.target.checked)}
              variant="default"
            >
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-primary-600" />
                <span className="text-sm text-neutral-700 font-medium">Nouveautés</span>
              </div>
            </CheckboxOption>

            <CheckboxOption
              checked={filters.isBestseller || false}
              onChange={(e) => handleFilterChange('isBestseller', e.target.checked)}
              variant="warning"
            >
              <div className="flex items-center gap-2">
                <FireIcon className="w-4 h-4 text-warning-600" />
                <span className="text-sm text-neutral-700 font-medium">Meilleures ventes</span>
              </div>
            </CheckboxOption>

            {isVIP && (
              <CheckboxOption
                checked={filters.vipOnly || false}
                onChange={(e) => handleFilterChange('vipOnly', e.target.checked)}
                variant="warning"
                className="mt-3 bg-gradient-to-r from-amber-50 to-yellow-50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  <span className="text-sm text-amber-800 font-bold">Exclusivités VIP</span>
                </div>
              </CheckboxOption>
            )}
          </div>
        </FilterSection>
      </div>

      {/* Footer mobile */}
      {mobile && (
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-white/20 p-4 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)]">
          <button
            className="w-full bg-gradient-to-r from-primary-500/90 to-secondary-500/90 backdrop-blur-sm text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all active:scale-95 border border-white/20"
          >
            Voir {totalProducts} résultats
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
