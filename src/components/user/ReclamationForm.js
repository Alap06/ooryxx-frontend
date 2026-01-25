import React, { useState, useEffect } from 'react';
import {
    ExclamationTriangleIcon,
    PaperAirplaneIcon,
    EyeSlashIcon,
    EyeIcon,
    ShoppingBagIcon,
    CubeIcon,
    CheckCircleIcon,
    XMarkIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import apiService from '../../services/api';

const ReclamationForm = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        isAnonymous: false,
        anonymousEmail: '',
        type: '',
        subject: '',
        description: '',
        orderId: '',
        productId: '',
        priority: 'medium'
    });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const typeOptions = [
        { value: 'produit', label: 'Problème de produit', icon: CubeIcon },
        { value: 'livraison', label: 'Problème de livraison', icon: ShoppingBagIcon },
        { value: 'vendeur', label: 'Problème avec un vendeur', icon: ExclamationTriangleIcon },
        { value: 'paiement', label: 'Problème de paiement', icon: ExclamationTriangleIcon },
        { value: 'service', label: 'Service client', icon: ExclamationTriangleIcon },
        { value: 'qualite', label: 'Qualité du produit', icon: ExclamationTriangleIcon },
        { value: 'remboursement', label: 'Demande de remboursement', icon: ExclamationTriangleIcon },
        { value: 'autre', label: 'Autre', icon: ExclamationTriangleIcon }
    ];

    useEffect(() => {
        // Fetch user's orders for linking
        const fetchOrders = async () => {
            try {
                // Use the correct endpoint for user orders
                const response = await apiService.get('/users/orders', { params: { limit: 20 } });
                setOrders(response.data?.orders || response.orders || []);
            } catch (err) {
                console.log('Could not fetch orders:', err.message);
                // Orders are optional, don't block the form
            }
        };
        fetchOrders();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await apiService.post('/reclamations', formData);
            setSuccess(true);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || 'Erreur lors de l\'envoi de la réclamation');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-scale-in">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircleIcon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-800 mb-2">Réclamation envoyée !</h2>
                    <p className="text-neutral-500 mb-6">
                        Votre réclamation a été soumise avec succès. Notre équipe la traitera dans les plus brefs délais.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-gradient-to-r from-red-500 to-orange-500">
                    <div>
                        <h2 className="text-xl font-bold text-white">Soumettre une réclamation</h2>
                        <p className="text-white/80 text-sm">Nous sommes là pour vous aider</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Anonymous Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200">
                        <div className="flex items-center gap-3">
                            {formData.isAnonymous ? (
                                <EyeSlashIcon className="w-5 h-5 text-neutral-600" />
                            ) : (
                                <EyeIcon className="w-5 h-5 text-neutral-600" />
                            )}
                            <div>
                                <p className="font-medium text-neutral-800">Réclamation anonyme</p>
                                <p className="text-xs text-neutral-500">Votre identité ne sera pas révélée</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isAnonymous"
                                checked={formData.isAnonymous}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                    </div>

                    {/* Anonymous Email (if anonymous) */}
                    {formData.isAnonymous && (
                        <div>
                            <label className="text-sm font-medium text-neutral-700 mb-2 block">
                                Email de contact (optionnel)
                            </label>
                            <input
                                type="email"
                                name="anonymousEmail"
                                value={formData.anonymousEmail}
                                onChange={handleChange}
                                placeholder="Pour recevoir une réponse..."
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    )}

                    {/* Type Selection */}
                    <div>
                        <label className="text-sm font-medium text-neutral-700 mb-2 block">
                            Type de réclamation *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {typeOptions.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: option.value }))}
                                    className={`flex items-center gap-2 p-3 rounded-xl border text-left text-sm font-medium transition-all ${formData.type === option.value
                                        ? 'bg-red-50 border-red-300 text-red-700'
                                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                                        }`}
                                >
                                    <option.icon className="w-4 h-4" />
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="text-sm font-medium text-neutral-700 mb-2 block">
                            Sujet *
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Résumé de votre réclamation"
                            required
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-neutral-700 mb-2 block">
                            Description détaillée *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Décrivez votre problème en détail..."
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none transition-all"
                        />
                    </div>

                    {/* Link to Order */}
                    {orders.length > 0 && (
                        <div>
                            <label className="text-sm font-medium text-neutral-700 mb-2 block">
                                Lier à une commande (optionnel)
                            </label>
                            <select
                                name="orderId"
                                value={formData.orderId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="">Sélectionner une commande</option>
                                {orders.map(order => (
                                    <option key={order._id} value={order._id}>
                                        {order.orderNumber} - {order.totalAmount} TND
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Priority */}
                    <div>
                        <label className="text-sm font-medium text-neutral-700 mb-2 block">
                            Priorité
                        </label>
                        <div className="flex gap-2">
                            {[
                                { value: 'low', label: 'Basse', color: 'neutral' },
                                { value: 'medium', label: 'Moyenne', color: 'blue' },
                                { value: 'high', label: 'Haute', color: 'orange' },
                                { value: 'urgent', label: 'Urgente', color: 'red' }
                            ].map(p => (
                                <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, priority: p.value }))}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${formData.priority === p.value
                                        ? `bg-${p.color}-100 text-${p.color}-700 border-2 border-${p.color}-300`
                                        : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-200 bg-neutral-50">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading || !formData.type || !formData.subject || !formData.description}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <ClockIcon className="w-5 h-5 animate-spin" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <PaperAirplaneIcon className="w-5 h-5" />
                                Soumettre la réclamation
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReclamationForm;
