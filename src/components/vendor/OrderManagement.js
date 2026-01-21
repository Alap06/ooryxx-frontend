import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  PrinterIcon,
  EyeIcon,
  BellIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ShippingLabel from './ShippingLabel';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labelOrder, setLabelOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Simuler les données avec tous les champs nécessaires pour l'étiquette
      setOrders([
        {
          _id: 'ord001',
          id: 'CMD-001',
          orderNumber: 'CMD-001',
          clientCode: 'CLT-7834',
          deliveryCode: 'LIV-2834',
          items: [
            { name: 'Produit A', title: 'Produit A', quantity: 2, price: 99.99 },
            { name: 'Produit B', title: 'Produit B', quantity: 1, price: 149.99 }
          ],
          totalAmount: 349.97,
          status: 'pending',
          paymentMethod: 'cash_on_delivery',
          date: '2025-11-18T10:30:00',
          shippingAddress: {
            recipientName: 'Ahmed Ben Salah',
            phone: '+216 XX XXX XXX',
            street: '123 Avenue Habib Bourguiba',
            city: 'Tunis',
            postalCode: '1000',
            country: 'Tunisie',
            instructions: 'Appeler avant livraison'
          }
        },
        {
          _id: 'ord002',
          id: 'CMD-002',
          orderNumber: 'CMD-002',
          clientCode: 'CLT-9012',
          deliveryCode: 'LIV-9452',
          items: [
            { name: 'Produit C', title: 'Produit C', quantity: 3, price: 79.99 }
          ],
          totalAmount: 239.97,
          status: 'confirmed',
          paymentMethod: 'card',
          date: '2025-11-18T09:15:00',
          shippingAddress: {
            recipientName: 'Fatma Trabelsi',
            phone: '+216 XX XXX XXX',
            street: '45 Rue de la Liberté',
            city: 'Sousse',
            postalCode: '4000',
            country: 'Tunisie',
            instructions: ''
          }
        },
        {
          _id: 'ord003',
          id: 'CMD-003',
          orderNumber: 'CMD-003',
          clientCode: 'CLT-5621',
          deliveryCode: 'LIV-7123',
          items: [
            { name: 'Produit D', title: 'Produit D', quantity: 1, price: 299.99 }
          ],
          totalAmount: 299.99,
          status: 'shipped',
          paymentMethod: 'cash_on_delivery',
          date: '2025-11-17T14:20:00',
          shippingAddress: {
            recipientName: 'Mohamed Karray',
            phone: '+216 XX XXX XXX',
            street: '78 Boulevard du 7 Novembre',
            city: 'Sfax',
            postalCode: '3000',
            country: 'Tunisie',
            instructions: 'Laisser chez le voisin si absent'
          }
        },
        {
          _id: 'ord004',
          id: 'CMD-004',
          orderNumber: 'CMD-004',
          clientCode: 'CLT-3421',
          deliveryCode: 'LIV-5634',
          items: [
            { name: 'Produit E', title: 'Produit E', quantity: 2, price: 59.99 }
          ],
          totalAmount: 119.98,
          status: 'delivered',
          paymentMethod: 'card',
          date: '2025-11-16T11:00:00',
          shippingAddress: {
            recipientName: 'Sonia Mejri',
            phone: '+216 XX XXX XXX',
            street: '12 Rue Ibn Khaldoun',
            city: 'Monastir',
            postalCode: '5000',
            country: 'Tunisie',
            instructions: ''
          }
        },
        {
          _id: 'ord005',
          id: 'CMD-005',
          orderNumber: 'CMD-005',
          clientCode: 'CLT-8765',
          deliveryCode: 'LIV-3421',
          items: [
            { name: 'Produit F', title: 'Produit F', quantity: 1, price: 189.99 }
          ],
          totalAmount: 189.99,
          status: 'cancelled',
          paymentMethod: 'cash_on_delivery',
          date: '2025-11-15T16:45:00',
          shippingAddress: {
            recipientName: 'Karim Boussaid',
            phone: '+216 XX XXX XXX',
            street: '56 Avenue de Carthage',
            city: 'Bizerte',
            postalCode: '7000',
            country: 'Tunisie',
            instructions: ''
          }
        }
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      // Appel API pour confirmer
      toast.success('Commande confirmée avec succès!');
      fetchOrders();
    } catch (error) {
      toast.error('Erreur lors de la confirmation');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      try {
        // Appel API pour annuler
        toast.success('Commande annulée');
        fetchOrders();
      } catch (error) {
        toast.error('Erreur lors de l\'annulation');
      }
    }
  };

  const handleShipOrder = async (orderId) => {
    try {
      // Appel API pour marquer comme expédiée
      toast.success('Commande marquée comme expédiée!');
      fetchOrders();
    } catch (error) {
      toast.error('Erreur lors de l\'expédition');
    }
  };

  const handlePrintLabel = (order) => {
    // Ouvrir le modal avec la nouvelle étiquette
    setLabelOrder(order);
    setShowLabelModal(true);
    toast.success('Étiquette générée!');
  };

  const closeLabelModal = () => {
    setShowLabelModal(false);
    setLabelOrder(null);
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, label: 'En attente' },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon, label: 'Confirmée' },
      shipped: { color: 'bg-purple-100 text-purple-800', icon: TruckIcon, label: 'Expédiée' },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, label: 'Livrée' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircleIcon, label: 'Annulée' },
      returned: { color: 'bg-orange-100 text-orange-800', icon: ArrowPathIcon, label: 'Retournée' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.label}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.deliveryCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Gestion des Commandes</h1>
        <p className="text-purple-100">Traitez et suivez vos commandes</p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.pending}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmées</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.confirmed}</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expédiées</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.shipped}</p>
            </div>
            <TruckIcon className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Livrées</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.delivered}</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par N° commande, code client ou code livraison..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmées</option>
              <option value="shipped">Expédiées</option>
              <option value="delivered">Livrées</option>
              <option value="cancelled">Annulées</option>
              <option value="returned">Retournées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code Livraison
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs font-mono bg-gray-100 text-gray-800 rounded">
                        {order.clientCode}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-mono bg-indigo-100 text-indigo-800 rounded">
                      {order.deliveryCode}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    {order.totalAmount.toFixed(2)} TND
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString('fr-FR')}
                    <br />
                    <span className="text-xs text-gray-400">
                      {new Date(order.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="text-indigo-600 hover:text-indigo-900 p-2"
                        title="Voir les détails"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirmOrder(order.id)}
                            className="text-green-600 hover:text-green-900 p-2"
                            title="Confirmer"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-600 hover:text-red-900 p-2"
                            title="Annuler"
                          >
                            <XCircleIcon className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleShipOrder(order.id)}
                          className="text-purple-600 hover:text-purple-900 p-2"
                          title="Marquer comme expédiée"
                        >
                          <TruckIcon className="w-5 h-5" />
                        </button>
                      )}
                      
                      {(order.status === 'confirmed' || order.status === 'shipped') && (
                        <button
                          onClick={() => handlePrintLabel(order)}
                          className="text-gray-600 hover:text-gray-900 p-2"
                          title="Imprimer l'étiquette"
                        >
                          <PrinterIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal détails de la commande */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-bold">Détails de la commande</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Informations de la commande */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">N° Commande</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Statut</p>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Code Client (Confidentiel)</p>
                  <p className="font-mono font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded inline-block">
                    {selectedOrder.clientCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Code Livraison</p>
                  <p className="font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block">
                    {selectedOrder.deliveryCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedOrder.date).toLocaleDateString('fr-FR')} à{' '}
                    {new Date(selectedOrder.date).toLocaleTimeString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Montant total</p>
                  <p className="text-xl font-bold text-indigo-600">
                    {selectedOrder.totalAmount.toFixed(2)} TND
                  </p>
                </div>
              </div>

              {/* Note de confidentialité */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <BellIcon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Note de confidentialité:</strong> Les coordonnées complètes du client ne sont pas 
                      communiquées. Utilisez uniquement le <strong>Code Livraison</strong> pour l'identification 
                      auprès des livreurs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Articles de la commande */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Articles commandés</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix unitaire</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{item.price.toFixed(2)} TND</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                            {(item.quantity * item.price).toFixed(2)} TND
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handlePrintLabel(selectedOrder)}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  <PrinterIcon className="w-5 h-5 mr-2" />
                  Imprimer l'étiquette
                </button>
                {selectedOrder.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleConfirmOrder(selectedOrder.id);
                        setShowDetailsModal(false);
                      }}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Confirmer
                    </button>
                    <button
                      onClick={() => {
                        handleCancelOrder(selectedOrder.id);
                        setShowDetailsModal(false);
                      }}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <XCircleIcon className="w-5 h-5 mr-2" />
                      Annuler
                    </button>
                  </>
                )}
                {selectedOrder.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      handleShipOrder(selectedOrder.id);
                      setShowDetailsModal(false);
                    }}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    <TruckIcon className="w-5 h-5 mr-2" />
                    Marquer comme expédiée
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Étiquette de livraison */}
      {showLabelModal && labelOrder && (
        <ShippingLabel 
          order={labelOrder} 
          onClose={closeLabelModal} 
        />
      )}
    </div>
  );
};

export default OrderManagement;
