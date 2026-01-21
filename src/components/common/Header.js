import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  HeartIcon,
  BellIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import OoryxxLogo from './OoryxxLogo';
import { getActiveAnnouncements } from '../../services/announcementService';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await getActiveAnnouncements();
        if (response.success && response.data) {
          setAnnouncements(response.data);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncements();
  }, []);

  // Rotate announcements
  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Fetch unread notifications count
  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/messages/unread-count`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.data?.count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Fetch notifications for dropdown
  const fetchNotifications = async () => {
    if (!user) return;
    setLoadingNotifications(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/messages/my?limit=5`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data?.messages || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/messages/${id}/read`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Refresh counts and notifications
      fetchUnreadCount();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Fermer les menus en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch unread count on mount and periodically
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  // Open notifications dropdown
  const toggleNotifications = () => {
    if (!isNotificationsOpen) {
      fetchNotifications();
    }
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.6;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const cartItemsCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <>
    <header
      className="transition-all duration-500 ease-out w-full z-50 fixed top-0 bg-white/60 backdrop-blur-xl shadow-lg shadow-neutral-200/30 border-b border-neutral-100/50"
    >
      {/* Barre d'annonces dynamique - Affichée seulement si des annonces existent */}
      {announcements.length > 0 && (
        <div className={`bg-gradient-to-r ${announcements[currentAnnouncementIndex]?.backgroundColor || 'from-primary-600 via-primary-500 to-primary-600'} text-white py-2 hidden md:block transition-all duration-500`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-center gap-3 text-sm">
              {/* Announcement content based on type */}
              {announcements[currentAnnouncementIndex]?.type === 'social' ? (
                // Social Links Display
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    {announcements[currentAnnouncementIndex]?.socialLinks?.facebook && (
                      <a href={announcements[currentAnnouncementIndex].socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accent-300 transition-colors flex items-center gap-1">
                        <span>📘</span> Facebook
                      </a>
                    )}
                    {announcements[currentAnnouncementIndex]?.socialLinks?.instagram && (
                      <a href={announcements[currentAnnouncementIndex].socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent-300 transition-colors flex items-center gap-1">
                        <span>📸</span> Instagram
                      </a>
                    )}
                    {announcements[currentAnnouncementIndex]?.socialLinks?.twitter && (
                      <a href={announcements[currentAnnouncementIndex].socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-accent-300 transition-colors flex items-center gap-1">
                        <span>🐦</span> Twitter
                      </a>
                    )}
                    {announcements[currentAnnouncementIndex]?.socialLinks?.tiktok && (
                      <a href={announcements[currentAnnouncementIndex].socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-accent-300 transition-colors flex items-center gap-1">
                        <span>🎵</span> TikTok
                      </a>
                    )}
                    {announcements[currentAnnouncementIndex]?.socialLinks?.youtube && (
                      <a href={announcements[currentAnnouncementIndex].socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-accent-300 transition-colors flex items-center gap-1">
                        <span>▶️</span> YouTube
                      </a>
                    )}
                  </div>
                  <span className="text-white/80">{announcements[currentAnnouncementIndex]?.content}</span>
                </div>
              ) : announcements[currentAnnouncementIndex]?.type === 'info' ? (
                // Contact Info Display
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-6">
                    {announcements[currentAnnouncementIndex]?.contactInfo?.phone && (
                      <div className="flex items-center gap-1.5">
                        <PhoneIcon className="w-4 h-4" />
                        <span>{announcements[currentAnnouncementIndex].contactInfo.phone}</span>
                      </div>
                    )}
                    {announcements[currentAnnouncementIndex]?.contactInfo?.email && (
                      <div className="flex items-center gap-1.5">
                        <EnvelopeIcon className="w-4 h-4" />
                        <span>{announcements[currentAnnouncementIndex].contactInfo.email}</span>
                      </div>
                    )}
                    {announcements[currentAnnouncementIndex]?.contactInfo?.address && (
                      <div className="flex items-center gap-1.5">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{announcements[currentAnnouncementIndex].contactInfo.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Message or Offer Display
                <div className="flex items-center gap-2 animate-pulse">
                  <span className="text-lg">{announcements[currentAnnouncementIndex]?.icon || '📢'}</span>
                  <span className="font-medium">{announcements[currentAnnouncementIndex]?.content}</span>
                  {announcements[currentAnnouncementIndex]?.link && announcements[currentAnnouncementIndex]?.linkText && (
                    <a
                      href={announcements[currentAnnouncementIndex].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold hover:text-accent-300 transition-colors ml-2"
                    >
                      {announcements[currentAnnouncementIndex].linkText}
                    </a>
                  )}
                </div>
              )}
              
              {/* Dots indicator for multiple announcements */}
              {announcements.length > 1 && (
                <div className="flex items-center gap-1 ml-4">
                  {announcements.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentAnnouncementIndex(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentAnnouncementIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* En-tête principal */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <OoryxxLogo size="lg" variant="transparent" darkMode={false} />
          </div>

          {/* Barre de recherche - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des produits, marques..."
                  className="w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-all duration-300 bg-neutral-50 border-neutral-300 text-neutral-700 hover:bg-white focus:ring-2 focus:ring-primary-500"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors text-neutral-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg transition-all bg-primary-500 text-white hover:bg-primary-600"
                >
                  <MagnifyingGlassIcon className="w-5 h-5 lg:hidden" />
                  <span className="hidden lg:inline">Rechercher</span>
                </button>
              </div>
            </form>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            {/* Recherche - Desktop only */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex lg:hidden p-1.5 sm:p-2 rounded-full transition-all active:scale-95 text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
            >
              <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Notifications - Hidden on mobile */}
            {user && (
              <div className="relative hidden sm:block" ref={notificationsRef}>
                <button
                  onClick={toggleNotifications}
                  className="relative p-1.5 sm:p-2 rounded-full transition-all active:scale-95 text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
                >
                  <BellIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-gradient-to-r from-error-500 to-error-600 text-white text-[10px] sm:text-xs rounded-full min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-5 flex items-center justify-center font-medium shadow-md">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 sm:right-0 mt-2 w-[calc(100vw-24px)] sm:w-80 max-w-sm bg-white rounded-xl shadow-2xl border border-neutral-100 z-50 overflow-hidden" style={{right: 'max(-12px, calc(-50vw + 50%))' }}>
                    <div className="px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                      <h3 className="font-semibold">Notifications</h3>
                      <p className="text-xs text-white/80">{unreadCount} non lu(s)</p>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {loadingNotifications ? (
                        <div className="p-4 text-center text-neutral-500">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto mb-2"></div>
                          Chargement...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-neutral-500">
                          <BellIcon className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
                          <p>Aucune notification</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => !notif.isRead && markAsRead(notif._id)}
                            className={`p-4 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer ${!notif.isRead ? 'bg-blue-50' : ''
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${notif.type === 'warning' ? 'bg-orange-500' :
                                notif.type === 'success' ? 'bg-green-500' :
                                  notif.type === 'promo' ? 'bg-purple-500' :
                                    'bg-blue-500'
                                }`}>
                                {notif.type === 'warning' ? '⚠️' :
                                  notif.type === 'success' ? '✅' :
                                    notif.type === 'promo' ? '🎁' : '📢'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-neutral-800 truncate">{notif.title}</p>
                                <p className="text-sm text-neutral-500 line-clamp-2">{notif.content}</p>
                                <p className="text-xs text-neutral-400 mt-1">
                                  {new Date(notif.createdAt).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              {!notif.isRead && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="block px-4 py-3 text-center text-primary-600 text-sm font-medium hover:bg-neutral-50 border-t border-neutral-100"
                    >
                      Voir toutes les notifications
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Favoris */}
            {user && (
              <Link
                to="/wishlist"
                className={`hidden sm:flex relative p-1.5 sm:p-2 rounded-full transition-all active:scale-95 ${isHomePage && !isScrolled ? 'text-white hover:text-accent-400 hover:bg-white/10' : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'}`}
              >
                <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-[10px] sm:text-xs rounded-full min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-5 flex items-center justify-center font-medium shadow-md">
                  2
                </span>
              </Link>
            )}

            {/* Panier - Hidden on mobile */}
            {user && (
              <Link
                to="/cart"
                className="hidden sm:flex relative p-1.5 sm:p-2 rounded-full transition-all active:scale-95 text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
              >
                <ShoppingCartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] sm:text-xs rounded-full min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-5 flex items-center justify-center font-medium shadow-md">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {/* Menu utilisateur - Desktop */}
            <div className="relative hidden sm:block" ref={userMenuRef}>
              {user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl transition-all active:scale-95 hover:bg-neutral-50"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-offset-1 ring-primary-100">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name || user.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-500 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {(user.firstName || user.name)?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-neutral-800">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {user.role === 'admin' ? '⚙️ Administrateur' :
                        user.role === 'vendor' ? '🏪 Vendeur' :
                          user.role === 'moderator' ? '🛡️ Modérateur' :
                            user.role === 'livreur' ? '🚚 Livreur' :
                              user.level === 'VIP' ? '🌟 Client VIP' : '👤 Client'}
                    </p>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-neutral-500" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    to="/login"
                    className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all active:scale-95 text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 shadow-md hover:shadow-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}

              {/* Menu déroulant utilisateur */}
              {user && isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="font-medium text-neutral-800">{user.name}</p>
                    <p className="text-sm text-neutral-500">{user.email}</p>
                    {user.level === 'VIP' && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs bg-warning-100 text-warning-800 px-2 py-1 rounded-full">
                          🌟 Client VIP
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserIcon className="w-5 h-5" />
                      Mon Profil
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      Mes Commandes
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <HeartIcon className="w-5 h-5" />
                      Mes Favoris
                    </Link>

                    {user.role === 'vendor' && (
                      <Link
                        to="/vendor"
                        className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="w-5 h-5 flex items-center justify-center">📊</span>
                        Espace Vendeur
                      </Link>
                    )}

                    {user.role === 'livreur' && (
                      <Link
                        to="/livreur"
                        className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="w-5 h-5 flex items-center justify-center">🚚</span>
                        Espace Livreur
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="w-5 h-5 flex items-center justify-center">⚙️</span>
                        Administration
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-neutral-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-error-600 hover:bg-error-50"
                    >
                      <span className="w-5 h-5 flex items-center justify-center">🚪</span>
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 rounded-full transition-all active:scale-95 text-neutral-800 hover:text-primary-600 hover:bg-primary-50"
            >
              <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>

      {/* Overlay de recherche mobile */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] lg:hidden" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white p-3 sm:p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 sm:gap-4 max-w-lg mx-auto">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des produits..."
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-neutral-200 rounded-full focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 outline-none text-sm sm:text-base transition-all"
                    autoFocus
                  />
                  <MagnifyingGlassIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
                </div>
              </form>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] lg:hidden animate-fadeIn" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-[85%] max-w-[320px] h-full shadow-2xl overflow-y-auto animate-slideInLeft" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-neutral-100 bg-gradient-to-r from-primary-500 to-primary-600 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* User info in mobile menu */}
            {user && (
              <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                    {(user.firstName || user.name)?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 text-sm">{user.firstName || user.name}</p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Auth buttons for mobile - Non connecté */}
            {!user && (
              <div className="p-4 border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-white">
                <p className="text-xs text-neutral-500 mb-3 text-center">Bienvenue sur Ooryxx</p>
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="flex-1 py-2.5 text-center text-primary-600 border-2 border-primary-500 rounded-xl font-semibold hover:bg-primary-50 transition-all active:scale-95"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Connexion
                    </span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 py-2.5 text-center text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg active:scale-95"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center justify-center gap-2">
                      ✨ S'inscrire
                    </span>
                  </Link>
                </div>
              </div>
            )}

            {/* Section Catégories */}
            <div className="p-4 border-b border-neutral-100">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-1">
                Catégories
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/products?category=electronics"
                  className="flex items-center gap-2 px-3 py-2.5 bg-neutral-50 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">📱</span>
                  <span className="text-sm text-neutral-700">Électronique</span>
                </Link>
                <Link
                  to="/products?category=fashion"
                  className="flex items-center gap-2 px-3 py-2.5 bg-neutral-50 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">👕</span>
                  <span className="text-sm text-neutral-700">Mode</span>
                </Link>
                <Link
                  to="/products?category=home"
                  className="flex items-center gap-2 px-3 py-2.5 bg-neutral-50 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">🏠</span>
                  <span className="text-sm text-neutral-700">Maison</span>
                </Link>
                <Link
                  to="/products?category=beauty"
                  className="flex items-center gap-2 px-3 py-2.5 bg-neutral-50 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">💄</span>
                  <span className="text-sm text-neutral-700">Beauté</span>
                </Link>
                <Link
                  to="/products?category=sports"
                  className="flex items-center gap-2 px-3 py-2.5 bg-neutral-50 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">⚽</span>
                  <span className="text-sm text-neutral-700">Sports</span>
                </Link>
                <Link
                  to="/products?category=auto"
                  className="flex items-center gap-2 px-3 py-2.5 bg-neutral-50 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">🚗</span>
                  <span className="text-sm text-neutral-700">Auto</span>
                </Link>
              </div>
            </div>

            {/* Navigation principale */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-1">
                Navigation
              </h3>
              <nav className="space-y-1">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>🏠</span> Accueil
                </Link>
                <Link
                  to="/products"
                  className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>🛍️</span> Tous les Produits
                </Link>
                <Link
                  to="/products?filter=new"
                  className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>✨</span> Nouveautés
                </Link>
                <Link
                  to="/products?sale=true"
                  className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>🏷️</span> Promotions
                </Link>
                <Link
                  to="/products?bestseller=true"
                  className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>🔥</span> Meilleures Ventes
                </Link>
                {user && (
                  <>
                    <div className="border-t border-neutral-100 my-2"></div>
                    <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-3 mb-2 px-1">
                      Mon Compte
                    </h3>
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>❤️</span> Mes Favoris
                    </Link>
                    <Link
                      to="/cart"
                      className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>🛒</span> Mon Panier
                      {cartItemsCount > 0 && (
                        <span className="ml-auto bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {cartItemsCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>📦</span> Mes Commandes
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>👤</span> Mon Profil
                    </Link>
                  </>
                )}
                <div className="border-t border-neutral-100 my-2"></div>
                <Link
                  to="/contact"
                  className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>📞</span> Contact
                </Link>
              </nav>
            </div>

            {/* Logout for mobile */}
            {user && (
              <div className="p-4 border-t border-neutral-100">
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-error-600 border border-error-200 rounded-lg font-medium hover:bg-error-50 transition-colors"
                >
                  <span>🚪</span> Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;