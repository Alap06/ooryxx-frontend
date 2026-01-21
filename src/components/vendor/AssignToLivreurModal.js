import React, { useState, useEffect } from 'react';
import {
    XMarkIcon,
    MagnifyingGlassIcon,
    TruckIcon,
    MapPinIcon,
    StarIcon,
    UserCircleIcon,
    BoltIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import assignmentService from '../../services/assignmentService';

/**
 * Modal for assigning an order to a livreur
 * Used by vendors to select and assign a delivery person
 */
const AssignToLivreurModal = ({ order, onClose, onAssigned }) => {
    const [livreurs, setLivreurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [searchZone, setSearchZone] = useState('');
    const [selectedLivreur, setSelectedLivreur] = useState(null);

    useEffect(() => {
        fetchAvailableLivreurs();
    }, []);

    const fetchAvailableLivreurs = async (zone = '') => {
        try {
            setLoading(true);
            const response = await assignmentService.getAvailableLivreurs({ zone });
            setLivreurs(response.data?.livreurs || []);
        } catch (error) {
            console.error('Error fetching livreurs:', error);
            toast.error('Erreur lors du chargement des livreurs');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchAvailableLivreurs(searchZone);
    };

    const handleAssign = async () => {
        if (!selectedLivreur) {
            toast.warning('Veuillez sélectionner un livreur');
            return;
        }

        try {
            setAssigning(true);
            const response = await assignmentService.assignOrderToLivreur(order._id, selectedLivreur.userId);
            toast.success(`Commande assignée à ${selectedLivreur.name}`);
            onAssigned && onAssigned(response.data);
            onClose();
        } catch (error) {
            toast.error(error.message || 'Erreur lors de l\'assignation');
        } finally {
            setAssigning(false);
        }
    };

    const handleAutoAssign = async () => {
        try {
            setAssigning(true);
            const response = await assignmentService.autoAssignOrder(order._id);
            toast.success(response.message || 'Commande assignée automatiquement');
            onAssigned && onAssigned(response.data);
            onClose();
        } catch (error) {
            toast.error(error.message || 'Aucun livreur disponible dans la zone');
        } finally {
            setAssigning(false);
        }
    };

    const getVehicleEmoji = (type) => {
        const emojis = {
            moto: '🏍️',
            voiture: '🚗',
            camionnette: '🚐',
            velo: '🚲',
            pieton: '🚶'
        };
        return emojis[type] || '🚚';
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Assigner un livreur</h2>
                        <p className="text-blue-100 text-sm">
                            Commande: {order.orderNumber || order._id}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Order Info */}
                <div className="px-6 py-3 bg-gray-50 border-b flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div>
                            <span className="text-sm text-gray-500">Destination:</span>
                            <p className="font-medium text-gray-900">
                                {order.shippingAddress?.city || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Montant:</span>
                            <p className="font-bold text-green-600">
                                {order.totalAmount?.toFixed(2)} DT
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleAutoAssign}
                        disabled={assigning}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
                    >
                        <BoltIcon className="w-5 h-5" />
                        Auto-assigner
                    </button>
                </div>

                {/* Search */}
                <div className="px-6 py-4 border-b">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <MapPinIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Filtrer par zone (Tunis, Ariana, Sousse...)"
                                value={searchZone}
                                onChange={(e) => setSearchZone(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Livreurs List */}
                <div className="px-6 py-4 overflow-y-auto max-h-[400px]">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                        </div>
                    ) : livreurs.length === 0 ? (
                        <div className="text-center py-8">
                            <TruckIcon className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">Aucun livreur disponible</p>
                            <p className="text-sm text-gray-400">Essayez une autre zone</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {livreurs.map((livreur) => (
                                <div
                                    key={livreur._id}
                                    onClick={() => setSelectedLivreur(livreur)}
                                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedLivreur?._id === livreur._id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                                {livreur.profileImage ? (
                                                    <img
                                                        src={livreur.profileImage}
                                                        alt={livreur.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <UserCircleIcon className="w-10 h-10 text-gray-400" />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <p className="font-semibold text-gray-900">{livreur.name}</p>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span>{getVehicleEmoji(livreur.vehicleType)}</span>
                                                    <span>{livreur.zone}</span>
                                                    {livreur.additionalZones?.length > 0 && (
                                                        <span className="text-xs text-gray-400">
                                                            +{livreur.additionalZones.length} zones
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-6 text-sm">
                                            <div className="text-center">
                                                <p className="font-bold text-gray-900">
                                                    {livreur.stats?.totalDeliveries || 0}
                                                </p>
                                                <p className="text-xs text-gray-500">Livraisons</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="flex items-center gap-1">
                                                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="font-bold">
                                                        {livreur.stats?.rating?.toFixed(1) || '5.0'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">Note</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-green-600">
                                                    {livreur.stats?.successRate || 100}%
                                                </p>
                                                <p className="text-xs text-gray-500">Succès</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-blue-600">
                                                    {livreur.currentOrdersCount || 0}/{livreur.maxOrders || 5}
                                                </p>
                                                <p className="text-xs text-gray-500">En cours</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        {selectedLivreur ? (
                            <span className="text-blue-600 font-medium">
                                Sélectionné: {selectedLivreur.name}
                            </span>
                        ) : (
                            <span>Sélectionnez un livreur</span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleAssign}
                            disabled={!selectedLivreur || assigning}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {assigning ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Assignation...
                                </>
                            ) : (
                                <>
                                    <TruckIcon className="w-5 h-5" />
                                    Assigner
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignToLivreurModal;
