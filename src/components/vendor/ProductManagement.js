import React, { useState, useEffect, useRef } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  StarIcon,
  CubeIcon,
  DocumentArrowDownIcon,
  TableCellsIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import vendorService from '../../services/vendorService';

const CURRENCIES = [
  { code: 'TND', symbol: 'د.ت', name: 'Dinar Tunisien' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'Dollar US' },
  { code: 'CNY', symbol: '¥', name: 'Yuan Chinois' }
];

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    currency: 'TND',
    category: '',
    brand: '',
    stock: '',
    sku: '',
    status: 'active',
    isFeatured: false,
    tags: [],
    specifications: []
  });

  const [productImages, setProductImages] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const fileInputRef = useRef(null);
  const csvFileInputRef = useRef(null);

  const categories = [
    { id: 'electronics', name: 'Électronique' },
    { id: 'fashion', name: 'Mode & Vêtements' },
    { id: 'home', name: 'Maison & Jardin' },
    { id: 'beauty', name: 'Beauté & Santé' },
    { id: 'sports', name: 'Sport & Loisirs' },
    { id: 'auto', name: 'Auto & Moto' },
    { id: 'kids', name: 'Bébé & Enfant' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const timestamp = Date.now();
      const response = await vendorService.getProducts({ _t: timestamp });
      console.log('Vendor products response:', response);

      // Handle different response formats
      let productList = [];
      if (response && response.products) {
        productList = response.products;
      } else if (response && response.data && response.data.products) {
        productList = response.data.products;
      } else if (Array.isArray(response)) {
        productList = response;
      }

      console.log('Setting products:', productList);
      console.log('Products count:', productList.length);

      // Debug toast
      if (productList.length > 0) {
        toast.info(`${productList.length} produits chargés`);
      }

      setProducts(productList);
    } catch (error) {
      console.error('Erreur fetch products:', error);
      toast.error('Erreur lors du chargement des produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} dépasse 10MB`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImages(prev => [...prev, { preview: reader.result, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
    if (primaryImageIndex >= productImages.length - 1) {
      setPrimaryImageIndex(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    try {
      setLoading(true);

      const images = productImages.map((img, index) => ({
        url: img.preview || img.url || 'https://placehold.co/300x300/e2e8f0/475569?text=Produit',
        alt: formData.name,
        isPrimary: index === primaryImageIndex
      }));

      const productData = {
        name: formData.name,
        description: formData.description || formData.name,
        price: parseFloat(formData.price) || 0,
        comparePrice: parseFloat(formData.comparePrice) || 0,
        currency: formData.currency || 'TND',
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        sku: formData.sku || `SKU-${Date.now()}`,
        brand: formData.brand || '',
        status: formData.status || 'active',
        isFeatured: formData.isFeatured || false,
        featured: formData.isFeatured || false,
        images: images.length > 0 ? images : undefined,
        tags: formData.tags || [],
        specifications: formData.specifications || []
      };

      console.log('Sending product data:', productData);

      if (editingProduct) {
        await vendorService.updateProduct(editingProduct._id || editingProduct.id, productData);
        toast.success('Produit mis à jour!');
      } else {
        const result = await vendorService.createProduct(productData);
        console.log('Create product result:', result);
        toast.success('Produit créé!');
      }

      setShowModal(false);
      resetForm();

      // Force refresh after a short delay
      setTimeout(() => {
        fetchProducts();
      }, 500);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;

    setFormData({
      name: product.title || product.name || '',
      description: product.description || '',
      price: product.price || '',
      comparePrice: product.comparePrice || '',
      currency: product.currency || 'TND',
      category: categoryName || '',
      brand: product.brand || '',
      stock: product.stock || 0,
      sku: product.sku || '',
      status: product.status || 'active',
      isFeatured: product.isFeatured || product.featured || false,
      tags: product.tags || [],
      specifications: product.specifications || []
    });

    if (product.images && Array.isArray(product.images)) {
      setProductImages(product.images.map((img, i) => ({
        preview: typeof img === 'object' ? img.url : img,
        url: typeof img === 'object' ? img.url : img,
        name: `Image ${i + 1}`
      })));
    }
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Supprimer ce produit ?')) {
      try {
        await vendorService.deleteProduct(productId);
        toast.success('Produit supprimé!');
        fetchProducts();
      } catch (error) {
        toast.error('Erreur de suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', price: '', comparePrice: '', currency: 'TND',
      category: '', brand: '', stock: '', sku: '', status: 'active',
      isFeatured: false, tags: [], specifications: []
    });
    setProductImages([]);
    setPrimaryImageIndex(0);
    setEditingProduct(null);
  };

  // Import CSV/XLSX
  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setShowImportMenu(false);
    const isXLSX = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    try {
      let importedProducts = [];

      if (isXLSX) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('XLSX data:', jsonData);

        importedProducts = jsonData.map((row, i) => ({
          name: String(row.name || row.Nom || ''),
          description: String(row.description || row.Description || ''),
          price: parseFloat(row.price || row.Prix || 0),
          comparePrice: parseFloat(row.comparePrice || row['Prix comparé'] || 0),
          currency: String(row.currency || row.Devise || 'TND'),
          category: String(row.category || row.Catégorie || ''),
          stock: parseInt(row.stock || row.Stock || 0),
          sku: String(row.sku || row.SKU || `SKU-${Date.now()}-${i}`),
          brand: String(row.brand || row.Marque || ''),
          status: String(row.status || row.Statut || 'active'),
          isFeatured: row.isFeatured === true || row.isFeatured === 'true' || row.Vedette === 'Oui',
          images: row.images || row.Images ? [String(row.images || row.Images)] : []
        })).filter(p => p.name && p.price > 0);
      } else {
        // CSV parsing
        const text = await file.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

        console.log('CSV headers:', headers);

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = [];
          let current = '';
          let inQuotes = false;

          for (const char of lines[i]) {
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim());

          const row = {};
          headers.forEach((h, idx) => {
            row[h] = values[idx] || '';
          });

          if (row.name && row.price) {
            importedProducts.push({
              name: String(row.name || ''),
              description: String(row.description || ''),
              price: parseFloat(row.price) || 0,
              comparePrice: parseFloat(row.comparePrice) || 0,
              currency: String(row.currency || 'TND'),
              category: String(row.category || ''),
              stock: parseInt(row.stock) || 0,
              sku: String(row.sku || `SKU-${Date.now()}-${i}`),
              brand: String(row.brand || ''),
              status: String(row.status || 'active'),
              isFeatured: row.isFeatured === 'true',
              images: row.images ? [String(row.images)] : []
            });
          }
        }
      }

      console.log('Products to import:', importedProducts);

      if (importedProducts.length > 0) {
        toast.info(`Import de ${importedProducts.length} produits...`);
        const result = await vendorService.bulkImportProducts(importedProducts);
        console.log('Import result:', result);
        toast.success(`${result.imported || importedProducts.length} produits importés!`);

        if (result.failed > 0) {
          toast.warning(`${result.failed} produits échoués`);
          console.log('Import errors:', result.errors);
        }

        setTimeout(() => fetchProducts(), 500);
      } else {
        toast.warning('Aucun produit valide trouvé');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Erreur d\'import: ' + error.message);
    }

    e.target.value = '';
  };

  // Download templates
  const downloadTemplateXLSX = () => {
    const templateData = [
      ['name', 'description', 'price', 'comparePrice', 'currency', 'category', 'stock', 'sku', 'brand', 'status', 'isFeatured', 'images'],
      ['iPhone 15 Pro', 'Smartphone Apple dernière génération', 4999, 5499, 'TND', 'Électronique', 50, 'IPH-15-PRO', 'Apple', 'active', true, 'https://placehold.co/400'],
      ['Nike Air Max', 'Chaussures de sport running', 449, 549, 'TND', 'Mode & Vêtements', 100, 'NK-AM-24', 'Nike', 'active', false, 'https://placehold.co/400'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Produits');

    ws['!cols'] = [
      { wch: 20 }, { wch: 40 }, { wch: 10 }, { wch: 12 }, { wch: 8 },
      { wch: 18 }, { wch: 8 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 50 }
    ];

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), 'template_produits.xlsx');
    toast.success('Template Excel téléchargé!');
    setShowImportMenu(false);
  };

  const downloadTemplateCSV = () => {
    const csv = `"name","description","price","comparePrice","currency","category","stock","sku","brand","status","isFeatured","images"
"iPhone 15 Pro","Smartphone Apple","4999","5499","TND","Électronique","50","IPH-15-PRO","Apple","active","true","https://placehold.co/400"
"Nike Air Max","Chaussures sport","449","549","TND","Mode & Vêtements","100","NK-AM-24","Nike","active","false","https://placehold.co/400"`;

    saveAs(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'template_produits.csv');
    toast.success('Template CSV téléchargé!');
    setShowImportMenu(false);
  };

  const exportToExcel = () => {
    const data = [
      ['Nom', 'Description', 'Prix', 'Devise', 'Catégorie', 'Stock', 'SKU', 'Marque', 'Statut'],
      ...products.map(p => [
        p.title || p.name || '',
        p.description || '',
        p.price || 0,
        p.currency || 'TND',
        typeof p.category === 'object' ? p.category?.name : (p.category || ''),
        p.stock || 0,
        p.sku || '',
        p.brand || '',
        p.status || 'active'
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Produits');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), `produits_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Export réussi!');
    setShowExportModal(false);
  };

  const getCurrencySymbol = (code) => {
    const currency = CURRENCIES.find(c => c.code === code);
    return currency ? currency.symbol : code;
  };

  const filteredProducts = products.filter(product => {
    const name = product.title || product.name || '';
    const category = typeof product.category === 'object' ? product.category?.name : product.category;
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <input ref={csvFileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileImport} className="hidden" />
      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-t-2xl">
              <h2 className="text-xl font-bold">Exporter les produits</h2>
            </div>
            <div className="p-6 space-y-4">
              <button onClick={exportToExcel} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700">
                <TableCellsIcon className="w-5 h-5" /> Exporter en Excel
              </button>
              <button onClick={() => setShowExportModal(false)} className="w-full px-4 py-3 border rounded-xl hover:bg-neutral-50">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Gestion des Produits
            </h1>
            <p className="text-neutral-500 mt-1">Gérez votre catalogue de produits</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Import button */}
            <div className="relative">
              <button
                onClick={() => setShowImportMenu(!showImportMenu)}
                className="flex items-center px-4 py-2.5 border border-neutral-200 rounded-xl hover:bg-neutral-50"
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-2 text-neutral-500" />
                Importer
              </button>
              {showImportMenu && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border z-50">
                  <button onClick={() => csvFileInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 text-left">
                    <ArrowUpTrayIcon className="w-5 h-5 text-blue-600" />
                    <div><p className="font-medium">Importer fichier</p><p className="text-xs text-neutral-500">CSV ou Excel</p></div>
                  </button>
                  <hr className="border-neutral-100" />
                  <button onClick={downloadTemplateXLSX} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 text-left">
                    <DocumentArrowDownIcon className="w-5 h-5 text-green-600" />
                    <div><p className="font-medium">Modèle Excel</p></div>
                  </button>
                  <button onClick={downloadTemplateCSV} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 text-left">
                    <DocumentArrowDownIcon className="w-5 h-5 text-amber-600" />
                    <div><p className="font-medium">Modèle CSV</p></div>
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => setShowExportModal(true)} className="flex items-center px-4 py-2.5 border rounded-xl hover:bg-neutral-50">
              <ArrowUpTrayIcon className="w-5 h-5 mr-2 text-neutral-500" /> Exporter
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg">
              <PlusIcon className="w-5 h-5 mr-2" /> Nouveau Produit
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neutral-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="relative">
            <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-neutral-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none">
              <option value="all">Toutes les catégories</option>
              {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl px-4 py-3">
            <span className="text-sm text-indigo-700 font-medium">{filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}</span>
            <CubeIcon className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-neutral-500">Chargement...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <CubeIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 mb-4">Aucun produit trouvé</p>
            <button onClick={() => setShowModal(true)} className="text-indigo-600 hover:text-indigo-700 font-medium">
              Ajouter votre premier produit
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const productId = product._id || product.id;
            const productName = product.title || product.name || 'Sans nom';
            const productCategory = typeof product.category === 'object' ? product.category?.name : product.category;
            const productImage = product.images?.[0]?.url || product.images?.[0] || 'https://placehold.co/300x300/e2e8f0/475569?text=Image';
            const currencySymbol = getCurrencySymbol(product.currency || 'TND');

            return (
              <div key={productId} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="relative aspect-square bg-neutral-100">
                  <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                  {(product.isFeatured || product.featured) && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <StarSolid className="w-3 h-3" /> Vedette
                    </div>
                  )}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                    <button onClick={() => handleEdit(product)} className="p-2 bg-white rounded-lg shadow-lg hover:bg-indigo-50">
                      <PencilIcon className="w-4 h-4 text-indigo-600" />
                    </button>
                    <button onClick={() => handleDelete(productId)} className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-50">
                      <TrashIcon className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-1 text-xs font-bold rounded-lg ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                      {product.status === 'active' ? 'Actif' : product.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-indigo-500 font-medium mb-1">{productCategory || 'Non catégorisé'}</p>
                  <h3 className="font-bold text-neutral-800 truncate">{productName}</h3>
                  <p className="text-xs text-neutral-400 mt-1">SKU: {product.sku || 'N/A'}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-indigo-600">{product.price} {currencySymbol}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${product.stock > 20 ? 'bg-green-100 text-green-700' : product.stock > 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock} stock
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-white/20 rounded-lg">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Images */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <PhotoIcon className="w-4 h-4 inline mr-1" /> Images du produit
                </label>
                <div className="flex flex-wrap gap-3">
                  {productImages.map((img, idx) => (
                    <div key={idx} className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${idx === primaryImageIndex ? 'border-indigo-500' : 'border-neutral-200'}`}>
                      <img src={img.preview} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl">
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-20 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center hover:border-indigo-400">
                    <PlusIcon className="w-6 h-6 text-neutral-400" />
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Nom du produit *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={2}
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Prix *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} step="0.01" required
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    <CurrencyDollarIcon className="w-4 h-4 inline mr-1" /> Devise
                  </label>
                  <select name="currency" value={formData.currency} onChange={handleInputChange}
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500">
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Prix comparé</label>
                  <input type="number" name="comparePrice" value={formData.comparePrice} onChange={handleInputChange} step="0.01"
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Catégorie *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500">
                    <option value="">Sélectionner...</option>
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Stock *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">SKU</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleInputChange}
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Marque</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange}
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Statut</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500">
                    <option value="active">Actif</option>
                    <option value="draft">Brouillon</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-5 h-5 text-indigo-600 rounded" />
                  <label className="ml-2 text-sm font-medium text-neutral-700">Produit vedette</label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-6 py-2.5 border rounded-xl hover:bg-neutral-50">
                  Annuler
                </button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl disabled:opacity-50">
                  {loading ? 'Enregistrement...' : editingProduct ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
