import React, { useState, useEffect, useCallback } from 'react';
import {
    CogIcon,
    CurrencyDollarIcon,
    EnvelopeIcon,
    ShieldCheckIcon,
    BellIcon,
    CheckIcon,
    ExclamationTriangleIcon,
    PhotoIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    StarIcon,
    TagIcon,
    CreditCardIcon
} from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

const SystemSettings = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [settings, setSettings] = useState({
        siteName: 'Ooryxx',
        siteDescription: 'Votre plateforme e-commerce multi-vendeur en Tunisie',
        supportEmail: 'support@ooryxx.tn',
        defaultCurrency: 'TND',
        defaultLanguage: 'fr',
        commissionRate: 10,
        minWithdrawal: 100,
        enableNotifications: true,
        emailNotifications: true,
        smsNotifications: false,
        maintenanceMode: false,
        requireEmailVerification: true,
        allowGuestCheckout: false,
        stripeEnabled: true,
        paypalEnabled: false
    });

    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    // Featured Products state
    const [allProducts, setAllProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [productSearchQuery, setProductSearchQuery] = useState('');
    const [productLoading, setProductLoading] = useState(false);

    // Fetch all products when featured section is active
    useEffect(() => {
        if (activeSection === 'featured') {
            fetchProducts();
        }
    }, [activeSection]);

    const fetchProducts = async () => {
        setProductLoading(true);
        try {
            const response = await adminService.getAllProducts({ limit: 100, status: 'active' });
            const data = response.data || response;
            const products = data.products || [];
            setAllProducts(products);
            setFeaturedProducts(products.filter(p => p.featured === true));
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Erreur lors du chargement des produits');
        } finally {
            setProductLoading(false);
        }
    };

    const handleToggleFeatured = async (product) => {
        try {
            const newFeaturedStatus = !product.featured;
            await adminService.updateProduct(product._id, { featured: newFeaturedStatus });

            // Update local state
            setAllProducts(prev => prev.map(p =>
                p._id === product._id ? { ...p, featured: newFeaturedStatus } : p
            ));

            if (newFeaturedStatus) {
                setFeaturedProducts(prev => [...prev, { ...product, featured: true }]);
                toast.success(`${product.title} ajouté aux produits vedettes`);
            } else {
                setFeaturedProducts(prev => prev.filter(p => p._id !== product._id));
                toast.success(`${product.title} retiré des produits vedettes`);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        setSaved(true);
        toast.success('Paramètres enregistrés');
        setTimeout(() => setSaved(false), 3000);
    };

    // Filter products based on search
    const filteredProducts = allProducts.filter(p =>
        p.title?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(productSearchQuery.toLowerCase())
    );

    const sections = [
        { id: 'general', label: 'Général', icon: CogIcon },
        { id: 'featured', label: 'Produits Vedettes', icon: StarIcon },
        { id: 'commission', label: 'Commissions', icon: CurrencyDollarIcon },
        { id: 'email', label: 'Email', icon: EnvelopeIcon },
        { id: 'payments', label: 'Paiements', icon: CreditCardIcon },
        { id: 'security', label: 'Sécurité', icon: ShieldCheckIcon },
        { id: 'notifications', label: 'Notifications', icon: BellIcon }
    ];

    const SettingCard = ({ title, description, children }) => (
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-6">
            <h3 className="text-lg font-bold text-neutral-800 mb-1">{title}</h3>
            <p className="text-sm text-neutral-500 mb-4">{description}</p>
            <div className="space-y-4">{children}</div>
        </div>
    );

    const Toggle = ({ enabled, onChange, label }) => (
        <div className="flex items-center justify-between">
            <span className="text-neutral-700">{label}</span>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-primary-500' : 'bg-neutral-300'}`}
            >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-6' : ''}`} />
            </button>
        </div>
    );

    const Input = ({ label, value, onChange, type = 'text', suffix = '' }) => (
        <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                {suffix && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">{suffix}</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Paramètres Système</h1>
                    <p className="text-neutral-500">Configurez les paramètres de votre plateforme</p>
                </div>
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${saved
                        ? 'bg-success-500 text-white'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                        }`}
                >
                    {saved ? (
                        <>
                            <CheckIcon className="w-5 h-5" />
                            Enregistré !
                        </>
                    ) : (
                        <>
                            <CheckIcon className="w-5 h-5" />
                            Enregistrer
                        </>
                    )}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-3 sticky top-28">
                        <nav className="space-y-1">
                            {sections.map(section => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeSection === section.id
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-neutral-600 hover:bg-neutral-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{section.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1 space-y-6">
                    {/* General Settings */}
                    {activeSection === 'general' && (
                        <>
                            <SettingCard
                                title="Informations du site"
                                description="Paramètres de base de votre plateforme"
                            >
                                <Input
                                    label="Nom du site"
                                    value={settings.siteName}
                                    onChange={(v) => handleChange('siteName', v)}
                                />
                                <Input
                                    label="Description"
                                    value={settings.siteDescription}
                                    onChange={(v) => handleChange('siteDescription', v)}
                                />
                                <Input
                                    label="Email de support"
                                    value={settings.supportEmail}
                                    onChange={(v) => handleChange('supportEmail', v)}
                                />
                            </SettingCard>

                            <SettingCard
                                title="Localisation"
                                description="Paramètres régionaux"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Devise par défaut</label>
                                    <select
                                        value={settings.defaultCurrency}
                                        onChange={(e) => handleChange('defaultCurrency', e.target.value)}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        <option value="TND">Dinar Tunisien (TND)</option>
                                        <option value="EUR">Euro (EUR)</option>
                                        <option value="USD">Dollar US (USD)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Langue par défaut</label>
                                    <select
                                        value={settings.defaultLanguage}
                                        onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        <option value="fr">Français</option>
                                        <option value="ar">Arabe</option>
                                        <option value="en">Anglais</option>
                                    </select>
                                </div>
                            </SettingCard>
                        </>
                    )}

                    {/* Featured Products Settings */}
                    {activeSection === 'featured' && (
                        <>
                            <SettingCard
                                title="Produits Vedettes Actuels"
                                description="Ces produits apparaissent sur la page d'accueil"
                            >
                                {productLoading ? (
                                    <div className="text-center py-4">
                                        <div className="w-8 h-8 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600 mx-auto"></div>
                                    </div>
                                ) : featuredProducts.length === 0 ? (
                                    <div className="text-center py-8 text-neutral-500">
                                        <StarIcon className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                                        <p>Aucun produit vedette sélectionné</p>
                                        <p className="text-sm">Ajoutez des produits ci-dessous</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {featuredProducts.map(product => (
                                            <div key={product._id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                                                <img
                                                    src={product.images?.[0]?.url || '/placeholder.jpg'}
                                                    alt={product.title}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-neutral-800 truncate">{product.title}</p>
                                                    <p className="text-sm text-amber-600">{product.price?.toFixed(2)} TND</p>
                                                </div>
                                                <button
                                                    onClick={() => handleToggleFeatured(product)}
                                                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                                >
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </SettingCard>

                            <SettingCard
                                title="Ajouter des Produits Vedettes"
                                description="Recherchez et sélectionnez des produits à mettre en avant"
                            >
                                {/* Search */}
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un produit..."
                                        value={productSearchQuery}
                                        onChange={(e) => setProductSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                {/* Product List */}
                                <div className="max-h-96 overflow-y-auto space-y-2">
                                    {filteredProducts.filter(p => !p.featured).map(product => (
                                        <div key={product._id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                                            <img
                                                src={product.images?.[0]?.url || '/placeholder.jpg'}
                                                alt={product.title}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-neutral-800 truncate">{product.title}</p>
                                                <div className="flex items-center gap-2 text-sm text-neutral-500">
                                                    <span>{product.price?.toFixed(2)} TND</span>
                                                    {product.discount?.percentage > 0 && (
                                                        <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs">
                                                            -{product.discount.percentage}%
                                                        </span>
                                                    )}
                                                    <span className="text-neutral-400">•</span>
                                                    <span className="truncate">{product.category?.name || 'Non catégorisé'}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleToggleFeatured(product)}
                                                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-medium flex items-center gap-1"
                                            >
                                                <StarIcon className="w-4 h-4" />
                                                Ajouter
                                            </button>
                                        </div>
                                    ))}
                                    {filteredProducts.filter(p => !p.featured).length === 0 && (
                                        <div className="text-center py-4 text-neutral-500">
                                            Aucun produit trouvé
                                        </div>
                                    )}
                                </div>
                            </SettingCard>
                        </>
                    )}

                    {/* Commission Settings */}
                    {activeSection === 'commission' && (
                        <SettingCard
                            title="Gestion des Commissions"
                            description="Définissez les taux de commission pour les vendeurs"
                        >
                            <Input
                                label="Taux de commission par défaut"
                                type="number"
                                value={settings.commissionRate}
                                onChange={(v) => handleChange('commissionRate', parseInt(v))}
                                suffix="%"
                            />
                            <Input
                                label="Montant minimum de retrait"
                                type="number"
                                value={settings.minWithdrawal}
                                onChange={(v) => handleChange('minWithdrawal', parseInt(v))}
                                suffix="TND"
                            />
                            <div className="p-4 bg-info-50 rounded-xl border border-info-200">
                                <p className="text-sm text-info-700">
                                    💡 Les nouveaux vendeurs recevront automatiquement ce taux de commission.
                                    Vous pouvez modifier le taux pour chaque vendeur individuellement.
                                </p>
                            </div>
                        </SettingCard>
                    )}

                    {/* Email Settings */}
                    {activeSection === 'email' && (
                        <SettingCard
                            title="Configuration Email"
                            description="Gérez les paramètres d'envoi d'emails"
                        >
                            <Toggle
                                label="Notifications par email"
                                enabled={settings.emailNotifications}
                                onChange={(v) => handleChange('emailNotifications', v)}
                            />
                            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                                <h4 className="font-semibold text-neutral-800 mb-2">Templates disponibles</h4>
                                <div className="space-y-2">
                                    {['Bienvenue', 'Confirmation de commande', 'Réinitialisation mot de passe', 'Confirmation vendeur'].map(template => (
                                        <div key={template} className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200">
                                            <span className="text-neutral-700">{template}</span>
                                            <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                                                Modifier
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SettingCard>
                    )}

                    {/* Payment Settings */}
                    {activeSection === 'payments' && (
                        <SettingCard
                            title="Passerelles de Paiement"
                            description="Configurez vos méthodes de paiement"
                        >
                            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <span className="text-purple-600 font-bold">S</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-800">Stripe</p>
                                        <p className="text-sm text-neutral-500">Cartes bancaires</p>
                                    </div>
                                </div>
                                <Toggle
                                    enabled={settings.stripeEnabled}
                                    onChange={(v) => handleChange('stripeEnabled', v)}
                                    label=""
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <span className="text-blue-600 font-bold">P</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-800">PayPal</p>
                                        <p className="text-sm text-neutral-500">Paiements en ligne</p>
                                    </div>
                                </div>
                                <Toggle
                                    enabled={settings.paypalEnabled}
                                    onChange={(v) => handleChange('paypalEnabled', v)}
                                    label=""
                                />
                            </div>
                        </SettingCard>
                    )}

                    {/* Security Settings */}
                    {activeSection === 'security' && (
                        <SettingCard
                            title="Paramètres de Sécurité"
                            description="Options de sécurité et d'authentification"
                        >
                            <Toggle
                                label="Vérification email obligatoire"
                                enabled={settings.requireEmailVerification}
                                onChange={(v) => handleChange('requireEmailVerification', v)}
                            />
                            <Toggle
                                label="Autoriser le checkout en tant qu'invité"
                                enabled={settings.allowGuestCheckout}
                                onChange={(v) => handleChange('allowGuestCheckout', v)}
                            />
                            <div className="pt-4 border-t border-neutral-200">
                                <Toggle
                                    label="Mode maintenance"
                                    enabled={settings.maintenanceMode}
                                    onChange={(v) => handleChange('maintenanceMode', v)}
                                />
                                {settings.maintenanceMode && (
                                    <div className="mt-3 p-4 bg-warning-50 rounded-xl border border-warning-200 flex items-start gap-3">
                                        <ExclamationTriangleIcon className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-warning-700">
                                            Le mode maintenance est activé. Les visiteurs verront une page de maintenance.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </SettingCard>
                    )}

                    {/* Notification Settings */}
                    {activeSection === 'notifications' && (
                        <SettingCard
                            title="Paramètres de Notifications"
                            description="Gérez les notifications de la plateforme"
                        >
                            <Toggle
                                label="Activer les notifications push"
                                enabled={settings.enableNotifications}
                                onChange={(v) => handleChange('enableNotifications', v)}
                            />
                            <Toggle
                                label="Notifications par email"
                                enabled={settings.emailNotifications}
                                onChange={(v) => handleChange('emailNotifications', v)}
                            />
                            <Toggle
                                label="Notifications par SMS"
                                enabled={settings.smsNotifications}
                                onChange={(v) => handleChange('smsNotifications', v)}
                            />
                        </SettingCard>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
