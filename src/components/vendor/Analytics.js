import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  TableCellsIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [period, setPeriod] = useState('month');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    revenue: { current: 45680, previous: 40200, growth: 13.6 },
    orders: { current: 234, previous: 216, growth: 8.3 },
    customers: { current: 156, previous: 142, growth: 9.9 },
    avgOrderValue: { current: 195.21, previous: 186.11, growth: 4.9 }
  });

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Top products data
  const topProducts = [
    { rank: 1, name: 'iPhone 15 Pro Max', sales: 145, revenue: 12500, rating: 4.8, trend: 'up' },
    { rank: 2, name: 'Samsung Galaxy S24', sales: 132, revenue: 10800, rating: 4.6, trend: 'up' },
    { rank: 3, name: 'Nike Air Max 2024', sales: 98, revenue: 8900, rating: 4.9, trend: 'stable' },
    { rank: 4, name: 'MacBook Pro 14"', sales: 87, revenue: 7200, rating: 4.5, trend: 'up' },
    { rank: 5, name: 'AirPods Pro 2', sales: 76, revenue: 6500, rating: 4.7, trend: 'down' },
    { rank: 6, name: 'PlayStation 5', sales: 65, revenue: 5800, rating: 4.4, trend: 'up' },
    { rank: 7, name: 'Nintendo Switch OLED', sales: 54, revenue: 4900, rating: 4.6, trend: 'stable' },
    { rank: 8, name: 'Apple Watch Series 9', sales: 48, revenue: 4200, rating: 4.3, trend: 'down' },
    { rank: 9, name: 'iPad Air 5', sales: 42, revenue: 3800, rating: 4.5, trend: 'up' },
    { rank: 10, name: 'Sony WH-1000XM5', sales: 38, revenue: 3400, rating: 4.2, trend: 'stable' }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [period, selectedYear, selectedMonth]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setTimeout(() => {
      const multiplier = period === 'week' ? 0.25 : period === 'month' ? 1 : period === 'quarter' ? 3 : 12;
      setAnalyticsData({
        revenue: { current: Math.round(45680 * multiplier), previous: Math.round(40200 * multiplier), growth: 13.6 },
        orders: { current: Math.round(234 * multiplier), previous: Math.round(216 * multiplier), growth: 8.3 },
        customers: { current: Math.round(156 * multiplier), previous: Math.round(142 * multiplier), growth: 9.9 },
        avgOrderValue: { current: 195.21, previous: 186.11, growth: 4.9 }
      });
      setLoading(false);
    }, 500);
  };

  const chartKey = useMemo(() => `${period}-${selectedYear}-${selectedMonth}-${Date.now()}`, [period, selectedYear, selectedMonth]);

  const revenueChartData = useMemo(() => ({
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    datasets: [{
      label: 'Revenus quotidiens (TND)',
      data: [1200, 1450, 1800, 1650, 1900, 2100, 2300, 1950, 2200, 2400,
        2100, 1800, 2000, 2250, 2500, 2700, 2400, 2200, 2600, 2800,
        2500, 2300, 2700, 2900, 3100, 2800, 2600, 3000, 3200, 3400],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4
    }]
  }), []);

  const categoryChartData = useMemo(() => ({
    labels: ['Électronique', 'Vêtements', 'Maison', 'Sport', 'Beauté', 'Livres'],
    datasets: [{
      label: 'Ventes par catégorie',
      data: [30, 25, 20, 15, 10, 8],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ]
    }]
  }), []);

  const peakHoursData = useMemo(() => ({
    labels: ['00h', '03h', '06h', '09h', '12h', '15h', '18h', '21h'],
    datasets: [{
      label: 'Commandes par heure',
      data: [5, 3, 8, 25, 45, 38, 55, 42],
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 2
    }]
  }), []);

  const performanceRadarData = useMemo(() => ({
    labels: ['Qualité', 'Rapidité', 'Communication', 'Prix', 'Service'],
    datasets: [{
      label: 'Performance globale',
      data: [4.5, 4.2, 4.8, 4.1, 4.6],
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(99, 102, 241)',
      pointBorderColor: '#fff'
    }]
  }), []);

  const monthlyRevenueData = useMemo(() => ({
    labels: months,
    datasets: [{
      label: 'Revenus mensuels (TND)',
      data: [32000, 35000, 42000, 38000, 45000, 52000, 48000, 55000, 51000, 58000, 62000, 68000],
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 2
    }]
  }), []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false } }
  };

  // Get report period string
  const getReportPeriod = () => {
    if (showCustomRange) {
      return `${customDateRange.startDate} au ${customDateRange.endDate}`;
    }
    return `${months[selectedMonth - 1]} ${selectedYear}`;
  };

  // Generate PDF Report
  const generatePDFReport = () => {
    toast.info('Génération du rapport PDF en cours...');

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Rapport Analytique - OORYXX', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Période: ${getReportPeriod()}`, pageWidth / 2, 32, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Summary section
    doc.setFontSize(16);
    doc.text('Résumé des performances', 14, 55);

    doc.setFontSize(11);
    doc.text(`Chiffre d'affaires: ${analyticsData.revenue.current.toLocaleString()} TND (+${analyticsData.revenue.growth}%)`, 14, 65);
    doc.text(`Nombre de ventes: ${analyticsData.orders.current} (+${analyticsData.orders.growth}%)`, 14, 73);
    doc.text(`Nouveaux clients: ${analyticsData.customers.current} (+${analyticsData.customers.growth}%)`, 14, 81);
    doc.text(`Panier moyen: ${analyticsData.avgOrderValue.current.toFixed(2)} TND (+${analyticsData.avgOrderValue.growth}%)`, 14, 89);

    // Top products table
    doc.setFontSize(16);
    doc.text('Top 10 Produits', 14, 105);

    autoTable(doc, {
      startY: 110,
      head: [['Rang', 'Produit', 'Ventes', 'Revenus (TND)', 'Note']],
      body: topProducts.map(p => [
        p.rank,
        p.name,
        `${p.sales} unités`,
        p.revenue.toLocaleString(),
        `${p.rating}/5`
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [99, 102, 241] }
    });

    // Category distribution
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.text('Répartition par catégorie', 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Catégorie', 'Pourcentage']],
      body: [
        ['Électronique', '30%'],
        ['Vêtements', '25%'],
        ['Maison', '20%'],
        ['Sport', '15%'],
        ['Beauté', '10%'],
        ['Livres', '8%']
      ],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [99, 102, 241] }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Généré le ${new Date().toLocaleDateString('fr-FR')} - Page ${i} sur ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Save
    const fileName = `rapport_analytique_${getReportPeriod().replace(/\s/g, '_')}.pdf`;
    doc.save(fileName);
    toast.success(`Rapport PDF téléchargé: ${fileName}`);
  };

  // Generate Excel Report
  const generateExcelReport = () => {
    toast.info('Génération du rapport Excel en cours...');

    // Summary sheet data
    const summaryData = [
      ['Rapport Analytique OORYXX'],
      [`Période: ${getReportPeriod()}`],
      [],
      ['Métrique', 'Valeur actuelle', 'Valeur précédente', 'Croissance'],
      ["Chiffre d'affaires (TND)", analyticsData.revenue.current, analyticsData.revenue.previous, `${analyticsData.revenue.growth}%`],
      ['Nombre de ventes', analyticsData.orders.current, analyticsData.orders.previous, `${analyticsData.orders.growth}%`],
      ['Nouveaux clients', analyticsData.customers.current, analyticsData.customers.previous, `${analyticsData.customers.growth}%`],
      ['Panier moyen (TND)', analyticsData.avgOrderValue.current, analyticsData.avgOrderValue.previous, `${analyticsData.avgOrderValue.growth}%`]
    ];

    // Products sheet data
    const productsData = [
      ['Top 10 Produits'],
      ['Rang', 'Produit', 'Ventes', 'Revenus (TND)', 'Note', 'Tendance'],
      ...topProducts.map(p => [p.rank, p.name, p.sales, p.revenue, p.rating, p.trend === 'up' ? '↑' : p.trend === 'down' ? '↓' : '→'])
    ];

    // Categories sheet data
    const categoriesData = [
      ['Répartition par catégorie'],
      ['Catégorie', 'Pourcentage'],
      ['Électronique', '30%'],
      ['Vêtements', '25%'],
      ['Maison', '20%'],
      ['Sport', '15%'],
      ['Beauté', '10%'],
      ['Livres', '8%']
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Résumé');

    const wsProducts = XLSX.utils.aoa_to_sheet(productsData);
    XLSX.utils.book_append_sheet(wb, wsProducts, 'Produits');

    const wsCategories = XLSX.utils.aoa_to_sheet(categoriesData);
    XLSX.utils.book_append_sheet(wb, wsCategories, 'Catégories');

    // Generate buffer and save
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = `rapport_analytique_${getReportPeriod().replace(/\s/g, '_')}.xlsx`;
    saveAs(blob, fileName);

    toast.success(`Rapport Excel téléchargé: ${fileName}`);
  };

  // Generate CSV Report
  const generateCSVReport = () => {
    toast.info('Génération du rapport CSV en cours...');

    let csvContent = `Rapport Analytique OORYXX\n`;
    csvContent += `Période: ${getReportPeriod()}\n\n`;

    // Summary
    csvContent += `Résumé des performances\n`;
    csvContent += `Métrique,Valeur actuelle,Valeur précédente,Croissance\n`;
    csvContent += `Chiffre d'affaires (TND),${analyticsData.revenue.current},${analyticsData.revenue.previous},${analyticsData.revenue.growth}%\n`;
    csvContent += `Nombre de ventes,${analyticsData.orders.current},${analyticsData.orders.previous},${analyticsData.orders.growth}%\n`;
    csvContent += `Nouveaux clients,${analyticsData.customers.current},${analyticsData.customers.previous},${analyticsData.customers.growth}%\n`;
    csvContent += `Panier moyen (TND),${analyticsData.avgOrderValue.current},${analyticsData.avgOrderValue.previous},${analyticsData.avgOrderValue.growth}%\n\n`;

    // Products
    csvContent += `Top 10 Produits\n`;
    csvContent += `Rang,Produit,Ventes,Revenus (TND),Note,Tendance\n`;
    topProducts.forEach(p => {
      csvContent += `${p.rank},"${p.name}",${p.sales},${p.revenue},${p.rating},${p.trend}\n`;
    });

    csvContent += `\nRépartition par catégorie\n`;
    csvContent += `Catégorie,Pourcentage\n`;
    csvContent += `Électronique,30%\n`;
    csvContent += `Vêtements,25%\n`;
    csvContent += `Maison,20%\n`;
    csvContent += `Sport,15%\n`;
    csvContent += `Beauté,10%\n`;
    csvContent += `Livres,8%\n`;

    // Save
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const fileName = `rapport_analytique_${getReportPeriod().replace(/\s/g, '_')}.csv`;
    saveAs(blob, fileName);

    toast.success(`Rapport CSV téléchargé: ${fileName}`);
  };

  const handlePeriodChange = (newPeriod) => {
    if (newPeriod === 'custom') {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      setPeriod(newPeriod);
    }
  };

  const StatCard = ({ title, current, previous, growth, icon: Icon, prefix = '', suffix = '' }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold text-gray-900">
          {prefix}{current.toLocaleString('fr-TN')}{suffix}
        </p>
        <div className="flex items-center text-sm">
          {growth >= 0 ? (
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={growth >= 0 ? 'text-green-600' : 'text-red-600'}>
            {Math.abs(growth).toFixed(1)}%
          </span>
          <span className="text-gray-500 ml-2">vs période précédente</span>
        </div>
        <p className="text-xs text-gray-500">
          Période précédente: {prefix}{previous.toLocaleString('fr-TN')}{suffix}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Statistiques & Rapports</h1>
            <p className="text-indigo-100">Analysez les performances de votre boutique</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="px-4 py-2 bg-white text-gray-900 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
              <option value="custom">Période personnalisée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtres avancés */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filtres & Génération de rapports</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mois</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {months.map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Du</label>
            <input
              type="date"
              value={customDateRange.startDate}
              onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Au</label>
            <input
              type="date"
              value={customDateRange.endDate}
              onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Boutons de génération */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={generatePDFReport}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Télécharger PDF
          </button>
          <button
            onClick={generateExcelReport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <TableCellsIcon className="w-5 h-5 mr-2" />
            Télécharger Excel
          </button>
          <button
            onClick={generateCSVReport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Télécharger CSV
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Chiffre d'affaires"
            current={analyticsData.revenue.current}
            previous={analyticsData.revenue.previous}
            growth={analyticsData.revenue.growth}
            icon={CurrencyDollarIcon}
            suffix=" TND"
          />
          <StatCard
            title="Nombre de ventes"
            current={analyticsData.orders.current}
            previous={analyticsData.orders.previous}
            growth={analyticsData.orders.growth}
            icon={ShoppingBagIcon}
          />
          <StatCard
            title="Nouveaux clients"
            current={analyticsData.customers.current}
            previous={analyticsData.customers.previous}
            growth={analyticsData.customers.growth}
            icon={UsersIcon}
          />
          <StatCard
            title="Panier moyen"
            current={analyticsData.avgOrderValue.current}
            previous={analyticsData.avgOrderValue.previous}
            growth={analyticsData.avgOrderValue.growth}
            icon={ChartBarIcon}
            suffix=" TND"
          />
        </div>
      )}

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Évolution des revenus</h2>
            <CalendarIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div key={`line-${chartKey}`}>
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ventes par catégorie</h2>
          <div key={`doughnut-${chartKey}`}>
            <Doughnut
              data={categoryChartData}
              options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Heures de pointe</h2>
          <div key={`bar-${chartKey}`}>
            <Bar data={peakHoursData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Évaluations</h2>
          <div key={`radar-${chartKey}`}>
            <Radar
              data={performanceRadarData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                scales: { r: { beginAtZero: true, max: 5, ticks: { stepSize: 1 } } }
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">4.4/5</p>
              <p className="text-xs text-green-900">Note globale</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">98%</p>
              <p className="text-xs text-blue-900">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenus mensuels */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Revenus mensuels {selectedYear}</h2>
        <div key={`monthly-${chartKey}`}>
          <Bar
            data={monthlyRevenueData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, ticks: { callback: (value) => `${value.toLocaleString()} TND` } } }
            }}
          />
        </div>
      </div>

      {/* Top produits */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top 10 Produits</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rang</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ventes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tendance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product) => (
                <tr key={product.rank} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full font-bold">
                      {product.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales} unités</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{product.revenue.toLocaleString()} TND</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.trend === 'up' && <span className="flex items-center text-green-600"><ArrowTrendingUpIcon className="w-5 h-5 mr-1" />+12%</span>}
                    {product.trend === 'down' && <span className="flex items-center text-red-600"><ArrowTrendingDownIcon className="w-5 h-5 mr-1" />-8%</span>}
                    {product.trend === 'stable' && <span className="text-gray-500 text-sm">Stable</span>}
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

export default Analytics;
