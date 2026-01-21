import React, { useState } from 'react';
import {
    XMarkIcon,
    MapPinIcon,
    PhoneIcon,
    CheckCircleIcon,
    XCircleIcon,
    TruckIcon,
    CurrencyDollarIcon,
    ArrowRightIcon,
    ClipboardDocumentCheckIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';

// ========================================
// CONFIGURATION PLATEFORME
// ========================================
const PLATFORM_CONFIG = {
    name: 'OORYXX',
    slogan: 'Votre Marketplace de Confiance',
    logo: '/Logo.png',
    contact: {
        phone: '+216 XX XXX XXX',
        email: 'support@ooryxx.com',
        website: 'www.ooryxx.com'
    },
    colors: {
        primary: '#FF6B35',
        secondary: '#F7931E',
        gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
    }
};

const DeliveryLabelView = ({ order, onClose, onStatusUpdate }) => {
    const [updating, setUpdating] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(null); // 'delivered', 'refused', 'returned'
    const [showActionButtons] = useState(true);

    // Données pour le QR code (pour re-scanner si besoin)
    const qrData = JSON.stringify({
        code: order.deliveryCode,
        client: order.clientCode,
        platform: 'OORYXX'
    });

    // Gestion du statut
    const handleStatusChange = async (newStatus, reason = '') => {
        setUpdating(true);
        try {
            await onStatusUpdate(order._id, newStatus, reason);
            setShowConfirmation(null);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setUpdating(false);
        }
    };

    // Appeler le client
    const handleCall = () => {
        const phone = order.shippingAddress?.phone || order.userId?.phoneNumber;
        if (phone) {
            window.open(`tel:${phone}`, '_self');
        }
    };

    // Ouvrir Google Maps
    const handleOpenMaps = () => {
        const address = `${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.country || 'Tunisie'}`;
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    };

    // Labels et couleurs des statuts
    const getStatusInfo = (status) => {
        const configs = {
            'assigned_to_delivery': { 
                color: 'bg-blue-500', 
                bgColor: 'bg-blue-50 border-blue-200', 
                label: 'Assignée', 
                icon: ClipboardDocumentCheckIcon,
                description: 'Prête à être récupérée'
            },
            'picked_up': { 
                color: 'bg-purple-500', 
                bgColor: 'bg-purple-50 border-purple-200', 
                label: 'Récupérée', 
                icon: TruckIcon,
                description: 'En votre possession'
            },
            'out_for_delivery': { 
                color: 'bg-amber-500', 
                bgColor: 'bg-amber-50 border-amber-200', 
                label: 'En livraison', 
                icon: TruckIcon,
                description: 'En route vers le client'
            },
            'delivered': { 
                color: 'bg-green-500', 
                bgColor: 'bg-green-50 border-green-200', 
                label: 'Livrée', 
                icon: CheckCircleIcon,
                description: 'Livraison réussie'
            },
            'refused': { 
                color: 'bg-red-500', 
                bgColor: 'bg-red-50 border-red-200', 
                label: 'Refusée', 
                icon: XCircleIcon,
                description: 'Client a refusé'
            },
            'returned': { 
                color: 'bg-gray-500', 
                bgColor: 'bg-gray-50 border-gray-200', 
                label: 'Retour', 
                icon: ArrowPathIcon,
                description: 'En retour vendeur'
            }
        };
        return configs[status] || configs['assigned_to_delivery'];
    };

    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;

    // Boutons d'action selon le statut
    const getActionButtons = () => {
        switch (order.status) {
            case 'assigned_to_delivery':
                return (
                    <button
                        onClick={() => handleStatusChange('picked_up')}
                        disabled={updating}
                        className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        {updating ? (
                            <ArrowPathIcon className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <TruckIcon className="w-6 h-6" />
                                J'ai récupéré le colis
                            </>
                        )}
                    </button>
                );
            case 'picked_up':
                return (
                    <button
                        onClick={() => handleStatusChange('out_for_delivery')}
                        disabled={updating}
                        className="flex-1 py-4 bg-amber-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors disabled:opacity-50"
                    >
                        {updating ? (
                            <ArrowPathIcon className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <ArrowRightIcon className="w-6 h-6" />
                                Démarrer la livraison
                            </>
                        )}
                    </button>
                );
            case 'out_for_delivery':
                return (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowConfirmation('delivered')}
                            disabled={updating}
                            className="flex-1 py-4 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            <CheckCircleIcon className="w-6 h-6" />
                            Livré
                        </button>
                        <button
                            onClick={() => setShowConfirmation('refused')}
                            disabled={updating}
                            className="flex-1 py-4 bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                            <XCircleIcon className="w-6 h-6" />
                            Refusé
                        </button>
                    </div>
                );
            case 'refused':
                return (
                    <button
                        onClick={() => handleStatusChange('returned')}
                        disabled={updating}
                        className="flex-1 py-4 bg-gray-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        {updating ? (
                            <ArrowPathIcon className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <ArrowPathIcon className="w-6 h-6" />
                                Marquer comme retourné
                            </>
                        )}
                    </button>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[95vh] overflow-y-auto shadow-2xl">
                
                {/* En-tête avec branding */}
                <div 
                    className="p-6 text-white relative overflow-hidden"
                    style={{ background: PLATFORM_CONFIG.colors.gradient }}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img 
                                    src={PLATFORM_CONFIG.logo} 
                                    alt={PLATFORM_CONFIG.name}
                                    className="w-10 h-10 object-contain bg-white rounded-lg p-1"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                <div>
                                    <h1 className="text-xl font-bold">{PLATFORM_CONFIG.name}</h1>
                                    <p className="text-sm opacity-80">Étiquette de livraison</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Code de livraison principal */}
                        <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
                            <p className="text-sm opacity-80 mb-1">CODE DE LIVRAISON</p>
                            <p className="text-3xl font-mono font-bold tracking-wider">
                                {order.deliveryCode || 'LIV-XXXX'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statut actuel */}
                <div className={`mx-4 -mt-4 rounded-xl p-4 border ${statusInfo.bgColor} relative z-10`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${statusInfo.color} rounded-full flex items-center justify-center`}>
                            <StatusIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-lg text-gray-900">{statusInfo.label}</p>
                            <p className="text-sm text-gray-600">{statusInfo.description}</p>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="p-4 space-y-4">
                    
                    {/* Destinataire */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <MapPinIcon className="w-5 h-5 text-orange-500" />
                            <h3 className="font-semibold text-gray-800">Destinataire</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-bold text-gray-900">
                                {order.shippingAddress?.recipientName || order.userId?.firstName}
                            </p>
                            <p className="text-gray-600 text-sm">
                                {order.shippingAddress?.street}
                            </p>
                            <p className="font-semibold text-gray-800">
                                {order.shippingAddress?.postalCode} {order.shippingAddress?.city}
                            </p>
                        </div>
                        
                        {/* Instructions spéciales */}
                        {order.shippingAddress?.instructions && (
                            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800 flex items-start gap-2">
                                    <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>{order.shippingAddress.instructions}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Boutons d'action rapide */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleCall}
                            className="flex items-center justify-center gap-2 py-3 bg-green-100 text-green-700 rounded-xl font-semibold hover:bg-green-200 transition-colors"
                        >
                            <PhoneIcon className="w-5 h-5" />
                            Appeler
                        </button>
                        <button
                            onClick={handleOpenMaps}
                            className="flex items-center justify-center gap-2 py-3 bg-blue-100 text-blue-700 rounded-xl font-semibold hover:bg-blue-200 transition-colors"
                        >
                            <MapPinIcon className="w-5 h-5" />
                            Itinéraire
                        </button>
                    </div>

                    {/* Détails paiement */}
                    <div className={`rounded-xl p-4 ${
                        order.paymentMethod === 'cash_on_delivery' 
                            ? 'bg-orange-50 border-2 border-orange-300' 
                            : 'bg-green-50 border border-green-200'
                    }`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                order.paymentMethod === 'cash_on_delivery' 
                                    ? 'bg-orange-500' 
                                    : 'bg-green-500'
                            }`}>
                                <CurrencyDollarIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className={`font-bold text-lg ${
                                    order.paymentMethod === 'cash_on_delivery' 
                                        ? 'text-orange-800' 
                                        : 'text-green-800'
                                }`}>
                                    {order.paymentMethod === 'cash_on_delivery' 
                                        ? 'PAIEMENT À RÉCUPÉRER' 
                                        : 'DÉJÀ PAYÉ'}
                                </p>
                                {order.paymentMethod === 'cash_on_delivery' && (
                                    <p className="text-2xl font-bold text-orange-600">
                                        {order.totalAmount?.toFixed(2)} TND
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Articles */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">
                            Articles ({order.items?.length || 0})
                        </h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white rounded-lg p-3">
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{item.title || item.productId?.title}</p>
                                        <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-900">{(item.price * item.quantity).toFixed(2)} TND</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* QR Code pour référence */}
                    <div className="flex justify-center">
                        <div className="bg-white p-3 rounded-xl shadow-inner border">
                            <QRCodeSVG 
                                value={qrData}
                                size={100}
                                level="M"
                            />
                        </div>
                    </div>

                    {/* Info commande */}
                    <div className="text-center text-sm text-gray-500">
                        <p>Commande: <span className="font-mono">{order.orderNumber}</span></p>
                        <p>Code client: <span className="font-mono">{order.clientCode}</span></p>
                    </div>
                </div>

                {/* Boutons d'action */}
                {showActionButtons && getActionButtons() && (
                    <div className="p-4 border-t bg-gray-50">
                        {getActionButtons()}
                    </div>
                )}

                {/* Modal de confirmation */}
                {showConfirmation && (
                    <ConfirmationModal
                        type={showConfirmation}
                        onConfirm={(reason) => {
                            handleStatusChange(showConfirmation, reason);
                        }}
                        onCancel={() => setShowConfirmation(null)}
                        updating={updating}
                    />
                )}
            </div>
        </div>
    );
};

// ========================================
// MODAL DE CONFIRMATION
// ========================================
const ConfirmationModal = ({ type, onConfirm, onCancel, updating }) => {
    const [reason, setReason] = useState('');

    const configs = {
        delivered: {
            title: 'Confirmer la livraison',
            message: 'Le colis a bien été remis au client ?',
            confirmText: 'Oui, livré',
            color: 'bg-green-600 hover:bg-green-700',
            icon: CheckCircleIcon
        },
        refused: {
            title: 'Colis refusé',
            message: 'Indiquez la raison du refus:',
            confirmText: 'Confirmer le refus',
            color: 'bg-red-600 hover:bg-red-700',
            icon: XCircleIcon,
            showReason: true,
            reasons: [
                'Client absent',
                'Mauvaise adresse',
                'Client ne veut plus',
                'Montant incorrect',
                'Colis endommagé',
                'Autre'
            ]
        },
        returned: {
            title: 'Retour vendeur',
            message: 'Confirmer le retour du colis au vendeur ?',
            confirmText: 'Confirmer le retour',
            color: 'bg-gray-600 hover:bg-gray-700',
            icon: ArrowPathIcon
        }
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
                <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        type === 'delivered' ? 'bg-green-100' : 
                        type === 'refused' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                        <Icon className={`w-8 h-8 ${
                            type === 'delivered' ? 'text-green-600' : 
                            type === 'refused' ? 'text-red-600' : 'text-gray-600'
                        }`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{config.title}</h3>
                    <p className="text-gray-600 mt-2">{config.message}</p>
                </div>

                {config.showReason && (
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {config.reasons.map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setReason(r)}
                                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                        reason === r 
                                            ? 'bg-red-500 text-white' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                        {reason === 'Autre' && (
                            <textarea
                                placeholder="Précisez la raison..."
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                rows={2}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        )}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={() => onConfirm(reason)}
                        disabled={updating || (config.showReason && !reason)}
                        className={`flex-1 py-3 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 ${config.color}`}
                    >
                        {updating ? (
                            <ArrowPathIcon className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                            config.confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeliveryLabelView;
