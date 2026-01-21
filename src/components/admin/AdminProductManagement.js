import React, { useState, useEffect, useCallback } from 'react';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    XMarkIcon,
    CubeIcon,
    PhotoIcon,
    ArrowPathIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    TagIcon,
    TruckIcon,
    EyeIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import { productService } from '../../services/productService';

const AdminProductManagement = () => {
    // State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, outOfStock: 0 });
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [barcodeQuery, setBarcodeQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [activeFormTab, setActiveFormTab] = useState('general');

    // Delete confirmation
    const [deleteModal, setDeleteModal] = useState({ show: false, product: null });

    // Product details modal
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productReviews, setProductReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({});
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [activeDetailTab, setActiveDetailTab] = useState('info');

    // Categories & Vendors
    const [categories, setCategories] = useState([]);
    const [vendors, setVendors] = useState([]);

    // Tags & Specs input
    const [tagInput, setTagInput] = useState('');
    const [specKey, setSpecKey] = useState('');
    const [specValue, setSpecValue] = useState('');
    const [imageUrlInput, setImageUrlInput] = useState('');

    // Complete form data matching Product model
    const initialFormData = {
        title: '',
        description: '',
        price: '',
        stock: '',
        lowStockThreshold: 10,
        category: '',
        vendorId: '',
        status: 'draft',
        isPublished: false,
        featured: false,
        images: [],
        tags: [],
        specifications: [],
        badges: [],
        discount: {
            percentage: 0,
            startDate: '',
            endDate: ''
        },
        shipping: {
            weight: '',
            freeShipping: false,
            processingTime: 2,
            dimensions: { length: '', width: '', height: '' }
        },
        seo: {
            metaTitle: '',
            metaDescription: '',
            slug: ''
        },
        attributes: {}
    };

    const [formData, setFormData] = useState(initialFormData);

    // Fetch products from database
    // Debounced values
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [debouncedBarcode, setDebouncedBarcode] = useState('');

    // Handle debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            if (searchQuery) setPagination(prev => ({ ...prev, currentPage: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedBarcode(barcodeQuery);
            if (barcodeQuery) setPagination(prev => ({ ...prev, currentPage: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [barcodeQuery]);

    // Fetch products from database
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllProducts({
                page: pagination.currentPage,
                limit: 20,
                search: debouncedSearch,
                barcode: debouncedBarcode,
                status: filterStatus,
                category: filterCategory
            });

            setProducts(response.data?.products || []);
            setStats(response.data?.stats || { total: 0, active: 0, pending: 0, outOfStock: 0 });
            setPagination(response.data?.pagination || { currentPage: 1, totalPages: 1, total: 0 });
        } catch (error) {
            console.error('Error fetching products:', error);
            // toast.error('Erreur lors du chargement des produits');
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, debouncedSearch, debouncedBarcode, filterStatus, filterCategory]);

    // Fetch categories and vendors - MOUNT ONLY
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [catResponse, vendorResponse] = await Promise.all([
                    adminService.getCategories(),
                    adminService.getVendors({ limit: 100 })
                ]);
                setCategories(catResponse.data?.categories || catResponse.data || []);
                setVendors(vendorResponse.data?.vendors || []);
            } catch (error) {
                console.error('Error fetching metadata:', error);
            }
        };
        fetchMetadata();
    }, []);

    // Trigger fetch on dependencies change
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Handle form changes
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child, subchild] = name.split('.');
            if (subchild) {
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: {
                            ...prev[parent][child],
                            [subchild]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || '' : value
                        }
                    }
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || '' : value
                    }
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || '' : value
            }));
        }
    };

    // Add tag
    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    // Remove tag
    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // Add specification
    const addSpecification = () => {
        if (specKey.trim() && specValue.trim()) {
            setFormData(prev => ({
                ...prev,
                specifications: [...prev.specifications, { key: specKey.trim(), value: specValue.trim() }]
            }));
            setSpecKey('');
            setSpecValue('');
        }
    };

    // Remove specification
    const removeSpecification = (index) => {
        setFormData(prev => ({
            ...prev,
            specifications: prev.specifications.filter((_, i) => i !== index)
        }));
    };

    // Toggle badge
    const toggleBadge = (badge) => {
        setFormData(prev => ({
            ...prev,
            badges: prev.badges.includes(badge)
                ? prev.badges.filter(b => b !== badge)
                : [...prev.badges, badge]
        }));
    };

    // Add image URL
    const addImageUrl = () => {
        if (imageUrlInput.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, { url: imageUrlInput.trim(), alt: '', isPrimary: prev.images.length === 0 }]
            }));
            setImageUrlInput('');
        }
    };

    // Remove image
    const removeImage = (index) => {
        setFormData(prev => {
            const newImages = prev.images.filter((_, i) => i !== index);
            // Set first image as primary if primary was removed
            if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
                newImages[0].isPrimary = true;
            }
            return { ...prev, images: newImages };
        });
    };

    // Set image as primary
    const setImagePrimary = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.map((img, i) => ({ ...img, isPrimary: i === index }))
        }));
    };

    // Open add modal
    const handleAdd = () => {
        setEditingProduct(null);
        setFormData(initialFormData);
        setActiveFormTab('general');
        setShowModal(true);
    };

    // Open edit modal
    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title || '',
            description: product.description || '',
            price: product.price || '',
            stock: product.stock || 0,
            lowStockThreshold: product.lowStockThreshold || 10,
            category: product.category?._id || product.category || '',
            vendorId: product.vendorId?._id || product.vendorId || '',
            status: product.status || 'draft',
            isPublished: product.isPublished || false,
            featured: product.featured || false,
            images: product.images || [],
            tags: product.tags || [],
            specifications: product.specifications || [],
            badges: product.badges || [],
            discount: product.discount || { percentage: 0, startDate: '', endDate: '' },
            shipping: product.shipping || { weight: '', freeShipping: false, processingTime: 2, dimensions: { length: '', width: '', height: '' } },
            seo: product.seo || { metaTitle: '', metaDescription: '', slug: '' },
            attributes: product.attributes || {}
        });
        setActiveFormTab('general');
        setShowModal(true);
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.vendorId) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            setFormLoading(true);

            if (editingProduct) {
                await adminService.updateProduct(editingProduct._id, formData);
                toast.success('Produit modifié avec succès');
            } else {
                await adminService.createProduct(formData);
                toast.success('Produit créé avec succès');
            }

            setShowModal(false);
            fetchProducts();
        } catch (error) {
            toast.error(error.message || 'Erreur lors de l\'enregistrement');
        } finally {
            setFormLoading(false);
        }
    };

    // Delete product
    const handleDelete = async () => {
        if (!deleteModal.product) return;

        try {
            await adminService.deleteProduct(deleteModal.product._id);
            toast.success('Produit supprimé avec succès');
            setDeleteModal({ show: false, product: null });
            fetchProducts();
        } catch (error) {
            toast.error(error.message || 'Erreur lors de la suppression');
        }
    };

    // View product details
    const handleViewDetails = async (product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
        setActiveDetailTab('info');
        setLoadingDetails(true);

        try {
            const reviewsResponse = await productService.getProductReviews(product._id, 1, 20);
            if (reviewsResponse.success) {
                setProductReviews(reviewsResponse.data || []);
                setReviewStats(reviewsResponse.stats || {});
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoadingDetails(false);
        }
    };

    // Render stars
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            i < rating
                ? <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
                : <StarIcon key={i} className="w-4 h-4 text-neutral-300" />
        ));
    };

    // Clear filters
    const clearFilters = () => {
        setSearchQuery('');
        setBarcodeQuery('');
        setFilterStatus('');
        setFilterCategory('');
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    // Status badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Actif' },
            draft: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Brouillon' },
            inactive: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Inactif' },
            out_of_stock: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rupture' },
            discontinued: { bg: 'bg-neutral-100', text: 'text-neutral-700', label: 'Arrêté' }
        };
        const config = statusConfig[status] || statusConfig.draft;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const availableBadges = ['nouveau', 'populaire', 'promo', 'épuisé', 'top-ventes'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Gestion des Produits</h1>
                    <p className="text-neutral-500">{stats.total} produits au total</p>
                </div>
                <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all">
                    <PlusIcon className="w-5 h-5" />
                    Ajouter un Produit
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div><p className="text-sm text-neutral-500">Total</p><p className="text-2xl font-bold text-neutral-800">{stats.total}</p></div>
                        <div className="p-3 bg-blue-100 rounded-xl"><CubeIcon className="w-6 h-6 text-blue-600" /></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div><p className="text-sm text-neutral-500">Actifs</p><p className="text-2xl font-bold text-green-600">{stats.active}</p></div>
                        <div className="p-3 bg-green-100 rounded-xl"><CheckCircleIcon className="w-6 h-6 text-green-600" /></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div><p className="text-sm text-neutral-500">Brouillons</p><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p></div>
                        <div className="p-3 bg-yellow-100 rounded-xl"><ArrowPathIcon className="w-6 h-6 text-yellow-600" /></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div><p className="text-sm text-neutral-500">Rupture</p><p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p></div>
                        <div className="p-3 bg-red-100 rounded-xl"><ExclamationTriangleIcon className="w-6 h-6 text-red-600" /></div>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input type="text" placeholder="Rechercher par nom..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                    </div>
                    <div className="flex-1 relative">
                        <CubeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input type="text" placeholder="Rechercher par code barre..." value={barcodeQuery} onChange={(e) => setBarcodeQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${showFilters ? 'border-red-500 text-red-600 bg-red-50' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
                        <FunnelIcon className="w-5 h-5" />Filtres
                    </button>
                    <button onClick={() => fetchProducts()} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                        <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-neutral-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Catégorie</label>
                            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500">
                                <option value="">Toutes les catégories</option>
                                {categories.map(cat => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Statut</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500">
                                <option value="">Tous les statuts</option>
                                <option value="active">Actif</option>
                                <option value="draft">Brouillon</option>
                                <option value="inactive">Inactif</option>
                                <option value="out_of_stock">Rupture de stock</option>
                                <option value="discontinued">Arrêté</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-red-600">
                                <XMarkIcon className="w-5 h-5" />Réinitialiser
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <CubeIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                        <p className="text-neutral-500">Aucun produit trouvé</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Produit</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Catégorie</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Prix</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Stock</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Vendeur</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Statut</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-neutral-50 transition-colors cursor-pointer" onClick={() => handleViewDetails(product)}>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                                                    {product.images?.[0]?.url ? (
                                                        <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><PhotoIcon className="w-6 h-6 text-neutral-400" /></div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-neutral-800 truncate max-w-[200px]">{product.title}</p>
                                                    <p className="text-xs text-neutral-400">ID: {product._id?.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-neutral-600">{product.category?.name || 'Non définie'}</td>
                                        <td className="px-4 py-4">
                                            <span className="font-semibold text-neutral-800">{product.price?.toFixed(2)} TND</span>
                                            {product.discount?.percentage > 0 && (
                                                <span className="block text-xs text-green-600">-{product.discount.percentage}%</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-neutral-600">{product.vendorId?.storeName || 'N/A'}</td>
                                        <td className="px-4 py-4">{getStatusBadge(product.status)}</td>
                                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => handleViewDetails(product)} className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors" title="Voir détails">
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setDeleteModal({ show: true, product })} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                                                    <TrashIcon className="w-4 h-4" />
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
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
                        <p className="text-sm text-neutral-500">Page {pagination.currentPage} sur {pagination.totalPages} ({pagination.total} produits)</p>
                        <div className="flex gap-2">
                            <button onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))} disabled={pagination.currentPage === 1} className="p-2 rounded-lg border border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50">
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))} disabled={pagination.currentPage === pagination.totalPages} className="p-2 rounded-lg border border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50">
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal - Multi-tab form */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">{editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-lg text-white"><XMarkIcon className="w-5 h-5" /></button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-neutral-100 bg-neutral-50">
                            {[
                                { id: 'general', label: 'Général', icon: CubeIcon },
                                { id: 'images', label: 'Images', icon: PhotoIcon },
                                { id: 'pricing', label: 'Prix & Stock', icon: TagIcon },
                                { id: 'shipping', label: 'Livraison', icon: TruckIcon },
                                { id: 'seo', label: 'SEO', icon: MagnifyingGlassIcon }
                            ].map(tab => (
                                <button key={tab.id} onClick={() => setActiveFormTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeFormTab === tab.id ? 'text-red-600 border-b-2 border-red-600 bg-white' : 'text-neutral-500 hover:text-neutral-700'}`}>
                                    <tab.icon className="w-4 h-4" />{tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Form Content */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                            {/* General Tab */}
                            {activeFormTab === 'general' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Titre du produit <span className="text-red-500">*</span></label>
                                            <input type="text" name="title" value={formData.title} onChange={handleFormChange} required className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500" placeholder="Ex: iPhone 15 Pro Max 256GB" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Catégorie <span className="text-red-500">*</span></label>
                                            <select name="category" value={formData.category} onChange={handleFormChange} required className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500">
                                                <option value="">Sélectionner...</option>
                                                {categories.map(cat => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Vendeur <span className="text-red-500">*</span></label>
                                            <select name="vendorId" value={formData.vendorId} onChange={handleFormChange} required className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500">
                                                <option value="">Sélectionner...</option>
                                                {vendors.map(vendor => (<option key={vendor._id} value={vendor._id}>{vendor.storeName || vendor.companyInfo?.companyName}</option>))}
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Description <span className="text-red-500">*</span></label>
                                            <textarea name="description" value={formData.description} onChange={handleFormChange} required rows={4} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500" placeholder="Description détaillée du produit..." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Statut</label>
                                            <select name="status" value={formData.status} onChange={handleFormChange} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500">
                                                <option value="draft">Brouillon</option>
                                                <option value="active">Actif</option>
                                                <option value="inactive">Inactif</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-4 pt-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleFormChange} className="w-4 h-4 text-red-600 rounded" />
                                                <span className="text-sm text-neutral-700">Publié</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleFormChange} className="w-4 h-4 text-red-600 rounded" />
                                                <span className="text-sm text-neutral-700">En vedette</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Tags</label>
                                        <div className="flex gap-2 mb-2">
                                            <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500" placeholder="Ajouter un tag..." />
                                            <button type="button" onClick={addTag} className="px-4 py-2 bg-neutral-100 rounded-xl hover:bg-neutral-200">+</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.map((tag, index) => (
                                                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                                    {tag}<button type="button" onClick={() => removeTag(tag)} className="hover:text-red-900">×</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Badges</label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableBadges.map(badge => (
                                                <button key={badge} type="button" onClick={() => toggleBadge(badge)} className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${formData.badges.includes(badge) ? 'bg-red-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                                                    {badge}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Images Tab */}
                            {activeFormTab === 'images' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Ajouter une image par URL</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                value={imageUrlInput}
                                                onChange={(e) => setImageUrlInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                                                className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500"
                                                placeholder="https://exemple.com/image.jpg"
                                            />
                                            <button type="button" onClick={addImageUrl} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
                                                Ajouter
                                            </button>
                                        </div>
                                    </div>

                                    {formData.images.length === 0 ? (
                                        <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center">
                                            <PhotoIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                                            <p className="text-neutral-500">Aucune image ajoutée</p>
                                            <p className="text-sm text-neutral-400">Ajoutez des URLs d'images ci-dessus</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {formData.images.map((image, index) => (
                                                <div key={index} className={`relative group rounded-xl overflow-hidden border-2 ${image.isPrimary ? 'border-red-500' : 'border-neutral-200'}`}>
                                                    <img
                                                        src={image.url}
                                                        alt={image.alt || `Image ${index + 1}`}
                                                        className="w-full h-32 object-cover"
                                                        onError={(e) => { e.target.src = 'https://placehold.co/300x200/e2e8f0/475569?text=Image+Error'; }}
                                                    />
                                                    {image.isPrimary && (
                                                        <span className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full">Principal</span>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        {!image.isPrimary && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setImagePrimary(index)}
                                                                className="p-2 bg-white rounded-lg text-neutral-700 hover:bg-neutral-100"
                                                                title="Définir comme principal"
                                                            >
                                                                <CheckCircleIcon className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="p-2 bg-red-600 rounded-lg text-white hover:bg-red-700"
                                                            title="Supprimer"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-sm text-neutral-500">
                                        <strong>Conseil:</strong> Utilisez des URLs d'images hébergées sur un service comme Imgur, Cloudinary, ou votre propre serveur.
                                    </p>
                                </div>
                            )}

                            {/* Pricing Tab */}
                            {activeFormTab === 'pricing' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Prix (TND) <span className="text-red-500">*</span></label>
                                            <input type="number" name="price" value={formData.price} onChange={handleFormChange} required min="0" step="0.01" className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Stock <span className="text-red-500">*</span></label>
                                            <input type="number" name="stock" value={formData.stock} onChange={handleFormChange} required min="0" className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Seuil de stock bas</label>
                                            <input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleFormChange} min="0" className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500" />
                                        </div>
                                    </div>

                                    {/* Discount */}
                                    <div className="p-4 bg-neutral-50 rounded-xl">
                                        <h3 className="font-medium text-neutral-800 mb-3">Remise</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm text-neutral-600 mb-1">Pourcentage (%)</label>
                                                <input type="number" name="discount.percentage" value={formData.discount.percentage} onChange={handleFormChange} min="0" max="100" className="w-full px-3 py-2 border border-neutral-200 rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-neutral-600 mb-1">Date début</label>
                                                <input type="date" name="discount.startDate" value={formData.discount.startDate?.split('T')[0] || ''} onChange={handleFormChange} className="w-full px-3 py-2 border border-neutral-200 rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-neutral-600 mb-1">Date fin</label>
                                                <input type="date" name="discount.endDate" value={formData.discount.endDate?.split('T')[0] || ''} onChange={handleFormChange} className="w-full px-3 py-2 border border-neutral-200 rounded-lg" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Specifications */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Spécifications techniques</label>
                                        <div className="flex gap-2 mb-2">
                                            <input type="text" value={specKey} onChange={(e) => setSpecKey(e.target.value)} className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg" placeholder="Nom (ex: Poids)" />
                                            <input type="text" value={specValue} onChange={(e) => setSpecValue(e.target.value)} className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg" placeholder="Valeur (ex: 500g)" />
                                            <button type="button" onClick={addSpecification} className="px-4 py-2 bg-neutral-100 rounded-lg hover:bg-neutral-200">+</button>
                                        </div>
                                        {formData.specifications.length > 0 && (
                                            <div className="border border-neutral-200 rounded-lg overflow-hidden">
                                                {formData.specifications.map((spec, index) => (
                                                    <div key={index} className="flex items-center justify-between px-3 py-2 bg-neutral-50 border-b last:border-b-0">
                                                        <span><strong>{spec.key}:</strong> {spec.value}</span>
                                                        <button type="button" onClick={() => removeSpecification(index)} className="text-red-500 hover:text-red-700">×</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Shipping Tab */}
                            {activeFormTab === 'shipping' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Poids (kg)</label>
                                            <input type="number" name="shipping.weight" value={formData.shipping.weight} onChange={handleFormChange} min="0" step="0.1" className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Temps de traitement (jours)</label>
                                            <input type="number" name="shipping.processingTime" value={formData.shipping.processingTime} onChange={handleFormChange} min="0" className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Dimensions (cm)</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs text-neutral-500 mb-1">Longueur</label>
                                                <input type="number" name="shipping.dimensions.length" value={formData.shipping.dimensions.length} onChange={handleFormChange} min="0" step="0.1" className="w-full px-3 py-2 border border-neutral-200 rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-neutral-500 mb-1">Largeur</label>
                                                <input type="number" name="shipping.dimensions.width" value={formData.shipping.dimensions.width} onChange={handleFormChange} min="0" step="0.1" className="w-full px-3 py-2 border border-neutral-200 rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-neutral-500 mb-1">Hauteur</label>
                                                <input type="number" name="shipping.dimensions.height" value={formData.shipping.dimensions.height} onChange={handleFormChange} min="0" step="0.1" className="w-full px-3 py-2 border border-neutral-200 rounded-lg" />
                                            </div>
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="shipping.freeShipping" checked={formData.shipping.freeShipping} onChange={handleFormChange} className="w-4 h-4 text-red-600 rounded" />
                                        <span className="text-sm text-neutral-700">Livraison gratuite</span>
                                    </label>
                                </div>
                            )}

                            {/* SEO Tab */}
                            {activeFormTab === 'seo' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Titre SEO</label>
                                        <input type="text" name="seo.metaTitle" value={formData.seo.metaTitle} onChange={handleFormChange} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500" placeholder="Titre pour les moteurs de recherche" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Meta Description</label>
                                        <textarea name="seo.metaDescription" value={formData.seo.metaDescription} onChange={handleFormChange} rows={3} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500" placeholder="Description pour les résultats de recherche (max 160 caractères)" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Slug URL</label>
                                        <input type="text" name="seo.slug" value={formData.seo.slug} onChange={handleFormChange} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500" placeholder="mon-produit-url (généré automatiquement si vide)" />
                                    </div>
                                </div>
                            )}
                        </form>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex gap-3">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-100">Annuler</button>
                            <button type="submit" onClick={handleSubmit} disabled={formLoading} className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50">
                                {formLoading ? 'Enregistrement...' : editingProduct ? 'Modifier' : 'Créer le produit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Details Modal */}
            {showDetailsModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Détails du Produit</h2>
                            <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-white/20 rounded-lg text-white"><XMarkIcon className="w-5 h-5" /></button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-neutral-100 bg-neutral-50">
                            <button
                                onClick={() => setActiveDetailTab('info')}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${activeDetailTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-neutral-500 hover:text-neutral-700'}`}
                            >
                                <CubeIcon className="w-4 h-4" />
                                Informations
                            </button>
                            <button
                                onClick={() => setActiveDetailTab('reviews')}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${activeDetailTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-neutral-500 hover:text-neutral-700'}`}
                            >
                                <StarIcon className="w-4 h-4" />
                                Avis ({productReviews.length})
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {activeDetailTab === 'info' ? (
                                <div className="space-y-6">
                                    {/* Product Header */}
                                    <div className="flex gap-6">
                                        {/* Images */}
                                        <div className="w-48 flex-shrink-0">
                                            {selectedProduct.images?.[0]?.url ? (
                                                <img src={selectedProduct.images[0].url} alt={selectedProduct.title} className="w-full h-48 object-cover rounded-xl border" />
                                            ) : (
                                                <div className="w-full h-48 bg-neutral-100 rounded-xl flex items-center justify-center">
                                                    <PhotoIcon className="w-12 h-12 text-neutral-400" />
                                                </div>
                                            )}
                                            {selectedProduct.images?.length > 1 && (
                                                <div className="flex gap-2 mt-2">
                                                    {selectedProduct.images.slice(1, 4).map((img, idx) => (
                                                        <img key={idx} src={img.url} alt="" className="w-12 h-12 object-cover rounded-lg border" />
                                                    ))}
                                                    {selectedProduct.images.length > 4 && (
                                                        <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center text-sm text-neutral-500">
                                                            +{selectedProduct.images.length - 4}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Basic Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-xl font-bold text-neutral-800">{selectedProduct.title}</h3>
                                                {getStatusBadge(selectedProduct.status)}
                                            </div>
                                            <p className="text-sm text-neutral-500 mb-4">{selectedProduct.description}</p>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-neutral-50 rounded-xl p-3">
                                                    <p className="text-xs text-neutral-500">Prix</p>
                                                    <p className="text-lg font-bold text-neutral-800">{selectedProduct.price?.toFixed(2)} TND</p>
                                                    {selectedProduct.discount?.percentage > 0 && (
                                                        <span className="text-xs text-green-600">-{selectedProduct.discount.percentage}% remise</span>
                                                    )}
                                                </div>
                                                <div className="bg-neutral-50 rounded-xl p-3">
                                                    <p className="text-xs text-neutral-500">Stock</p>
                                                    <p className={`text-lg font-bold ${selectedProduct.stock === 0 ? 'text-red-600' : selectedProduct.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                                                        {selectedProduct.stock} unités
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Details */}
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="bg-neutral-50 rounded-xl p-4">
                                            <p className="text-xs text-neutral-500 mb-1">Catégorie</p>
                                            <p className="font-medium text-neutral-800">{selectedProduct.category?.name || 'Non définie'}</p>
                                        </div>
                                        <div className="bg-neutral-50 rounded-xl p-4">
                                            <p className="text-xs text-neutral-500 mb-1">Vendeur</p>
                                            <p className="font-medium text-neutral-800">{selectedProduct.vendorId?.storeName || 'N/A'}</p>
                                        </div>
                                        <div className="bg-neutral-50 rounded-xl p-4">
                                            <p className="text-xs text-neutral-500 mb-1">Code Barre</p>
                                            <p className="font-medium text-neutral-800">{selectedProduct.barcode || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {selectedProduct.tags?.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-neutral-700 mb-2">Tags</p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProduct.tags.map((tag, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Specifications */}
                                    {selectedProduct.specifications?.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-neutral-700 mb-2">Spécifications</p>
                                            <div className="border rounded-xl overflow-hidden">
                                                {selectedProduct.specifications.map((spec, idx) => (
                                                    <div key={idx} className={`flex justify-between px-4 py-2 ${idx % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}`}>
                                                        <span className="text-neutral-600">{spec.key}</span>
                                                        <span className="font-medium text-neutral-800">{spec.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Reviews Tab */
                                <div className="space-y-6">
                                    {/* Reviews Summary */}
                                    {reviewStats && (
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                                            <div className="flex items-center gap-8">
                                                <div className="text-center">
                                                    <p className="text-4xl font-bold text-neutral-800">{reviewStats.averageRating?.toFixed(1) || '0.0'}</p>
                                                    <div className="flex justify-center my-2">{renderStars(Math.round(reviewStats.averageRating || 0))}</div>
                                                    <p className="text-sm text-neutral-500">{reviewStats.totalReviews || 0} avis</p>
                                                </div>
                                                <div className="flex-1">
                                                    {[5, 4, 3, 2, 1].map(star => (
                                                        <div key={star} className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm text-neutral-600 w-3">{star}</span>
                                                            <StarIconSolid className="w-4 h-4 text-yellow-400" />
                                                            <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-yellow-400 rounded-full"
                                                                    style={{ width: `${reviewStats.ratingDistribution?.[star] ? (reviewStats.ratingDistribution[star] / (reviewStats.totalReviews || 1)) * 100 : 0}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-sm text-neutral-500 w-8">{reviewStats.ratingDistribution?.[star] || 0}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Reviews List */}
                                    {loadingDetails ? (
                                        <div className="flex items-center justify-center py-10">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                                        </div>
                                    ) : productReviews.length === 0 ? (
                                        <div className="text-center py-10">
                                            <StarIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                                            <p className="text-neutral-500">Aucun avis pour ce produit</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {productReviews.map((review) => (
                                                <div key={review._id} className="bg-white border border-neutral-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                                                                {review.userId?.firstName?.[0] || review.userId?.email?.[0] || 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-neutral-800">
                                                                    {review.userId?.firstName} {review.userId?.lastName || review.userId?.email || 'Utilisateur'}
                                                                </p>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex">{renderStars(review.rating)}</div>
                                                                    {review.verifiedPurchase && (
                                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Achat vérifié</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-neutral-400">
                                                            {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                    {review.title && (
                                                        <h4 className="font-medium text-neutral-800 mb-1">{review.title}</h4>
                                                    )}
                                                    <p className="text-neutral-600 text-sm">{review.comment}</p>

                                                    {/* Review Images */}
                                                    {review.images?.length > 0 && (
                                                        <div className="flex gap-2 mt-3">
                                                            {review.images.map((img, idx) => (
                                                                <img key={idx} src={img} alt="" className="w-16 h-16 object-cover rounded-lg" />
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Vendor Response */}
                                                    {review.vendorResponse?.comment && (
                                                        <div className="mt-3 bg-neutral-50 rounded-lg p-3 border-l-4 border-blue-500">
                                                            <p className="text-xs text-neutral-500 mb-1">Réponse du vendeur</p>
                                                            <p className="text-sm text-neutral-700">{review.vendorResponse.comment}</p>
                                                        </div>
                                                    )}

                                                    {/* Review Stats */}
                                                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-neutral-100">
                                                        <span className="text-xs text-neutral-500">
                                                            {review.helpfulCount || 0} personne(s) ont trouvé cet avis utile
                                                        </span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${review.status === 'approved' ? 'bg-green-100 text-green-700' : review.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {review.status === 'approved' ? 'Approuvé' : review.status === 'rejected' ? 'Rejeté' : 'En attente'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-between">
                            <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-100">
                                Fermer
                            </button>
                            <button onClick={() => { setShowDetailsModal(false); handleEdit(selectedProduct); }} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                                Modifier ce produit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><TrashIcon className="w-8 h-8 text-red-600" /></div>
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">Confirmer la suppression</h3>
                            <p className="text-neutral-500 mb-6">Êtes-vous sûr de vouloir supprimer <strong>{deleteModal.product?.title}</strong> ?</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteModal({ show: false, product: null })} className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50">Annuler</button>
                                <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">Supprimer</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductManagement;
