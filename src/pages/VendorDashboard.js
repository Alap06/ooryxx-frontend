import React, { useState } from 'react';
import {
  ChartBarIcon,
  CubeIcon,
  ShoppingBagIcon,
  ChartPieIcon,
  CogIcon,
  TicketIcon
} from '@heroicons/react/24/outline';

// Import components
import DashboardLayout from '../components/common/DashboardLayout';
import Dashboard from '../components/vendor/Dashboard';
import ProductManagement from '../components/vendor/ProductManagement';
import OrderManagement from '../components/vendor/OrderManagement';
import Analytics from '../components/vendor/Analytics';
import PromoManagement from '../components/vendor/PromoManagement';

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { divider: true, label: 'Principal' },
    { path: '#dashboard', label: 'Tableau de Bord', icon: ChartBarIcon },
    { path: '#analytics', label: 'Statistiques', icon: ChartPieIcon },
    { divider: true, label: 'Gestion' },
    { path: '#products', label: 'Mes Produits', icon: CubeIcon, badge: '156' },
    { path: '#orders', label: 'Commandes', icon: ShoppingBagIcon, badge: '12' },
    { divider: true, label: 'Marketing' },
    { path: '#promos', label: 'Codes & Promos', icon: TicketIcon },
    { divider: true, label: 'Paramètres' },
    { path: '#settings', label: 'Configuration', icon: CogIcon }
  ];

  const handleMenuClick = (path) => {
    if (path.startsWith('#')) {
      setActiveTab(path.substring(1));
    }
  };

  // Wrap menu items to handle click and set active state
  const wrappedMenuItems = menuItems.map(item => {
    if (item.divider) return item;
    const tabName = item.path?.substring(1);
    return {
      ...item,
      isActive: activeTab === tabName,
      onClick: () => handleMenuClick(item.path)
    };
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'promos':
        return <PromoManagement />;
      case 'settings':
        return <SettingsPlaceholder />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardLayout
      menuItems={wrappedMenuItems}
      title="Vendeur"
      subtitle="Espace vendeur"
      headerGradient="from-indigo-600 to-purple-600"
      accentColor="indigo"
    >
      {renderContent()}
    </DashboardLayout>
  );
};

const SettingsPlaceholder = () => (
  <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-neutral-100">
    <CogIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
    <h2 className="text-xl font-bold text-neutral-800 mb-2">Configuration Vendeur</h2>
    <p className="text-neutral-500">Gérez les paramètres de votre boutique.</p>
    <p className="text-sm text-neutral-400 mt-4">Cette fonctionnalité sera bientôt disponible.</p>
  </div>
);

export default VendorDashboard;