import React, { useState } from 'react';
import {
    HomeIcon,
    CubeIcon,
    FlagIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

// Import components
import DashboardLayout from '../components/common/DashboardLayout';
import ModeratorDashboard from '../components/moderator/ModeratorDashboard';
import ProductApproval from '../components/moderator/ProductApproval';
import ReportManagement from '../components/moderator/ReportManagement';

const ModeratorPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const menuItems = [
        { divider: true, label: 'Modération' },
        { path: '#dashboard', label: 'Tableau de bord', icon: HomeIcon },
        { path: '#products', label: 'Produits en attente', icon: CubeIcon, badge: '8' },
        { path: '#reports', label: 'Signalements', icon: FlagIcon, badge: '5' },
        { divider: true, label: 'Utilisateurs' },
        { path: '#users', label: 'Gestion Utilisateurs', icon: UsersIcon }
    ];

    // Handle tab navigation
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
                return <ModeratorDashboard />;
            case 'products':
                return <ProductApproval />;
            case 'reports':
                return <ReportManagement />;
            case 'users':
                return <UsersPlaceholder />;
            default:
                return <ModeratorDashboard />;
        }
    };

    return (
        <DashboardLayout
            menuItems={wrappedMenuItems}
            title="Modérateur"
            subtitle="Espace de modération"
            headerGradient="from-purple-600 to-indigo-700"
            accentColor="purple"
        >
            {renderContent()}
        </DashboardLayout>
    );
};

const UsersPlaceholder = () => (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-neutral-100">
        <UsersIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-neutral-800 mb-2">Gestion des Utilisateurs</h2>
        <p className="text-neutral-500">Cette fonctionnalité sera bientôt disponible pour les modérateurs.</p>
    </div>
);

export default ModeratorPanel;
