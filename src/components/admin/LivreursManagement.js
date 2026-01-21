import React, { useState, useEffect, useCallback } from 'react';
import {
    TruckIcon,
    UserPlusIcon,
    CheckCircleIcon,
    XCircleIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    StarIcon,
    ClockIcon,
    ChevronDownIcon,
    PlusIcon,
    DocumentTextIcon,
    BuildingOfficeIcon,
    UserIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const LivreursManagement = () => {
    const [livreurs, setLivreurs] = useState([]);
    const [companies, setCompanies] = useState([]); // List of delivery companies
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedLivreurForDetails, setSelectedLivreurForDetails] = useState(null);

    const fetchLivreurs = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page,
                limit: 10,
                ...(search && { search }),
                ...(statusFilter && { status: statusFilter }),
                ...(typeFilter && { type: typeFilter })
            });

            const response = await fetch(`${API_URL}/admin/livreurs?${params}`, {
                headers: getAuthHeaders()
            });
            const data = await response.json();

            if (data.success) {
                setLivreurs(data.data.livreurs || []);
                setStats(data.data.stats);
                setPagination(data.data.pagination);

                // Filter companies for the dropdown
                const companyList = (data.data.livreurs || []).filter(l => l.type === 'company');
                setCompanies(companyList);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Erreur lors du chargement des livreurs');
        } finally {
            setLoading(false);
        }
    }, [page, search, statusFilter, typeFilter]);

    useEffect(() => {
        fetchLivreurs();
    }, [fetchLivreurs]);

    const handleStatusChange = async (livreurId, newStatus, reason = '') => {
        try {
            const response = await fetch(`${API_URL}/admin/livreurs/${livreurId}/status`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status: newStatus, reason })
            });
            const data = await response.json();

            if (data.success) {
                toast.success(`Statut mis à jour: ${newStatus}`);
                fetchLivreurs();
            } else {
                toast.error(data.message || 'Erreur');
            }
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const handleCreateLivreur = async (formData) => {
        try {
            const response = await fetch(`${API_URL}/admin/livreurs`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                toast.success('Compte livreur créé avec succès!');
                setShowCreateModal(false);
                fetchLivreurs();
            } else {
                toast.error(data.message || 'Erreur');
            }
        } catch (error) {
            toast.error('Erreur lors de la création');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            approved: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            suspended: 'bg-red-100 text-red-800',
            inactive: 'bg-gray-100 text-gray-800'
        };
        const labels = {
            approved: 'Approuvé',
            pending: 'En attente',
            suspended: 'Suspendu',
            inactive: 'Inactif'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.inactive}`}>
                {labels[status] || status}
            </span>
        );
    };

    const getVehicleIcon = (type) => {
        const icons = {
            moto: '🏍️',
            voiture: '🚗',
            camionnette: '🚐',
            velo: '🚲',
            pieton: '🚶'
        };
        return icons[type] || '🚚';
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Livreurs</h1>
                    <p className="text-gray-600">Gérez les comptes, les sociétés et les performances</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-md transition-all hover:scale-105"
                >
                    <PlusIcon className="w-5 h-5" />
                    Nouveau Livreur / Société
                </button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <p className="text-sm text-gray-500">En attente</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <p className="text-sm text-gray-500">Approuvés</p>
                        <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <p className="text-sm text-gray-500">Suspendus</p>
                        <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <p className="text-sm text-gray-500">Disponibles</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.available}</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher (Nom, Email, Zone)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">Tous les types</option>
                    <option value="independent">Indépendant</option>
                    <option value="company">Société</option>
                    <option value="employee">Employé</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvé</option>
                    <option value="suspended">Suspendu</option>
                    <option value="inactive">Inactif</option>
                </select>
            </div>

            {/* Livreurs List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                </div>
            ) : livreurs.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center">
                    <TruckIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Aucun livreur trouvé</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Livreur</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Matricule</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Zone</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Stats</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Statut</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {livreurs.map((livreur) => (
                                <tr key={livreur._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                                                {livreur.profileImage ? (
                                                    <img src={livreur.profileImage} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-primary-600 font-semibold text-lg">
                                                        {livreur.name?.charAt(0) || 'L'}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{livreur.name}</p>
                                                <p className="text-xs text-gray-500">{livreur.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                                            {livreur.matricule || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${livreur.type === 'company' ? 'bg-purple-100 text-purple-700' :
                                            livreur.type === 'employee' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {livreur.type === 'company' ? '🏢 Société' :
                                                livreur.type === 'employee' ? '👨‍💼 Employé' : '👤 Indépendant'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1">
                                            <MapPinIcon className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-700 text-sm">{livreur.zone}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-center gap-3 text-xs">
                                            <div className="text-center" title="Livraisons">
                                                <p className="font-bold text-gray-900">{livreur.stats?.totalDeliveries || 0}</p>
                                                <p className="text-gray-400">Liv</p>
                                            </div>
                                            <div className="text-center" title="Note">
                                                <div className="flex items-center gap-0.5 justify-center">
                                                    <span className="font-bold">{livreur.stats?.rating?.toFixed(1) || '5.0'}</span>
                                                    <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
                                                </div>
                                                <p className="text-gray-400">Note</p>
                                            </div>
                                            <div className="text-center" title="Taux de succès">
                                                <p className="font-bold text-green-600">{livreur.successRate || 100}%</p>
                                                <p className="text-gray-400">Succès</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            {getStatusBadge(livreur.status)}
                                            {livreur.status === 'approved' && (
                                                <span className={`text-[10px] ${livreur.isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {livreur.isAvailable ? '● Disponible' : '○ Indisponible'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {livreur.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusChange(livreur._id, 'approved')}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Approuver"
                                                >
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            {livreur.status === 'approved' && (
                                                <button
                                                    onClick={() => {
                                                        const reason = prompt('Raison de la suspension:');
                                                        if (reason) handleStatusChange(livreur._id, 'suspended', reason);
                                                    }}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Suspendre"
                                                >
                                                    <XCircleIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            {livreur.status === 'suspended' && (
                                                <button
                                                    onClick={() => handleStatusChange(livreur._id, 'approved')}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Réactiver"
                                                >
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setSelectedLivreurForDetails(livreur)}
                                                className="px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                                            >
                                                Détails complets
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                        Précédent
                    </button>
                    <span className="px-4 py-2 text-gray-600">
                        Page {page} sur {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={page === pagination.totalPages}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                        Suivant
                    </button>
                </div>
            )}

            {/* Modals */}
            {showCreateModal && (
                <CreateLivreurModal
                    companies={companies}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateLivreur}
                />
            )}

            {selectedLivreurForDetails && (
                <LivreurDetailsModal
                    livreur={selectedLivreurForDetails}
                    onClose={() => setSelectedLivreurForDetails(null)}
                />
            )}
        </div>
    );
};

// --- Sub-components ---

// Create Livreur Modal
const CreateLivreurModal = ({ onClose, onSubmit, companies }) => {
    const [formData, setFormData] = useState({
        email: '', password: '', firstName: '', lastName: '', phoneNumber: '',
        vehicleType: 'moto', licensePlate: '', zone: '', additionalZones: '', maxOrdersAtOnce: 5,
        type: 'independent', // independent, company, employee
        parentCompany: '',
        hasCin: true
    });
    const [cinImages, setCinImages] = useState({ recto: '', verso: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleFileChange = (e, side) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCinImages(prev => ({ ...prev, [side]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = {
            ...formData,
            additionalZones: formData.additionalZones ? formData.additionalZones.split(',').map(z => z.trim()) : [],
            cin: cinImages,
            // If independent, clear parentCompany
            parentCompany: formData.type === 'employee' ? formData.parentCompany : undefined
        };

        await onSubmit(data);
        setSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {formData.type === 'company' ? 'Créer une Société de Livraison' : 'Créer un Compte Livreur'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircleIcon className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Account Type Selection */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div
                            onClick={() => setFormData({ ...formData, type: 'independent' })}
                            className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${formData.type === 'independent' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'}`}
                        >
                            <UserIcon className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                            <p className="font-semibold text-sm">Indépendant</p>
                        </div>
                        <div
                            onClick={() => setFormData({ ...formData, type: 'company' })}
                            className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${formData.type === 'company' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}
                        >
                            <BuildingOfficeIcon className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                            <p className="font-semibold text-sm">Société</p>
                        </div>
                        <div
                            onClick={() => setFormData({ ...formData, type: 'employee' })}
                            className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${formData.type === 'employee' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                        >
                            <UserPlusIcon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                            <p className="font-semibold text-sm">Employé (Sous-livreur)</p>
                        </div>
                    </div>

                    {/* Employee specific field */}
                    {formData.type === 'employee' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Société parente *</label>
                            <select
                                required
                                value={formData.parentCompany}
                                onChange={(e) => setFormData({ ...formData, parentCompany: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Choisir une société...</option>
                                {companies.map(c => (
                                    <option key={c._id} value={c._id}>{c.name} ({c.matricule})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                            <input type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                            <input type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                            <input type="tel" required value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                        <input type="password" required minLength={6} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <DocumentTextIcon className="w-5 h-5" /> Documents & Véhicule
                        </h3>

                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CIN (Recto)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative">
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'recto')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    {cinImages.recto ? (
                                        <div className="relative h-20"><img src={cinImages.recto} alt="Recto" className="h-full mx-auto object-contain" /></div>
                                    ) : (
                                        <div className="text-gray-400"><PhotoIcon className="w-8 h-8 mx-auto mb-1" /><span className="text-xs">Glisser ou cliquer</span></div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CIN (Verso)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative">
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'verso')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    {cinImages.verso ? (
                                        <div className="relative h-20"><img src={cinImages.verso} alt="Verso" className="h-full mx-auto object-contain" /></div>
                                    ) : (
                                        <div className="text-gray-400"><PhotoIcon className="w-8 h-8 mx-auto mb-1" /><span className="text-xs">Glisser ou cliquer</span></div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type de véhicule</label>
                                <select value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
                                    <option value="moto">🏍️ Moto</option>
                                    <option value="voiture">🚗 Voiture</option>
                                    <option value="camionnette">🚐 Camionnette</option>
                                    <option value="velo">🚲 Vélo</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
                                <input type="text" value={formData.licensePlate} onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="123 TUN 4567" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border rounded-xl hover:bg-gray-50 font-medium">Annuler</button>
                        <button type="submit" disabled={submitting} className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium shadow-lg shadow-primary-500/30 disabled:opacity-70">
                            {submitting ? 'Création en cours...' : 'Créer le Compte'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Details Modal Component
const LivreurDetailsModal = ({ livreur, onClose }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/admin/livreurs/${livreur._id}`, { headers: getAuthHeaders() });
                const data = await response.json();
                if (data.success) {
                    setDetails(data.data);
                }
            } catch (error) {
                console.error(error);
                toast.error("Erreur chargement détails");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [livreur._id]);

    if (!details && loading) return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        </div>
    );

    if (!details) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white shrink-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border-2 border-white/30">
                                {details.livreur.userId.profileImage ? (
                                    <img src={details.livreur.userId.profileImage} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold">{details.livreur.userId.firstName?.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{details.livreur.userId.firstName} {details.livreur.userId.lastName}</h2>
                                <p className="text-primary-100 flex items-center gap-2">
                                    <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{details.livreur.matricule || 'N/A'}</span>
                                    <span>•</span>
                                    <span>{details.livreur.userId.email}</span>
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors">
                            <XCircleIcon className="w-8 h-8" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b shrink-0">
                    <button onClick={() => setActiveTab('overview')} className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary-500 text-primary-600 bg-primary-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Vue d'ensemble</button>
                    <button onClick={() => setActiveTab('orders')} className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'orders' ? 'border-primary-500 text-primary-600 bg-primary-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Commandes ({details.pendingOrders.length})</button>
                    <button onClick={() => setActiveTab('history')} className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-primary-500 text-primary-600 bg-primary-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Historique</button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto grow bg-gray-50">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><UserIcon className="w-5 h-5 text-gray-400" /> Infos Personnelles</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">Statut:</span> <span className="font-medium capitalize">{details.livreur.status}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Type:</span> <span className="font-medium capitalize text-primary-600">{details.livreur.type}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Téléphone:</span> <span className="font-medium">{details.livreur.userId.phoneNumber}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Zone:</span> <span className="font-medium">{details.livreur.zone}</span></div>
                                    {details.livreur.matricule && <div className="flex justify-between"><span className="text-gray-500">Matricule:</span> <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{details.livreur.matricule}</span></div>}
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><TruckIcon className="w-5 h-5 text-gray-400" /> Performance</h3>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-2xl font-bold text-blue-600">{details.livreur.stats?.totalDeliveries}</p>
                                        <p className="text-xs text-blue-600/80">Livrées</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="text-2xl font-bold text-green-600">{details.livreur.successRate}%</p>
                                        <p className="text-xs text-green-600/80">Succès</p>
                                    </div>
                                </div>
                            </div>

                            {/* CIN Display if available */}
                            {details.livreur.cin && (
                                <div className="col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><DocumentTextIcon className="w-5 h-5 text-gray-400" /> Documents CIN</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {details.livreur.cin.recto && (
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Recto</p>
                                                <img src={details.livreur.cin.recto} alt="Recto" className="w-full h-32 object-contain border rounded bg-gray-50" />
                                            </div>
                                        )}
                                        {details.livreur.cin.verso && (
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Verso</p>
                                                <img src={details.livreur.cin.verso} alt="Verso" className="w-full h-32 object-contain border rounded bg-gray-50" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            {details.pendingOrders.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">Aucune commande en cours</div>
                            ) : (
                                details.pendingOrders.map(order => (
                                    <div key={order._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-gray-900">#{order.orderNumber}</p>
                                            <p className="text-sm text-gray-500">{order.shippingAddress?.city}</p>
                                            {order.userId && (
                                                <p className="text-xs text-indigo-600 mt-1">Client: {order.userId.firstName} {order.userId.lastName}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800`}>
                                                {order.status}
                                            </span>
                                            <p className="text-sm font-bold mt-1">{order.totalAmount} TND</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-2">
                            {details.deliveryHistory.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">Historique vide</div>
                            ) : (
                                details.deliveryHistory.map(h => (
                                    <div key={h._id} className="bg-white px-4 py-3 rounded-lg border border-gray-100 flex justify-between items-center hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${h.status === 'delivered' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <div>
                                                <p className="font-medium">#{h.orderNumber}</p>
                                                <p className="text-xs text-gray-500">{new Date(h.deliveredAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className="font-medium text-sm">{h.totalAmount} TND</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LivreursManagement;

