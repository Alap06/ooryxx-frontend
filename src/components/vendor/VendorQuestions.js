import React, { useState, useEffect, useCallback } from 'react';
import {
    ChatBubbleLeftRightIcon,
    PaperAirplaneIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import vendorService from '../../services/vendorService';

const VendorQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await vendorService.getProductQuestions({
                status: filterStatus,
                search: searchQuery
            });

            const data = response || {};
            setQuestions(data.questions || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error('Erreur chargement questions:', error);
            toast.error('Erreur lors du chargement des questions');
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    }, [filterStatus, searchQuery]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleSelectQuestion = async (question) => {
        setSelectedQuestion(question);
        setReplyText('');

        // Marquer comme lu
        if (question.unreadCount > 0) {
            try {
                await vendorService.getProductQuestion(question._id);
                fetchQuestions(); // Rafraîchir pour mettre à jour le compteur
            } catch (error) {
                console.error('Erreur marquage lu:', error);
            }
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim() || !selectedQuestion) return;

        try {
            setSending(true);
            const response = await vendorService.replyToQuestion(selectedQuestion._id, replyText);

            if (response.warning) {
                toast.warning(response.warning);
            } else {
                toast.success('Réponse envoyée!');
            }

            setReplyText('');

            // Mettre à jour la question sélectionnée
            if (response.question) {
                setSelectedQuestion(response.question);
            }

            fetchQuestions();
        } catch (error) {
            toast.error(error.message || 'Erreur lors de l\'envoi');
        } finally {
            setSending(false);
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            open: { bg: 'bg-amber-100', text: 'text-amber-700', icon: ClockIcon, label: 'En attente' },
            answered: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircleIcon, label: 'Répondu' },
            closed: { bg: 'bg-neutral-100', text: 'text-neutral-600', icon: XCircleIcon, label: 'Fermé' },
            blocked: { bg: 'bg-red-100', text: 'text-red-700', icon: ExclamationTriangleIcon, label: 'Bloqué' }
        };
        const c = config[status] || config.open;
        return (
            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
                <c.icon className="w-3 h-3" />
                {c.label}
            </span>
        );
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;

        if (diff < 60000) return 'À l\'instant';
        if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
        if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`;

        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="h-[calc(100vh-200px)] flex flex-col">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-neutral-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                            <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-800">Questions Clients</h1>
                            <p className="text-neutral-500">
                                Répondez aux questions sur vos produits
                                {unreadCount > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                        {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchQuestions}
                        className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50"
                    >
                        <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        Actualiser
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Questions List */}
                <div className="w-1/3 bg-white rounded-2xl shadow-lg border border-neutral-100 flex flex-col overflow-hidden">
                    {/* Filters */}
                    <div className="p-4 border-b border-neutral-100 space-y-3">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="flex-1 px-3 py-2 bg-neutral-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="open">En attente</option>
                                <option value="answered">Répondu</option>
                                <option value="closed">Fermé</option>
                            </select>
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : questions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                <ChatBubbleLeftRightIcon className="w-12 h-12 text-neutral-300 mb-3" />
                                <p className="text-neutral-500">Aucune question</p>
                            </div>
                        ) : (
                            questions.map((q) => (
                                <button
                                    key={q._id}
                                    onClick={() => handleSelectQuestion(q)}
                                    className={`w-full p-4 text-left border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${selectedQuestion?._id === q._id ? 'bg-indigo-50' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-medium text-neutral-800 line-clamp-1">{q.subject}</h3>
                                        {q.unreadCount > 0 && (
                                            <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
                                        )}
                                    </div>
                                    <p className="text-sm text-neutral-500 line-clamp-2 mb-2">
                                        {q.messages?.[q.messages.length - 1]?.content || 'Pas de message'}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        {getStatusBadge(q.status)}
                                        <span className="text-xs text-neutral-400">{formatDate(q.lastActivityAt)}</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Conversation */}
                <div className="flex-1 bg-white rounded-2xl shadow-lg border border-neutral-100 flex flex-col overflow-hidden">
                    {selectedQuestion ? (
                        <>
                            {/* Question Header */}
                            <div className="p-4 border-b border-neutral-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="font-bold text-neutral-800">{selectedQuestion.subject}</h2>
                                        <p className="text-sm text-neutral-500 mt-1">
                                            Question d'un client anonyme
                                        </p>
                                    </div>
                                    {getStatusBadge(selectedQuestion.status)}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {selectedQuestion.messages?.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.sender === 'vendor' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-2xl p-4 ${msg.sender === 'vendor'
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                                    : 'bg-neutral-100 text-neutral-800'
                                                } ${msg.isBlocked ? 'opacity-60' : ''}`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-medium opacity-75">
                                                    {msg.senderLabel}
                                                </span>
                                                <span className="text-xs opacity-50">
                                                    {formatDate(msg.createdAt)}
                                                </span>
                                            </div>
                                            <p className={`text-sm ${msg.isBlocked ? 'italic' : ''}`}>
                                                {msg.content}
                                            </p>
                                            {msg.isBlocked && (
                                                <div className="flex items-center gap-1 mt-2 text-xs opacity-75">
                                                    <ExclamationTriangleIcon className="w-3 h-3" />
                                                    Message filtré
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Box */}
                            {selectedQuestion.status !== 'closed' && (
                                <div className="p-4 border-t border-neutral-100">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="Tapez votre réponse..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                                            className="flex-1 px-4 py-3 bg-neutral-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <button
                                            onClick={handleSendReply}
                                            disabled={!replyText.trim() || sending}
                                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
                                        >
                                            {sending ? (
                                                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <PaperAirplaneIcon className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-neutral-400 mt-2">
                                        ⚠️ Les emails, numéros de téléphone et liens sont automatiquement masqués
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                            <ChatBubbleLeftRightIcon className="w-16 h-16 text-neutral-200 mb-4" />
                            <h3 className="text-lg font-medium text-neutral-500">Sélectionnez une question</h3>
                            <p className="text-sm text-neutral-400 mt-1">
                                Choisissez une question dans la liste pour y répondre
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorQuestions;
