import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    ShieldCheckIcon,
    NoSymbolIcon,
    StarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
    CheckIcon,
    GlobeAltIcon,
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    EyeIcon,
    EyeSlashIcon,
    KeyIcon,
    ClockIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchField, setSearchField] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [actionUser, setActionUser] = useState(null);

    // Form states
    const [createForm, setCreateForm] = useState({
        firstName: '', lastName: '', email: '', phone: '', password: '', role: 'customer', isVip: false, birthdate: '', gender: ''
    });
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const itemsPerPage = 10;

    // Fetch users from API
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery || undefined,
                field: searchField !== 'all' ? searchField : undefined,
                status: filterStatus !== 'all' ? filterStatus : undefined,
                role: filterRole !== 'all' ? filterRole : undefined
            };
            const response = await adminService.getUsers(params);
            // Handle response structure: { success, data: { users, pagination } }
            if (response.success && response.data) {
                setUsers(response.data.users || []);
                setTotalPages(response.data.pagination?.totalPages || 1);
                setTotalUsers(response.data.pagination?.total || response.data.users?.length || 0);
            } else {
                // Fallback for direct data structure
                setUsers(response.users || []);
                setTotalPages(response.pagination?.totalPages || 1);
                setTotalUsers(response.pagination?.total || 0);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filterStatus, filterRole]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            if (currentPage === 1) fetchUsers();
            else setCurrentPage(1);
        }, 500);
        return () => clearTimeout(debounce);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, searchField]);

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-success-100 text-success-700 border-success-200',
            suspended: 'bg-error-100 text-error-700 border-error-200',
            pending: 'bg-warning-100 text-warning-700 border-warning-200',
            deleted: 'bg-neutral-100 text-neutral-500 border-neutral-200'
        };
        const labels = { active: 'Actif', suspended: 'Suspendu', pending: 'En attente', deleted: 'Supprimé' };
        return (
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status] || styles.pending}`}>
                {labels[status] || status}
            </span>
        );
    };

    const getRoleBadge = (role) => {
        const styles = {
            customer: 'bg-blue-100 text-blue-700',
            vendor: 'bg-purple-100 text-purple-700',
            moderator: 'bg-orange-100 text-orange-700',
            admin: 'bg-red-100 text-red-700'
        };
        const labels = { customer: 'Client', vendor: 'Vendeur', moderator: 'Modérateur', admin: 'Admin' };
        return (
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[role] || 'bg-gray-100 text-gray-700'}`}>
                {labels[role] || role}
            </span>
        );
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await adminService.updateUserStatus(userId, newStatus);
            setUsers(users.map(user =>
                user._id === userId ? { ...user, status: newStatus } : user
            ));
            if (selectedUser?._id === userId) {
                setSelectedUser({ ...selectedUser, status: newStatus });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleVIPToggle = async (userId) => {
        try {
            await adminService.toggleUserVIP(userId);
            setUsers(users.map(user =>
                user._id === userId ? { ...user, isVip: !user.isVip } : user
            ));
            if (selectedUser?._id === userId) {
                setSelectedUser({ ...selectedUser, isVip: !selectedUser.isVip });
            }
        } catch (error) {
            console.error('Error toggling VIP:', error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        try {
            const response = await adminService.createUser(createForm);
            if (response.success) {
                setShowCreateModal(false);
                setCreateForm({ firstName: '', lastName: '', email: '', phone: '', password: '', role: 'customer', isVip: false });
                fetchUsers();
            }
        } catch (error) {
            setFormError(error.message || 'Erreur lors de la création');
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            setFormError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }
        setFormLoading(true);
        setFormError('');
        try {
            await adminService.updateUserPassword(actionUser._id, newPassword);
            setShowPasswordModal(false);
            setNewPassword('');
            setActionUser(null);
        } catch (error) {
            setFormError(error.message || 'Erreur lors de la mise à jour');
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        if (!newEmail || !newEmail.includes('@')) {
            setFormError("L'email n'est pas valide");
            return;
        }
        setFormLoading(true);
        setFormError('');
        try {
            await adminService.updateUserEmail(actionUser._id, newEmail);
            setUsers(users.map(user =>
                user._id === actionUser._id ? { ...user, email: newEmail } : user
            ));
            setShowEmailModal(false);
            setNewEmail('');
            setActionUser(null);
        } catch (error) {
            setFormError(error.message || 'Erreur lors de la mise à jour');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
        try {
            await adminService.deleteUser(userId);
            fetchUsers();
            if (selectedUser?._id === userId) setSelectedUser(null);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const openPasswordModal = (user) => {
        setActionUser(user);
        setNewPassword('');
        setFormError('');
        setShowPasswordModal(true);
    };

    const openEmailModal = (user) => {
        setActionUser(user);
        setNewEmail(user.email);
        setFormError('');
        setShowEmailModal(true);
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 sm:gap-4">
                <div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-800">Gestion des Utilisateurs</h1>
                    <p className="text-sm sm:text-base text-neutral-500">{totalUsers} utilisateurs trouvés</p>
                </div>
                <button
                    onClick={() => {
                        setFormError('');
                        setCreateForm({ firstName: '', lastName: '', email: '', phone: '', password: '', role: 'customer', isVip: false, birthdate: '', gender: '' });
                        setShowCreateModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all shadow-lg"
                >
                    <PlusIcon className="w-5 h-5" />
                    Nouvel Utilisateur
                </button>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-4 border border-neutral-100">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base bg-neutral-50 border border-neutral-200 rounded-l-lg sm:rounded-l-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        className="px-4 py-2 sm:py-3 bg-neutral-50 border border-l-0 border-neutral-200 rounded-r-lg sm:rounded-r-xl text-sm sm:text-base text-neutral-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    >
                        <option value="all">Tous</option>
                        <option value="name">Nom</option>
                        <option value="email">Email</option>
                    </select>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center justify-center gap-2 px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border transition-all text-sm sm:text-base ${showFilters ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'}`}
                    >
                        <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Filtres</span>
                    </button>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-neutral-200 space-y-3">
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <span className="text-sm text-neutral-500 w-full">Statut:</span>
                            {['all', 'active', 'suspended', 'pending'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${filterStatus === status ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                                >
                                    {status === 'all' ? 'Tous' : status === 'active' ? 'Actifs' : status === 'suspended' ? 'Suspendus' : 'En attente'}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <span className="text-sm text-neutral-500 w-full">Rôle:</span>
                            {['all', 'customer', 'vendor', 'moderator', 'admin'].map(role => (
                                <button
                                    key={role}
                                    onClick={() => setFilterRole(role)}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${filterRole === role ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                                >
                                    {role === 'all' ? 'Tous' : role === 'customer' ? 'Clients' : role === 'vendor' ? 'Vendeurs' : role === 'moderator' ? 'Modérateurs' : 'Admins'}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-neutral-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="text-left px-4 lg:px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Utilisateur</th>
                                <th className="text-left px-4 lg:px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                                <th className="text-left px-4 lg:px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Rôle</th>
                                <th className="text-left px-4 lg:px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden sm:table-cell">Statut</th>
                                <th className="text-right px-4 lg:px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-neutral-50 transition-colors group">
                                    <td className="px-4 lg:px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                                </div>
                                                {user.isVip && (
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-warning-400 rounded-full flex items-center justify-center">
                                                        <StarIcon className="w-3 h-3 text-white fill-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-neutral-800">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs text-neutral-500 md:hidden">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 hidden md:table-cell">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                                                <EnvelopeIcon className="w-4 h-4" />
                                                {user.email}
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                                    <PhoneIcon className="w-4 h-4" />
                                                    {user.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4">{getRoleBadge(user.role)}</td>
                                    <td className="px-4 lg:px-6 py-4 hidden sm:table-cell">{getStatusBadge(user.status)}</td>
                                    <td className="px-4 lg:px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => setSelectedUser(user)} className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors" title="Voir détails">
                                                <UserCircleIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => openEmailModal(user)} className="p-2 rounded-lg hover:bg-purple-100 text-purple-600 transition-colors" title="Changer email">
                                                <EnvelopeIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => openPasswordModal(user)} className="p-2 rounded-lg hover:bg-orange-100 text-orange-600 transition-colors" title="Changer mot de passe">
                                                <KeyIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleVIPToggle(user._id)} className={`p-2 rounded-lg transition-colors ${user.isVip ? 'bg-warning-100 text-warning-600' : 'hover:bg-neutral-100 text-neutral-600'}`} title={user.isVip ? 'Retirer VIP' : 'Ajouter VIP'}>
                                                <StarIcon className={`w-5 h-5 ${user.isVip ? 'fill-warning-400' : ''}`} />
                                            </button>
                                            {user.status === 'active' ? (
                                                <button onClick={() => handleStatusChange(user._id, 'suspended')} className="p-2 rounded-lg hover:bg-error-100 text-error-600 transition-colors" title="Suspendre">
                                                    <NoSymbolIcon className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button onClick={() => handleStatusChange(user._id, 'active')} className="p-2 rounded-lg hover:bg-success-100 text-success-600 transition-colors" title="Activer">
                                                    <ShieldCheckIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteUser(user._id)} className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors" title="Supprimer">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="border-t border-neutral-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs sm:text-sm text-neutral-500">Page {currentPage} sur {totalPages}</p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-gradient-to-r from-red-500 to-orange-500">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <PlusIcon className="w-6 h-6" />
                                Créer un Utilisateur
                            </h2>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-white/20 text-white">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            {formError && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{formError}</div>}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Prénom *</label>
                                    <input type="text" required value={createForm.firstName} onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Nom *</label>
                                    <input type="text" required value={createForm.lastName} onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Email *</label>
                                <input type="email" required value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Téléphone</label>
                                <input type="tel" value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Mot de passe *</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} required minLength={6} value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none pr-10" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Date de naissance</label>
                                    <input type="date" value={createForm.birthdate} onChange={(e) => setCreateForm({ ...createForm, birthdate: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Genre</label>
                                    <select value={createForm.gender} onChange={(e) => setCreateForm({ ...createForm, gender: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none">
                                        <option value="">-- Sélectionner --</option>
                                        <option value="male">Homme</option>
                                        <option value="female">Femme</option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Rôle</label>
                                    <select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none">
                                        <option value="customer">Client</option>
                                        <option value="vendor">Vendeur</option>
                                        <option value="moderator">Modérateur</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                    <input type="checkbox" id="isVip" checked={createForm.isVip} onChange={(e) => setCreateForm({ ...createForm, isVip: e.target.checked })} className="rounded border-neutral-300 text-red-500 focus:ring-red-500" />
                                    <label htmlFor="isVip" className="text-sm text-neutral-700">Client VIP</label>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl text-neutral-700 hover:bg-neutral-50">Annuler</button>
                                <button type="submit" disabled={formLoading} className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 disabled:opacity-50">
                                    {formLoading ? 'Création...' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && actionUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-gradient-to-r from-orange-500 to-amber-500">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <KeyIcon className="w-6 h-6" />
                                Changer le mot de passe
                            </h2>
                            <button onClick={() => setShowPasswordModal(false)} className="p-2 rounded-lg hover:bg-white/20 text-white">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
                            <p className="text-neutral-600">Modifier le mot de passe de <strong>{actionUser.firstName} {actionUser.lastName}</strong></p>
                            {formError && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{formError}</div>}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Nouveau mot de passe *</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none pr-10" placeholder="Minimum 6 caractères" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl text-neutral-700 hover:bg-neutral-50">Annuler</button>
                                <button type="submit" disabled={formLoading} className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 disabled:opacity-50">
                                    {formLoading ? 'Mise à jour...' : 'Mettre à jour'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Email Modal */}
            {showEmailModal && actionUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-gradient-to-r from-purple-500 to-indigo-500">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <EnvelopeIcon className="w-6 h-6" />
                                Changer l'email
                            </h2>
                            <button onClick={() => setShowEmailModal(false)} className="p-2 rounded-lg hover:bg-white/20 text-white">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateEmail} className="p-6 space-y-4">
                            <p className="text-neutral-600">Modifier l'email de <strong>{actionUser.firstName} {actionUser.lastName}</strong></p>
                            {formError && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{formError}</div>}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Nouvel email *</label>
                                <input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowEmailModal(false)} className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl text-neutral-700 hover:bg-neutral-50">Annuler</button>
                                <button type="submit" disabled={formLoading} className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50">
                                    {formLoading ? 'Mise à jour...' : 'Mettre à jour'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
                        {/* Header */}
                        <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-gradient-to-r from-red-500 to-orange-500">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                    {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedUser.firstName} {selectedUser.lastName}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        {getRoleBadge(selectedUser.role)}
                                        {getStatusBadge(selectedUser.status)}
                                        {selectedUser.isVip && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded">
                                                <StarIcon className="w-3 h-3" /> VIP
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedUser(null)} className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Account Info */}
                            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl p-4 border border-neutral-200">
                                <h4 className="text-sm font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                    <IdentificationIcon className="w-5 h-5 text-red-500" />
                                    Informations du Compte
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-neutral-500">Email</p>
                                            <p className="text-sm font-medium text-neutral-800 truncate">{selectedUser.email}</p>
                                        </div>
                                        <button onClick={() => openEmailModal(selectedUser)} className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600" title="Modifier">
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <PhoneIcon className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-neutral-500">Téléphone</p>
                                            <p className="text-sm font-medium text-neutral-800">{selectedUser.phone || 'Non renseigné'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <KeyIcon className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-neutral-500">Mot de passe</p>
                                            <p className="text-sm font-mono text-neutral-600">••••••••</p>
                                        </div>
                                        <button onClick={() => openPasswordModal(selectedUser)} className="p-1.5 rounded-lg hover:bg-purple-100 text-purple-600" title="Modifier">
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                            <GlobeAltIcon className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-neutral-500">ID Utilisateur</p>
                                            <p className="text-sm font-mono text-neutral-600">{selectedUser._id?.slice(-8)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                <h4 className="text-sm font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                    <ClockIcon className="w-5 h-5 text-blue-500" />
                                    Activité du Compte
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                            <CalendarIcon className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-neutral-500">Date d'inscription</p>
                                            <p className="text-sm font-medium text-neutral-800">
                                                {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                                            <ClockIcon className="w-5 h-5 text-cyan-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-neutral-500">Dernière connexion</p>
                                            <p className="text-sm font-medium text-neutral-800">
                                                {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString('fr-FR') : 'Jamais'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Grid */}
                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100">
                                <h4 className="text-sm font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                    <ShieldCheckIcon className="w-5 h-5 text-amber-500" />
                                    Statut du Compte
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                        <p className={`text-sm font-semibold ${selectedUser.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedUser.isEmailVerified ? '✓ Vérifié' : '✗ Non vérifié'}
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-1">Email</p>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                        <p className={`text-sm font-semibold ${selectedUser.isVip ? 'text-yellow-600' : 'text-neutral-500'}`}>
                                            {selectedUser.isVip ? '★ VIP' : '○ Standard'}
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-1">Statut VIP</p>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                        <p className={`text-sm font-semibold ${selectedUser.status === 'active' ? 'text-green-600' : selectedUser.status === 'suspended' ? 'text-red-600' : 'text-yellow-600'}`}>
                                            {selectedUser.status === 'active' ? '✓ Actif' : selectedUser.status === 'suspended' ? '✗ Suspendu' : '⏳ En attente'}
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-1">Compte</p>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                        <p className="text-sm font-semibold text-neutral-700">{selectedUser.ordersCount || 0}</p>
                                        <p className="text-xs text-neutral-500 mt-1">Commandes</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => handleVIPToggle(selectedUser._id)}
                                    className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${selectedUser.isVip
                                        ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                        : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'}`}
                                >
                                    <StarIcon className={`w-5 h-5 ${selectedUser.isVip ? '' : 'fill-white'}`} />
                                    {selectedUser.isVip ? 'Retirer VIP' : 'Ajouter VIP'}
                                </button>
                                {selectedUser.status === 'active' ? (
                                    <button
                                        onClick={() => {
                                            handleStatusChange(selectedUser._id, 'suspended');
                                        }}
                                        className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all"
                                    >
                                        <NoSymbolIcon className="w-5 h-5" />
                                        Suspendre
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            handleStatusChange(selectedUser._id, 'active');
                                        }}
                                        className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all"
                                    >
                                        <CheckIcon className="w-5 h-5" />
                                        Activer
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
