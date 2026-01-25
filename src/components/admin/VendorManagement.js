import React, { useState, useEffect, useCallback } from 'react';
import {
    MagnifyingGlassIcon,
    BuildingStorefrontIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    StarIcon,
    CubeIcon,
    ShoppingBagIcon,
    ChevronRightIcon,
    XMarkIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { Bar } from 'react-chartjs-2';
import apiService from '../../services/api';
import { toast } from 'react-toastify';

const VendorManagement = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [activeTab, setActiveTab] = useState('list'); // 'list', 'pending'

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);

    const fetchVendors = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiService.get('/admin/vendors');

            // Handle nested response structure: { success, data: { vendors } }
            const responseData = response.data || response;
            const vendorData = responseData.vendors || responseData.data?.vendors || [];

            setVendors(vendorData.map(v => ({
                id: v._id,
                storeName: v.companyInfo?.name || 'Sans nom',
                ownerName: v.userId?.firstName ? `${v.userId.firstName} ${v.userId.lastName}` : 'Inconnu',
                email: v.companyInfo?.email || v.userId?.email || '',
                phone: v.companyInfo?.phone || '',
                status: v.status || 'pending',
                joinDate: v.createdAt,
                products: v.productCount || 0,
                orders: v.orderCount || 0,
                revenue: v.totalRevenue || 0,
                rating: v.rating || 0,
                commission: v.commission || 10,
                category: v.notes?.split(':')[1]?.split('.')[0]?.trim() || 'Non spécifié',
                documents: v.documents,
                bankInfo: v.bankInfo
            })));
        } catch (error) {
            console.error('Error fetching vendors:', error);
            toast.error('Erreur lors du chargement des vendeurs');
            // Keep empty array on error - no mock data
            setVendors([]);
        } finally {
            setLoading(false);
        }

    }, []);

    const getStatusBadge = (status) => {
        const styles = {
            approved: 'bg-success-100 text-success-700 border-success-200',
            suspended: 'bg-error-100 text-error-700 border-error-200',
            pending: 'bg-warning-100 text-warning-700 border-warning-200'
        };
        const labels = { approved: 'Approuvé', suspended: 'Suspendu', pending: 'En attente' };
        const icons = {
            approved: CheckCircleIcon,
            suspended: XCircleIcon,
            pending: ClockIcon
        };
        const Icon = icons[status];
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
                <Icon className="w-3.5 h-3.5" />
                {labels[status]}
            </span>
        );
    };

    const handleApprove = async (vendorId) => {
        try {
            await apiService.put(`/admin/vendors/${vendorId}/approve`);
            setVendors(vendors.map(v =>
                v.id === vendorId ? { ...v, status: 'approved' } : v
            ));
            toast.success('Vendeur approuvé avec succès');
        } catch (error) {
            console.error('Error approving vendor:', error);
            toast.error('Erreur lors de l\'approbation');
        }
    };

    const handleReject = async (vendorId) => {
        try {
            await apiService.put(`/admin/vendors/${vendorId}/reject`);
            setVendors(vendors.map(v =>
                v.id === vendorId ? { ...v, status: 'suspended' } : v
            ));
            toast.success('Demande rejetée');
        } catch (error) {
            console.error('Error rejecting vendor:', error);
            toast.error('Erreur lors du rejet');
        }
    };

    const handleSuspend = async (vendorId) => {
        try {
            await apiService.put(`/admin/vendors/${vendorId}/suspend`);
            setVendors(vendors.map(v =>
                v.id === vendorId ? { ...v, status: 'suspended' } : v
            ));
            toast.success('Vendeur suspendu');
        } catch (error) {
            console.error('Error suspending vendor:', error);
            toast.error('Erreur lors de la suspension');
        }
    };

    const handleActivate = async (vendorId) => {
        try {
            await apiService.put(`/admin/vendors/${vendorId}/activate`);
            setVendors(vendors.map(v =>
                v.id === vendorId ? { ...v, status: 'approved' } : v
            ));
            toast.success('Vendeur réactivé');
        } catch (error) {
            console.error('Error activating vendor:', error);
            toast.error('Erreur lors de la réactivation');
        }
    };

    const pendingVendors = vendors.filter(v => v.status === 'pending');
    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = vendor.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || vendor.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Chart data for selected vendor
    const vendorRevenueChart = selectedVendor ? {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
        datasets: [
            {
                label: 'Revenus (TND)',
                data: [12000, 15000, 18000, 22000, 25000, selectedVendor.revenue / 5],
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderRadius: 8
            }
        ]
    } : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Gestion des Vendeurs</h1>
                    <p className="text-neutral-500">{vendors.length} vendeurs · {pendingVendors.length} en attente d'approbation</p>
                </div>
                <div className="flex bg-neutral-100 rounded-xl p-1">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                    >
                        Tous les Vendeurs
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                    >
                        En Attente
                        {pendingVendors.length > 0 && (
                            <span className="px-2 py-0.5 bg-warning-500 text-white text-xs rounded-full">
                                {pendingVendors.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Pending Approvals */}
            {activeTab === 'pending' && (
                <div className="space-y-4">
                    {pendingVendors.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-neutral-100">
                            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircleIcon className="w-8 h-8 text-success-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-800">Aucune demande en attente</h3>
                            <p className="text-neutral-500 mt-2">Toutes les demandes de vendeurs ont été traitées.</p>
                        </div>
                    ) : (
                        pendingVendors.map(vendor => (
                            <div key={vendor.id} className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-warning-400 to-orange-500 flex items-center justify-center text-white">
                                            <BuildingStorefrontIcon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-neutral-800">{vendor.storeName}</h3>
                                            <p className="text-neutral-500">{vendor.ownerName} · {vendor.category}</p>
                                            <p className="text-sm text-neutral-400">{vendor.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setSelectedVendor(vendor)}
                                            className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 font-medium transition-all flex items-center gap-2"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                            Voir Détails
                                        </button>
                                        <button
                                            onClick={() => handleReject(vendor.id)}
                                            className="px-4 py-2 rounded-xl bg-error-100 text-error-700 hover:bg-error-200 font-semibold transition-all flex items-center gap-2"
                                        >
                                            <XCircleIcon className="w-4 h-4" />
                                            Rejeter
                                        </button>
                                        <button
                                            onClick={() => handleApprove(vendor.id)}
                                            className="px-4 py-2 rounded-xl bg-success-500 text-white hover:bg-success-600 font-semibold transition-all flex items-center gap-2"
                                        >
                                            <CheckCircleIcon className="w-4 h-4" />
                                            Approuver
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* All Vendors List */}
            {activeTab === 'list' && (
                <>
                    {/* Search & Filters */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 border border-neutral-100">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un vendeur..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div className="flex gap-2">
                                {['all', 'approved', 'pending', 'suspended'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === status
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                            }`}
                                    >
                                        {status === 'all' ? 'Tous' : status === 'approved' ? 'Approuvés' : status === 'pending' ? 'En attente' : 'Suspendus'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Vendors Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVendors.map(vendor => (
                            <div
                                key={vendor.id}
                                className="group bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Header */}
                                <div className="p-6 border-b border-neutral-100">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                                                {vendor.storeName[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-neutral-800">{vendor.storeName}</h3>
                                                <p className="text-sm text-neutral-500">{vendor.category}</p>
                                            </div>
                                        </div>
                                        {getStatusBadge(vendor.status)}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="p-6 grid grid-cols-3 gap-4 bg-neutral-50/50">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-lg font-bold text-neutral-800">
                                            <CubeIcon className="w-4 h-4 text-primary-500" />
                                            {vendor.products}
                                        </div>
                                        <p className="text-xs text-neutral-500">Produits</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-lg font-bold text-neutral-800">
                                            <ShoppingBagIcon className="w-4 h-4 text-success-500" />
                                            {vendor.orders}
                                        </div>
                                        <p className="text-xs text-neutral-500">Ventes</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-lg font-bold text-warning-600">
                                            <StarIcon className="w-4 h-4 fill-warning-400" />
                                            {vendor.rating || '-'}
                                        </div>
                                        <p className="text-xs text-neutral-500">Note</p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-4 border-t border-neutral-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-success-600">{vendor.revenue.toLocaleString('fr-FR')} TND</p>
                                        <p className="text-xs text-neutral-500">Chiffre d'affaires</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedVendor(vendor)}
                                        className="p-2 rounded-lg bg-neutral-100 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                                    >
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Vendor Detail Modal */}
            {selectedVendor && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                        {/* Header */}
                        <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-gradient-to-r from-primary-600 to-secondary-600 rounded-t-2xl text-white">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
                                    {selectedVendor.storeName[0]}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{selectedVendor.storeName}</h2>
                                    <p className="text-white/80">{selectedVendor.ownerName}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedVendor(null)}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Status & Commission */}
                            <div className="flex items-center justify-between">
                                {getStatusBadge(selectedVendor.status)}
                                <div className="text-right">
                                    <p className="text-sm text-neutral-500">Commission</p>
                                    <p className="text-lg font-bold text-primary-600">{selectedVendor.commission}%</p>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-4 gap-4">
                                <div className="p-4 bg-primary-50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-primary-700">{selectedVendor.products}</p>
                                    <p className="text-sm text-primary-600">Produits</p>
                                </div>
                                <div className="p-4 bg-success-50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-success-700">{selectedVendor.orders}</p>
                                    <p className="text-sm text-success-600">Ventes</p>
                                </div>
                                <div className="p-4 bg-warning-50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-warning-700">{selectedVendor.rating || '-'}</p>
                                    <p className="text-sm text-warning-600">Note</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-purple-700">{(selectedVendor.revenue / 1000).toFixed(0)}K</p>
                                    <p className="text-sm text-purple-600">TND CA</p>
                                </div>
                            </div>

                            {/* Chart */}
                            {vendorRevenueChart && selectedVendor.status === 'approved' && (
                                <div className="p-4 bg-neutral-50 rounded-xl">
                                    <h3 className="font-semibold text-neutral-800 mb-4">Évolution des revenus</h3>
                                    <Bar data={vendorRevenueChart} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } } }} />
                                </div>
                            )}

                            {/* Contact */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-neutral-800">Informations de contact</h3>
                                <div className="p-3 bg-neutral-50 rounded-xl text-neutral-700">{selectedVendor.email}</div>
                                <div className="p-3 bg-neutral-50 rounded-xl text-neutral-700">{selectedVendor.phone}</div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-neutral-200">
                                {selectedVendor.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => { handleReject(selectedVendor.id); setSelectedVendor(null); }}
                                            className="flex-1 py-3 rounded-xl bg-error-500 text-white font-semibold hover:bg-error-600 transition-all"
                                        >
                                            Rejeter la demande
                                        </button>
                                        <button
                                            onClick={() => { handleApprove(selectedVendor.id); setSelectedVendor(null); }}
                                            className="flex-1 py-3 rounded-xl bg-success-500 text-white font-semibold hover:bg-success-600 transition-all"
                                        >
                                            Approuver
                                        </button>
                                    </>
                                )}
                                {selectedVendor.status === 'approved' && (
                                    <button
                                        onClick={() => { handleSuspend(selectedVendor.id); setSelectedVendor(null); }}
                                        className="flex-1 py-3 rounded-xl bg-error-500 text-white font-semibold hover:bg-error-600 transition-all"
                                    >
                                        Suspendre le vendeur
                                    </button>
                                )}
                                {selectedVendor.status === 'suspended' && (
                                    <button
                                        onClick={() => { handleActivate(selectedVendor.id); setSelectedVendor(null); }}
                                        className="flex-1 py-3 rounded-xl bg-success-500 text-white font-semibold hover:bg-success-600 transition-all"
                                    >
                                        Réactiver le vendeur
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorManagement;
