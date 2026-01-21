import React, { useState } from 'react';
import {
    XMarkIcon,
    PhoneIcon,
    MapPinIcon,
    TruckIcon,
    CheckIcon,
    ArrowUturnLeftIcon,
    CameraIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const OrderDetailsModal = ({ order, onClose, onStatusUpdate, getStatusColor, getStatusLabel }) => {
    const [updating, setUpdating] = useState(false);
    const [showRefusalForm, setShowRefusalForm] = useState(false);
    const [refusalReason, setRefusalReason] = useState('');
    const [refusalDetails, setRefusalDetails] = useState('');

    const handleStatusUpdate = async (newStatus) => {
        setUpdating(true);
        try {
            if (newStatus === 'refused') {
                await onStatusUpdate(order._id, newStatus, {
                    refusalReason,
                    refusalDetails
                });
            } else {
                await onStatusUpdate(order._id, newStatus);
            }
        } finally {
            setUpdating(false);
        }
    };

    const getNextActions = () => {
        const actions = {
            'assigned_to_delivery': [
                { status: 'picked_up', label: 'Récupérée', icon: CheckIcon, color: 'bg-purple-500' }
            ],
            'picked_up': [
                { status: 'out_for_delivery', label: 'En route', icon: TruckIcon, color: 'bg-yellow-500' }
            ],
            'out_for_delivery': [
                { status: 'delivered', label: 'Livrée', icon: CheckIcon, color: 'bg-green-500' },
                { status: 'refused', label: 'Refusée', icon: XMarkIcon, color: 'bg-red-500', hasForm: true }
            ],
            'delivery_attempted': [
                { status: 'out_for_delivery', label: 'Réessayer', icon: TruckIcon, color: 'bg-yellow-500' },
                { status: 'returned', label: 'Retour', icon: ArrowUturnLeftIcon, color: 'bg-gray-500' }
            ],
            'refused': [
                { status: 'returned', label: 'Retourner', icon: ArrowUturnLeftIcon, color: 'bg-gray-500' }
            ]
        };
        return actions[order.status] || [];
    };

    const refusalReasons = [
        { value: 'not_home', label: 'Client absent' },
        { value: 'wrong_address', label: 'Mauvaise adresse' },
        { value: 'damaged', label: 'Colis endommagé' },
        { value: 'refused_payment', label: 'Refus de paiement' },
        { value: 'other', label: 'Autre raison' }
    ];

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
            <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{order.orderNumber}</h2>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Amount */}
                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-primary-600">Montant à collecter</p>
                                <p className="text-2xl font-bold text-primary-700">
                                    {order.paymentMethod === 'cash_on_delivery'
                                        ? `${order.totalAmount?.toFixed(2)} DT`
                                        : 'Déjà payé ✓'
                                    }
                                </p>
                            </div>
                            {order.paymentMethod === 'cash_on_delivery' && (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                                    💵 Cash
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Client</h3>
                        <div className="space-y-2">
                            <p className="font-medium text-gray-900">
                                {order.shippingAddress?.recipientName || order.customer?.name}
                            </p>

                            <a
                                href={`tel:${order.shippingAddress?.phone || order.customer?.phone}`}
                                className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                            >
                                <PhoneIcon className="w-5 h-5" />
                                <span>{order.shippingAddress?.phone || order.customer?.phone}</span>
                            </a>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Adresse de livraison</h3>
                        <div className="flex items-start gap-2">
                            <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-gray-900">{order.shippingAddress?.street}</p>
                                <p className="text-gray-600">
                                    {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                                </p>
                                {order.shippingAddress?.instructions && (
                                    <p className="mt-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                                        📝 {order.shippingAddress.instructions}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Open in Maps */}
                        <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(
                                `${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.country}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 block w-full text-center py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100"
                        >
                            🗺️ Ouvrir dans Maps
                        </a>
                    </div>

                    {/* Items */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Articles ({order.items?.length})</h3>
                        <div className="space-y-2">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-gray-700">{item.title} × {item.quantity}</span>
                                    <span className="text-gray-500">{(item.price * item.quantity).toFixed(2)} DT</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customer Notes */}
                    {order.customerNotes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <h3 className="font-semibold text-yellow-800 mb-2">Note du client</h3>
                            <p className="text-yellow-700">{order.customerNotes}</p>
                        </div>
                    )}

                    {/* Refusal Form */}
                    {showRefusalForm && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-5 h-5" />
                                Raison du refus
                            </h3>
                            <select
                                value={refusalReason}
                                onChange={(e) => setRefusalReason(e.target.value)}
                                className="w-full mb-3 p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500"
                            >
                                <option value="">Sélectionner une raison</option>
                                {refusalReasons.map(r => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </select>
                            <textarea
                                value={refusalDetails}
                                onChange={(e) => setRefusalDetails(e.target.value)}
                                placeholder="Détails supplémentaires..."
                                className="w-full p-3 border border-red-200 rounded-lg resize-none focus:ring-2 focus:ring-red-500"
                                rows={2}
                            />
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => setShowRefusalForm(false)}
                                    className="flex-1 py-2 border border-gray-300 rounded-lg"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('refused')}
                                    disabled={!refusalReason || updating}
                                    className="flex-1 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
                                >
                                    {updating ? 'Envoi...' : 'Confirmer refus'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {!showRefusalForm && (
                    <div className="sticky bottom-0 bg-white border-t p-4">
                        <div className="grid grid-cols-2 gap-3">
                            {getNextActions().map((action) => (
                                <button
                                    key={action.status}
                                    onClick={() => {
                                        if (action.hasForm) {
                                            setShowRefusalForm(true);
                                        } else {
                                            handleStatusUpdate(action.status);
                                        }
                                    }}
                                    disabled={updating}
                                    className={`py-3 px-4 ${action.color} text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50`}
                                >
                                    <action.icon className="w-5 h-5" />
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailsModal;
