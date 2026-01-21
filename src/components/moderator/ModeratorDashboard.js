import React, { useState, useEffect } from 'react';
import {
    ClipboardDocumentListIcon,
    CubeIcon,
    FlagIcon,
    CheckCircleIcon,
    ClockIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const ModeratorDashboard = () => {
    const [stats, setStats] = useState({
        pendingProducts: 0,
        pendingReports: 0,
        resolvedToday: 0,
        totalModerated: 0
    });
    const [recentActions, setRecentActions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setStats({
                pendingProducts: 8,
                pendingReports: 5,
                resolvedToday: 23,
                totalModerated: 1547
            });

            setRecentActions([
                { id: 1, action: 'Produit approuvé', item: 'iPhone 15 Pro Max', time: 'Il y a 5 min', status: 'approved' },
                { id: 2, action: 'Signalement traité', item: 'Produit #2847', time: 'Il y a 15 min', status: 'resolved' },
                { id: 3, action: 'Produit rejeté', item: 'Faux AirPods', time: 'Il y a 32 min', status: 'rejected' },
                { id: 4, action: 'Utilisateur averti', item: 'User #1234', time: 'Il y a 1h', status: 'warning' },
                { id: 5, action: 'Produit approuvé', item: 'Samsung Galaxy S24', time: 'Il y a 1h', status: 'approved' },
            ]);

            setLoading(false);
        }, 800);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-success-100 text-success-700';
            case 'rejected': return 'bg-error-100 text-error-700';
            case 'resolved': return 'bg-info-100 text-info-700';
            case 'warning': return 'bg-warning-100 text-warning-700';
            default: return 'bg-neutral-100 text-neutral-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5" />
                <div className="relative">
                    <h1 className="text-2xl font-bold mb-2">Tableau de Bord Modérateur</h1>
                    <p className="text-purple-100">Gérez les contenus en attente de validation</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 group hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">Produits en attente</p>
                            <p className="text-3xl font-bold text-neutral-800">{stats.pendingProducts}</p>
                        </div>
                        <div className="p-4 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform">
                            <CubeIcon className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 group hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">Signalements</p>
                            <p className="text-3xl font-bold text-neutral-800">{stats.pendingReports}</p>
                        </div>
                        <div className="p-4 bg-red-100 rounded-xl group-hover:scale-110 transition-transform">
                            <FlagIcon className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 group hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">Résolus aujourd'hui</p>
                            <p className="text-3xl font-bold text-success-600">{stats.resolvedToday}</p>
                        </div>
                        <div className="p-4 bg-success-100 rounded-xl group-hover:scale-110 transition-transform">
                            <CheckCircleIcon className="w-6 h-6 text-success-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 group hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">Total modéré</p>
                            <p className="text-3xl font-bold text-neutral-800">{stats.totalModerated.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                            <ArrowTrendingUpIcon className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100">
                    <h2 className="text-lg font-bold text-neutral-800 mb-4">Actions Rapides</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-left group">
                            <CubeIcon className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-semibold text-neutral-800">Produits</p>
                            <p className="text-sm text-neutral-500">{stats.pendingProducts} en attente</p>
                        </button>
                        <button className="p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-left group">
                            <FlagIcon className="w-8 h-8 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-semibold text-neutral-800">Signalements</p>
                            <p className="text-sm text-neutral-500">{stats.pendingReports} à traiter</p>
                        </button>
                        <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left group col-span-2">
                            <ClipboardDocumentListIcon className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-semibold text-neutral-800">File d'attente</p>
                            <p className="text-sm text-neutral-500">Voir tous les éléments en attente</p>
                        </button>
                    </div>
                </div>

                {/* Recent Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100">
                    <h2 className="text-lg font-bold text-neutral-800 mb-4">Actions Récentes</h2>
                    <div className="space-y-3">
                        {recentActions.map(action => (
                            <div key={action.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(action.status)}`}>
                                        {action.status === 'approved' ? '✓' : action.status === 'rejected' ? '✗' : '!'}
                                    </span>
                                    <div>
                                        <p className="font-medium text-neutral-800">{action.action}</p>
                                        <p className="text-sm text-neutral-500">{action.item}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-neutral-400">
                                    <ClockIcon className="w-4 h-4" />
                                    {action.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModeratorDashboard;
