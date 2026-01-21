import React, { useState, useEffect, useCallback } from 'react';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    TicketIcon,
    BoltIcon,
    EnvelopeIcon,
    UserGroupIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ArrowPathIcon,
    ChevronDownIcon,
    CalendarIcon,
    PercentBadgeIcon,
    CurrencyDollarIcon,
    TagIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const PromoManagement = () => {
    // State
    const [activeTab, setActiveTab] = useState('coupons');
    const [loading, setLoading] = useState(true);

    // Coupons state
    const [coupons, setCoupons] = useState([]);
    const [couponStats, setCouponStats] = useState({ total: 0, active: 0, expired: 0, flashSales: 0 });
    const [couponPagination, setCouponPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Delete modal
    const [deleteModal, setDeleteModal] = useState({ show: false, coupon: null });

    // Newsletter state
    const [subscribers, setSubscribers] = useState([]);
    const [newsletterStats, setNewsletterStats] = useState({});
    const [newsletterSearch, setNewsletterSearch] = useState('');
    const [showNewsletterModal, setShowNewsletterModal] = useState(false);
    const [newsletterForm, setNewsletterForm] = useState({ subject: '', content: '', targetPreference: '' });

    // Coupon form
    const initialFormData = {
        code: '',
        description: '',
        promoType: 'standard',
        discountType: 'percentage',
        discountValue: 10,
        conditions: {
            minimumPurchase: 0,
            maximumDiscount: '',
            firstPurchaseOnly: false,
            combinable: false
        },
        usageLimit: {
            total: '',
            perUser: 1
        },
        flashSale: {
            startTime: '',
            endTime: '',
            limitedQuantity: ''
        },
        validFrom: new Date().toISOString().split('T')[0],
        validTo: '',
        isActive: true
    };

    const [formData, setFormData] = useState(initialFormData);

    // Fetch coupons
    const fetchCoupons = useCallback(async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllCoupons({
                page: couponPagination.currentPage,
                limit: 20,
                search: searchQuery,
                promoType: filterType,
                status: filterStatus
            });

            setCoupons(response.data?.coupons || []);
            setCouponStats(response.data?.stats || { total: 0, active: 0, expired: 0, flashSales: 0 });
            setCouponPagination(response.data?.pagination || { currentPage: 1, totalPages: 1, total: 0 });
        } catch (error) {
            console.error('Error fetching coupons:', error);
            toast.error('Erreur lors du chargement des coupons');
        } finally {
            setLoading(false);
        }
    }, [couponPagination.currentPage, searchQuery, filterType, filterStatus]);

    // Fetch newsletter subscribers
    const fetchSubscribers = useCallback(async () => {
        try {
            setLoading(true);
            const [subscribersRes, statsRes] = await Promise.all([
                adminService.getNewsletterSubscribers({ search: newsletterSearch }),
                adminService.getNewsletterStats()
            ]);

            setSubscribers(subscribersRes.data?.subscribers || []);
            setNewsletterStats(statsRes.data || {});
        } catch (error) {
            console.error('Error fetching newsletter data:', error);
        } finally {
            setLoading(false);
        }
    }, [newsletterSearch]);

    useEffect(() => {
        if (activeTab === 'coupons' || activeTab === 'flash') {
            fetchCoupons();
        } else if (activeTab === 'newsletter') {
            fetchSubscribers();
        }
    }, [activeTab, fetchCoupons, fetchSubscribers]);

    // Handle form change
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || '' : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || '' : value
            }));
        }
    };

    // Handle add coupon
    const handleAddCoupon = (type = 'standard') => {
        setEditingCoupon(null);
        setFormData({ ...initialFormData, promoType: type });
        setShowModal(true);
    };

    // Handle edit coupon
    const handleEditCoupon = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code || '',
            description: coupon.description || '',
            promoType: coupon.promoType || 'standard',
            discountType: coupon.discountType || 'percentage',
            discountValue: coupon.discountValue || 10,
            conditions: {
                minimumPurchase: coupon.conditions?.minimumPurchase || 0,
                maximumDiscount: coupon.conditions?.maximumDiscount || '',
                firstPurchaseOnly: coupon.conditions?.firstPurchaseOnly || false,
                combinable: coupon.conditions?.combinable || false
            },
            usageLimit: {
                total: coupon.usageLimit?.total || '',
                perUser: coupon.usageLimit?.perUser || 1
            },
            flashSale: {
                startTime: coupon.flashSale?.startTime?.split('T')[0] || '',
                endTime: coupon.flashSale?.endTime?.split('T')[0] || '',
                limitedQuantity: coupon.flashSale?.limitedQuantity || ''
            },
            validFrom: coupon.validFrom?.split('T')[0] || '',
            validTo: coupon.validTo?.split('T')[0] || '',
            isActive: coupon.isActive !== undefined ? coupon.isActive : true
        });
        setShowModal(true);
    };

    // Submit coupon form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.code || !formData.discountValue) {
            toast.error('Le code et la valeur de réduction sont requis');
            return;
        }

        try {
            setFormLoading(true);

            if (editingCoupon) {
                await adminService.updateCoupon(editingCoupon._id, formData);
                toast.success('Coupon modifié avec succès');
            } else {
                await adminService.createCoupon(formData);
                toast.success('Coupon créé avec succès');
            }

            setShowModal(false);
            fetchCoupons();
        } catch (error) {
            toast.error(error.message || 'Erreur lors de l\'enregistrement');
        } finally {
            setFormLoading(false);
        }
    };

    // Delete coupon
    const handleDelete = async () => {
        if (!deleteModal.coupon) return;

        try {
            await adminService.deleteCoupon(deleteModal.coupon._id);
            toast.success('Coupon supprimé avec succès');
            setDeleteModal({ show: false, coupon: null });
            fetchCoupons();
        } catch (error) {
            toast.error(error.message || 'Erreur lors de la suppression');
        }
    };

    // Toggle coupon status
    const handleToggleStatus = async (coupon) => {
        try {
            await adminService.toggleCouponStatus(coupon._id);
            toast.success(`Coupon ${coupon.isActive ? 'désactivé' : 'activé'} avec succès`);
            fetchCoupons();
        } catch (error) {
            toast.error(error.message || 'Erreur lors du changement de statut');
        }
    };

    // Send newsletter
    const handleSendNewsletter = async () => {
        if (!newsletterForm.subject || !newsletterForm.content) {
            toast.error('Le sujet et le contenu sont requis');
            return;
        }

        try {
            const response = await adminService.sendNewsletter(newsletterForm);
            toast.success(response.message || 'Newsletter programmée');
            setShowNewsletterModal(false);
            setNewsletterForm({ subject: '', content: '', targetPreference: '' });
        } catch (error) {
            toast.error(error.message || 'Erreur lors de l\'envoi');
        }
    };

    // Generate random code
    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(prev => ({ ...prev, code }));
    };

    // Get promo type badge
    const getPromoTypeBadge = (type) => {
        const config = {
            standard: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Standard' },
            flash_sale: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Vente Flash' },
            loyalty: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Fidélité' },
            newsletter: { bg: 'bg-green-100', text: 'text-green-700', label: 'Newsletter' },
            welcome: { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Bienvenue' }
        };
        const c = config[type] || config.standard;
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
    };

    // Check if coupon is expired
    const isExpired = (coupon) => {
        if (!coupon.validTo) return false;
        return new Date(coupon.validTo) < new Date();
    };

    const tabs = [
        { id: 'coupons', label: 'Codes Promo', icon: TicketIcon },
        { id: 'flash', label: 'Ventes Flash', icon: BoltIcon },
        { id: 'newsletter', label: 'Newsletter', icon: EnvelopeIcon }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Marketing & Promotions</h1>
                    <p className="text-neutral-500">Gérez vos codes promo, ventes flash et newsletters</p>
                </div>
                {activeTab !== 'newsletter' && (
                    <button
                        onClick={() => handleAddCoupon(activeTab === 'flash' ? 'flash_sale' : 'standard')}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                        <PlusIcon className="w-5 h-5" />
                        {activeTab === 'flash' ? 'Nouvelle Vente Flash' : 'Nouveau Code Promo'}
                    </button>
                )}
                {activeTab === 'newsletter' && (
                    <button
                        onClick={() => setShowNewsletterModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                        Envoyer Newsletter
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-100">
                <div className="flex border-b border-neutral-100">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-red-600 border-b-2 border-red-600 bg-red-50/50' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                {(activeTab === 'coupons' || activeTab === 'flash') && (
                    <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 border-b border-neutral-100">
                        <div className="bg-neutral-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-500">Total</p>
                                    <p className="text-2xl font-bold text-neutral-800">{couponStats.total}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-xl"><TicketIcon className="w-6 h-6 text-blue-600" /></div>
                            </div>
                        </div>
                        <div className="bg-neutral-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-500">Actifs</p>
                                    <p className="text-2xl font-bold text-green-600">{couponStats.active}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-xl"><CheckCircleIcon className="w-6 h-6 text-green-600" /></div>
                            </div>
                        </div>
                        <div className="bg-neutral-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-500">Expirés</p>
                                    <p className="text-2xl font-bold text-red-600">{couponStats.expired}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-xl"><ClockIcon className="w-6 h-6 text-red-600" /></div>
                            </div>
                        </div>
                        <div className="bg-neutral-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-500">Ventes Flash</p>
                                    <p className="text-2xl font-bold text-orange-600">{couponStats.flashSales}</p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-xl"><BoltIcon className="w-6 h-6 text-orange-600" /></div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'newsletter' && (
                    <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 border-b border-neutral-100">
                        <div className="bg-neutral-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-500">Total Abonnés</p>
                                    <p className="text-2xl font-bold text-neutral-800">{newsletterStats.totalSubscribers || 0}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-xl"><UserGroupIcon className="w-6 h-6 text-blue-600" /></div>
                            </div>
                        </div>
                        <div className="bg-neutral-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-500">Actifs</p>
                                    <p className="text-2xl font-bold text-green-600">{newsletterStats.activeSubscribers || 0}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-xl"><CheckCircleIcon className="w-6 h-6 text-green-600" /></div>
                            </div>
                        </div>
                        <div className="bg-neutral-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-500">Nouveaux (30j)</p>
                                    <p className="text-2xl font-bold text-purple-600">{newsletterStats.recentSubscriptions || 0}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-xl"><ArrowPathIcon className="w-6 h-6 text-purple-600" /></div>
                            </div>
                        </div>
                        <div className="bg-neutral-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-500">Désabonnés (30j)</p>
                                    <p className="text-2xl font-bold text-red-600">{newsletterStats.recentUnsubscriptions || 0}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-xl"><XCircleIcon className="w-6 h-6 text-red-600" /></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Coupons Content */}
                {(activeTab === 'coupons' || activeTab === 'flash') && (
                    <div className="p-6">
                        {/* Search & Filters */}
                        <div className="flex flex-col lg:flex-row gap-4 mb-6">
                            <div className="flex-1 relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par code..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="active">Actifs</option>
                                <option value="inactive">Inactifs</option>
                            </select>
                            <button
                                onClick={() => fetchCoupons()}
                                className="px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50"
                            >
                                <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Coupons List */}
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
                            </div>
                        ) : coupons.length === 0 ? (
                            <div className="text-center py-12">
                                <TicketIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                                <p className="text-neutral-500">Aucun coupon trouvé</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-neutral-50 border-b border-neutral-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Code</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Réduction</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Utilisations</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Validité</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Statut</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {coupons
                                            .filter(c => activeTab === 'flash' ? c.promoType === 'flash_sale' : true)
                                            .map(coupon => (
                                                <tr key={coupon._id} className="hover:bg-neutral-50 transition-colors">
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono font-bold text-neutral-800 bg-neutral-100 px-2 py-1 rounded">{coupon.code}</span>
                                                        </div>
                                                        {coupon.description && (
                                                            <p className="text-xs text-neutral-400 mt-1 truncate max-w-[200px]">{coupon.description}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4">{getPromoTypeBadge(coupon.promoType)}</td>
                                                    <td className="px-4 py-4">
                                                        <span className="font-semibold text-neutral-800">
                                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `${coupon.discountValue} TND`}
                                                        </span>
                                                        {coupon.conditions?.minimumPurchase > 0 && (
                                                            <span className="block text-xs text-neutral-500">Min: {coupon.conditions.minimumPurchase} TND</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-neutral-600">
                                                            {coupon.usageCount || 0}
                                                            {coupon.usageLimit?.total && ` / ${coupon.usageLimit.total}`}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="text-sm">
                                                            {coupon.validFrom && (
                                                                <span className="text-neutral-600">{new Date(coupon.validFrom).toLocaleDateString('fr-FR')}</span>
                                                            )}
                                                            {coupon.validTo && (
                                                                <span className={`block text-xs ${isExpired(coupon) ? 'text-red-600' : 'text-neutral-500'}`}>
                                                                    → {new Date(coupon.validTo).toLocaleDateString('fr-FR')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <button
                                                            onClick={() => handleToggleStatus(coupon)}
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${coupon.isActive && !isExpired(coupon) ? 'bg-green-100 text-green-700' : isExpired(coupon) ? 'bg-red-100 text-red-700' : 'bg-neutral-100 text-neutral-600'}`}
                                                        >
                                                            {isExpired(coupon) ? 'Expiré' : coupon.isActive ? 'Actif' : 'Inactif'}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleEditCoupon(coupon)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Modifier"
                                                            >
                                                                <PencilIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteModal({ show: true, coupon })}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Supprimer"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Newsletter Content */}
                {activeTab === 'newsletter' && (
                    <div className="p-6">
                        {/* Search */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par email..."
                                    value={newsletterSearch}
                                    onChange={(e) => setNewsletterSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={() => fetchSubscribers()}
                                className="px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50"
                            >
                                <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Subscribers List */}
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
                            </div>
                        ) : subscribers.length === 0 ? (
                            <div className="text-center py-12">
                                <EnvelopeIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                                <p className="text-neutral-500">Aucun abonné trouvé</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-neutral-50 border-b border-neutral-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Email</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Nom</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Source</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {subscribers.map(sub => (
                                            <tr key={sub._id} className="hover:bg-neutral-50 transition-colors">
                                                <td className="px-4 py-4">
                                                    <span className="text-neutral-800">{sub.email}</span>
                                                </td>
                                                <td className="px-4 py-4 text-neutral-600">
                                                    {sub.firstName} {sub.lastName}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs">{sub.source}</span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-neutral-500">
                                                    {new Date(sub.subscribedAt).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${sub.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {sub.isActive ? 'Actif' : 'Désabonné'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Coupon Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {editingCoupon ? 'Modifier le Coupon' : formData.promoType === 'flash_sale' ? 'Nouvelle Vente Flash' : 'Nouveau Code Promo'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-lg text-white">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                            {/* Code */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Code <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleFormChange}
                                        className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 uppercase font-mono"
                                        placeholder="PROMO2024"
                                    />
                                    <button type="button" onClick={generateCode} className="px-4 py-2 bg-neutral-100 rounded-xl hover:bg-neutral-200">
                                        Générer
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500"
                                    placeholder="Réduction spéciale pour les nouveaux clients"
                                />
                            </div>

                            {/* Discount */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Type de réduction</label>
                                    <select
                                        name="discountType"
                                        value={formData.discountType}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="percentage">Pourcentage (%)</option>
                                        <option value="fixed">Montant fixe (TND)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Valeur <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="discountValue"
                                        value={formData.discountValue}
                                        onChange={handleFormChange}
                                        min="0"
                                        max={formData.discountType === 'percentage' ? 100 : undefined}
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                            </div>

                            {/* Conditions */}
                            <div className="p-4 bg-neutral-50 rounded-xl">
                                <h3 className="font-medium text-neutral-800 mb-3 flex items-center gap-2">
                                    <TagIcon className="w-4 h-4" /> Conditions d'utilisation
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-neutral-600 mb-1">Achat minimum (TND)</label>
                                        <input
                                            type="number"
                                            name="conditions.minimumPurchase"
                                            value={formData.conditions.minimumPurchase}
                                            onChange={handleFormChange}
                                            min="0"
                                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-600 mb-1">Réduction max (TND)</label>
                                        <input
                                            type="number"
                                            name="conditions.maximumDiscount"
                                            value={formData.conditions.maximumDiscount}
                                            onChange={handleFormChange}
                                            min="0"
                                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
                                            placeholder="Illimité"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="conditions.firstPurchaseOnly"
                                            checked={formData.conditions.firstPurchaseOnly}
                                            onChange={handleFormChange}
                                            className="w-4 h-4 text-red-600 rounded"
                                        />
                                        <span className="text-sm text-neutral-700">Premier achat uniquement</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="conditions.combinable"
                                            checked={formData.conditions.combinable}
                                            onChange={handleFormChange}
                                            className="w-4 h-4 text-red-600 rounded"
                                        />
                                        <span className="text-sm text-neutral-700">Cumulable</span>
                                    </label>
                                </div>
                            </div>

                            {/* Usage Limits */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Limite totale</label>
                                    <input
                                        type="number"
                                        name="usageLimit.total"
                                        value={formData.usageLimit.total}
                                        onChange={handleFormChange}
                                        min="0"
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-xl"
                                        placeholder="Illimité"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Par utilisateur</label>
                                    <input
                                        type="number"
                                        name="usageLimit.perUser"
                                        value={formData.usageLimit.perUser}
                                        onChange={handleFormChange}
                                        min="1"
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Validity Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Date de début</label>
                                    <input
                                        type="date"
                                        name="validFrom"
                                        value={formData.validFrom}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Date de fin</label>
                                    <input
                                        type="date"
                                        name="validTo"
                                        value={formData.validTo}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Active */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleFormChange}
                                    className="w-4 h-4 text-red-600 rounded"
                                />
                                <span className="text-sm font-medium text-neutral-700">Coupon actif</span>
                            </label>
                        </form>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex gap-3">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-100">
                                Annuler
                            </button>
                            <button onClick={handleSubmit} disabled={formLoading} className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50">
                                {formLoading ? 'Enregistrement...' : editingCoupon ? 'Modifier' : 'Créer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrashIcon className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">Confirmer la suppression</h3>
                            <p className="text-neutral-500 mb-6">
                                Êtes-vous sûr de vouloir supprimer le coupon <strong>{deleteModal.coupon?.code}</strong> ?
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteModal({ show: false, coupon: null })} className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50">
                                    Annuler
                                </button>
                                <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Newsletter Modal */}
            {showNewsletterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Envoyer une Newsletter</h2>
                            <button onClick={() => setShowNewsletterModal(false)} className="p-2 hover:bg-white/20 rounded-lg text-white">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Sujet <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={newsletterForm.subject}
                                    onChange={(e) => setNewsletterForm(prev => ({ ...prev, subject: e.target.value }))}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-green-500"
                                    placeholder="Nouvelles promotions de la semaine !"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Contenu <span className="text-red-500">*</span></label>
                                <textarea
                                    value={newsletterForm.content}
                                    onChange={(e) => setNewsletterForm(prev => ({ ...prev, content: e.target.value }))}
                                    rows={8}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-green-500"
                                    placeholder="Bonjour {{firstName}},

Découvrez nos nouvelles offres..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Cibler par préférence</label>
                                <select
                                    value={newsletterForm.targetPreference}
                                    onChange={(e) => setNewsletterForm(prev => ({ ...prev, targetPreference: e.target.value }))}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Tous les abonnés</option>
                                    <option value="promotions">Promotions</option>
                                    <option value="newProducts">Nouveaux produits</option>
                                    <option value="flashSales">Ventes flash</option>
                                </select>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <p className="text-sm text-blue-700">
                                    <strong>Note:</strong> L'envoi réel de newsletters nécessite l'intégration d'un service email (SendGrid, Mailgun, etc.)
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex gap-3">
                            <button onClick={() => setShowNewsletterModal(false)} className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-100">
                                Annuler
                            </button>
                            <button onClick={handleSendNewsletter} className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg flex items-center justify-center gap-2">
                                <PaperAirplaneIcon className="w-5 h-5" />
                                Envoyer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromoManagement;
