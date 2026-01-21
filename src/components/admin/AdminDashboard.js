import React, { useState, useEffect } from 'react';
import {
    UsersIcon,
    BuildingStorefrontIcon,
    CubeIcon,
    CurrencyDollarIcon,
    ShoppingBagIcon,
    ArrowTrendingUpIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalVendors: 0,
        totalProducts: 0,
        totalRevenue: 0,
        totalOrders: 0,
        pendingApprovals: 0,
        usersGrowth: 0,
        revenueGrowth: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
            setStats({
                totalUsers: 15847,
                totalVendors: 234,
                totalProducts: 8956,
                totalRevenue: 458960,
                totalOrders: 3421,
                pendingApprovals: 12,
                usersGrowth: 12.5,
                revenueGrowth: 23.8
            });

            setRecentActivity([
                { id: 1, type: 'user', message: 'Nouveau utilisateur inscrit', user: 'Ahmed Ben Ali', time: 'Il y a 5 min', icon: UsersIcon, color: 'text-blue-500 bg-blue-100' },
                { id: 2, type: 'vendor', message: 'Demande vendeur en attente', user: 'Tech Store TN', time: 'Il y a 15 min', icon: BuildingStorefrontIcon, color: 'text-orange-500 bg-orange-100' },
                { id: 3, type: 'order', message: 'Nouvelle commande créée', user: 'Commande #ORD-2847', time: 'Il y a 23 min', icon: ShoppingBagIcon, color: 'text-green-500 bg-green-100' },
                { id: 4, type: 'product', message: 'Produit en attente d\'approbation', user: 'iPhone 15 Pro Max', time: 'Il y a 45 min', icon: CubeIcon, color: 'text-purple-500 bg-purple-100' },
                { id: 5, type: 'user', message: 'Nouveau utilisateur inscrit', user: 'Fatma Trabelsi', time: 'Il y a 1h', icon: UsersIcon, color: 'text-blue-500 bg-blue-100' },
            ]);

            setLoading(false);
        }, 1000);
    }, []);

    // Chart data
    const revenueChartData = {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [
            {
                label: 'Revenus (TND)',
                data: [28000, 35000, 42000, 39000, 48000, 52000, 58000, 62000, 55000, 68000, 72000, 85000],
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const ordersChartData = {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
            {
                label: 'Commandes',
                data: [145, 189, 156, 234, 267, 312, 289],
                backgroundColor: 'rgba(139, 92, 246, 0.8)',
                borderRadius: 8
            }
        ]
    };

    const categoryChartData = {
        labels: ['Électronique', 'Mode', 'Maison', 'Sport', 'Beauté', 'Autre'],
        datasets: [
            {
                data: [35, 25, 18, 12, 7, 3],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.9)',
                    'rgba(139, 92, 246, 0.9)',
                    'rgba(236, 72, 153, 0.9)',
                    'rgba(251, 146, 60, 0.9)',
                    'rgba(34, 197, 94, 0.9)',
                    'rgba(156, 163, 175, 0.9)'
                ],
                borderWidth: 0
            }
        ]
    };

    const StatCard = ({ title, value, icon: Icon, growth, iconBg, delay = 0 }) => (
        <div
            className="group bg-white rounded-xl lg:rounded-2xl shadow-lg hover:shadow-2xl p-4 sm:p-5 lg:p-6 transition-all duration-500 transform hover:-translate-y-1 border border-neutral-100 overflow-hidden relative"
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-start justify-between">
                <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-neutral-500 truncate">{title}</p>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight truncate">{value}</h3>
                    {growth !== undefined && (
                        <div className="flex items-center gap-1 flex-wrap">
                            {growth >= 0 ? (
                                <ArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-success-500" />
                            ) : (
                                <ArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-error-500" />
                            )}
                            <span className={`text-xs sm:text-sm font-semibold ${growth >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                                {Math.abs(growth)}%
                            </span>
                            <span className="text-xs text-neutral-400 hidden sm:inline">vs mois dernier</span>
                        </div>
                    )}
                </div>
                <div className={`p-2 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl ${iconBg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0 ml-2`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-primary-400 opacity-20" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 lg:space-y-8 animate-fade-in">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700 rounded-2xl lg:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 text-white">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNjAgMTAgTSAxMCAwIEwgMTAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
                <div className="relative">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Tableau de Bord Administrateur</h1>
                    <p className="text-primary-100 text-sm sm:text-base lg:text-lg">Bienvenue ! Voici un aperçu de votre plateforme.</p>
                </div>

                {/* Quick Stats in Header */}
                <div className="relative mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 lg:flex lg:flex-wrap">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                        <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-success-300" />
                        <div>
                            <p className="text-white/70 text-xs">Aujourd'hui</p>
                            <p className="text-white font-bold text-sm sm:text-base">127 commandes</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                        <ExclamationCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-warning-300" />
                        <div>
                            <p className="text-white/70 text-xs">En attente</p>
                            <p className="text-white font-bold text-sm sm:text-base">{stats.pendingApprovals} approbations</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Utilisateurs Totaux"
                    value={stats.totalUsers.toLocaleString('fr-FR')}
                    icon={UsersIcon}
                    growth={stats.usersGrowth}
                    iconBg="bg-blue-100 text-blue-600"
                    delay={0}
                />
                <StatCard
                    title="Vendeurs Actifs"
                    value={stats.totalVendors.toLocaleString('fr-FR')}
                    icon={BuildingStorefrontIcon}
                    iconBg="bg-purple-100 text-purple-600"
                    delay={100}
                />
                <StatCard
                    title="Produits en Ligne"
                    value={stats.totalProducts.toLocaleString('fr-FR')}
                    icon={CubeIcon}
                    iconBg="bg-pink-100 text-pink-600"
                    delay={200}
                />
                <StatCard
                    title="Chiffre d'Affaires"
                    value={`${stats.totalRevenue.toLocaleString('fr-FR')} TND`}
                    icon={CurrencyDollarIcon}
                    growth={stats.revenueGrowth}
                    iconBg="bg-green-100 text-green-600"
                    delay={300}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 border border-neutral-100">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-neutral-800 truncate">Évolution des Revenus</h2>
                            <p className="text-xs sm:text-sm text-neutral-500">Revenus mensuels 2024</p>
                        </div>
                        <ArrowTrendingUpIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500 flex-shrink-0 ml-2" />
                    </div>
                    <Line
                        data={revenueChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: { display: false }
                            },
                            scales: {
                                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                                x: { grid: { display: false } }
                            }
                        }}
                    />
                </div>

                {/* Orders Chart */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 border border-neutral-100">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-neutral-800 truncate">Commandes Hebdomadaires</h2>
                            <p className="text-xs sm:text-sm text-neutral-500">Cette semaine</p>
                        </div>
                        <ShoppingBagIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 flex-shrink-0 ml-2" />
                    </div>
                    <Bar
                        data={ordersChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: { display: false }
                            },
                            scales: {
                                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                                x: { grid: { display: false } }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 border border-neutral-100">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-neutral-800">Activité Récente</h2>
                        <button className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                            <EyeIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Voir tout</span>
                        </button>
                    </div>
                    <div className="space-y-2 sm:space-y-4">
                        {recentActivity.map((activity) => {
                            const Icon = activity.icon;
                            return (
                                <div key={activity.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-neutral-50 transition-colors group">
                                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${activity.color} transition-transform group-hover:scale-110 flex-shrink-0`}>
                                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-neutral-800 text-sm sm:text-base truncate">{activity.message}</p>
                                        <p className="text-xs sm:text-sm text-neutral-500 truncate">{activity.user}</p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-1 text-neutral-400 text-sm flex-shrink-0">
                                        <ClockIcon className="w-4 h-4" />
                                        {activity.time}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 border border-neutral-100">
                    <h2 className="text-base sm:text-lg lg:text-xl font-bold text-neutral-800 mb-4 sm:mb-6">Répartition par Catégorie</h2>
                    <Doughnut
                        data={categoryChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        usePointStyle: true,
                                        padding: 10,
                                        font: { size: 10 }
                                    }
                                }
                            },
                            cutout: '65%'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
