import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';

const AdminModeratorManagement = () => {
    const [moderators, setModerators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [selectedModerator, setSelectedModerator] = useState(null);
    const [activities, setActivities] = useState([]);
    const [activityLoading, setActivityLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        mode: 'new', // 'new' or 'existing'
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    // Pagination
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0,
        limit: 20
    });

    // Fetch moderators
    const fetchModerators = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminService.getModerators({
                page: pagination.currentPage,
                limit: pagination.limit,
                search: searchQuery
            });
            const result = response.data || response;
            setModerators(result.moderators || []);
            setPagination(prev => ({
                ...prev,
                totalPages: result.pagination?.totalPages || 1,
                total: result.pagination?.total || 0
            }));
        } catch (err) {
            console.error('Error fetching moderators:', err);
            setError('Impossible de charger les modérateurs.');
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, pagination.limit, searchQuery]);

    // Fetch users for existing user selection
    const fetchUsers = async () => {
        try {
            const response = await adminService.getUsers({ limit: 100 });
            const result = response.data || response;
            // Filter out admins and existing moderators
            const eligibleUsers = (result.users || []).filter(u =>
                u.role !== 'admin' && u.role !== 'moderator'
            );
            setUsers(eligibleUsers);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    useEffect(() => {
        fetchModerators();
    }, [fetchModerators]);

    // Fetch activity for a moderator
    const fetchActivity = async (moderatorId) => {
        setActivityLoading(true);
        try {
            const response = await adminService.getModeratorActivity(moderatorId);
            const result = response.data || response;
            setActivities(result.activities || []);
        } catch (err) {
            console.error('Error fetching activity:', err);
        } finally {
            setActivityLoading(false);
        }
    };

    const handleOpenModal = (moderator = null) => {
        if (moderator) {
            setFormData({
                mode: 'edit',
                userId: moderator._id,
                firstName: moderator.firstName,
                lastName: moderator.lastName,
                email: moderator.email,
                password: ''
            });
        } else {
            setFormData({
                mode: 'new',
                userId: '',
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            });
            fetchUsers();
        }
        setShowModal(true);
    };

    const handleOpenActivityModal = (moderator) => {
        setSelectedModerator(moderator);
        fetchActivity(moderator._id);
        setShowActivityModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.mode === 'edit') {
                await adminService.updateModerator(formData.userId, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email
                });
            } else if (formData.mode === 'existing') {
                await adminService.createModerator({ userId: formData.userId });
            } else {
                await adminService.createModerator({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                });
            }
            setShowModal(false);
            fetchModerators();
        } catch (err) {
            console.error('Error saving moderator:', err);
            setError(err.message);
        }
    };

    const handleToggleBlock = async (moderatorId) => {
        try {
            await adminService.toggleModeratorBlock(moderatorId);
            fetchModerators();
        } catch (err) {
            console.error('Error toggling block:', err);
        }
    };

    const handleRevoke = async (moderatorId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir révoquer ce modérateur? Il redeviendra un client normal.')) return;
        try {
            await adminService.revokeModerator(moderatorId);
            fetchModerators();
        } catch (err) {
            console.error('Error revoking moderator:', err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Jamais';
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Gestion des Modérateurs</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto"
                >
                    + Ajouter Modérateur
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    className="w-full max-w-md border rounded-lg px-4 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-10">Chargement...</div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : moderators.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Aucun modérateur trouvé</div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                        {moderators.map((mod) => (
                            <div key={mod._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center">
                                        <span className="text-purple-600 font-bold text-lg">
                                            {mod.firstName?.[0]}{mod.lastName?.[0]}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                                            {mod.firstName} {mod.lastName}
                                        </h3>
                                        <p className="text-xs text-gray-500 truncate">{mod.email}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${mod.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {mod.isBlocked ? 'Bloqué' : 'Actif'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mb-3">
                                    <span>{mod.activityCount || 0} actions</span>
                                    <span>Dernière: {formatDate(mod.lastActivityAt)}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleOpenActivityModal(mod)}
                                        className="flex-1 text-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100"
                                    >
                                        Activité
                                    </button>
                                    <button
                                        onClick={() => handleOpenModal(mod)}
                                        className="flex-1 text-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleToggleBlock(mod._id)}
                                        className={`flex-1 text-center px-3 py-1.5 rounded-lg text-xs font-medium ${mod.isBlocked
                                                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                                : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                            }`}
                                    >
                                        {mod.isBlocked ? 'Débloquer' : 'Bloquer'}
                                    </button>
                                    <button
                                        onClick={() => handleRevoke(mod._id)}
                                        className="text-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100"
                                    >
                                        Révoquer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modérateur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activités</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière Activité</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {moderators.map((mod) => (
                                    <tr key={mod._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center">
                                                    <span className="text-purple-600 font-medium">
                                                        {mod.firstName?.[0]}{mod.lastName?.[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {mod.firstName} {mod.lastName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {mod.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${mod.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {mod.isBlocked ? 'Bloqué' : 'Actif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {mod.activityCount || 0} actions
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(mod.lastActivityAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            <button onClick={() => handleOpenActivityModal(mod)} className="text-blue-600 hover:text-blue-900">
                                                Activité
                                            </button>
                                            <button onClick={() => handleOpenModal(mod)} className="text-indigo-600 hover:text-indigo-900">
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleToggleBlock(mod._id)}
                                                className={mod.isBlocked ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'}
                                            >
                                                {mod.isBlocked ? 'Débloquer' : 'Bloquer'}
                                            </button>
                                            <button onClick={() => handleRevoke(mod._id)} className="text-red-600 hover:text-red-900">
                                                Révoquer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
                        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {formData.mode === 'edit' ? 'Modifier Modérateur' : 'Ajouter Modérateur'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {formData.mode !== 'edit' && (
                                    <div className="flex space-x-4 mb-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="mode"
                                                value="new"
                                                checked={formData.mode === 'new'}
                                                onChange={() => setFormData(prev => ({ ...prev, mode: 'new' }))}
                                                className="mr-2"
                                            />
                                            Nouveau
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="mode"
                                                value="existing"
                                                checked={formData.mode === 'existing'}
                                                onChange={() => setFormData(prev => ({ ...prev, mode: 'existing' }))}
                                                className="mr-2"
                                            />
                                            Utilisateur existant
                                        </label>
                                    </div>
                                )}

                                {formData.mode === 'existing' ? (
                                    <select
                                        className="w-full border rounded-lg px-3 py-2"
                                        value={formData.userId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                                        required
                                    >
                                        <option value="">Sélectionner un utilisateur</option>
                                        {users.map(u => (
                                            <option key={u._id} value={u._id}>
                                                {u.firstName} {u.lastName} ({u.email})
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Prénom"
                                                className="border rounded-lg px-3 py-2"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Nom"
                                                className="border rounded-lg px-3 py-2"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="w-full border rounded-lg px-3 py-2"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            required
                                        />
                                        {formData.mode === 'new' && (
                                            <input
                                                type="password"
                                                placeholder="Mot de passe"
                                                className="w-full border rounded-lg px-3 py-2"
                                                value={formData.password}
                                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                                required
                                            />
                                        )}
                                    </>
                                )}

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        {formData.mode === 'edit' ? 'Enregistrer' : 'Créer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Modal */}
            {showActivityModal && selectedModerator && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowActivityModal(false)}></div>
                        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
                            <h3 className="text-lg font-semibold mb-4">
                                Activité de {selectedModerator.firstName} {selectedModerator.lastName}
                            </h3>
                            {activityLoading ? (
                                <div className="text-center py-4">Chargement...</div>
                            ) : activities.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">Aucune activité enregistrée</div>
                            ) : (
                                <div className="space-y-3">
                                    {activities.map((act, idx) => (
                                        <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="font-medium text-gray-900 capitalize">{act.action.replace(/_/g, ' ')}</span>
                                                    {act.description && (
                                                        <p className="text-sm text-gray-600">{act.description}</p>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500">{formatDate(act.createdAt)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => setShowActivityModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminModeratorManagement;
