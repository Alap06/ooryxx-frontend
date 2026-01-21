import React, { useState } from 'react';
import {
    PaperAirplaneIcon,
    UserGroupIcon,
    UserIcon,
    MagnifyingGlassIcon,
    CheckCircleIcon,
    XMarkIcon,
    ClockIcon,
    ExclamationCircleIcon,
    MegaphoneIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const AdminMessageForm = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        targetType: 'role',
        targetRole: 'all',
        recipientEmail: '',
        title: '',
        content: '',
        type: 'info'
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const messageTypes = [
        { value: 'info', label: 'Information', color: 'blue', icon: '📢' },
        { value: 'success', label: 'Succès', color: 'green', icon: '✅' },
        { value: 'warning', label: 'Avertissement', color: 'orange', icon: '⚠️' },
        { value: 'promo', label: 'Promotion', color: 'purple', icon: '🎁' },
        { value: 'announcement', label: 'Annonce', color: 'indigo', icon: '📣' }
    ];

    const targetRoles = [
        { value: 'all', label: 'Tous les utilisateurs', icon: UserGroupIcon },
        { value: 'customer', label: 'Tous les clients', icon: UserIcon },
        { value: 'vendor', label: 'Tous les vendeurs', icon: UserIcon },
        { value: 'moderator', label: 'Tous les modérateurs', icon: UserIcon }
    ];

    const searchUsers = async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/messages/search-users?q=${encodeURIComponent(query)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const data = await response.json();
            setSearchResults(data.data?.users || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        searchUsers(query);
    };

    const selectUser = (user) => {
        setSelectedUser(user);
        setFormData({ ...formData, targetType: 'individual', recipientEmail: user.email });
        setSearchQuery('');
        setSearchResults([]);
    };

    const clearSelectedUser = () => {
        setSelectedUser(null);
        setFormData({ ...formData, targetType: 'role', recipientEmail: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                targetType: formData.targetType,
                title: formData.title,
                content: formData.content,
                type: formData.type
            };

            if (formData.targetType === 'individual') {
                payload.recipientEmail = formData.recipientEmail;
            } else if (formData.targetType === 'role') {
                payload.targetRole = formData.targetRole;
            }

            const response = await fetch(
                `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                toast.success(data.message || 'Message envoyé !');
                if (onSuccess) onSuccess();
            } else {
                toast.error(data.message || 'Erreur lors de l\'envoi');
            }
        } catch (error) {
            toast.error('Erreur lors de l\'envoi du message');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircleIcon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-800 mb-2">Message envoyé !</h2>
                    <p className="text-neutral-500 mb-6">
                        Votre message a été envoyé avec succès aux destinataires.
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-indigo-600 to-purple-600">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <MegaphoneIcon className="w-8 h-8 text-white" />
                            <div>
                                <h2 className="text-xl font-bold text-white">Envoyer un message</h2>
                                <p className="text-white/80 text-sm">Notifier les utilisateurs</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Target Type Selection */}
                    <div>
                        <label className="text-sm font-medium text-neutral-700 mb-3 block">
                            Destinataires
                        </label>

                        {/* Individual User Search */}
                        <div className="mb-4">
                            <div className="relative">
                                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Rechercher un utilisateur par nom ou email..."
                                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                {searchLoading && (
                                    <ClockIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 animate-spin" />
                                )}
                            </div>

                            {/* Search Results Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="mt-2 border border-neutral-200 rounded-xl bg-white shadow-lg max-h-48 overflow-y-auto">
                                    {searchResults.map(user => (
                                        <button
                                            key={user._id}
                                            type="button"
                                            onClick={() => selectUser(user)}
                                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 text-left"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                {user.profileImage ? (
                                                    <img src={user.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <span className="text-indigo-600 font-medium">
                                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-neutral-800">{user.firstName} {user.lastName}</p>
                                                <p className="text-sm text-neutral-500">{user.email} • {user.role}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected User Badge */}
                        {selectedUser && (
                            <div className="mb-4 flex items-center gap-2 p-3 bg-indigo-50 rounded-xl">
                                <UserIcon className="w-5 h-5 text-indigo-600" />
                                <span className="text-indigo-800 font-medium">{selectedUser.firstName} {selectedUser.lastName}</span>
                                <span className="text-indigo-600 text-sm">({selectedUser.email})</span>
                                <button type="button" onClick={clearSelectedUser} className="ml-auto text-indigo-600 hover:text-indigo-800">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* Role Selection (if no individual user selected) */}
                        {!selectedUser && (
                            <div className="grid grid-cols-2 gap-2">
                                {targetRoles.map(role => (
                                    <button
                                        key={role.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, targetType: 'role', targetRole: role.value })}
                                        className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${formData.targetType === 'role' && formData.targetRole === role.value
                                                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                                : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                    >
                                        <role.icon className="w-4 h-4" />
                                        {role.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Message Type */}
                    <div>
                        <label className="text-sm font-medium text-neutral-700 mb-2 block">Type de message</label>
                        <div className="flex gap-2 flex-wrap">
                            {messageTypes.map(mt => (
                                <button
                                    key={mt.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: mt.value })}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${formData.type === mt.value
                                            ? `bg-${mt.color}-100 text-${mt.color}-700 border-2 border-${mt.color}-300`
                                            : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                                        }`}
                                >
                                    <span>{mt.icon}</span>
                                    {mt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium text-neutral-700 mb-2 block">Titre *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Titre du message"
                            required
                            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="text-sm font-medium text-neutral-700 mb-2 block">Contenu *</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Contenu du message..."
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-200 bg-neutral-50">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading || !formData.title || !formData.content}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <ClockIcon className="w-5 h-5 animate-spin" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <PaperAirplaneIcon className="w-5 h-5" />
                                Envoyer le message
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminMessageForm;
