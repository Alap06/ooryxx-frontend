import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Bars3Icon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowLeftOnRectangleIcon,
    HomeIcon,
    UserCircleIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import OoryxxLogo from './OoryxxLogo';

const DashboardLayout = ({
    children,
    menuItems = [],
    title = 'Dashboard',
    subtitle = '',
    headerGradient = 'from-neutral-900 to-neutral-800', // Black theme
    accentColor = 'accent' // Orange accent
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error parsing user data');
            }
        }
    }, []);

    // Get role display name
    const getRoleLabel = (role) => {
        const roles = {
            admin: 'Administrateur',
            vendor: 'Vendeur',
            moderator: 'Modérateur',
            customer: 'Client',
            customer_vip: 'Client VIP'
        };
        return roles[role] || 'Utilisateur';
    };

    // Get role badge color
    const getRoleBadgeColor = (role) => {
        const colors = {
            admin: 'bg-red-100 text-red-700',
            vendor: 'bg-indigo-100 text-indigo-700',
            moderator: 'bg-purple-100 text-purple-700',
            customer: 'bg-blue-100 text-blue-700',
            customer_vip: 'bg-amber-100 text-amber-700'
        };
        return colors[role] || 'bg-neutral-100 text-neutral-700';
    };

    // Get user initials
    const getUserInitials = () => {
        if (!user) return 'U';
        const first = user.firstName?.charAt(0) || '';
        const last = user.lastName?.charAt(0) || '';
        return (first + last).toUpperCase() || 'U';
    };

    const isActive = (path) => {
        if (!path || path === '#') return false;
        // Handle internal hash paths
        if (path.startsWith('#')) {
            return false; // Active state managed by parent component
        }
        const pathQuery = path.includes('?') ? path.split('?')[1] : null;
        return location.pathname === path || (pathQuery && location.search.includes(pathQuery));
    };

    const handleMenuClick = (item, e) => {
        // If item has onClick, use it (for internal tab navigation)
        if (item.onClick) {
            e.preventDefault();
            item.onClick();
            setMobileMenuOpen(false);
        }
    };

    const handleLogout = () => {
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        // Force redirect to home page (using window.location for full page reload)
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white/95 backdrop-blur-xl border-r border-neutral-200/50 shadow-2xl z-50 transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-72' : 'w-20'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Logo Section */}
                <div className={`h-20 flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center'} border-b border-neutral-200/50 bg-gradient-to-r ${headerGradient}`}>
                    <div className={`flex items-center gap-3 ${!sidebarOpen && 'flex-col'}`}>
                        {/* Logo - using OoryxxLogo */}
                        <div className={`
                            ${sidebarOpen ? '' : 'flex items-center justify-center'} 
                            transition-all duration-300
                        `}>
                            <OoryxxLogo
                                variant="transparent"
                                size={sidebarOpen ? 'md' : 'sm'}
                                showText={false}
                                darkMode={true}
                                className={!sidebarOpen ? 'justify-center' : ''}
                            />
                        </div>
                        {sidebarOpen && (
                            <div className="animate-fade-in text-white">
                                <h1 className="font-bold text-lg leading-tight">{title}</h1>
                                {subtitle && <p className="text-white/70 text-xs">{subtitle}</p>}
                            </div>
                        )}
                    </div>

                    {/* Collapse Button - only when open */}
                    {sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                    )}

                    {/* Mobile Close */}
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Expand button when collapsed - positioned below logo */}
                {!sidebarOpen && (
                    <div className="hidden lg:flex justify-center p-2 border-b border-neutral-100">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-all duration-200 hover:scale-110"
                            title="Ouvrir le menu"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Navigation */}
                <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100%-12rem)] pb-4">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const active = item.isActive || isActive(item.path);

                        if (item.divider) {
                            return (
                                <div key={index} className="py-3">
                                    {sidebarOpen && (
                                        <p className="px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                            {item.label}
                                        </p>
                                    )}
                                    {!sidebarOpen && <hr className="border-neutral-200" />}
                                </div>
                            );
                        }

                        // Use button for internal navigation with onClick
                        const isInternalNav = item.path?.startsWith('#') || item.onClick;

                        const menuItemContent = (
                            <>
                                {/* Animated Background */}
                                {!active && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-100 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                )}

                                {/* Active Indicator */}
                                {active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                                )}

                                <Icon className={`w-5 h-5 relative z-10 transition-all duration-200 group-hover:scale-110 ${active ? 'text-white' : ''}`} />

                                {sidebarOpen && (
                                    <span className="relative z-10 font-medium truncate">{item.label}</span>
                                )}

                                {/* Badge */}
                                {item.badge && sidebarOpen && (
                                    <span className={`ml-auto relative z-10 px-2 py-0.5 text-xs font-semibold rounded-full animate-pulse
                    ${active ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'}
                  `}>
                                        {item.badge}
                                    </span>
                                )}

                                {/* Tooltip for collapsed state */}
                                {!sidebarOpen && (
                                    <div className="absolute left-full ml-2 px-3 py-2 bg-neutral-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl">
                                        {item.label}
                                        {item.badge && (
                                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-white/20 rounded">
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </>
                        );

                        const menuItemClasses = `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden cursor-pointer
                  ${active
                                ? `bg-gradient-to-r ${headerGradient} text-white shadow-lg shadow-${accentColor}-500/30`
                                : `text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900`
                            }
                  ${!sidebarOpen && 'justify-center px-3'}
                `;

                        if (isInternalNav) {
                            return (
                                <button
                                    key={index}
                                    onClick={(e) => handleMenuClick(item, e)}
                                    className={menuItemClasses + ' w-full text-left'}
                                >
                                    {menuItemContent}
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={menuItemClasses}
                            >
                                {menuItemContent}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200/50 bg-white/50 backdrop-blur-sm">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-200 ${!sidebarOpen && 'justify-center px-3'}`}
                    >
                        <HomeIcon className="w-5 h-5" />
                        {sidebarOpen && <span className="font-medium">Retour au site</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 ${!sidebarOpen && 'justify-center px-3'}`}
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                        {sidebarOpen && <span className="font-medium">Déconnexion</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 flex items-center justify-between px-4 lg:px-8 shadow-sm">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                        <Bars3Icon className="w-6 h-6 text-neutral-600" />
                    </button>

                    {/* Page Title for Mobile */}
                    <div className="lg:hidden flex-1 text-center">
                        <h2 className="font-semibold text-neutral-800">{title}</h2>
                    </div>

                    <div className="hidden lg:block flex-1" />

                    {/* User Profile Section */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-100 transition-all"
                        >
                            {/* Avatar */}
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="w-10 h-10 rounded-xl object-cover shadow-md"
                                />
                            ) : (
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${headerGradient} flex items-center justify-center text-white font-bold shadow-lg`}>
                                    {getUserInitials()}
                                </div>
                            )}

                            {/* User Info - Hidden on mobile */}
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-neutral-800">
                                    {user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}
                                </p>
                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(user?.role)}`}>
                                    {getRoleLabel(user?.role)}
                                </span>
                            </div>

                            <ChevronDownIcon className={`hidden md:block w-4 h-4 text-neutral-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-neutral-200 py-2 z-50 animate-fade-in">
                                    {/* User Info Header */}
                                    <div className="px-4 py-3 border-b border-neutral-100">
                                        <div className="flex items-center gap-3">
                                            {user?.profileImage ? (
                                                <img
                                                    src={user.profileImage}
                                                    alt=""
                                                    className="w-12 h-12 rounded-xl object-cover"
                                                />
                                            ) : (
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${headerGradient} flex items-center justify-center text-white font-bold text-lg`}>
                                                    {getUserInitials()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-neutral-800">
                                                    {user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}
                                                </p>
                                                <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                                                <span className={`inline-flex mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(user?.role)}`}>
                                                    {getRoleLabel(user?.role)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <Link
                                            to="/profile"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition"
                                        >
                                            <UserCircleIcon className="w-5 h-5 text-neutral-400" />
                                            Mon Profil
                                        </Link>
                                        <Link
                                            to="/"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition"
                                        >
                                            <HomeIcon className="w-5 h-5 text-neutral-400" />
                                            Retour au site
                                        </Link>
                                    </div>

                                    {/* Logout */}
                                    <div className="border-t border-neutral-100 pt-2">
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                handleLogout();
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                        >
                                            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                                            Déconnexion
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8 animate-fade-in">
                    {children}
                </main>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;
