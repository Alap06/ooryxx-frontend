import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDownIcon,
  Bars3Icon,
  FireIcon,
  TagIcon,
  SparklesIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [, setActiveDropdown] = useState(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const dropdownRef = useRef(null);

  // Catégories principales avec sous-catégories
  const categories = [
    {
      id: 'electronics',
      name: 'Électronique',
      icon: '📱',
      subcategories: [
        {
          title: 'Smartphones & Tablettes',
          items: ['iPhone', 'Samsung Galaxy', 'Tablettes iPad', 'Accessoires Mobile']
        },
        {
          title: 'Informatique',
          items: ['Ordinateurs Portables', 'PC Bureau', 'Composants', 'Périphériques']
        },
        {
          title: 'TV & Audio',
          items: ['Téléviseurs', 'Systèmes Audio', 'Casques', 'Enceintes']
        },
        {
          title: 'Gaming',
          items: ['PlayStation', 'Xbox', 'Nintendo', 'PC Gaming']
        }
      ]
    },
    {
      id: 'fashion',
      name: 'Mode & Style',
      icon: '👕',
      subcategories: [
        {
          title: 'Femme',
          items: ['Vêtements', 'Chaussures', 'Sacs & Maroquinerie', 'Bijoux']
        },
        {
          title: 'Homme',
          items: ['Vêtements', 'Chaussures', 'Accessoires', 'Montres']
        },
        {
          title: 'Enfants',
          items: ['Bébé (0-2 ans)', 'Enfant (3-12 ans)', 'Adolescent', 'Chaussures Enfant']
        },
        {
          title: 'Sport',
          items: ['Vêtements Sport', 'Chaussures Sport', 'Équipements', 'Fitness']
        }
      ]
    },
    {
      id: 'home',
      name: 'Maison & Jardin',
      icon: '🏠',
      subcategories: [
        {
          title: 'Décoration',
          items: ['Mobilier', 'Éclairage', 'Textiles', 'Art & Décoration']
        },
        {
          title: 'Électroménager',
          items: ['Gros Électroménager', 'Petit Électroménager', 'Climatisation', 'Chauffage']
        },
        {
          title: 'Jardin',
          items: ['Outillage Jardin', 'Mobilier Extérieur', 'Plantes', 'Barbecue']
        },
        {
          title: 'Bricolage',
          items: ['Outils', 'Peinture', 'Plomberie', 'Électricité']
        }
      ]
    },
    {
      id: 'beauty',
      name: 'Beauté & Santé',
      icon: '💄',
      subcategories: [
        {
          title: 'Cosmétiques',
          items: ['Maquillage', 'Soins Visage', 'Soins Corps', 'Parfums']
        },
        {
          title: 'Santé & Bien-être',
          items: ['Compléments', 'Matériel Médical', 'Fitness', 'Relaxation']
        },
        {
          title: 'Cheveux',
          items: ['Soins Cheveux', 'Coiffage', 'Coloration', 'Accessoires']
        }
      ]
    },
    {
      id: 'sports',
      name: 'Sports & Loisirs',
      icon: '⚽',
      subcategories: [
        {
          title: 'Sports',
          items: ['Football', 'Basketball', 'Tennis', 'Fitness']
        },
        {
          title: 'Outdoor',
          items: ['Camping', 'Randonnée', 'Vélo', 'Sports Nautiques']
        },
        {
          title: 'Loisirs',
          items: ['Jeux & Jouets', 'Livres', 'Musique', 'Cinéma']
        }
      ]
    },
    {
      id: 'auto',
      name: 'Auto & Moto',
      icon: '🚗',
      subcategories: [
        {
          title: 'Automobile',
          items: ['Pièces Auto', 'Accessoires', 'Entretien', 'Tuning']
        },
        {
          title: 'Moto',
          items: ['Pièces Moto', 'Casques', 'Équipements', 'Accessoires']
        }
      ]
    }
  ];

  // Navigation links
  const navLinks = [
    { name: 'Accueil', path: '/', exact: true },
    { name: 'Nouveautés', path: '/products?filter=new', icon: SparklesIcon },
    { name: 'Promotions', path: '/products?sale=true', icon: TagIcon },
    { name: 'Meilleures Ventes', path: '/products?bestseller=true', icon: FireIcon },
    { name: 'Cartes Cadeaux', path: '/gift-cards', icon: GiftIcon }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setIsMegaMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const threshold = 50; // Masquer après 50px de scroll
    setIsScrolled(window.scrollY > threshold);
  };

  const isActiveLink = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`hidden lg:block transition-all duration-300 z-40 w-full fixed top-[104px] xl:top-[112px] bg-white/60 backdrop-blur-xl border-b border-neutral-200/50 shadow-sm ${isScrolled ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-11">
          {/* Bouton catégories */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
            >
              <Bars3Icon className="w-5 h-5" />
              <span className="font-medium">Catégories</span>
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mega Menu Catégories */}
            {isMegaMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-screen max-w-6xl bg-white rounded-xl shadow-xl border border-neutral-200 z-50">
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                      <div key={category.id} className="group">
                        <Link
                          to={`/products?category=${category.id}`}
                          className="flex items-center gap-3 mb-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                          onClick={() => setIsMegaMenuOpen(false)}
                        >
                          <span className="text-2xl">{category.icon}</span>
                          <h3 className="font-semibold text-neutral-800 group-hover:text-primary-600">
                            {category.name}
                          </h3>
                        </Link>

                        <div className="space-y-4">
                          {category.subcategories.map((subcategory, index) => (
                            <div key={index}>
                              <h4 className="font-medium text-sm text-neutral-600 mb-2">
                                {subcategory.title}
                              </h4>
                              <ul className="space-y-1">
                                {subcategory.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <Link
                                      to={`/products?category=${category.id}&subcategory=${item.toLowerCase().replace(/\s+/g, '-')}`}
                                      className="text-sm text-neutral-500 hover:text-primary-600 transition-colors duration-200"
                                      onClick={() => setIsMegaMenuOpen(false)}
                                    >
                                      {item}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Section promotions dans le mega menu */}
                  <div className="border-t border-neutral-200 mt-8 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg p-4 text-white">
                        <h4 className="font-semibold mb-1">Offres Spéciales</h4>
                        <p className="text-sm opacity-90">Jusqu'à -50%</p>
                      </div>
                      <div className="bg-gradient-to-r from-success-500 to-success-600 rounded-lg p-4 text-white">
                        <h4 className="font-semibold mb-1">Livraison Gratuite</h4>
                        <p className="text-sm opacity-90">Dès 100 DT d'achat</p>
                      </div>
                      <div className="bg-gradient-to-r from-info-500 to-info-600 rounded-lg p-4 text-white">
                        <h4 className="font-semibold mb-1">Nouveautés</h4>
                        <p className="text-sm opacity-90">Découvrez nos derniers produits</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Liens de navigation */}
          <div className="hidden lg:flex items-center ml-8 space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActiveLink(link.path, link.exact);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                    }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Actions rapides */}
          <div className="hidden lg:flex items-center ml-auto space-x-4">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span>Plus de 50,000 produits</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;