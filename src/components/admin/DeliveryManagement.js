import React, { useState, useEffect, useCallback } from 'react';
import {
    TruckIcon,
    UserGroupIcon,
    MapPinIcon,
    MagnifyingGlassIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    EyeIcon,
    UserPlusIcon,
    PrinterIcon,
    PhoneIcon,
    CurrencyDollarIcon,
    BoltIcon,
    HandRaisedIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ShippingLabel from '../vendor/ShippingLabel';
import deliveryZoneService from '../../services/deliveryZoneService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const DeliveryManagement = () => {
    // États principaux
    const [orders, setOrders] = useState([]);
    const [livreurs, setLivreurs] = useState([]);
    const [deliveryZones, setDeliveryZones] = useState([]);
    const [countries, setCountries] = useState([]);
    const [stats, setStats] = useState({
        pendingAssignment: 0,
        inDelivery: 0,
        deliveredToday: 0,
        availableLivreurs: 0
    });
    const [loading, setLoading] = useState(true);

    // Filtres
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ready_for_delivery');
    const [zoneFilter, setZoneFilter] = useState('');
    const [countryFilter, setCountryFilter] = useState('');

    // Modaux
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedOrderForAssign, setSelectedOrderForAssign] = useState(null);
    const [showLabelModal, setShowLabelModal] = useState(false);
    const [labelOrder, setLabelOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    // Mode d'assignation
    const [assignmentMode, setAssignmentMode] = useState('manual'); // 'manual' ou 'auto'

    // Charger les zones de livraison depuis l'API
    const fetchDeliveryZones = useCallback(async () => {
        try {
            const [zonesRes, countriesRes] = await Promise.all([
                deliveryZoneService.getZones(countryFilter || null),
                deliveryZoneService.getCountries()
            ]);
            
            setDeliveryZones(zonesRes.data?.zones || []);
            setCountries(countriesRes.data?.countries || []);
        } catch (error) {
            console.error('Erreur chargement zones:', error);
            // Fallback aux données locales si API échoue
            setDeliveryZones([]);
            setCountries([{ code: 'TN', name: 'Tunisie' }]);
        }
    }, [countryFilter]);

    // Charger les commandes et livreurs depuis l'API
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Charger les zones d'abord
            await fetchDeliveryZones();

            // Charger les commandes depuis l'API
            const params = new URLSearchParams();
            if (statusFilter && statusFilter !== 'all') {
                params.append('status', statusFilter);
            }
            if (searchTerm) params.append('search', searchTerm);

            const ordersResponse = await fetch(`${API_URL}/admin/orders/delivery?${params}`, {
                headers: getAuthHeaders()
            });

            if (ordersResponse.ok) {
                const ordersData = await ordersResponse.json();
                setOrders(ordersData.data?.orders || []);
                setLivreurs(ordersData.data?.livreurs || []);
            } else {
                // Fallback aux données de démo si API non disponible
                loadDemoData();
            }

            // Charger les statistiques
            const statsResponse = await fetch(`${API_URL}/admin/delivery/stats`, {
                headers: getAuthHeaders()
            });

            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setStats({
                    pendingAssignment: statsData.data?.pendingAssignment || 0,
                    inDelivery: statsData.data?.inDelivery || 0,
                    deliveredToday: statsData.data?.deliveredToday || 0,
                    availableLivreurs: statsData.data?.availableLivreurs || 0
                });
            }
        } catch (error) {
            console.error('Erreur chargement données:', error);
            // Charger les données de démo en cas d'erreur
            loadDemoData();
            toast.warning('Mode démo: utilisation des données locales');
        } finally {
            setLoading(false);
        }
    }, [fetchDeliveryZones, statusFilter, searchTerm]);

    // Données de démonstration (fallback)
    const loadDemoData = () => {
        const mockOrders = [
            {
                _id: 'ord001',
                orderNumber: 'CMD-001',
                deliveryCode: 'LIV-2834',
                clientCode: 'CLT-7834',
                status: 'shipped',
                paymentMethod: 'cash_on_delivery',
                totalAmount: 349.97,
                createdAt: new Date().toISOString(),
                shippingAddress: {
                    recipientName: 'Ahmed Ben Salah',
                    phone: '+216 22 333 444',
                    street: '123 Avenue Habib Bourguiba',
                    city: 'Tunis',
                    postalCode: '1000',
                    country: 'Tunisie',
                    instructions: 'Appeler avant livraison'
                },
                items: [
                    { title: 'Smartphone Samsung Galaxy', quantity: 1, price: 299.99 },
                    { title: 'Coque Protection', quantity: 2, price: 24.99 }
                ],
                livreurId: null,
                zone: 'TN-TUNIS'
            },
            {
                _id: 'ord002',
                orderNumber: 'CMD-002',
                deliveryCode: 'LIV-9452',
                clientCode: 'CLT-9012',
                status: 'shipped',
                paymentMethod: 'card',
                totalAmount: 239.97,
                createdAt: new Date().toISOString(),
                shippingAddress: {
                    recipientName: 'Fatma Trabelsi',
                    phone: '+216 55 666 777',
                    street: '45 Rue de la Liberté',
                    city: 'Sousse',
                    postalCode: '4000',
                    country: 'Tunisie',
                    instructions: ''
                },
                items: [
                    { title: 'Montre Connectée', quantity: 1, price: 199.99 },
                    { title: 'Bracelet Cuir', quantity: 2, price: 19.99 }
                ],
                livreurId: null,
                zone: 'TN-SAHEL'
            },
            {
                _id: 'ord003',
                orderNumber: 'CMD-003',
                deliveryCode: 'LIV-7123',
                clientCode: 'CLT-5621',
                status: 'assigned_to_delivery',
                paymentMethod: 'cash_on_delivery',
                totalAmount: 299.99,
                createdAt: new Date().toISOString(),
                shippingAddress: {
                    recipientName: 'Mohamed Karray',
                    phone: '+216 98 111 222',
                    street: '78 Boulevard du 7 Novembre',
                    city: 'Sfax',
                    postalCode: '3000',
                    country: 'Tunisie',
                    instructions: 'Laisser chez le voisin si absent'
                },
                items: [
                    { title: 'Tablette iPad', quantity: 1, price: 299.99 }
                ],
                livreurId: 'liv001',
                livreurName: 'Karim Bouaziz',
                zone: 'TN-SFAX'
            }
        ];

        const mockLivreurs = [
            {
                _id: 'liv001',
                name: 'Karim Bouaziz',
                phone: '+216 22 111 222',
                vehicleType: 'moto',
                zones: ['TN-TUNIS', 'TN-NORD'],
                isAvailable: true,
                currentOrders: 2,
                maxOrders: 5,
                rating: 4.8,
                deliveriesToday: 5
            },
            {
                _id: 'liv002',
                name: 'Ali Hammami',
                phone: '+216 55 333 444',
                vehicleType: 'voiture',
                zones: ['TN-SAHEL', 'TN-SFAX'],
                isAvailable: true,
                currentOrders: 1,
                maxOrders: 8,
                rating: 4.5,
                deliveriesToday: 3
            },
            {
                _id: 'liv003',
                name: 'Nour Mansouri',
                phone: '+216 98 555 666',
                vehicleType: 'moto',
                zones: ['TN-TUNIS'],
                isAvailable: true,
                currentOrders: 0,
                maxOrders: 5,
                rating: 4.9,
                deliveriesToday: 7
            }
        ];

        setOrders(mockOrders);
        setLivreurs(mockLivreurs);
        setStats({
            pendingAssignment: mockOrders.filter(o => !o.livreurId && o.status === 'shipped').length,
            inDelivery: mockOrders.filter(o => ['assigned_to_delivery', 'out_for_delivery', 'picked_up'].includes(o.status)).length,
            deliveredToday: 12,
            availableLivreurs: mockLivreurs.filter(l => l.isAvailable && l.currentOrders < l.maxOrders).length
        });
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Déterminer la zone d'une ville (utilise les zones chargées depuis API)
    const getZoneFromCity = useCallback((city) => {
        if (!city) return null;
        
        for (const zone of deliveryZones) {
            if (zone.cities?.some(c => 
                city.toLowerCase().includes(c.name?.toLowerCase()) ||
                c.name?.toLowerCase().includes(city.toLowerCase())
            )) {
                return zone.code;
            }
        }
        return null;
    }, [deliveryZones]);

    // Filtrer les commandes
    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.deliveryCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingAddress?.recipientName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = !statusFilter || statusFilter === 'all' || 
            (statusFilter === 'ready_for_delivery' && order.status === 'shipped' && !order.livreurId) ||
            order.status === statusFilter;
        
        const orderZone = order.zone || getZoneFromCity(order.shippingAddress?.city);
        const matchesZone = !zoneFilter || orderZone === zoneFilter;

        // Filtrer par pays si sélectionné
        const matchesCountry = !countryFilter || 
            deliveryZones.find(z => z.code === orderZone)?.country === countryFilter;
        
        return matchesSearch && matchesStatus && matchesZone && matchesCountry;
    });

    // Livreurs disponibles pour une zone
    const getAvailableLivreursForZone = (zoneCode) => {
        return livreurs.filter(l => 
            l.isAvailable && 
            l.currentOrders < l.maxOrders &&
            l.zones?.includes(zoneCode)
        );
    };

    // Assigner un livreur à une commande (appel API)
    const handleAssignLivreur = async (orderId, livreurId) => {
        try {
            const response = await fetch(`${API_URL}/admin/orders/${orderId}/assign-livreur`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ livreurId })
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(data.message || 'Livreur assigné avec succès !');
                // Rafraîchir les données
                fetchData();
            } else {
                // Mise à jour locale pour la démo
                setOrders(prev => prev.map(o => {
                    if (o._id === orderId) {
                        const livreur = livreurs.find(l => l._id === livreurId);
                        return {
                            ...o,
                            livreurId,
                            livreurName: livreur?.name,
                            status: 'assigned_to_delivery'
                        };
                    }
                    return o;
                }));

                setLivreurs(prev => prev.map(l => {
                    if (l._id === livreurId) {
                        return { ...l, currentOrders: l.currentOrders + 1 };
                    }
                    return l;
                }));

                toast.success('Livreur assigné avec succès !');
            }
            
            setShowAssignModal(false);
            setSelectedOrderForAssign(null);
        } catch (error) {
            toast.error('Erreur lors de l\'assignation');
        }
    };

    // Assignation automatique
    const handleAutoAssign = async (order) => {
        const zone = order.zone || getZoneFromCity(order.shippingAddress?.city);
        const availableLivreurs = getAvailableLivreursForZone(zone);

        if (availableLivreurs.length === 0) {
            toast.warning('Aucun livreur disponible pour cette zone');
            return;
        }

        // Trouver le meilleur livreur (moins de commandes en cours, meilleure note)
        const bestLivreur = availableLivreurs.sort((a, b) => {
            // Priorité: moins de commandes en cours
            if (a.currentOrders !== b.currentOrders) {
                return a.currentOrders - b.currentOrders;
            }
            // Ensuite: meilleure note
            return b.rating - a.rating;
        })[0];

        await handleAssignLivreur(order._id, bestLivreur._id);
    };

    // Assignation automatique pour toutes les commandes en attente
    const handleAutoAssignAll = async () => {
        const pendingOrders = orders.filter(o => o.status === 'shipped' && !o.livreurId);
        
        if (pendingOrders.length === 0) {
            toast.info('Aucune commande en attente d\'assignation');
            return;
        }

        let assigned = 0;
        let failed = 0;

        for (const order of pendingOrders) {
            const zone = order.zone || getZoneFromCity(order.shippingAddress?.city);
            const availableLivreurs = getAvailableLivreursForZone(zone);

            if (availableLivreurs.length > 0) {
                const bestLivreur = availableLivreurs.sort((a, b) => a.currentOrders - b.currentOrders)[0];
                await handleAssignLivreur(order._id, bestLivreur._id);
                assigned++;
            } else {
                failed++;
            }
        }

        if (assigned > 0) {
            toast.success(`${assigned} commande(s) assignée(s) automatiquement`);
        }
        if (failed > 0) {
            toast.warning(`${failed} commande(s) sans livreur disponible`);
        }
    };

    // Ouvrir le modal d'étiquette
    const openLabelModal = (order) => {
        setLabelOrder(order);
        setShowLabelModal(true);
    };

    // Badges de statut
    const getStatusBadge = (status, livreurId) => {
        const configs = {
            'shipped': { 
                color: livreurId ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800', 
                label: livreurId ? 'Assignée' : 'À assigner' 
            },
            'assigned_to_delivery': { color: 'bg-blue-100 text-blue-800', label: 'Assignée' },
            'picked_up': { color: 'bg-purple-100 text-purple-800', label: 'Récupérée' },
            'out_for_delivery': { color: 'bg-yellow-100 text-yellow-800', label: 'En livraison' },
            'delivered': { color: 'bg-green-100 text-green-800', label: 'Livrée' },
            'refused': { color: 'bg-red-100 text-red-800', label: 'Refusée' },
            'returned': { color: 'bg-gray-100 text-gray-800', label: 'Retour' }
        };
        const config = configs[status] || { color: 'bg-gray-100 text-gray-800', label: status };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const getVehicleIcon = (type) => {
        const icons = { moto: '🏍️', voiture: '🚗', camionnette: '🚐', velo: '🚲' };
        return icons[type] || '🚚';
    };

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <TruckIcon className="w-8 h-8" />
                            Gestion des Livraisons
                        </h1>
                        <p className="text-indigo-100 mt-1">Assignez et suivez les livraisons en temps réel</p>
                    </div>
                    
                    {/* Mode d'assignation */}
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                        <button
                            onClick={() => setAssignmentMode('manual')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                assignmentMode === 'manual' 
                                    ? 'bg-white text-indigo-600' 
                                    : 'text-white hover:bg-white/10'
                            }`}
                        >
                            <HandRaisedIcon className="w-4 h-4" />
                            Manuel
                        </button>
                        <button
                            onClick={() => setAssignmentMode('auto')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                assignmentMode === 'auto' 
                                    ? 'bg-white text-indigo-600' 
                                    : 'text-white hover:bg-white/10'
                            }`}
                        >
                            <BoltIcon className="w-4 h-4" />
                            Automatique
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">À assigner</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingAssignment}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <ClockIcon className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">En livraison</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.inDelivery}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <TruckIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Livrées aujourd'hui</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.deliveredToday}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Livreurs dispo.</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.availableLivreurs}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <UserGroupIcon className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions rapides pour mode auto */}
            {assignmentMode === 'auto' && stats.pendingAssignment > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BoltIcon className="w-8 h-8 text-amber-600" />
                        <div>
                            <p className="font-semibold text-amber-800">
                                {stats.pendingAssignment} commande(s) en attente d'assignation
                            </p>
                            <p className="text-sm text-amber-600">
                                Cliquez pour assigner automatiquement aux livreurs disponibles
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleAutoAssignAll}
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md flex items-center gap-2"
                    >
                        <BoltIcon className="w-5 h-5" />
                        Assigner tout
                    </button>
                </div>
            )}

            {/* Filtres */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2 relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher commande, code, ville, client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="ready_for_delivery">À assigner</option>
                        <option value="assigned_to_delivery">Assignées</option>
                        <option value="picked_up">Récupérées</option>
                        <option value="out_for_delivery">En livraison</option>
                        <option value="delivered">Livrées</option>
                    </select>
                    <select
                        value={countryFilter}
                        onChange={(e) => {
                            setCountryFilter(e.target.value);
                            setZoneFilter(''); // Reset zone filter when country changes
                        }}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">🌍 Tous les pays</option>
                        {countries.map(country => (
                            <option key={country.code} value={country.code}>
                                {country.code === 'TN' ? '🇹🇳' : country.code === 'DZ' ? '🇩🇿' : country.code === 'MA' ? '🇲🇦' : country.code === 'LY' ? '🇱🇾' : '🏳️'} {country.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={zoneFilter}
                        onChange={(e) => setZoneFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Toutes les zones</option>
                        {deliveryZones
                            .filter(zone => !countryFilter || zone.country === countryFilter)
                            .map(zone => (
                                <option key={zone.code || zone._id} value={zone.code}>
                                    {zone.name}
                                </option>
                            ))}
                    </select>
                </div>
                
                {/* Bouton refresh */}
                <div className="flex justify-end mt-3">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Actualiser
                    </button>
                </div>
            </div>

            {/* Liste des commandes */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-gray-500">Chargement...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-8 text-center">
                        <TruckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune commande trouvée</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destinataire</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livreur</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => {
                                    const orderZoneCode = order.zone || getZoneFromCity(order.shippingAddress?.city);
                                    const zone = deliveryZones.find(z => z.code === orderZoneCode);
                                    return (
                                        <tr key={order._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                                                    <p className="text-xs text-indigo-600 font-mono">{order.deliveryCode}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.shippingAddress?.recipientName}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <MapPinIcon className="w-3 h-3" />
                                                        {order.shippingAddress?.city}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span 
                                                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                                    style={{ backgroundColor: zone?.color || '#6B7280' }}
                                                >
                                                    {zone?.name || order.shippingAddress?.city || 'Zone inconnue'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{order.totalAmount?.toFixed(2)} TND</p>
                                                    <p className={`text-xs ${order.paymentMethod === 'cash_on_delivery' ? 'text-orange-600 font-semibold' : 'text-green-600'}`}>
                                                        {order.paymentMethod === 'cash_on_delivery' ? '💰 COD' : '✓ Payé'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                {getStatusBadge(order.status, order.livreurId)}
                                            </td>
                                            <td className="px-4 py-4">
                                                {order.livreurId ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm">
                                                            {getVehicleIcon(livreurs.find(l => l._id === order.livreurId)?.vehicleType)}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">{order.livreurName}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Non assigné</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-end gap-2">
                                                    {/* Bouton Assigner */}
                                                    {!order.livreurId && order.status === 'shipped' && (
                                                        assignmentMode === 'auto' ? (
                                                            <button
                                                                onClick={() => handleAutoAssign(order)}
                                                                className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                                                                title="Assigner automatiquement"
                                                            >
                                                                <BoltIcon className="w-5 h-5" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedOrderForAssign(order);
                                                                    setShowAssignModal(true);
                                                                }}
                                                                className="p-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                                                title="Assigner un livreur"
                                                            >
                                                                <UserPlusIcon className="w-5 h-5" />
                                                            </button>
                                                        )
                                                    )}
                                                    
                                                    {/* Bouton Étiquette */}
                                                    <button
                                                        onClick={() => openLabelModal(order)}
                                                        className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                        title="Voir l'étiquette"
                                                    >
                                                        <PrinterIcon className="w-5 h-5" />
                                                    </button>
                                                    
                                                    {/* Bouton Détails */}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrderDetails(order);
                                                            setShowDetailsModal(true);
                                                        }}
                                                        className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                        title="Voir les détails"
                                                    >
                                                        <EyeIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Assignation Livreur */}
            {showAssignModal && selectedOrderForAssign && (
                <AssignLivreurModal
                    order={selectedOrderForAssign}
                    livreurs={livreurs}
                    zones={deliveryZones}
                    getZoneFromCity={getZoneFromCity}
                    onAssign={handleAssignLivreur}
                    onClose={() => {
                        setShowAssignModal(false);
                        setSelectedOrderForAssign(null);
                    }}
                />
            )}

            {/* Modal Étiquette */}
            {showLabelModal && labelOrder && (
                <ShippingLabel
                    order={labelOrder}
                    onClose={() => {
                        setShowLabelModal(false);
                        setLabelOrder(null);
                    }}
                />
            )}

            {/* Modal Détails Commande */}
            {showDetailsModal && selectedOrderDetails && (
                <OrderDetailsAdminModal
                    order={selectedOrderDetails}
                    livreurs={livreurs}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedOrderDetails(null);
                    }}
                />
            )}
        </div>
    );
};

// ========================================
// MODAL ASSIGNATION LIVREUR
// ========================================
const AssignLivreurModal = ({ order, livreurs, zones, getZoneFromCity, onAssign, onClose }) => {
    const orderZone = order.zone || getZoneFromCity(order.shippingAddress?.city);
    const zone = zones.find(z => z.code === orderZone);
    const zoneName = zone?.name || 'Zone inconnue';
    
    // Filtrer les livreurs disponibles pour cette zone
    const availableLivreurs = livreurs.filter(l => 
        l.isAvailable && 
        l.currentOrders < l.maxOrders &&
        l.zones.includes(orderZone)
    );

    const allLivreurs = livreurs.filter(l => l.isAvailable && l.currentOrders < l.maxOrders);

    const [showAllLivreurs, setShowAllLivreurs] = useState(false);

    const displayedLivreurs = showAllLivreurs ? allLivreurs : availableLivreurs;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <h2 className="text-xl font-bold">Assigner un livreur</h2>
                    <p className="text-indigo-100 mt-1">Commande {order.orderNumber}</p>
                </div>

                <div className="p-6">
                    {/* Info commande */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <MapPinIcon className="w-5 h-5 text-indigo-600" />
                            <div>
                                <p className="font-semibold text-gray-900">{order.shippingAddress?.city}</p>
                                <div className="flex items-center gap-2">
                                    <span 
                                        className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                                        style={{ backgroundColor: zone?.color || '#6B7280' }}
                                    >
                                        {zoneName}
                                    </span>
                                    {zone?.country && (
                                        <span className="text-xs text-gray-500">
                                            {zone.country === 'TN' ? '🇹🇳' : zone.country === 'DZ' ? '🇩🇿' : zone.country === 'MA' ? '🇲🇦' : '🇱🇾'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="font-semibold text-gray-900">{order.totalAmount?.toFixed(2)} TND</p>
                                <p className={`text-sm ${order.paymentMethod === 'cash_on_delivery' ? 'text-orange-600' : 'text-green-600'}`}>
                                    {order.paymentMethod === 'cash_on_delivery' ? 'Paiement à la livraison' : 'Déjà payé'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Toggle tous les livreurs */}
                    {availableLivreurs.length < allLivreurs.length && (
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-600">
                                {availableLivreurs.length} livreur(s) dans la zone
                            </span>
                            <button
                                onClick={() => setShowAllLivreurs(!showAllLivreurs)}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                {showAllLivreurs ? 'Voir zone uniquement' : 'Voir tous les livreurs'}
                            </button>
                        </div>
                    )}

                    {/* Liste des livreurs */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {displayedLivreurs.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <UserGroupIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>Aucun livreur disponible</p>
                            </div>
                        ) : (
                            displayedLivreurs.map((livreur) => (
                                <button
                                    key={livreur._id}
                                    onClick={() => onAssign(order._id, livreur._id)}
                                    className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
                                            {livreur.vehicleType === 'moto' ? '🏍️' : livreur.vehicleType === 'voiture' ? '🚗' : '🚐'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{livreur.name}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    ⭐ {livreur.rating}
                                                </span>
                                                <span>•</span>
                                                <span>{livreur.currentOrders}/{livreur.maxOrders} en cours</span>
                                            </div>
                                        </div>
                                    </div>
                                    <CheckCircleIcon className="w-6 h-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="border-t p-4">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

// ========================================
// MODAL DÉTAILS COMMANDE ADMIN
// ========================================
const OrderDetailsAdminModal = ({ order, livreurs, onClose }) => {
    const livreur = livreurs.find(l => l._id === order.livreurId);

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white sticky top-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold">Commande {order.orderNumber}</h2>
                            <p className="text-indigo-100 mt-1 font-mono">{order.deliveryCode}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                            <XCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Destinataire */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <MapPinIcon className="w-5 h-5 text-indigo-600" />
                            Destinataire
                        </h3>
                        <div className="space-y-2">
                            <p className="font-bold text-lg text-gray-900">{order.shippingAddress?.recipientName}</p>
                            <p className="flex items-center gap-2 text-gray-600">
                                <PhoneIcon className="w-4 h-4" />
                                {order.shippingAddress?.phone}
                            </p>
                            <p className="text-gray-600">{order.shippingAddress?.street}</p>
                            <p className="font-semibold text-gray-800">
                                {order.shippingAddress?.postalCode} {order.shippingAddress?.city}
                            </p>
                            {order.shippingAddress?.instructions && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                                    <p className="text-sm text-yellow-800">
                                        📝 {order.shippingAddress.instructions}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Livreur assigné */}
                    {livreur && (
                        <div className="bg-indigo-50 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <TruckIcon className="w-5 h-5 text-indigo-600" />
                                Livreur assigné
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">
                                    {livreur.vehicleType === 'moto' ? '🏍️' : livreur.vehicleType === 'voiture' ? '🚗' : '🚐'}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{livreur.name}</p>
                                    <p className="text-sm text-gray-600">{livreur.phone}</p>
                                    <p className="text-sm text-indigo-600">⭐ {livreur.rating} • {livreur.deliveriesToday} livraisons aujourd'hui</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Articles */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Articles ({order.items?.length})</h3>
                        <div className="space-y-2">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white rounded-lg p-3">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.title}</p>
                                        <p className="text-sm text-gray-500">Qté: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-900">{(item.price * item.quantity).toFixed(2)} TND</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                            <span className="font-semibold text-gray-700">Total</span>
                            <span className="text-xl font-bold text-indigo-600">{order.totalAmount?.toFixed(2)} TND</span>
                        </div>
                    </div>

                    {/* Paiement */}
                    <div className={`rounded-xl p-4 ${order.paymentMethod === 'cash_on_delivery' ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
                        <div className="flex items-center gap-3">
                            <CurrencyDollarIcon className={`w-8 h-8 ${order.paymentMethod === 'cash_on_delivery' ? 'text-orange-600' : 'text-green-600'}`} />
                            <div>
                                <p className={`font-semibold ${order.paymentMethod === 'cash_on_delivery' ? 'text-orange-800' : 'text-green-800'}`}>
                                    {order.paymentMethod === 'cash_on_delivery' ? 'Paiement à la livraison' : 'Déjà payé'}
                                </p>
                                {order.paymentMethod === 'cash_on_delivery' && (
                                    <p className="text-sm text-orange-600">Le livreur doit collecter {order.totalAmount?.toFixed(2)} TND</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t p-4 sticky bottom-0 bg-white">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeliveryManagement;
