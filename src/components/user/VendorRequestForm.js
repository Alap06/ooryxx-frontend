import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    BuildingStorefrontIcon,
    DocumentTextIcon,
    BanknotesIcon,
    UserIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    ArrowDownTrayIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

const VendorRequestForm = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        // Personal Info
        fullName: '',
        birthdate: '',
        nationalIdNumber: '',
        nationalIdFront: null,
        nationalIdBack: null,

        // Company Info
        companyName: '',
        companyDescription: '',
        street: '',
        city: '',
        postalCode: '',
        companyPhone: '',
        companyEmail: '',
        website: '',

        // Banking Info
        accountHolder: '',
        iban: '',
        bankName: '',
        swift: '',

        // Product Info
        productCategories: [],
        productDescription: '',

        // Documents
        signedConvention: null
    });

    const steps = [
        { id: 1, name: 'Informations Personnelles', icon: UserIcon },
        { id: 2, name: 'Entreprise', icon: BuildingStorefrontIcon },
        { id: 3, name: 'Informations Bancaires', icon: BanknotesIcon },
        { id: 4, name: 'Documents', icon: DocumentTextIcon }
    ];

    const productCategoryOptions = [
        'Électronique',
        'Mode & Vêtements',
        'Maison & Jardin',
        'Sports & Loisirs',
        'Beauté & Santé',
        'Auto & Moto',
        'Alimentaire',
        'Artisanat',
        'Autre'
    ];

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCategoryChange = (category) => {
        setFormData(prev => {
            const categories = prev.productCategories.includes(category)
                ? prev.productCategories.filter(c => c !== category)
                : [...prev.productCategories, category];
            return { ...prev, productCategories: categories };
        });
    };

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();

            // Append all text fields
            Object.keys(formData).forEach(key => {
                if (formData[key] instanceof File) {
                    formDataToSend.append(key, formData[key]);
                } else if (Array.isArray(formData[key])) {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else if (formData[key]) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/users/vendor-request`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formDataToSend
                }
            );
            const data = await response.json();

            if (data.success) {
                toast.success('Votre demande a été soumise avec succès ! Elle sera examinée sous 48h.', {
                    position: 'top-center',
                    autoClose: 5000
                });
                navigate('/profile');
            } else {
                toast.error(data.message || 'Erreur lors de la soumission');
            }
        } catch (error) {
            console.error('Error submitting vendor request:', error);
            toast.error('Erreur lors de la soumission. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-neutral-800 mb-4">Informations Personnelles</h3>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Nom complet *
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Votre nom complet"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Date de naissance *
                            </label>
                            <input
                                type="date"
                                name="birthdate"
                                value={formData.birthdate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Numéro de Carte d'Identité Nationale *
                            </label>
                            <input
                                type="text"
                                name="nationalIdNumber"
                                value={formData.nationalIdNumber}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="00000000"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    CIN (Recto) *
                                </label>
                                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                                    <PhotoIcon className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                                    <input
                                        type="file"
                                        name="nationalIdFront"
                                        onChange={handleChange}
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        id="nationalIdFront"
                                    />
                                    <label htmlFor="nationalIdFront" className="cursor-pointer text-primary-600 font-medium">
                                        {formData.nationalIdFront ? formData.nationalIdFront.name : 'Téléverser le recto'}
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    CIN (Verso) *
                                </label>
                                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                                    <PhotoIcon className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                                    <input
                                        type="file"
                                        name="nationalIdBack"
                                        onChange={handleChange}
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        id="nationalIdBack"
                                    />
                                    <label htmlFor="nationalIdBack" className="cursor-pointer text-primary-600 font-medium">
                                        {formData.nationalIdBack ? formData.nationalIdBack.name : 'Téléverser le verso'}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-neutral-800 mb-4">Informations de l'Entreprise</h3>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Nom de l'entreprise / Marque *
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Votre entreprise"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Description de l'activité
                            </label>
                            <textarea
                                name="companyDescription"
                                value={formData.companyDescription}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Décrivez votre activité..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Adresse *</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Rue..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Ville *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Tunis"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Code Postal *</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="1000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Téléphone *</label>
                                <input
                                    type="tel"
                                    name="companyPhone"
                                    value={formData.companyPhone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="+216 XX XXX XXX"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Email professionnel *</label>
                                <input
                                    type="email"
                                    name="companyEmail"
                                    value={formData.companyEmail}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="contact@entreprise.tn"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Site web</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://www.entreprise.tn"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-3">
                                Catégories de produits que vous souhaitez vendre *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {productCategoryOptions.map(category => (
                                    <label
                                        key={category}
                                        className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.productCategories.includes(category)
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-neutral-200 hover:border-neutral-300'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.productCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                            className="sr-only"
                                        />
                                        <span className="text-sm font-medium">{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-neutral-800 mb-4">Informations Bancaires</h3>
                        <p className="text-sm text-neutral-600 mb-6">
                            Ces informations seront utilisées pour le versement de vos revenus de vente.
                        </p>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Titulaire du compte *
                            </label>
                            <input
                                type="text"
                                name="accountHolder"
                                value={formData.accountHolder}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Nom du titulaire"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                IBAN / RIB *
                            </label>
                            <input
                                type="text"
                                name="iban"
                                value={formData.iban}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="TN59 XXXX XXXX XXXX XXXX XXXX"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Nom de la banque *</label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="BIAT, BNA, STB..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Code SWIFT (optionnel)</label>
                                <input
                                    type="text"
                                    name="swift"
                                    value={formData.swift}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="BIATTNTX"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-neutral-800 mb-4">Documents</h3>

                        {/* Convention Download */}
                        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 border border-primary-200">
                            <div className="flex items-start gap-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm">
                                    <DocumentTextIcon className="w-8 h-8 text-primary-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-neutral-800 mb-1">Convention Vendeur Ooryxx</h4>
                                    <p className="text-sm text-neutral-600 mb-4">
                                        Téléchargez, lisez et signez la convention. Ensuite, téléversez-la ci-dessous.
                                    </p>
                                    <a
                                        href="/documents/convention_ooryxx.pdf"
                                        download
                                        className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                                    >
                                        <ArrowDownTrayIcon className="w-5 h-5" />
                                        Télécharger la Convention
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Upload Signed Convention */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Convention signée *
                            </label>
                            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
                                <DocumentTextIcon className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                                <input
                                    type="file"
                                    name="signedConvention"
                                    onChange={handleChange}
                                    accept=".pdf,image/*"
                                    className="hidden"
                                    id="signedConvention"
                                    required
                                />
                                <label htmlFor="signedConvention" className="cursor-pointer">
                                    <span className="text-primary-600 font-semibold text-lg">
                                        {formData.signedConvention ? formData.signedConvention.name : 'Cliquez pour téléverser'}
                                    </span>
                                    <p className="text-sm text-neutral-500 mt-1">PDF ou image (max 5MB)</p>
                                </label>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-success-50 border border-success-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <CheckCircleIcon className="w-6 h-6 text-success-600" />
                                <h4 className="font-bold text-success-800">Prêt à soumettre</h4>
                            </div>
                            <p className="text-sm text-success-700">
                                Votre demande sera examinée par notre équipe dans un délai de 48 heures.
                                Vous recevrez un email de confirmation.
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <BuildingStorefrontIcon className="w-5 h-5" />
                        Demande Vendeur
                    </div>
                    <h1 className="text-4xl font-black text-neutral-800 mb-3">
                        Devenir Vendeur sur Ooryxx
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        Rejoignez notre communauté de vendeurs et développez votre activité en ligne
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-10">
                    <div className="flex items-center justify-center">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            return (
                                <div key={step.id} className="flex items-center">
                                    <div
                                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${currentStep >= step.id
                                            ? 'bg-primary-600 border-primary-600 text-white'
                                            : 'bg-white border-neutral-300 text-neutral-400'
                                            }`}
                                    >
                                        <StepIcon className="w-6 h-6" />
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`w-20 h-1 mx-2 rounded-full transition-all ${currentStep > step.id ? 'bg-primary-600' : 'bg-neutral-200'
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-center mt-3">
                        <span className="text-sm font-medium text-neutral-600">
                            Étape {currentStep} sur {steps.length}: {steps[currentStep - 1].name}
                        </span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
                    <form onSubmit={handleSubmit}>
                        {renderStep()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-10 pt-6 border-t border-neutral-200">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${currentStep === 1
                                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                    }`}
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                                Précédent
                            </button>

                            {currentStep < 4 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                                >
                                    Suivant
                                    <ArrowRightIcon className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 bg-success-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-success-700 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleIcon className="w-5 h-5" />
                                            Soumettre ma demande
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VendorRequestForm;
