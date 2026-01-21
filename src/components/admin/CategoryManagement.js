import React, { useState, useEffect, useCallback } from 'react';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    FolderIcon,
    FolderOpenIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    TagIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    ListBulletIcon,
    Squares2X2Icon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const CategoryManagement = () => {
    // State
    const [categories, setCategories] = useState([]);
    const [tree, setTree] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, rootCategories: 0 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'list'
    const [expandedNodes, setExpandedNodes] = useState(new Set());

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parentId: '',
        attributes: [],
        image: '',
        icon: '',
        isActive: true,
        displayOrder: 0
    });
    const [newAttribute, setNewAttribute] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllAdminCategories({ search: searchQuery });

            if (response.success) {
                setCategories(response.data.categories || []);
                setTree(response.data.tree || []);
                setStats(response.data.stats || { total: 0, active: 0, inactive: 0, rootCategories: 0 });
            }
        } catch (error) {
            toast.error('Erreur lors du chargement des catégories');
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Toggle node expansion
    const toggleExpand = (categoryId) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    // Expand all nodes
    const expandAll = () => {
        const allIds = new Set(categories.map(cat => cat._id));
        setExpandedNodes(allIds);
    };

    // Collapse all nodes
    const collapseAll = () => {
        setExpandedNodes(new Set());
    };

    // Open add modal
    const handleAdd = (parentId = null) => {
        setEditingCategory(null);
        setFormData({
            name: '',
            description: '',
            parentId: parentId || '',
            attributes: [],
            image: '',
            icon: '',
            isActive: true,
            displayOrder: 0
        });
        setFormErrors({});
        setShowModal(true);
    };

    // Open edit modal
    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name || '',
            description: category.description || '',
            parentId: category.parentId?._id || category.parentId || '',
            attributes: category.attributes || [],
            image: category.image || '',
            icon: category.icon || '',
            isActive: category.isActive !== false,
            displayOrder: category.displayOrder || 0
        });
        setFormErrors({});
        setShowModal(true);
    };

    // Handle form change
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Add attribute
    const addAttribute = () => {
        if (newAttribute.trim() && !formData.attributes.includes(newAttribute.trim())) {
            setFormData(prev => ({
                ...prev,
                attributes: [...prev.attributes, newAttribute.trim()]
            }));
            setNewAttribute('');
        }
    };

    // Remove attribute
    const removeAttribute = (attr) => {
        setFormData(prev => ({
            ...prev,
            attributes: prev.attributes.filter(a => a !== attr)
        }));
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) {
            errors.name = 'Le nom est requis';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setSubmitting(true);

            const dataToSend = {
                ...formData,
                parentId: formData.parentId || null,
                displayOrder: parseInt(formData.displayOrder) || 0
            };

            if (editingCategory) {
                await adminService.updateCategory(editingCategory._id, dataToSend);
                toast.success('Catégorie mise à jour avec succès');
            } else {
                await adminService.createCategory(dataToSend);
                toast.success('Catégorie créée avec succès');
            }

            setShowModal(false);
            fetchCategories();
        } catch (error) {
            toast.error(error.message || 'Erreur lors de l\'enregistrement');
        } finally {
            setSubmitting(false);
        }
    };

    // Open delete modal
    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    // Delete category
    const handleDelete = async (deleteChildren = false) => {
        if (!categoryToDelete) return;

        try {
            await adminService.deleteCategory(categoryToDelete._id, {
                deleteChildren: deleteChildren ? 'true' : undefined
            });
            toast.success('Catégorie supprimée avec succès');
            setShowDeleteModal(false);
            setCategoryToDelete(null);
            fetchCategories();
        } catch (error) {
            toast.error(error.message || 'Erreur lors de la suppression');
        }
    };

    // Render tree node
    const renderTreeNode = (node, level = 0) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.has(node._id);

        return (
            <div key={node._id} className="select-none">
                <div
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-neutral-50 group cursor-pointer ${level > 0 ? 'ml-6' : ''}`}
                    style={{ paddingLeft: `${level * 20 + 12}px` }}
                >
                    {/* Expand/Collapse button */}
                    <button
                        onClick={() => toggleExpand(node._id)}
                        className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all ${hasChildren ? 'hover:bg-neutral-200 text-neutral-600' : 'invisible'}`}
                    >
                        {isExpanded ? (
                            <ChevronDownIcon className="w-4 h-4" />
                        ) : (
                            <ChevronRightIcon className="w-4 h-4" />
                        )}
                    </button>

                    {/* Folder icon */}
                    {isExpanded && hasChildren ? (
                        <FolderOpenIcon className="w-5 h-5 text-amber-500" />
                    ) : (
                        <FolderIcon className={`w-5 h-5 ${hasChildren ? 'text-amber-500' : 'text-neutral-400'}`} />
                    )}

                    {/* Category name and info */}
                    <div className="flex-1 flex items-center gap-3">
                        <span className="font-medium text-neutral-800">{node.name}</span>
                        {node.slug && (
                            <span className="text-xs text-neutral-400 hidden sm:inline">/{node.slug}</span>
                        )}
                        <span className={`px-2 py-0.5 text-xs rounded-full ${node.isActive ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
                            {node.isActive ? 'Actif' : 'Inactif'}
                        </span>
                        {node.attributes?.length > 0 && (
                            <span className="text-xs text-neutral-500 hidden md:inline">
                                {node.attributes.length} attribut(s)
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleAdd(node._id); }}
                            className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-600 transition-all"
                            title="Ajouter une sous-catégorie"
                        >
                            <PlusIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(node); }}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-all"
                            title="Modifier"
                        >
                            <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(node); }}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-all"
                            title="Supprimer"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Children */}
                {hasChildren && isExpanded && (
                    <div className="border-l-2 border-neutral-100 ml-6">
                        {node.children.map(child => renderTreeNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    // Get parent category options (excluding current category and its descendants)
    const getParentOptions = () => {
        const excludeIds = new Set();

        if (editingCategory) {
            excludeIds.add(editingCategory._id);
            // Recursively get all descendant IDs
            const getDescendantIds = (parentId) => {
                categories
                    .filter(cat => cat.parentId?._id === parentId || cat.parentId === parentId)
                    .forEach(cat => {
                        excludeIds.add(cat._id);
                        getDescendantIds(cat._id);
                    });
            };
            getDescendantIds(editingCategory._id);
        }

        return categories.filter(cat => !excludeIds.has(cat._id));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-3">
                        <TagIcon className="w-8 h-8 text-primary-600" />
                        Gestion des Catégories
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        Gérez la hiérarchie et les attributs de vos catégories
                    </p>
                </div>
                <button
                    onClick={() => handleAdd()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 hover:scale-105"
                >
                    <PlusIcon className="w-5 h-5" />
                    Nouvelle Catégorie
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-neutral-100">
                    <p className="text-sm text-neutral-500">Total</p>
                    <p className="text-2xl font-bold text-neutral-800">{stats.total}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-neutral-100">
                    <p className="text-sm text-neutral-500">Actives</p>
                    <p className="text-2xl font-bold text-success-600">{stats.active}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-neutral-100">
                    <p className="text-sm text-neutral-500">Inactives</p>
                    <p className="text-2xl font-bold text-neutral-400">{stats.inactive}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-neutral-100">
                    <p className="text-sm text-neutral-500">Racines</p>
                    <p className="text-2xl font-bold text-primary-600">{stats.rootCategories}</p>
                </div>
            </div>

            {/* Search and View Toggle */}
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une catégorie..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* View Toggle & Expand/Collapse */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={expandAll}
                            className="px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all"
                        >
                            Tout développer
                        </button>
                        <button
                            onClick={collapseAll}
                            className="px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all"
                        >
                            Tout réduire
                        </button>
                        <div className="h-6 w-px bg-neutral-200" />
                        <button
                            onClick={() => setViewMode('tree')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'tree' ? 'bg-primary-100 text-primary-600' : 'text-neutral-400 hover:bg-neutral-100'}`}
                        >
                            <Squares2X2Icon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-neutral-400 hover:bg-neutral-100'}`}
                        >
                            <ListBulletIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={fetchCategories}
                            className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 transition-all"
                            title="Rafraîchir"
                        >
                            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Categories Tree/List */}
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-4 min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    </div>
                ) : tree.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <FolderIcon className="w-16 h-16 text-neutral-300 mb-4" />
                        <h3 className="text-lg font-semibold text-neutral-600 mb-2">Aucune catégorie</h3>
                        <p className="text-neutral-400 mb-4">Commencez par créer votre première catégorie</p>
                        <button
                            onClick={() => handleAdd()}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-xl font-medium hover:bg-primary-200 transition-all"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Ajouter une catégorie
                        </button>
                    </div>
                ) : viewMode === 'tree' ? (
                    <div className="space-y-1">
                        {tree.map(node => renderTreeNode(node))}
                    </div>
                ) : (
                    /* List View */
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-neutral-500 border-b border-neutral-100">
                                    <th className="pb-3 font-medium">Nom</th>
                                    <th className="pb-3 font-medium">Parent</th>
                                    <th className="pb-3 font-medium">Attributs</th>
                                    <th className="pb-3 font-medium">Ordre</th>
                                    <th className="pb-3 font-medium">Statut</th>
                                    <th className="pb-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {categories.map(cat => (
                                    <tr key={cat._id} className="group hover:bg-neutral-50 transition-colors">
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <FolderIcon className="w-5 h-5 text-amber-500" />
                                                <span className="font-medium text-neutral-800">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-neutral-500">
                                            {cat.parentId?.name || '—'}
                                        </td>
                                        <td className="py-3">
                                            <span className="text-sm text-neutral-500">
                                                {cat.attributes?.length || 0}
                                            </span>
                                        </td>
                                        <td className="py-3 text-neutral-500">{cat.displayOrder}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 text-xs rounded-full ${cat.isActive ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
                                                {cat.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleAdd(cat._id)}
                                                    className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-600 opacity-0 group-hover:opacity-100 transition-all"
                                                    title="Ajouter une sous-catégorie"
                                                >
                                                    <PlusIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(cat)}
                                                    className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                                                >
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
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                            <h2 className="text-xl font-bold text-neutral-800">
                                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-xl hover:bg-neutral-100 transition-all"
                            >
                                <XMarkIcon className="w-5 h-5 text-neutral-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
                            <div className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Nom <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        className={`w-full px-4 py-3 bg-neutral-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${formErrors.name ? 'border-red-300' : 'border-neutral-200'}`}
                                        placeholder="Nom de la catégorie"
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Description de la catégorie"
                                    />
                                </div>

                                {/* Parent Category */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Catégorie parente
                                    </label>
                                    <select
                                        name="parentId"
                                        value={formData.parentId}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="">— Catégorie principale —</option>
                                        {getParentOptions().map(cat => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.parentId?.name ? `${cat.parentId.name} > ` : ''}{cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Display Order and Status */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Ordre d'affichage
                                        </label>
                                        <input
                                            type="number"
                                            name="displayOrder"
                                            value={formData.displayOrder}
                                            onChange={handleFormChange}
                                            min="0"
                                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center pt-7">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleFormChange}
                                                className="w-5 h-5 rounded-lg border-neutral-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="font-medium text-neutral-700">Catégorie active</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Image URL */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        URL de l'image
                                    </label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        placeholder="https://..."
                                    />
                                </div>

                                {/* Icon */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Icône (nom ou emoji)
                                    </label>
                                    <input
                                        type="text"
                                        name="icon"
                                        value={formData.icon}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        placeholder="📱 ou icon-name"
                                    />
                                </div>

                                {/* Attributes */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Attributs de la catégorie
                                    </label>
                                    <p className="text-xs text-neutral-500 mb-3">
                                        Les attributs définissent les caractéristiques spécifiques des produits dans cette catégorie
                                    </p>

                                    {/* Existing attributes */}
                                    {formData.attributes.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {formData.attributes.map((attr, idx) => (
                                                <span
                                                    key={idx}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm"
                                                >
                                                    {attr}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttribute(attr)}
                                                        className="p-0.5 hover:bg-primary-200 rounded transition-colors"
                                                    >
                                                        <XMarkIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add new attribute */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newAttribute}
                                            onChange={(e) => setNewAttribute(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttribute())}
                                            className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Ex: Couleur, Taille, Matière..."
                                        />
                                        <button
                                            type="button"
                                            onClick={addAttribute}
                                            className="px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200 transition-all"
                                        >
                                            Ajouter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-100 bg-neutral-50">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2.5 text-neutral-600 font-medium rounded-xl hover:bg-neutral-200 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircleIcon className="w-5 h-5" />
                                        {editingCategory ? 'Mettre à jour' : 'Créer'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && categoryToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">
                                Supprimer la catégorie ?
                            </h3>
                            <p className="text-neutral-500 mb-6">
                                Êtes-vous sûr de vouloir supprimer <strong>"{categoryToDelete.name}"</strong> ?
                                Cette action est irréversible.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleDelete(false)}
                                    className="w-full px-5 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
                                >
                                    Supprimer uniquement cette catégorie
                                </button>
                                <button
                                    onClick={() => handleDelete(true)}
                                    className="w-full px-5 py-3 bg-red-100 text-red-700 font-semibold rounded-xl hover:bg-red-200 transition-all"
                                >
                                    Supprimer avec les sous-catégories
                                </button>
                                <button
                                    onClick={() => { setShowDeleteModal(false); setCategoryToDelete(null); }}
                                    className="w-full px-5 py-3 text-neutral-600 font-medium rounded-xl hover:bg-neutral-100 transition-all"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Animation Style */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default CategoryManagement;
