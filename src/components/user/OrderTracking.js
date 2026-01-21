import React from 'react';
import {
    CheckCircleIcon,
    ClockIcon,
    TruckIcon,
    MapPinIcon,
    HomeIcon,
    XCircleIcon,
    ArrowUturnLeftIcon
} from '@heroicons/react/24/solid';

const OrderTracking = ({ order }) => {
    if (!order) return null;

    const getStatusSteps = () => {
        const allSteps = [
            {
                status: 'pending',
                label: 'Commande passée',
                icon: ClockIcon,
                description: 'Votre commande a été reçue'
            },
            {
                status: 'confirmed',
                label: 'Confirmée',
                icon: CheckCircleIcon,
                description: 'Le vendeur a confirmé votre commande'
            },
            {
                status: 'processing',
                label: 'En préparation',
                icon: ClockIcon,
                description: 'Votre commande est en cours de préparation'
            },
            {
                status: 'ready_to_ship',
                label: 'Prête à expédier',
                icon: CheckCircleIcon,
                description: 'Votre commande est prête pour l\'expédition'
            },
            {
                status: 'assigned_to_delivery',
                label: 'Assignée au livreur',
                icon: TruckIcon,
                description: 'Un livreur a été assigné à votre commande'
            },
            {
                status: 'picked_up',
                label: 'Récupérée',
                icon: TruckIcon,
                description: 'Le livreur a récupéré votre colis'
            },
            {
                status: 'out_for_delivery',
                label: 'En cours de livraison',
                icon: MapPinIcon,
                description: 'Votre livreur est en route !'
            },
            {
                status: 'delivered',
                label: 'Livrée',
                icon: HomeIcon,
                description: 'Votre commande a été livrée avec succès'
            }
        ];

        // Handle special statuses
        if (order.status === 'refused') {
            return [...allSteps.slice(0, 7), {
                status: 'refused',
                label: 'Refusée',
                icon: XCircleIcon,
                description: 'La livraison a été refusée'
            }];
        }

        if (order.status === 'returned') {
            return [...allSteps.slice(0, 7), {
                status: 'returned',
                label: 'Retournée',
                icon: ArrowUturnLeftIcon,
                description: 'La commande est en cours de retour'
            }];
        }

        if (order.status === 'cancelled') {
            return [{
                status: 'cancelled',
                label: 'Annulée',
                icon: XCircleIcon,
                description: 'Cette commande a été annulée'
            }];
        }

        return allSteps;
    };

    const steps = getStatusSteps();
    const currentIndex = steps.findIndex(s => s.status === order.status);

    const getStatusFromHistory = (status) => {
        return order.statusHistory?.find(h => h.status === status);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Suivi de commande</h2>

            {/* Order Number */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Numéro de commande</p>
                        <p className="font-mono font-bold text-lg">{order.orderNumber}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Statut actuel</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'cancelled' || order.status === 'refused' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                            }`}>
                            {steps[currentIndex]?.label || order.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="relative">
                {steps.map((step, index) => {
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const historyEntry = getStatusFromHistory(step.status);
                    const Icon = step.icon;

                    return (
                        <div key={step.status} className="flex gap-4 pb-8 last:pb-0">
                            {/* Line & Icon */}
                            <div className="relative">
                                {/* Vertical Line */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={`absolute top-10 left-5 w-0.5 h-full -ml-px ${isCompleted && index < currentIndex
                                                ? 'bg-green-500'
                                                : 'bg-gray-200'
                                            }`}
                                    />
                                )}

                                {/* Icon Circle */}
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${isCompleted
                                        ? step.status === 'refused' || step.status === 'cancelled'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-400'
                                    } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className={`flex-1 ${!isCompleted ? 'opacity-50' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className={`font-semibold ${isCurrent ? 'text-green-600' : 'text-gray-900'
                                            }`}>
                                            {step.label}
                                            {isCurrent && (
                                                <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            )}
                                        </h3>
                                        <p className="text-sm text-gray-500">{step.description}</p>
                                    </div>
                                    {historyEntry && (
                                        <span className="text-xs text-gray-400">
                                            {formatDate(historyEntry.date)}
                                        </span>
                                    )}
                                </div>

                                {/* Additional notes */}
                                {historyEntry?.note && (
                                    <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                        {historyEntry.note}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Delivery Info (if out for delivery) */}
            {order.status === 'out_for_delivery' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <TruckIcon className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-yellow-800">Votre livreur est en route !</p>
                            <p className="text-sm text-yellow-600">
                                Préparez-vous à recevoir votre colis dans les prochaines minutes.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Delivery Proof (if delivered) */}
            {order.status === 'delivered' && order.deliveryProof && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="font-semibold text-green-800 mb-2">✓ Livraison confirmée</p>
                    {order.deliveredAt && (
                        <p className="text-sm text-green-600">
                            Livrée le {formatDate(order.deliveredAt)}
                        </p>
                    )}
                    {order.deliveryProof.photo && (
                        <img
                            src={order.deliveryProof.photo}
                            alt="Preuve de livraison"
                            className="mt-2 rounded-lg max-h-40 object-cover"
                        />
                    )}
                </div>
            )}

            {/* Refusal Info */}
            {order.status === 'refused' && order.refusalInfo && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="font-semibold text-red-800 mb-2">Livraison refusée</p>
                    <p className="text-sm text-red-600">
                        Raison: {order.refusalInfo.details || order.refusalInfo.reason}
                    </p>
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
