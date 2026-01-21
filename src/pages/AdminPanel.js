import React, { useState } from 'react';
import {
  HomeIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  TagIcon,
  TicketIcon,
  TruckIcon,
  SparklesIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';

// Import components
import DashboardLayout from '../components/common/DashboardLayout';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import VendorManagement from '../components/admin/VendorManagement';
import SystemSettings from '../components/admin/SystemSettings';
import ReclamationManagement from '../components/admin/ReclamationManagement';
import AdminProductManagement from '../components/admin/AdminProductManagement';
import AdminOrderManagement from '../components/admin/AdminOrderManagement';
import AdminModeratorManagement from '../components/admin/AdminModeratorManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import PromoManagement from '../components/admin/PromoManagement';
import LivreursManagement from '../components/admin/LivreursManagement';
import DeliveryManagement from '../components/admin/DeliveryManagement';
import FeaturedProductsManagement from '../components/admin/FeaturedProductsManagement';
import AnnouncementManagement from '../components/admin/AnnouncementManagement';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { divider: true, label: 'Tableau de bord' },
    { path: '#dashboard', label: 'Vue d\'ensemble', icon: HomeIcon },
    { path: '#analytics', label: 'Analytiques', icon: ChartBarIcon },
    { divider: true, label: 'Catalogue' },
    { path: '#categories', label: 'Catégories', icon: TagIcon },
    { path: '#products', label: 'Produits', icon: CubeIcon },
    { path: '#featured', label: 'Produits Vedette', icon: SparklesIcon, badge: 'Hero' },
    { divider: true, label: 'Marketing' },
    { path: '#promos', label: 'Codes & Promos', icon: TicketIcon },
    { path: '#announcements', label: 'Barre d\'Annonces', icon: MegaphoneIcon, badge: 'Nouveau' },
    { divider: true, label: 'Gestion' },
    { path: '#users', label: 'Utilisateurs', icon: UsersIcon, badge: '15K+' },
    { path: '#vendors', label: 'Vendeurs', icon: BuildingStorefrontIcon, badge: '12' },
    { path: '#livreurs', label: 'Livreurs', icon: TruckIcon },
    { path: '#deliveries', label: 'Livraisons', icon: TruckIcon, badge: 'Nouveau' },
    { path: '#orders', label: 'Commandes', icon: ShoppingBagIcon },
    { divider: true, label: 'Support' },
    { path: '#reclamations', label: 'Réclamations', icon: ExclamationTriangleIcon, badge: 'Nouveau' },
    { divider: true, label: 'Système' },
    { path: '#moderation', label: 'Modération', icon: ShieldCheckIcon },
    { path: '#settings', label: 'Paramètres', icon: CogIcon }
  ];

  // Handle tab navigation from menu clicks
  const handleMenuClick = (path) => {
    if (path.startsWith('#')) {
      setActiveTab(path.substring(1));
    }
  };

  // Wrap menu items to handle click and set active state
  const wrappedMenuItems = menuItems.map(item => {
    if (item.divider) return item;
    const tabName = item.path?.substring(1); // Remove # from path
    return {
      ...item,
      path: item.path,
      isActive: activeTab === tabName, // Set active state based on current tab
      onClick: () => handleMenuClick(item.path)
    };
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'analytics':
        return <AdminDashboard />;
      case 'categories':
        return <CategoryManagement />;
      case 'users':
        return <UserManagement />;
      case 'vendors':
        return <VendorManagement />;
      case 'products':
        return <AdminProductManagement />;
      case 'featured':
        return <FeaturedProductsManagement />;
      case 'orders':
        return <AdminOrderManagement />;
      case 'deliveries':
        return <DeliveryManagement />;
      case 'promos':
        return <PromoManagement />;
      case 'announcements':
        return <AnnouncementManagement />;
      case 'livreurs':
        return <LivreursManagement />;
      case 'reclamations':
        return <ReclamationManagement />;
      case 'moderation':
        return <AdminModeratorManagement />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <DashboardLayout
      menuItems={wrappedMenuItems}
      title="Admin"
      subtitle="Panneau d'administration"
      headerGradient="from-red-600 to-orange-600"
      accentColor="red"
    >
      {renderContent()}
    </DashboardLayout>
  );
};



export default AdminPanel;