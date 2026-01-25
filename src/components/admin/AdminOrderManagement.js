import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start mb-6 border-b pb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900" id="modal-title">
                                    Commande #{order.orderNumber}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Placée le {formatDate(order.createdAt)}
                                </p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Fermer</span>
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Section Gauche : Infos */}
                            <div className="space-y-6">
                                {/* Client */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        Client
                                    </h4>
                                    <div className="text-sm space-y-1">
                                        <p><span className="font-medium">Nom:</span> {order.userId?.firstName} {order.userId?.lastName}</p>
                                        <p><span className="font-medium">Email:</span> {order.userId?.email}</p>
                                        <p><span className="font-medium">Téléphone:</span> {order.shippingAddress?.phone || order.userId?.phoneNumber || 'N/A'}</p>
                                        <p><span className="font-medium">Code Client:</span> {order.clientCode}</p>
                                    </div>
                                </div>

                                {/* Livraison */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        Adresse de Livraison
                                    </h4>
                                    <div className="text-sm space-y-1">
                                        <p className="font-medium">{order.shippingAddress?.recipientName}</p>
                                        <p>{order.shippingAddress?.street}</p>
                                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                                        <p>{order.shippingAddress?.country}</p>
                                        {order.shippingAddress?.instructions && (
                                            <p className="mt-2 text-xs text-gray-500 bg-white p-2 border rounded">
                                                Note: {order.shippingAddress.instructions}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Vendeur */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                        Vendeur
                                    </h4>
                                    <div className="text-sm space-y-1">
                                        <p><span className="font-medium">Magasin:</span> {order.vendorId?.storeName || 'N/A'}</p>
                                        <p><span className="font-medium">Société:</span> {order.vendorId?.companyInfo?.name || 'OORYXX'}</p>
                                        {/* Afficher plus d'infos vendeur si disponible */}
                                    </div>
                                </div>
                            </div>

                            {/* Section Droite : Produits & Statuts */}
                            <div className="space-y-6">
                                {/* Produits */}
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qté</th>
                                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {order.items?.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-3 text-sm">
                                                        <div className="flex items-center">
                                                            {item.productId?.images?.[0]?.url && (
                                                                <img src={item.productId.images[0].url} alt="" className="h-8 w-8 rounded mr-2 object-cover" />
                                                            )}
                                                            <span className="font-medium truncate max-w-[150px]">{item.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-500">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium">{(item.price * item.quantity).toFixed(2)} TND</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td colSpan="2" className="px-4 py-2 text-right text-sm font-semibold">Total Commande</td>
                                                <td className="px-4 py-2 text-right text-sm font-bold text-blue-600">
                                                    {order.totalAmount?.toFixed(2)} TND
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* Historique Statuts */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-3">Historique de Suivi</h4>
                                    <div className="relative pl-4 border-l-2 border-gray-200 space-y-4">
                                        {order.statusHistory?.slice().reverse().map((history, idx) => (
                                            <div key={idx} className="relative">
                                                <div className="absolute -left-[21px] bg-blue-500 h-3 w-3 rounded-full border-2 border-white top-1"></div>
                                                <p className="text-sm font-semibold text-gray-900 capitalize">{history.status}</p>
                                                <p className="text-xs text-gray-500">{formatDate(history.date)}</p>
                                                {history.note && <p className="text-xs text-gray-600 italic mt-1">"{history.note}"</p>}
                                            </div>
                                        ))}
                                        {(!order.statusHistory || order.statusHistory.length === 0) && (
                                            <p className="text-sm text-gray-500 italic">Aucun historique disponible.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminOrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, processing: 0, delivered: 0, cancelled: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Selected Order for Modal
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Pagination
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0,
        limit: 20
    });

    // Filters
    const [filters, setFilters] = useState({
        status: '',
        vendorId: '',
        paymentStatus: '',
        startDate: '',
        endDate: '',
        sortBy: 'createdAt',
        sortOrder: 'desc' // Newest first
    });

    // Search
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Vendors for filter
    const [vendors, setVendors] = useState([]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            if (searchQuery) setPagination(prev => ({ ...prev, currentPage: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch vendors for filter
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const data = await adminService.getVendors({ limit: 100 });
                setVendors(data.vendors || []);
            } catch (err) {
                console.error('Error fetching vendors:', err);
            }
        };
        fetchVendors();
    }, []);

    // Fetch orders
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                page: pagination.currentPage,
                limit: pagination.limit,
                search: debouncedSearch,
                ...filters
            };

            // Clean empty params
            Object.keys(params).forEach(key => !params[key] && delete params[key]);

            const response = await adminService.getAllOrders(params);

            // Handle response structure where data is nested in 'data' property
            const result = response.data || response;

            setOrders(result.orders || []);
            setStats(result.stats || { total: 0, pending: 0, processing: 0, delivered: 0, cancelled: 0 });
            setPagination(prev => ({
                ...prev,
                totalPages: result.pagination?.totalPages || 1,
                total: result.pagination?.total || 0
            }));
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Impossible de charger les commandes.');
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, pagination.limit, debouncedSearch, filters]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    // Helper for status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-purple-100 text-purple-800';
            case 'shipped': return 'bg-indigo-100 text-indigo-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'refunded': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 relative">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Gestion des Commandes</h2>
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                    <span className="bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-full">Total: {stats.total}</span>
                    <span className="bg-green-50 text-green-700 px-2 sm:px-3 py-1 rounded-full">Livrées: {stats.delivered}</span>
                    <span className="bg-yellow-50 text-yellow-700 px-2 sm:px-3 py-1 rounded-full">En attente: {stats.pending}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="sm:col-span-2">
                    <input
                        type="text"
                        placeholder="Rechercher (N° Commande, Client, Code...)"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <select
                    name="status"
                    className="border rounded-md px-3 py-2 text-sm"
                    value={filters.status}
                    onChange={handleFilterChange}
                >
                    <option value="">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="processing">En traitement</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                </select>

                <select
                    name="vendorId"
                    className="border rounded-md px-3 py-2 text-sm"
                    value={filters.vendorId}
                    onChange={handleFilterChange}
                >
                    <option value="">Tous les vendeurs</option>
                    {vendors.map(v => (
                        <option key={v._id} value={v._id}>{v.companyInfo?.name || 'Vendeur'}</option>
                    ))}
                </select>

                <div className="flex gap-2 sm:col-span-2 lg:col-span-2">
                    <input
                        type="date"
                        name="startDate"
                        className="border rounded-md px-3 py-2 w-full text-sm"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        placeholder="Date début"
                    />
                    <input
                        type="date"
                        name="endDate"
                        className="border rounded-md px-3 py-2 w-full text-sm"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        placeholder="Date fin"
                    />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-10">Chargement...</div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Aucune commande trouvée</div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">{order.orderNumber}</h3>
                                        <p className="text-xs text-gray-500">{order.items?.length} article(s)</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="space-y-2 text-xs text-gray-600 mb-3">
                                    <div className="flex justify-between">
                                        <span>Client:</span>
                                        <span className="font-medium text-gray-900">{order.userId?.firstName} {order.userId?.lastName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Montant:</span>
                                        <span className="font-bold text-gray-900">{order.totalAmount?.toFixed(2)} TND</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Date:</span>
                                        <span>{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Vendeur:</span>
                                        <span className="truncate max-w-[120px]">{order.vendorId?.companyInfo?.name || 'Platforme'}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="w-full text-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
                                >
                                    Voir détails
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendeur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                                            <div className="text-xs text-gray-500">{order.items?.length} article(s)</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {order.userId?.firstName} {order.userId?.lastName}
                                            </div>
                                            <div className="text-xs text-gray-500">{order.userId?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.vendorId?.companyInfo?.name || 'Platforme'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.totalAmount?.toFixed(2)} TND
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-blue-600 hover:text-blue-900 font-medium"
                                            >
                                                Voir détails
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Pagination controls */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="w-full sm:w-auto px-4 py-2 border rounded-md disabled:opacity-50 text-sm"
                >
                    Précédent
                </button>
                <span className="text-sm text-gray-700 order-first sm:order-none">
                    Page {pagination.currentPage} sur {pagination.totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="w-full sm:w-auto px-4 py-2 border rounded-md disabled:opacity-50 text-sm"
                >
                    Suivant
                </button>
            </div>

            {/* Modal Order Details */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
};

export default AdminOrderManagement;
