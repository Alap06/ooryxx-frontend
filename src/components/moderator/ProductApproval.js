import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    CubeIcon,
    ClockIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const ProductApproval = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        setTimeout(() => {
            setProducts([
                {
                    id: 1,
                    title: 'iPhone 15 Pro Max 256GB',
                    vendor: 'Tech Store TN',
                    category: 'Électronique',
                    price: 3999,
                    images: ['/api/placeholder/300/300'],
                    description: 'Le dernier iPhone avec puce A17 Pro, écran Super Retina XDR et système de caméras professionnelles.',
                    submittedAt: '2024-05-28T10:30:00',
                    specifications: { 'Stockage': '256GB', 'Couleur': 'Noir', 'Garantie': '1 an' }
                },
                {
                    id: 2,
                    title: 'Samsung Galaxy S24 Ultra',
                    vendor: 'Mobile Shop',
                    category: 'Électronique',
                    price: 3599,
                    images: ['/api/placeholder/300/300'],
                    description: 'Samsung Galaxy S24 Ultra avec S Pen intégré et caméra 200MP.',
                    submittedAt: '2024-05-28T09:15:00',
                    specifications: { 'RAM': '12GB', 'Stockage': '256GB', 'Couleur': 'Violet' }
                },
                {
                    id: 3,
                    title: 'MacBook Air M3',
                    vendor: 'Apple Store TN',
                    category: 'Informatique',
                    price: 4299,
                    images: ['/api/placeholder/300/300'],
                    description: 'MacBook Air avec la nouvelle puce M3, 15 heures d\'autonomie.',
                    submittedAt: '2024-05-27T16:45:00',
                    specifications: { 'Puce': 'M3', 'RAM': '8GB', 'SSD': '256GB' }
                },
                {
                    id: 4,
                    title: 'Robe d\'été fleurie',
                    vendor: 'Fashion House',
                    category: 'Mode',
                    price: 89,
                    images: ['/api/placeholder/300/300'],
                    description: 'Robe légère et élégante pour l\'été, tissu 100% coton.',
                    submittedAt: '2024-05-27T14:20:00',
                    specifications: { 'Taille': 'S-XL', 'Matière': 'Coton', 'Couleur': 'Floral' }
                }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const handleApprove = (productId) => {
        setProducts(products.filter(p => p.id !== productId));
        setSelectedProduct(null);
    };

    const handleReject = (productId) => {
        if (!rejectionReason.trim()) return;
        setProducts(products.filter(p => p.id !== productId));
        setSelectedProduct(null);
        setRejectionReason('');
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
                    <h1 className="text-2xl font-bold text-neutral-800">Approbation des Produits</h1>
                    <p className="text-neutral-500">{products.length} produits en attente de validation</p>
                </div>
                <div className="relative max-w-xs">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                </div>
            </div>

            {/* Empty State */}
            {products.length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-neutral-100">
                    <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircleIcon className="w-8 h-8 text-success-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-800">Tout est vérifié !</h3>
                    <p className="text-neutral-500 mt-2">Aucun produit en attente de validation.</p>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.id} className="group bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden hover:shadow-xl transition-all">
                        {/* Product Image */}
                        <div className="relative h-48 bg-neutral-100">
                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                                <ClockIcon className="w-3 h-3" />
                                {new Date(product.submittedAt).toLocaleDateString('fr-FR')}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                            <h3 className="font-bold text-neutral-800 mb-1 truncate">{product.title}</h3>
                            <p className="text-sm text-neutral-500 mb-2">{product.vendor} · {product.category}</p>
                            <p className="text-lg font-bold text-primary-600 mb-4">{product.price} TND</p>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedProduct(product)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                                >
                                    <EyeIcon className="w-4 h-4" />
                                    Voir
                                </button>
                                <button
                                    onClick={() => handleApprove(product.id)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-success-500 text-white hover:bg-success-600 transition-colors"
                                >
                                    <CheckCircleIcon className="w-4 h-4" />
                                    Approuver
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                        {/* Header */}
                        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-neutral-800">Détails du Produit</h2>
                            <button
                                onClick={() => { setSelectedProduct(null); setRejectionReason(''); }}
                                className="p-2 rounded-lg hover:bg-neutral-100"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Product Header */}
                            <div className="flex gap-4">
                                <div className="w-32 h-32 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0">
                                    <img src={selectedProduct.images[0]} alt={selectedProduct.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-neutral-800">{selectedProduct.title}</h3>
                                    <p className="text-neutral-500">{selectedProduct.vendor}</p>
                                    <p className="text-2xl font-bold text-primary-600 mt-2">{selectedProduct.price} TND</p>
                                    <p className="text-sm text-neutral-400 mt-1">
                                        Soumis le {new Date(selectedProduct.submittedAt).toLocaleDateString('fr-FR', { dateStyle: 'full' })}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h4 className="font-semibold text-neutral-800 mb-2">Description</h4>
                                <p className="text-neutral-600 bg-neutral-50 rounded-xl p-4">{selectedProduct.description}</p>
                            </div>

                            {/* Specifications */}
                            <div>
                                <h4 className="font-semibold text-neutral-800 mb-2">Spécifications</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                                        <div key={key} className="p-3 bg-neutral-50 rounded-xl">
                                            <p className="text-sm text-neutral-500">{key}</p>
                                            <p className="font-medium text-neutral-800">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rejection Reason */}
                            <div>
                                <label className="block font-semibold text-neutral-800 mb-2">Raison du rejet (si applicable)</label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Expliquez pourquoi ce produit est rejeté..."
                                    className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                                    rows={3}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-neutral-200">
                                <button
                                    onClick={() => handleReject(selectedProduct.id)}
                                    disabled={!rejectionReason.trim()}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-error-500 text-white hover:bg-error-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <XCircleIcon className="w-5 h-5" />
                                    Rejeter
                                </button>
                                <button
                                    onClick={() => handleApprove(selectedProduct.id)}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-success-500 text-white hover:bg-success-600 transition-colors"
                                >
                                    <CheckCircleIcon className="w-5 h-5" />
                                    Approuver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductApproval;
