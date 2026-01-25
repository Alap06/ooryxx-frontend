import React, { useState, useEffect } from 'react';
import {
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    UserIcon,
    CubeIcon,
    ClockIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [resolution, setResolution] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        setTimeout(() => {
            setReports([
                {
                    id: 1,
                    type: 'product',
                    reason: 'Contrefaçon',
                    description: 'Ce produit semble être une contrefaçon de l\'original. Les images ne correspondent pas à la description.',
                    reportedItem: { name: 'AirPods Pro 2', id: 'PRD-2847' },
                    reporter: 'Ahmed Ben Ali',
                    reportedAt: '2024-05-28T14:30:00',
                    severity: 'high'
                },
                {
                    id: 2,
                    type: 'user',
                    reason: 'Comportement inapproprié',
                    description: 'L\'utilisateur a envoyé des messages offensants à plusieurs vendeurs.',
                    reportedItem: { name: 'Mohamed Sahli', id: 'USR-1234' },
                    reporter: 'Tech Store TN',
                    reportedAt: '2024-05-28T11:15:00',
                    severity: 'medium'
                },
                {
                    id: 3,
                    type: 'product',
                    reason: 'Description trompeuse',
                    description: 'Le produit reçu ne correspond pas à la description et aux images affichées.',
                    reportedItem: { name: 'Chargeur iPhone 20W', id: 'PRD-3521' },
                    reporter: 'Fatma Trabelsi',
                    reportedAt: '2024-05-27T16:45:00',
                    severity: 'medium'
                },
                {
                    id: 4,
                    type: 'user',
                    reason: 'Fraude suspectée',
                    description: 'Cet utilisateur a tenté de frauder avec une fausse preuve de paiement.',
                    reportedItem: { name: 'Karim Bouazizi', id: 'USR-5678' },
                    reporter: 'Fashion House',
                    reportedAt: '2024-05-27T10:20:00',
                    severity: 'high'
                },
                {
                    id: 5,
                    type: 'product',
                    reason: 'Prix incorrect',
                    description: 'Le prix affiché est clairement une erreur (0.1 TND pour un iPhone).',
                    reportedItem: { name: 'iPhone 14', id: 'PRD-9872' },
                    reporter: 'Sara Hammami',
                    reportedAt: '2024-05-26T09:00:00',
                    severity: 'low'
                }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const filteredReports = reports.filter(report => {
        if (filterType === 'all') return true;
        return report.type === filterType;
    });

    const getSeverityBadge = (severity) => {
        const styles = {
            high: 'bg-error-100 text-error-700 border-error-200',
            medium: 'bg-warning-100 text-warning-700 border-warning-200',
            low: 'bg-info-100 text-info-700 border-info-200'
        };
        const labels = { high: 'Urgent', medium: 'Moyen', low: 'Faible' };
        return (
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${styles[severity]}`}>
                {labels[severity]}
            </span>
        );
    };

    const getTypeIcon = (type) => {
        return type === 'product' ? CubeIcon : UserIcon;
    };

    const handleResolve = (reportId) => {
        setReports(reports.filter(r => r.id !== reportId));
        setSelectedReport(null);
        setResolution('');
    };

    const handleDismiss = (reportId) => {
        setReports(reports.filter(r => r.id !== reportId));
        setSelectedReport(null);
        setResolution('');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Gestion des Signalements</h1>
                    <p className="text-neutral-500">{reports.length} signalements en attente</p>
                </div>
                <div className="flex gap-2 bg-neutral-100 p-1 rounded-xl">
                    {['all', 'product', 'user'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === type ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                        >
                            {type === 'all' ? 'Tous' : type === 'product' ? 'Produits' : 'Utilisateurs'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {filteredReports.length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-neutral-100">
                    <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircleIcon className="w-8 h-8 text-success-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-800">Aucun signalement</h3>
                    <p className="text-neutral-500 mt-2">Tous les signalements ont été traités.</p>
                </div>
            )}

            {/* Reports List */}
            <div className="space-y-4">
                {filteredReports.map(report => {
                    const TypeIcon = getTypeIcon(report.type);
                    return (
                        <div key={report.id} className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-6 hover:shadow-xl transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${report.type === 'product' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                                        <TypeIcon className={`w-6 h-6 ${report.type === 'product' ? 'text-purple-600' : 'text-blue-600'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-neutral-800">{report.reason}</h3>
                                            {getSeverityBadge(report.severity)}
                                        </div>
                                        <p className="text-sm text-neutral-500 mb-2">
                                            {report.type === 'product' ? 'Produit' : 'Utilisateur'}: <span className="text-neutral-700 font-medium">{report.reportedItem.name}</span> ({report.reportedItem.id})
                                        </p>
                                        <p className="text-neutral-600 text-sm line-clamp-2">{report.description}</p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-neutral-400">
                                            <span>Signalé par {report.reporter}</span>
                                            <span className="flex items-center gap-1">
                                                <ClockIcon className="w-3 h-3" />
                                                {new Date(report.reportedAt).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedReport(report)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                        Examiner
                                    </button>
                                    <button
                                        onClick={() => handleDismiss(report.id)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                                    >
                                        <XCircleIcon className="w-4 h-4" />
                                        Ignorer
                                    </button>
                                    <button
                                        onClick={() => handleResolve(report.id)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success-500 text-white hover:bg-success-600 transition-colors"
                                    >
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Résoudre
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Report Detail Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-neutral-800">Détails du Signalement</h2>
                            <button onClick={() => { setSelectedReport(null); setResolution(''); }} className="p-2 rounded-lg hover:bg-neutral-100">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-neutral-800">{selectedReport.reason}</span>
                                {getSeverityBadge(selectedReport.severity)}
                            </div>
                            <div className="p-4 bg-neutral-50 rounded-xl">
                                <p className="text-sm text-neutral-500 mb-1">Élément signalé</p>
                                <p className="font-medium text-neutral-800">{selectedReport.reportedItem.name}</p>
                                <p className="text-xs text-neutral-400">{selectedReport.reportedItem.id}</p>
                            </div>
                            <div className="p-4 bg-neutral-50 rounded-xl">
                                <p className="text-sm text-neutral-500 mb-1">Description</p>
                                <p className="text-neutral-700">{selectedReport.description}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Actions prises</label>
                                <textarea
                                    value={resolution}
                                    onChange={(e) => setResolution(e.target.value)}
                                    placeholder="Décrivez les actions prises..."
                                    className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleDismiss(selectedReport.id)}
                                    className="flex-1 py-3 rounded-xl bg-neutral-100 text-neutral-700 font-semibold hover:bg-neutral-200 transition-colors"
                                >
                                    Ignorer
                                </button>
                                <button
                                    onClick={() => handleResolve(selectedReport.id)}
                                    className="flex-1 py-3 rounded-xl bg-success-500 text-white font-semibold hover:bg-success-600 transition-colors"
                                >
                                    Résoudre
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportManagement;
