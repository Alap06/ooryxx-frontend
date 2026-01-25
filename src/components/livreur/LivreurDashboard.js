import React, { useState, useEffect, useCallback } from 'react';
import {
    TruckIcon,
    QrCodeIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    MapPinIcon,
    PhoneIcon,

    ChevronRightIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    KeyIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import livreurService from '../../services/livreurService';
import QRScanner from './QRScanner';
import OrderDetailsModal from './OrderDetailsModal';
import DeliveryLabelView from './DeliveryLabelView';

const LivreurDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showScanner, setShowScanner] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showLabelView, setShowLabelView] = useState(false);
    const [labelOrder, setLabelOrder] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true);
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualCode, setManualCode] = useState('');

    const fetchDashboard = useCallback(async () => {
        try {
            const response = await livreurService.getDashboard();
            const data = response.data || response;
            setDashboard(data);
            setIsAvailable(data.livreur?.isAvailable ?? true);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            toast.error('Erreur lors du chargement du tableau de bord');
        }
    }, []);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await livreurService.getMyOrders();
            const data = response.data || response;
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
        fetchOrders();
    }, [fetchDashboard, fetchOrders]);

    const handleAvailabilityToggle = async () => {
        try {
            await livreurService.updateAvailability(!isAvailable);
            setIsAvailable(!isAvailable);
            toast.success(isAvailable ? 'Vous êtes maintenant indisponible' : 'Vous êtes maintenant disponible');
        } catch (error) {
            toast.error('Erreur lors du changement de disponibilité');
        }
    };

    const handleQRScan = async (code) => {
        try {
            const response = await livreurService.scanQRCode(code);
            const data = response.data || response;
            // Afficher l'étiquette complète
            setLabelOrder(data.order);
            setShowLabelView(true);
            setShowScanner(false);
            toast.success('Commande trouvée !');
        } catch (error) {
            toast.error(error.message || 'Commande non trouvée');
        }
    };

    // Recherche manuelle par code
    const handleManualSearch = async (e) => {
        e.preventDefault();
        if (!manualCode.trim()) {
            toast.warning('Entrez un code de livraison');
            return;
        }

        try {
            const response = await livreurService.scanQRCode(manualCode.trim().toUpperCase());
            const data = response.data || response;
            setLabelOrder(data.order);
            setShowLabelView(true);
            setShowManualInput(false);
            setManualCode('');
            toast.success('Commande trouvée !');
        } catch (error) {
            toast.error(error.message || 'Commande non trouvée');
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await livreurService.updateOrderStatus(orderId, { status: newStatus });
            toast.success('Statut mis à jour');
            fetchOrders();
            setSelectedOrder(null);
        } catch (error) {
            toast.error(error.message || 'Erreur lors de la mise à jour');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'assigned_to_delivery': 'bg-blue-100 text-blue-800',
            'picked_up': 'bg-purple-100 text-purple-800',
            'out_for_delivery': 'bg-yellow-100 text-yellow-800',
            'delivered': 'bg-green-100 text-green-800',
            'refused': 'bg-red-100 text-red-800',
            'returned': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'assigned_to_delivery': 'Assignée',
            'picked_up': 'Récupérée',
            'out_for_delivery': 'En route',
            'delivered': 'Livrée',
            'refused': 'Refusée',
            'returned': 'Retour'
        };
        return labels[status] || status;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Bonjour, Livreur</h1>
                        <p className="text-primary-100">Tableau de bord des livraisons</p>
                    </div>
                    <button
                        onClick={handleAvailabilityToggle}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isAvailable
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-red-500 hover:bg-red-600'
                            }`}
                    >
                        {isAvailable ? '✓ Disponible' : '✗ Indisponible'}
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
                        <TruckIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{orders.length}</p>
                        <p className="text-xs text-primary-100">En cours</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
                        <CheckCircleIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{dashboard?.todayStats?.delivered || 0}</p>
                        <p className="text-xs text-primary-100">Livrées aujourd'hui</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
                        <ClockIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{dashboard?.livreur?.stats?.averageDeliveryTime || 0}</p>
                        <p className="text-xs text-primary-100">Min. moyenne</p>
                    </div>
                </div>
            </div>

            {/* QR Scanner Button & Manual Code Entry */}
            <div className="p-4 space-y-3">
                <button
                    onClick={() => setShowScanner(true)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                    <QrCodeIcon className="w-6 h-6" />
                    Scanner un QR Code
                </button>

                <button
                    onClick={() => setShowManualInput(!showManualInput)}
                    className="w-full bg-white border-2 border-indigo-200 text-indigo-600 py-3 rounded-xl flex items-center justify-center gap-3 font-semibold hover:bg-indigo-50 transition-colors"
                >
                    <KeyIcon className="w-5 h-5" />
                    Entrer le code manuellement
                </button>

                {/* Champ de saisie manuelle */}
                {showManualInput && (
                    <form onSubmit={handleManualSearch} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                placeholder="Ex: LIV-2834"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-mono uppercase"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                <MagnifyingGlassIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Entrez le code de livraison (LIV-XXXX) inscrit sur l'étiquette
                        </p>
                    </form>
                )}
            </div>

            {/* Orders List */}
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Mes Livraisons</h2>
                    <button onClick={fetchOrders} className="text-primary-600 hover:text-primary-700">
                        <ArrowPathIcon className="w-5 h-5" />
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl">
                        <TruckIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Aucune livraison en cours</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                onClick={() => {
                                    setLabelOrder(order);
                                    setShowLabelView(true);
                                }}
                                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                                        <p className="text-xs text-indigo-600 font-mono">{order.deliveryCode || 'LIV-XXXX'}</p>
                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary-600">{order.totalAmount?.toFixed(2)} DT</p>
                                        <p className="text-xs text-gray-500">{order.paymentMethod === 'cash_on_delivery' ? '💵 Cash' : '✓ Payé'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                                    <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span className="line-clamp-2">
                                        {order.shippingAddress?.street}, {order.shippingAddress?.city}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <PhoneIcon className="w-4 h-4" />
                                    <span>{order.shippingAddress?.phone || order.userId?.phoneNumber}</span>
                                </div>

                                <div className="flex justify-end mt-3">
                                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* QR Scanner Modal */}
            {showScanner && (
                <QRScanner
                    onScan={handleQRScan}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {/* Delivery Label View - Affichage complet de l'étiquette */}
            {showLabelView && labelOrder && (
                <DeliveryLabelView
                    order={labelOrder}
                    onClose={() => {
                        setShowLabelView(false);
                        setLabelOrder(null);
                    }}
                    onStatusUpdate={async (orderId, status, reason) => {
                        await handleStatusUpdate(orderId, status);
                        // Rafraîchir les commandes après mise à jour
                        fetchOrders();
                        setShowLabelView(false);
                        setLabelOrder(null);
                    }}
                />
            )}

            {/* Order Details Modal (legacy - gardé pour compatibilité) */}
            {selectedOrder && !showLabelView && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusUpdate={handleStatusUpdate}
                    getStatusColor={getStatusColor}
                    getStatusLabel={getStatusLabel}
                />
            )}
        </div>
    );
};

export default LivreurDashboard;
