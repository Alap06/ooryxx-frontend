import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChatBubbleLeftRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    EyeIcon,
    UserIcon,
    ShoppingBagIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import apiService from '../../services/api';
import { toast } from 'react-toastify';

const ReclamationManagement = () => {
    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pending: 0,
        in_progress: 0,
        resolved: 0,
        rejected: 0,
        total: 0
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [selectedReclamation, setSelectedReclamation] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [responseText, setResponseText] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [updating, setUpdating] = useState(false);

    const itemsPerPage = 10;

    const typeLabels = {
        produit: 'Produit',
        livraison: 'Livraison',
        vendeur: 'Vendeur',
        paiement: 'Paiement',
        service: 'Service',
        qualite: 'Qualité',
        remboursement: 'Remboursement',
        autre: 'Autre'
    };

    const statusLabels = {
        pending: 'En attente',
        in_progress: 'En cours',
        resolved: 'Résolu',
        rejected: 'Rejeté',
        closed: 'Fermé'
    };

    const priorityLabels = {
        low: 'Basse',
        medium: 'Moyenne',
        high: 'Haute',
        urgent: 'Urgente'
    };

    useEffect(() => {
        fetchReclamations();
    }, [currentPage, filterStatus, filterType, filterPriority, searchQuery]);

    const fetchReclamations = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                status: filterStatus,
                type: filterType,
                priority: filterPriority,
                search: searchQuery
            };

            const response = await apiService.get('/reclamations', { params });

            // Handle nested response structure: { success, data: { reclamations, pagination, stats } }
            const responseData = response.data || response;
            const reclamationsData = responseData.reclamations || responseData.data?.reclamations || [];
            const statsData = responseData.stats || responseData.data?.stats || {
                pending: 0,
                in_progress: 0,
                resolved: 0,
                rejected: 0,
                total: 0
            };
            const paginationData = responseData.pagination || responseData.data?.pagination || {};

            setReclamations(reclamationsData);
            setStats(statsData);
            setTotalPages(paginationData.totalPages || 1);
        } catch (error) {
            console.error('Error fetching reclamations:', error);
            toast.error('Erreur lors du chargement des réclamations');
            // Keep empty array on error - no mock data
            setReclamations([]);
            setStats({ pending: 0, in_progress: 0, resolved: 0, rejected: 0, total: 0 });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!selectedReclamation) return;

        setUpdating(true);
        try {
            await apiService.put(`/reclamations/${selectedReclamation._id}/status`, {
                status: newStatus,
                response: responseText,
                adminNotes: adminNotes
            });

            // Update local state
            setReclamations(reclamations.map(r =>
                r._id === selectedReclamation._id
                    ? { ...r, status: newStatus, response: responseText, adminNotes: adminNotes }
                    : r
            ));
            setSelectedReclamation({ ...selectedReclamation, status: newStatus });
        } catch (error) {
            console.error('Error updating reclamation:', error);
        } finally {
            setUpdating(false);
        }
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 0) return `il y a ${days}j`;
        if (hours > 0) return `il y a ${hours}h`;
        if (minutes > 0) return `il y a ${minutes}min`;
        return 'À l\'instant';
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-amber-100 text-amber-700 border-amber-200',
            in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
            resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            rejected: 'bg-red-100 text-red-700 border-red-200',
            closed: 'bg-neutral-100 text-neutral-700 border-neutral-200'
        };
        const icons = {
            pending: ClockIcon,
            in_progress: ArrowPathIcon,
            resolved: CheckCircleIcon,
            rejected: XCircleIcon,
            closed: CheckCircleIcon
        };
        const Icon = icons[status] || ClockIcon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
                <Icon className="w-3.5 h-3.5" />
                {statusLabels[status]}
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        const styles = {
            low: 'bg-neutral-100 text-neutral-600',
            medium: 'bg-blue-100 text-blue-600',
            high: 'bg-orange-100 text-orange-600',
            urgent: 'bg-red-100 text-red-600'
        };
        return (
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[priority]}`}>
                {priorityLabels[priority]}
            </span>
        );
    };

    const getTypeBadge = (type) => {
        const colors = {
            produit: 'bg-purple-100 text-purple-700',
            livraison: 'bg-indigo-100 text-indigo-700',
            vendeur: 'bg-pink-100 text-pink-700',
            paiement: 'bg-green-100 text-green-700',
            service: 'bg-cyan-100 text-cyan-700',
            qualite: 'bg-yellow-100 text-yellow-700',
            remboursement: 'bg-rose-100 text-rose-700',
            autre: 'bg-neutral-100 text-neutral-700'
        };
        return (
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${colors[type]}`}>
                {typeLabels[type]}
            </span>
        );
    };

    const openReclamationDetail = (reclamation) => {
        setSelectedReclamation(reclamation);
        setResponseText(reclamation.response || '');
        setAdminNotes(reclamation.adminNotes || '');
    };

    if (loading && reclamations.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-red-200 rounded-full animate-spin border-t-red-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Gestion des Réclamations</h1>
                    <p className="text-neutral-500">{stats.total} réclamations au total</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-4 border border-amber-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-amber-600 font-medium">En attente</p>
                            <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-200 rounded-xl flex items-center justify-center">
                            <ClockIcon className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium">En cours</p>
                            <p className="text-2xl font-bold text-blue-700">{stats.in_progress}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                            <ArrowPathIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border border-emerald-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-emerald-600 font-medium">Résolu</p>
                            <p className="text-2xl font-bold text-emerald-700">{stats.resolved}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center">
                            <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 border border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-600 font-medium">Rejeté</p>
                            <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center">
                            <XCircleIcon className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-neutral-100">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par sujet ou description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${showFilters ? 'bg-red-50 border-red-300 text-red-700' : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                            }`}
                    >
                        <FunnelIcon className="w-5 h-5" />
                        Filtres
                    </button>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-neutral-200 space-y-4">
                        {/* Status Filter */}
                        <div>
                            <label className="text-sm font-medium text-neutral-700 mb-2 block">Statut</label>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'pending', 'in_progress', 'resolved', 'rejected'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === status
                                            ? 'bg-red-500 text-white'
                                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                            }`}
                                    >
                                        {status === 'all' ? 'Tous' : statusLabels[status]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label className="text-sm font-medium text-neutral-700 mb-2 block">Type</label>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'produit', 'livraison', 'vendeur', 'paiement', 'service', 'remboursement'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFilterType(type)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === type
                                            ? 'bg-red-500 text-white'
                                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                            }`}
                                    >
                                        {type === 'all' ? 'Tous' : typeLabels[type]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Priority Filter */}
                        <div>
                            <label className="text-sm font-medium text-neutral-700 mb-2 block">Priorité</label>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'low', 'medium', 'high', 'urgent'].map((priority) => (
                                    <button
                                        key={priority}
                                        onClick={() => setFilterPriority(priority)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterPriority === priority
                                            ? 'bg-red-500 text-white'
                                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                            }`}
                                    >
                                        {priority === 'all' ? 'Toutes' : priorityLabels[priority]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Reclamations List */}
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden">
                <div className="divide-y divide-neutral-100">
                    {reclamations.map((reclamation) => (
                        <div
                            key={reclamation._id}
                            onClick={() => openReclamationDetail(reclamation)}
                            className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        {reclamation.priority === 'urgent' && (
                                            <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        )}
                                        <h3 className="font-semibold text-neutral-800 truncate">
                                            {reclamation.subject}
                                        </h3>
                                        {getTypeBadge(reclamation.type)}
                                        {getPriorityBadge(reclamation.priority)}
                                    </div>
                                    <p className="text-sm text-neutral-500 line-clamp-1 mb-2">
                                        {reclamation.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-neutral-400">
                                        {reclamation.isAnonymous ? (
                                            <span className="flex items-center gap-1">
                                                <UserIcon className="w-3.5 h-3.5" />
                                                Anonyme
                                            </span>
                                        ) : reclamation.userId && (
                                            <span className="flex items-center gap-1">
                                                <UserIcon className="w-3.5 h-3.5" />
                                                {reclamation.userId.firstName} {reclamation.userId.lastName}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <ClockIcon className="w-3.5 h-3.5" />
                                            {getTimeAgo(reclamation.createdAt)}
                                        </span>
                                        {reclamation.orderId && (
                                            <span className="flex items-center gap-1">
                                                <ShoppingBagIcon className="w-3.5 h-3.5" />
                                                {reclamation.orderId.orderNumber || 'Commande liée'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {getStatusBadge(reclamation.status)}
                                    <button className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500">
                                        <EyeIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {reclamations.length === 0 && (
                    <div className="p-12 text-center">
                        <ChatBubbleLeftRightIcon className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-neutral-600">Aucune réclamation</h3>
                        <p className="text-neutral-400">Les réclamations apparaîtront ici</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="border-t border-neutral-200 px-6 py-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-500">
                            Page {currentPage} sur {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Reclamation Detail Modal */}
            {selectedReclamation && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-neutral-200 flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-xl font-bold text-neutral-800">{selectedReclamation.subject}</h2>
                                    {getPriorityBadge(selectedReclamation.priority)}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-neutral-500">
                                    {getTypeBadge(selectedReclamation.type)}
                                    {getStatusBadge(selectedReclamation.status)}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedReclamation(null)}
                                className="p-2 rounded-lg hover:bg-neutral-100"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* User Info */}
                            <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                                    {selectedReclamation.isAnonymous ? '?' : (
                                        selectedReclamation.userId
                                            ? `${selectedReclamation.userId.firstName?.[0] || ''}${selectedReclamation.userId.lastName?.[0] || ''}`
                                            : '?'
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-800">
                                        {selectedReclamation.isAnonymous
                                            ? 'Utilisateur Anonyme'
                                            : selectedReclamation.userId
                                                ? `${selectedReclamation.userId.firstName} ${selectedReclamation.userId.lastName}`
                                                : 'Utilisateur inconnu'}
                                    </p>
                                    <p className="text-sm text-neutral-500">
                                        {selectedReclamation.isAnonymous
                                            ? selectedReclamation.anonymousEmail || 'Email non fourni'
                                            : selectedReclamation.userId?.email || ''}
                                    </p>
                                </div>
                                <div className="ml-auto text-right">
                                    <p className="text-sm text-neutral-500">Soumis</p>
                                    <p className="font-medium text-neutral-700">{getTimeAgo(selectedReclamation.createdAt)}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium text-neutral-700 mb-2 block">Description</label>
                                <div className="p-4 bg-neutral-50 rounded-xl text-neutral-700">
                                    {selectedReclamation.description}
                                </div>
                            </div>

                            {/* Related Order/Product */}
                            {(selectedReclamation.orderId || selectedReclamation.productId) && (
                                <div className="flex gap-4">
                                    {selectedReclamation.orderId && (
                                        <div className="flex-1 p-3 bg-blue-50 rounded-xl">
                                            <p className="text-sm font-medium text-blue-700">Commande liée</p>
                                            <p className="text-blue-600">{selectedReclamation.orderId.orderNumber}</p>
                                        </div>
                                    )}
                                    {selectedReclamation.productId && (
                                        <div className="flex-1 p-3 bg-purple-50 rounded-xl">
                                            <p className="text-sm font-medium text-purple-700">Produit concerné</p>
                                            <p className="text-purple-600">{selectedReclamation.productId.title}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Admin Notes */}
                            <div>
                                <label className="text-sm font-medium text-neutral-700 mb-2 block">Notes internes (non visibles par l'utilisateur)</label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Ajoutez des notes internes..."
                                    rows={2}
                                    className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                                />
                            </div>

                            {/* Response to User */}
                            <div>
                                <label className="text-sm font-medium text-neutral-700 mb-2 block">Réponse à l'utilisateur</label>
                                <textarea
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    placeholder="Rédigez votre réponse..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-neutral-200 bg-neutral-50">
                            <div className="flex flex-wrap gap-3">
                                {selectedReclamation.status === 'pending' && (
                                    <button
                                        onClick={() => handleStatusUpdate('in_progress')}
                                        disabled={updating}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                                    >
                                        <ArrowPathIcon className="w-4 h-4" />
                                        Prendre en charge
                                    </button>
                                )}
                                {(selectedReclamation.status === 'pending' || selectedReclamation.status === 'in_progress') && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate('resolved')}
                                            disabled={updating}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                        >
                                            <CheckCircleIcon className="w-4 h-4" />
                                            Marquer résolu
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate('rejected')}
                                            disabled={updating}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                                        >
                                            <XCircleIcon className="w-4 h-4" />
                                            Rejeter
                                        </button>
                                    </>
                                )}
                                {responseText && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedReclamation.status)}
                                        disabled={updating}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 text-white rounded-xl font-medium hover:bg-neutral-900 transition-colors disabled:opacity-50 ml-auto"
                                    >
                                        <PaperAirplaneIcon className="w-4 h-4" />
                                        Envoyer la réponse
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

export default ReclamationManagement;
