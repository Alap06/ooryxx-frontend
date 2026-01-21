import React, { useState, useEffect } from 'react';
import {
    ChatBubbleLeftRightIcon,
    PaperAirplaneIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import productQuestionService from '../services/productQuestionService';

/**
 * Composant pour les questions/réponses anonymes sur les produits
 * À utiliser sur la page de détail produit
 */
const ProductQuestions = ({ productId, isLoggedIn = false }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (productId) {
            fetchQuestions();
        }
    }, [productId]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await productQuestionService.getProductQuestions(productId);
            setQuestions(response?.questions || []);
        } catch (error) {
            console.error('Erreur chargement questions:', error);
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            toast.info('Veuillez vous connecter pour poser une question');
            return;
        }

        if (!formData.subject.trim() || !formData.message.trim()) {
            toast.warning('Veuillez remplir le sujet et la question');
            return;
        }

        try {
            setSending(true);
            const response = await productQuestionService.createQuestion(
                productId,
                formData.subject,
                formData.message
            );

            if (response.warning) {
                toast.warning(response.warning);
            } else {
                toast.success('Question envoyée ! Le vendeur vous répondra bientôt.');
            }

            setFormData({ subject: '', message: '' });
            setShowForm(false);
            fetchQuestions();
        } catch (error) {
            toast.error(error.message || 'Erreur lors de l\'envoi');
        } finally {
            setSending(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-xl">
                            <ChatBubbleLeftRightIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-neutral-800">Questions & Réponses</h2>
                            <p className="text-sm text-neutral-500">
                                Posez une question anonyme au vendeur
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
                    >
                        Poser une question
                    </button>
                </div>

                {/* Security Notice */}
                <div className="mt-4 flex items-start gap-2 p-3 bg-white/50 rounded-xl">
                    <ShieldCheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-neutral-600">
                        <strong>Communication anonyme :</strong> Votre identité reste confidentielle.
                        Pour votre sécurité, les emails, numéros de téléphone et liens sont automatiquement masqués.
                    </p>
                </div>
            </div>

            {/* Question Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="p-6 bg-neutral-50 border-b border-neutral-100">
                    {!isLoggedIn && (
                        <div className="mb-4 p-3 bg-amber-50 rounded-xl flex items-center gap-2">
                            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
                            <span className="text-sm text-amber-700">
                                Connectez-vous pour poser une question
                            </span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Sujet de la question
                            </label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="Ex: Disponibilité, Dimensions, Compatibilité..."
                                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                maxLength={200}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Votre question
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Posez votre question au vendeur..."
                                rows={3}
                                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                maxLength={2000}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-neutral-600 hover:text-neutral-800"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={sending || !isLoggedIn}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
                            >
                                {sending ? (
                                    <>Envoi en cours...</>
                                ) : (
                                    <>
                                        <PaperAirplaneIcon className="w-4 h-4" />
                                        Envoyer
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Questions List */}
            <div className="divide-y divide-neutral-100">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                        <p className="text-neutral-500 text-sm">Chargement des questions...</p>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="p-8 text-center">
                        <ChatBubbleLeftRightIcon className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
                        <p className="text-neutral-500">Aucune question pour le moment</p>
                        <p className="text-sm text-neutral-400 mt-1">
                            Soyez le premier à poser une question !
                        </p>
                    </div>
                ) : (
                    questions.map((q) => (
                        <div key={q._id} className="p-4 hover:bg-neutral-50 transition-colors">
                            {/* Question Header */}
                            <button
                                onClick={() => setExpandedQuestion(expandedQuestion === q._id ? null : q._id)}
                                className="w-full flex items-start justify-between text-left"
                            >
                                <div className="flex-1">
                                    <h3 className="font-medium text-neutral-800">{q.subject}</h3>
                                    <p className="text-sm text-neutral-500 mt-1">
                                        {q.messages?.[0]?.content?.slice(0, 100)}
                                        {q.messages?.[0]?.content?.length > 100 ? '...' : ''}
                                    </p>
                                    <p className="text-xs text-neutral-400 mt-2">
                                        Posée le {formatDate(q.createdAt)} • {q.messages?.length || 0} message(s)
                                    </p>
                                </div>
                                {expandedQuestion === q._id ? (
                                    <ChevronUpIcon className="w-5 h-5 text-neutral-400 flex-shrink-0 ml-4" />
                                ) : (
                                    <ChevronDownIcon className="w-5 h-5 text-neutral-400 flex-shrink-0 ml-4" />
                                )}
                            </button>

                            {/* Expanded Conversation */}
                            {expandedQuestion === q._id && (
                                <div className="mt-4 space-y-3 pl-4 border-l-2 border-indigo-100">
                                    {q.messages?.map((msg, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <div className={`p-2 rounded-full ${msg.sender === 'customer' ? 'bg-indigo-100' : 'bg-green-100'
                                                }`}>
                                                <UserCircleIcon className={`w-5 h-5 ${msg.sender === 'customer' ? 'text-indigo-600' : 'text-green-600'
                                                    }`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-sm font-medium ${msg.sender === 'customer' ? 'text-indigo-600' : 'text-green-600'
                                                        }`}>
                                                        {msg.senderLabel}
                                                    </span>
                                                    <span className="text-xs text-neutral-400">
                                                        {formatDate(msg.createdAt)}
                                                    </span>
                                                </div>
                                                <p className={`text-sm text-neutral-700 ${msg.isBlocked ? 'italic text-neutral-400' : ''}`}>
                                                    {msg.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductQuestions;
