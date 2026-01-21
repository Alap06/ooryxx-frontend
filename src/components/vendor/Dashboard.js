import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import vendorService from '../../services/vendorService';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const VendorDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    averageRating: 0,
    revenueGrowth: 0,
    ordersGrowth: 0
  });

  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await vendorService.getDashboard();

      // Handle both wrapped and unwrapped response structures
      const data = response?.data || response || {};

      setStats({
        totalRevenue: data.stats?.totalRevenue || 0,
        totalOrders: data.stats?.totalOrders || 0,
        totalProducts: data.stats?.totalProducts || 0,
        averageRating: data.stats?.averageRating || 0,
        revenueGrowth: 12.5, // À calculer depuis le backend
        ordersGrowth: 8.3    // À calculer depuis le backend
      });

      setTopProducts(data.topProducts || []);
      setRecentOrders(data.recentOrders || []);
      setRevenueData(data.revenueByDay || []);

      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement du dashboard');
      setLoading(false);
    }
  };

  // Données pour le graphique de revenus (7 derniers jours)
  const revenueChartData = {
    labels: revenueData.map(d => new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Revenus (TND)',
        data: revenueData.map(d => d.revenue),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Données pour le graphique des ventes
  const salesChartData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Ventes',
        data: [12, 19, 15, 25, 22, 30, 28],
        backgroundColor: 'rgba(99, 102, 241, 0.8)'
      }
    ]
  };

  // Données pour les catégories de produits
  const categoryChartData = {
    labels: ['Électronique', 'Vêtements', 'Maison', 'Sport', 'Beauté'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };

  const StatCard = ({ title, value, icon: Icon, growth, iconBg, iconColor }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {growth !== undefined && (
            <div className="flex items-center mt-2">
              {growth >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(growth)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-full ${iconBg}`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord Vendeur</h1>
        <p className="text-indigo-100">Bienvenue sur votre espace de gestion</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Chiffre d'affaires"
          value={`${stats.totalRevenue.toLocaleString('fr-TN')} TND`}
          icon={CurrencyDollarIcon}
          growth={stats.revenueGrowth}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Nombre de ventes"
          value={stats.totalOrders}
          icon={ShoppingBagIcon}
          growth={stats.ordersGrowth}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Produits en vente"
          value={stats.totalProducts}
          icon={ChartBarIcon}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Note moyenne"
          value={`${stats.averageRating}/5`}
          icon={StarIcon}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des revenus */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <ArrowTrendingUpIcon className="w-6 h-6 mr-2 text-indigo-600" />
            Évolution des revenus
          </h2>
          <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        {/* Graphique des ventes hebdomadaires */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="w-6 h-6 mr-2 text-indigo-600" />
            Ventes hebdomadaires
          </h2>
          <Bar data={salesChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
      </div>

      {/* Produits et catégories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Produits les plus vendus */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Produits les plus vendus</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.sales} ventes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{product.revenue.toLocaleString('fr-TN')} TND</p>
                  <p className="text-sm text-gray-500">Revenus</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition par catégorie */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Catégories</h2>
          <Doughnut data={categoryChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
      </div>

      {/* Commandes récentes */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Commandes récentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.clientCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.amount} TND
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                      }`}>
                      {order.status === 'pending' ? 'En attente' :
                        order.status === 'confirmed' ? 'Confirmée' : 'Expédiée'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;