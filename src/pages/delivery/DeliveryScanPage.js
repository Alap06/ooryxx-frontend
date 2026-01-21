import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPinIcon,
    PhoneIcon,
    CurrencyDollarIcon,
    ClipboardDocumentCheckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon,
    QrCodeIcon,
    ShoppingBagIcon
} from '@heroicons/react/24/outline';

// Configuration plateforme
const PLATFORM_CONFIG = {
    name: 'OORYXX',
    logo: '/Logo.png',
    contact: {
        phone: '+216 XX XXX XXX',
        support: 'support@ooryxx.com'
    }
};

const DeliveryScanPage = () => {
    const { deliveryCode } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Essayer de récupérer les données depuis le QR code (URL query params) ou API
        const fetchOrderData = async () => {
            setLoading(true);
            try {
                // Vérifier si les données sont dans l'URL (format base64 ou paramètres)
                const urlParams = new URLSearchParams(window.location.search);
                const encodedData = urlParams.get('data');
                
                if (encodedData) {
                    // Décoder les données du QR code
                    const decodedData = JSON.parse(decodeURIComponent(encodedData));
                    setOrderData(decodedData);
                } else {
                    // Sinon, appeler l'API pour récupérer les infos
                    const response = await fetch(`/api/orders/delivery/${deliveryCode}`);
                    if (!response.ok) {
                        throw new Error('Commande non trouvée');
                    }
                    const data = await response.json();
                    setOrderData(data);
                }
            } catch (err) {
                console.error('Erreur récupération commande:', err);
                setError(err.message || 'Impossible de charger les informations de livraison');
            } finally {
                setLoading(false);
            }
        };

        if (deliveryCode) {
            fetchOrderData();
        } else {
            setError('Code de livraison manquant');
            setLoading(false);
        }
    }, [deliveryCode]);

    const handleCopyAddress = () => {
        if (orderData?.recipient) {
            const fullAddress = `${orderData.recipient.name}\n${orderData.recipient.address}\n${orderData.recipient.postalCode} ${orderData.recipient.city}\n${orderData.recipient.phone}`;
            navigator.clipboard.writeText(fullAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCall = () => {
        if (orderData?.recipient?.phone) {
            window.location.href = `tel:${orderData.recipient.phone}`;
        }
    };

    const handleOpenMaps = () => {
        if (orderData?.recipient) {
            const address = encodeURIComponent(
                `${orderData.recipient.address}, ${orderData.recipient.city}, ${orderData.recipient.country || 'Tunisie'}`
            );
            window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Chargement des informations...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircleIcon className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-6 sticky top-0 z-10 shadow-lg">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                <img src={PLATFORM_CONFIG.logo} alt="" className="w-8 h-8 object-contain" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg">{PLATFORM_CONFIG.name}</h1>
                                <p className="text-xs text-white/80">Interface Livreur</p>
                            </div>
                        </div>
                        <div className="bg-white/20 px-3 py-1 rounded-full">
                            <span className="text-xs font-semibold">🚚 Livraison</span>
                        </div>
                    </div>
                    
                    {/* Code Livraison */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/70 uppercase tracking-wider mb-1">Code Livraison</p>
                                <p className="font-mono font-black text-2xl tracking-wider">
                                    {orderData?.deliveryCode || deliveryCode}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-2">
                                <QrCodeIcon className="w-8 h-8 text-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
                
                {/* Montant à encaisser */}
                {orderData?.order && (
                    <div className={`rounded-2xl p-5 shadow-md ${
                        !orderData.order.isPaid 
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                            : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <CurrencyDollarIcon className="w-5 h-5" />
                                    <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                                        {!orderData.order.isPaid ? '💰 À Encaisser' : '✅ Déjà Payé'}
                                    </span>
                                </div>
                                <p className="text-4xl font-black">
                                    {orderData.order.amountToCollect || orderData.order.totalAmount} 
                                    <span className="text-lg font-normal ml-1">TND</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs opacity-80">Articles</p>
                                <p className="text-2xl font-bold">{orderData.order.itemsCount}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Informations Commande */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-5 py-3 border-b">
                        <div className="flex items-center gap-2">
                            <ShoppingBagIcon className="w-5 h-5 text-gray-500" />
                            <span className="font-semibold text-gray-700">Détails Commande</span>
                        </div>
                    </div>
                    <div className="p-5 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">N° Commande</span>
                            <span className="font-mono font-semibold text-gray-900">
                                {orderData?.orderNumber}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Mode Paiement</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                orderData?.order?.paymentMethod === 'cash_on_delivery' 
                                    ? 'bg-orange-100 text-orange-700' 
                                    : 'bg-green-100 text-green-700'
                            }`}>
                                {orderData?.order?.paymentMethod === 'cash_on_delivery' ? 'Contre Remboursement' : 'Prépayé'}
                            </span>
                        </div>
                        {orderData?.generatedAt && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Date Étiquette</span>
                                <span className="text-gray-700">
                                    {new Date(orderData.generatedAt).toLocaleDateString('fr-TN')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Destinataire */}
                {orderData?.recipient && (
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div className="bg-gray-50 px-5 py-3 border-b flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-gray-500" />
                                <span className="font-semibold text-gray-700">Destinataire</span>
                            </div>
                            <button
                                onClick={handleCopyAddress}
                                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                                    copied 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {copied ? '✓ Copié !' : 'Copier adresse'}
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                    {orderData.recipient.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                                        {orderData.recipient.name}
                                    </h3>
                                    <div className="space-y-2 text-gray-600">
                                        <p>{orderData.recipient.address}</p>
                                        <p className="font-semibold text-gray-900">
                                            {orderData.recipient.postalCode} {orderData.recipient.city}
                                        </p>
                                        <p className="text-gray-500">{orderData.recipient.country || 'Tunisie'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            {orderData.recipient.instructions && (
                                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                    <div className="flex items-start gap-2">
                                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-yellow-700 uppercase mb-1">Instructions</p>
                                            <p className="text-sm text-yellow-800">{orderData.recipient.instructions}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleCall}
                                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors shadow-md"
                                >
                                    <PhoneIcon className="w-5 h-5" />
                                    Appeler
                                </button>
                                <button
                                    onClick={handleOpenMaps}
                                    className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-colors shadow-md"
                                >
                                    <MapPinIcon className="w-5 h-5" />
                                    Maps
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions Livreur */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-5 py-3 border-b">
                        <div className="flex items-center gap-2">
                            <ClipboardDocumentCheckIcon className="w-5 h-5 text-gray-500" />
                            <span className="font-semibold text-gray-700">Actions Rapides</span>
                        </div>
                    </div>
                    <div className="p-5 space-y-3">
                        <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-bold transition-all shadow-md">
                            <CheckCircleIcon className="w-6 h-6" />
                            Confirmer Livraison
                        </button>
                        <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 rounded-xl font-bold transition-all shadow-md">
                            <ClockIcon className="w-6 h-6" />
                            Tentative Échouée
                        </button>
                        <button className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-bold transition-all">
                            <XCircleIcon className="w-6 h-6" />
                            Signaler un Problème
                        </button>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="bg-gray-800 text-white rounded-2xl p-5 text-center">
                    <p className="text-sm text-gray-300 mb-2">Besoin d'aide ?</p>
                    <a 
                        href={`tel:${PLATFORM_CONFIG.contact.phone}`}
                        className="inline-flex items-center gap-2 text-orange-400 font-semibold hover:text-orange-300"
                    >
                        <PhoneIcon className="w-5 h-5" />
                        {PLATFORM_CONFIG.contact.phone}
                    </a>
                </div>

            </div>
        </div>
    );
};

export default DeliveryScanPage;
