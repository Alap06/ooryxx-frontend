import React, { useState, useEffect, useRef } from 'react';
import { Tab } from '@headlessui/react';
import {
  UserIcon,
  MapPinIcon,
  ShoppingBagIcon,
  HeartIcon,
  KeyIcon,
  ChartBarIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CameraIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  MegaphoneIcon,
  InboxIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import userService from '../services/userService';
import ErrorHandler from '../utils/errorHandler';
import { Link } from 'react-router-dom';
import ReclamationForm from '../components/user/ReclamationForm';
import AdminMessageForm from '../components/admin/AdminMessageForm';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [stats, setStats] = useState({});
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [reclamations, setReclamations] = useState([]);
  const [showReclamationForm, setShowReclamationForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [userMessages, setUserMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [editingReclamation, setEditingReclamation] = useState(false);
  const [reclamationEditData, setReclamationEditData] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  });
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthdate: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [addressData, setAddressData] = useState({
    label: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Tunisie',
    isDefault: false
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [profileRes, addressesRes, ordersRes, wishlistRes, statsRes, reclamationsRes] = await Promise.all([
        userService.getProfile(),
        userService.getAddresses(),
        userService.getOrders(null, 1, 5),
        userService.getWishlist(),
        userService.getUserStats(),
        // Fetch user's reclamations with improved error handling
        fetch(`${process.env.REACT_APP_API_URL}/reclamations/my`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }).then(async res => {
          const data = await res.json();
          console.log('Reclamations API response:', data);
          return data;
        }).catch(err => {
          console.error('Error fetching reclamations:', err);
          return { data: { reclamations: [] } };
        })
      ]);

      const userData = profileRes.data || profileRes;
      setUser(userData);
      setProfileData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber || '',
        birthdate: userData.birthdate ? userData.birthdate.split('T')[0] : ''
      });

      setAddresses(addressesRes.data || addressesRes);
      setOrders(ordersRes.data?.orders || ordersRes.orders || []);
      setWishlist(wishlistRes.data || wishlistRes);
      setStats(statsRes.data || statsRes);
      // Set reclamations
      setReclamations(reclamationsRes.data?.reclamations || reclamationsRes.reclamations || []);
    } catch (error) {
      ErrorHandler.handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Load user messages (for non-admin users)
  const loadUserMessages = async () => {
    try {
      setLoadingMessages(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/messages/my`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        setUserMessages(data.data?.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Mark message as read
  const markMessageAsRead = async (messageId) => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/messages/${messageId}/read`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      loadUserMessages(); // Refresh messages
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(profileData);
      await loadUserData();
      setEditingProfile(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      ErrorHandler.handleApiError(error);
    }
  };

  // Handle profile photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La photo ne doit pas dépasser 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server (if API supports it)
    try {
      setUploadingPhoto(true);
      // For now, we'll save the base64 as profileImage
      // In production, you'd upload to cloud storage
      const base64 = await new Promise((resolve) => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result);
        r.readAsDataURL(file);
      });

      await userService.updateProfile({ profileImage: base64 });
      await loadUserData();
      toast.success('Photo de profil mise à jour!');
    } catch (error) {
      toast.error('Erreur lors de l\'upload de la photo');
      setProfileImagePreview(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  // Default avatars to choose from
  const defaultAvatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie'
  ];

  const selectDefaultAvatar = async (avatarUrl) => {
    try {
      setUploadingPhoto(true);
      await userService.updateProfile({ profileImage: avatarUrl });
      await loadUserData();
      setProfileImagePreview(null);
      toast.success('Avatar sélectionné!');
    } catch (error) {
      toast.error('Erreur lors de la sélection de l\'avatar');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Calculate password strength
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;

    // Length checks
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character type checks
    if (/[a-z]/.test(password)) score += 1; // lowercase
    if (/[A-Z]/.test(password)) score += 1; // uppercase
    if (/[0-9]/.test(password)) score += 1; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 1; // special chars

    if (score <= 2) return { score: 1, label: 'Très faible', color: 'bg-red-500' };
    if (score <= 3) return { score: 2, label: 'Faible', color: 'bg-orange-500' };
    if (score <= 4) return { score: 3, label: 'Moyen', color: 'bg-yellow-500' };
    if (score <= 5) return { score: 4, label: 'Fort', color: 'bg-green-500' };
    return { score: 5, label: 'Très fort', color: 'bg-emerald-600' };
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      await userService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setEditingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // Reset visibility states
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      toast.success('Mot de passe modifié avec succès');
    } catch (error) {
      ErrorHandler.handleApiError(error);
    }
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await userService.updateAddress(editingAddress, addressData);
        toast.success('Adresse mise à jour');
      } else {
        await userService.addAddress(addressData);
        toast.success('Adresse ajoutée');
      }
      const addressesRes = await userService.getAddresses();
      setAddresses(addressesRes.data || addressesRes);
      setShowAddressModal(false);
      setEditingAddress(null);
      setAddressData({ label: '', street: '', city: '', postalCode: '', country: 'Tunisie', isDefault: false });
    } catch (error) {
      ErrorHandler.handleApiError(error);
    }
  };

  const deleteAddress = async (addressId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette adresse ?')) return;
    try {
      await userService.deleteAddress(addressId);
      const addressesRes = await userService.getAddresses();
      setAddresses(addressesRes.data || addressesRes);
      toast.success('Adresse supprimée');
    } catch (error) {
      ErrorHandler.handleApiError(error);
    }
  };

  const openEditAddress = (address) => {
    setEditingAddress(address._id);
    setAddressData({
      label: address.label,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setShowAddressModal(true);
  };

  // Reclamation functions
  const openReclamationDetails = (reclamation) => {
    setSelectedReclamation(reclamation);
    setEditingReclamation(false);
  };

  const startEditReclamation = () => {
    if (selectedReclamation) {
      setReclamationEditData({
        subject: selectedReclamation.subject,
        description: selectedReclamation.description,
        priority: selectedReclamation.priority || 'medium'
      });
      setEditingReclamation(true);
    }
  };

  const saveReclamationEdit = async () => {
    if (!selectedReclamation) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/reclamations/my/${selectedReclamation._id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reclamationEditData)
        }
      );

      if (response.ok) {
        toast.success('Réclamation mise à jour avec succès');
        setEditingReclamation(false);
        setSelectedReclamation(null);
        // Reload reclamations
        await loadUserData();
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const closeReclamationModal = () => {
    setSelectedReclamation(null);
    setEditingReclamation(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>

        <Tab.Group>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-center mb-6">
                  {/* Profile Photo with Upload */}
                  <div className="relative inline-block">
                    <div className="w-28 h-28 rounded-full mx-auto overflow-hidden border-4 border-blue-100 shadow-lg">
                      {profileImagePreview || user?.profileImage ? (
                        <img
                          src={profileImagePreview || user.profileImage}
                          alt={`${user?.firstName} ${user?.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <span className="text-white text-3xl font-bold">{getUserInitials()}</span>
                        </div>
                      )}
                    </div>
                    {/* Upload Button Overlay */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110 disabled:opacity-50"
                      title="Changer la photo"
                    >
                      {uploadingPhoto ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CameraIcon className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                  <h2 className="font-bold text-lg mt-3">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                  {user?.role && (
                    <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'vendor' ? 'bg-indigo-100 text-indigo-700' :
                        user.role === 'customer_vip' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                      }`}>
                      {user.role === 'admin' ? 'Administrateur' :
                        user.role === 'vendor' ? 'Vendeur' :
                          user.role === 'customer_vip' ? 'Client VIP' : 'Client'}
                    </span>
                  )}
                </div>

                <Tab.List className="space-y-2">
                  {[
                    { name: 'Profil', icon: UserIcon },
                    { name: 'Adresses', icon: MapPinIcon },
                    { name: 'Commandes', icon: ShoppingBagIcon },
                    { name: 'Wishlist', icon: HeartIcon },
                    { name: 'Sécurité', icon: KeyIcon },
                    { name: 'Statistiques', icon: ChartBarIcon },
                    // Réclamations for non-admin users (first because panel is first)
                    ...(user?.role !== 'admin' ? [{ name: 'Réclamations', icon: ExclamationTriangleIcon }] : []),
                    // Messages tab for non-admin users (to view received messages)
                    ...(user?.role !== 'admin' ? [{ name: 'Messages', icon: InboxIcon, onSelect: loadUserMessages }] : []),
                    // Devenir Vendeur for customers only (not vendors, admins, or mods)
                    ...(user?.role === 'customer' || user?.role === 'customer_vip' ? [{ name: 'Devenir Vendeur', icon: BuildingStorefrontIcon }] : []),
                    // Envoyer Message for admin only
                    ...(user?.role === 'admin' ? [{ name: 'Envoyer Message', icon: MegaphoneIcon }] : []),
                    // Paramètres for all users
                    { name: 'Paramètres', icon: Cog6ToothIcon }
                  ].map((item) => (
                    <Tab
                      key={item.name}
                      onClick={item.onSelect}
                      className={({ selected }) =>
                        `w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${selected
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Tab>
                  ))}
                </Tab.List>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <Tab.Panels>
                {/* Profil */}
                <Tab.Panel>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Informations personnelles</h2>
                      <button
                        onClick={() => setEditingProfile(!editingProfile)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {editingProfile ? 'Annuler' : 'Modifier'}
                      </button>
                    </div>

                    {/* Photo de profil Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <PhotoIcon className="w-5 h-5 text-blue-600" />
                        Photo de profil
                      </h3>

                      <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Current Photo */}
                        <div className="flex-shrink-0">
                          <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                            {profileImagePreview || user?.profileImage ? (
                              <img
                                src={profileImagePreview || user.profileImage}
                                alt="Photo de profil"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <span className="text-white text-4xl font-bold">{getUserInitials()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 space-y-4">
                          {/* Upload Button */}
                          <div>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadingPhoto}
                              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                            >
                              {uploadingPhoto ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Upload en cours...
                                </>
                              ) : (
                                <>
                                  <CameraIcon className="w-5 h-5" />
                                  Télécharger une photo
                                </>
                              )}
                            </button>
                            <p className="text-xs text-gray-500 mt-2">JPG, PNG jusqu'à 5MB</p>
                          </div>

                          {/* Avatar Presets */}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Ou choisir un avatar :</p>
                            <div className="flex flex-wrap gap-2">
                              {defaultAvatars.map((avatar, index) => (
                                <button
                                  key={index}
                                  onClick={() => selectDefaultAvatar(avatar)}
                                  disabled={uploadingPhoto}
                                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-110 hover:border-blue-500 disabled:opacity-50 ${user?.profileImage === avatar ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                                    }`}
                                >
                                  <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Remove Photo */}
                          {user?.profileImage && (
                            <button
                              onClick={() => selectDefaultAvatar('')}
                              disabled={uploadingPhoto}
                              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                            >
                              <TrashIcon className="w-4 h-4" />
                              Supprimer la photo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {editingProfile ? (
                      <form onSubmit={updateProfile} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                            <input
                              type="text"
                              value={profileData.firstName}
                              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                            <input
                              type="text"
                              value={profileData.lastName}
                              onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                          <input
                            type="tel"
                            value={profileData.phoneNumber}
                            onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                          <input
                            type="date"
                            value={profileData.birthdate}
                            onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
                        >
                          Enregistrer
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between py-3 border-b">
                          <span className="text-gray-600">Nom complet</span>
                          <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b">
                          <span className="text-gray-600">Email</span>
                          <span className="font-medium">{user?.email}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b">
                          <span className="text-gray-600">Téléphone</span>
                          <span className="font-medium">{user?.phoneNumber || 'Non renseigné'}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b">
                          <span className="text-gray-600">Date de naissance</span>
                          <span className="font-medium">
                            {user?.birthdate ? new Date(user.birthdate).toLocaleDateString('fr-FR') : 'Non renseigné'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Tab.Panel>

                {/* Adresses */}
                <Tab.Panel>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Mes adresses</h2>
                      <button
                        onClick={() => {
                          setEditingAddress(null);
                          setAddressData({ label: '', street: '', city: '', postalCode: '', country: 'Tunisie', isDefault: false });
                          setShowAddressModal(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                      >
                        <PlusIcon className="w-5 h-5" />
                        Ajouter une adresse
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div key={address._id} className="border border-gray-200 rounded-lg p-4 relative">
                          {address.isDefault && (
                            <span className="absolute top-2 right-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                              Par défaut
                            </span>
                          )}
                          <h3 className="font-bold mb-2">{address.label}</h3>
                          <p className="text-gray-600 text-sm">{address.street}</p>
                          <p className="text-gray-600 text-sm">{address.postalCode} {address.city}</p>
                          <p className="text-gray-600 text-sm mb-4">{address.country}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditAddress(address)}
                              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                              <PencilIcon className="w-4 h-4" />
                              Modifier
                            </button>
                            <button
                              onClick={() => deleteAddress(address._id)}
                              className="border border-red-300 text-red-600 px-3 py-2 rounded-lg hover:bg-red-50"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* Commandes */}
                <Tab.Panel>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold mb-6">Mes commandes</h2>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="font-semibold">Commande #{order.orderNumber}</span>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                'bg-blue-100 text-blue-600'
                              }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">{order.totalAmount?.toFixed(2)} DT</span>
                            <Link
                              to={`/orders/${order._id}`}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Voir détails →
                            </Link>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <p className="text-center text-gray-500 py-8">Aucune commande</p>
                      )}
                    </div>
                  </div>
                </Tab.Panel>

                {/* Wishlist */}
                <Tab.Panel>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold mb-6">Ma wishlist</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.map((product) => (
                        <Link
                          key={product._id}
                          to={`/products/${product._id}`}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                        >
                          <img
                            src={product.images?.[0] || '/placeholder.jpg'}
                            alt={product.title}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-blue-600">{product.price?.toFixed(2)} DT</span>
                            {product.discount > 0 && (
                              <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                                -{product.discount}%
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                      {wishlist.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-8">
                          Aucun produit dans votre wishlist
                        </div>
                      )}
                    </div>
                  </div>
                </Tab.Panel>

                {/* Sécurité */}
                <Tab.Panel>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Sécurité</h2>
                      <button
                        onClick={() => setEditingPassword(!editingPassword)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {editingPassword ? 'Annuler' : 'Modifier le mot de passe'}
                      </button>
                    </div>

                    {editingPassword && (
                      <form onSubmit={changePassword} className="space-y-5 max-w-md">
                        {/* Current Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mot de passe actuel
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                              placeholder="Entrez votre mot de passe actuel"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                              {showCurrentPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* New Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nouveau mot de passe
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                              minLength="6"
                              placeholder="Créez un nouveau mot de passe"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                              {showNewPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>

                          {/* Password Strength Indicator */}
                          {passwordData.newPassword && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-600">Force du mot de passe</span>
                                <span className={`text-xs font-semibold ${getPasswordStrength(passwordData.newPassword).score <= 2 ? 'text-red-600' :
                                  getPasswordStrength(passwordData.newPassword).score <= 3 ? 'text-yellow-600' :
                                    'text-green-600'
                                  }`}>
                                  {getPasswordStrength(passwordData.newPassword).label}
                                </span>
                              </div>
                              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300 ${getPasswordStrength(passwordData.newPassword).color}`}
                                  style={{ width: `${(getPasswordStrength(passwordData.newPassword).score / 5) * 100}%` }}
                                />
                              </div>

                              {/* Password Requirements Checklist */}
                              <div className="mt-3 space-y-1 text-xs">
                                <div className={`flex items-center gap-2 ${passwordData.newPassword.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                                  {passwordData.newPassword.length >= 6 ? (
                                    <CheckCircleIcon className="w-4 h-4" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-gray-300" />
                                  )}
                                  <span>Au moins 6 caractères</span>
                                </div>
                                <div className={`flex items-center gap-2 ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                                  {/[A-Z]/.test(passwordData.newPassword) ? (
                                    <CheckCircleIcon className="w-4 h-4" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-gray-300" />
                                  )}
                                  <span>Une lettre majuscule</span>
                                </div>
                                <div className={`flex items-center gap-2 ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                                  {/[0-9]/.test(passwordData.newPassword) ? (
                                    <CheckCircleIcon className="w-4 h-4" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-gray-300" />
                                  )}
                                  <span>Un chiffre</span>
                                </div>
                                <div className={`flex items-center gap-2 ${/[^a-zA-Z0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                                  {/[^a-zA-Z0-9]/.test(passwordData.newPassword) ? (
                                    <CheckCircleIcon className="w-4 h-4" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-gray-300" />
                                  )}
                                  <span>Un caractère spécial (!@#$...)</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmer le nouveau mot de passe
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              className={`w-full border rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                                ? 'border-red-300 bg-red-50'
                                : passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword
                                  ? 'border-green-300 bg-green-50'
                                  : 'border-gray-300'
                                }`}
                              required
                              placeholder="Confirmez le nouveau mot de passe"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                              {showConfirmPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {/* Match indicator */}
                          {passwordData.confirmPassword && (
                            <div className={`mt-1 text-xs flex items-center gap-1 ${passwordData.newPassword === passwordData.confirmPassword
                              ? 'text-green-600'
                              : 'text-red-600'
                              }`}>
                              {passwordData.newPassword === passwordData.confirmPassword ? (
                                <>
                                  <CheckCircleIcon className="w-4 h-4" />
                                  <span>Les mots de passe correspondent</span>
                                </>
                              ) : (
                                <>
                                  <XCircleIcon className="w-4 h-4" />
                                  <span>Les mots de passe ne correspondent pas</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={
                            !passwordData.currentPassword ||
                            !passwordData.newPassword ||
                            !passwordData.confirmPassword ||
                            passwordData.newPassword !== passwordData.confirmPassword ||
                            passwordData.newPassword.length < 6
                          }
                          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          Changer le mot de passe
                        </button>
                      </form>
                    )}
                  </div>
                </Tab.Panel>

                {/* Statistiques */}
                <Tab.Panel>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold mb-6">Mes statistiques</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-6 text-center">
                        <ShoppingBagIcon className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                        <p className="text-3xl font-bold text-blue-600">{stats.totalOrders || 0}</p>
                        <p className="text-gray-600">Commandes</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-6 text-center">
                        <svg className="w-12 h-12 mx-auto text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-3xl font-bold text-green-600">{stats.totalSpent?.toFixed(2) || '0.00'} DT</p>
                        <p className="text-gray-600">Dépensé</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-6 text-center">
                        <HeartIcon className="w-12 h-12 mx-auto text-red-600 mb-2" />
                        <p className="text-3xl font-bold text-red-600">{stats.wishlistCount || 0}</p>
                        <p className="text-gray-600">Favoris</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-6 text-center">
                        <svg className="w-12 h-12 mx-auto text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="text-3xl font-bold text-purple-600">{stats.cartItemsCount || 0}</p>
                        <p className="text-gray-600">Dans le panier</p>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Réclamations / Messagerie Admin */}
                <Tab.Panel>
                  {user?.role === 'admin' ? (
                    /* Admin Messaging Interface */
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-2xl font-bold">Envoyer un message</h2>
                          <p className="text-gray-500 text-sm mt-1">Notifier les utilisateurs de la plateforme</p>
                        </div>
                        <button
                          onClick={() => setShowMessageForm(true)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
                        >
                          <MegaphoneIcon className="w-5 h-5" />
                          Nouveau message
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                          <h3 className="font-semibold text-blue-800 mb-2">Messages rapides</h3>
                          <p className="text-sm text-blue-600 mb-4">Envoyez des notifications ciblées</p>
                          <div className="space-y-2">
                            <button
                              onClick={() => setShowMessageForm(true)}
                              className="w-full text-left px-3 py-2 bg-white rounded-lg text-sm hover:bg-blue-50 flex items-center gap-2"
                            >
                              <span className="text-lg">📢</span> Annonce générale
                            </button>
                            <button
                              onClick={() => setShowMessageForm(true)}
                              className="w-full text-left px-3 py-2 bg-white rounded-lg text-sm hover:bg-blue-50 flex items-center gap-2"
                            >
                              <span className="text-lg">🎁</span> Promotion
                            </button>
                            <button
                              onClick={() => setShowMessageForm(true)}
                              className="w-full text-left px-3 py-2 bg-white rounded-lg text-sm hover:bg-blue-50 flex items-center gap-2"
                            >
                              <span className="text-lg">⚠️</span> Avertissement
                            </button>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                          <h3 className="font-semibold text-purple-800 mb-2">Ciblage</h3>
                          <p className="text-sm text-purple-600 mb-4">Types de destinataires disponibles</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <CheckCircleIcon className="w-4 h-4 text-green-500" />
                              Tous les utilisateurs
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <CheckCircleIcon className="w-4 h-4 text-green-500" />
                              Par type (clients, vendeurs, modérateurs)
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <CheckCircleIcon className="w-4 h-4 text-green-500" />
                              Utilisateur individuel (par email ou ID)
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <MegaphoneIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">Cliquez sur "Nouveau message" pour composer</p>
                      </div>
                    </div>
                  ) : (
                    /* Regular User Reclamations Interface */
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Mes réclamations</h2>
                        <button
                          onClick={() => setShowReclamationForm(true)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center gap-2"
                        >
                          <PlusIcon className="w-5 h-5" />
                          Nouvelle réclamation
                        </button>
                      </div>

                      <div className="space-y-4">
                        {reclamations.map((reclamation) => (
                          <div
                            key={reclamation._id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition cursor-pointer"
                            onClick={() => openReclamationDetails(reclamation)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-semibold">{reclamation.subject}</span>
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded ${reclamation.type === 'produit' ? 'bg-purple-100 text-purple-600' :
                                  reclamation.type === 'livraison' ? 'bg-indigo-100 text-indigo-600' :
                                    reclamation.type === 'paiement' ? 'bg-green-100 text-green-600' :
                                      'bg-gray-100 text-gray-600'
                                  }`}>
                                  {reclamation.type}
                                </span>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${reclamation.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                reclamation.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                                  reclamation.status === 'resolved' ? 'bg-green-100 text-green-600' :
                                    reclamation.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                      'bg-gray-100 text-gray-600'
                                }`}>
                                {reclamation.status === 'pending' && <ClockIcon className="w-3 h-3" />}
                                {reclamation.status === 'resolved' && <CheckCircleIcon className="w-3 h-3" />}
                                {reclamation.status === 'rejected' && <XCircleIcon className="w-3 h-3" />}
                                {reclamation.status === 'pending' ? 'En attente' :
                                  reclamation.status === 'in_progress' ? 'En cours' :
                                    reclamation.status === 'resolved' ? 'Résolu' :
                                      reclamation.status === 'rejected' ? 'Rejeté' : reclamation.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{reclamation.description}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>{new Date(reclamation.createdAt).toLocaleDateString('fr-FR')}</span>
                              <div className="flex items-center gap-3">
                                {reclamation.response && (
                                  <span className="text-green-600 font-medium">Réponse reçue</span>
                                )}
                                <span className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                  <EyeIcon className="w-4 h-4" />
                                  Voir détails
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {reclamations.length === 0 && (
                          <div className="text-center py-12">
                            <ExclamationTriangleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">Vous n'avez aucune réclamation</p>
                            <button
                              onClick={() => setShowReclamationForm(true)}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              Créer votre première réclamation
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Tab.Panel>

                {/* Messages Panel - For non-admin users */}
                {user?.role !== 'admin' && (
                  <Tab.Panel>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-2xl font-bold">Mes Messages</h2>
                          <p className="text-gray-500 text-sm">Notifications reçues de l'administration</p>
                        </div>
                        <button
                          onClick={loadUserMessages}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Actualiser
                        </button>
                      </div>

                      {loadingMessages ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <p className="text-gray-500">Chargement des messages...</p>
                        </div>
                      ) : userMessages.length === 0 ? (
                        <div className="text-center py-12">
                          <InboxIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Aucun message reçu</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userMessages.map((message) => (
                            <div
                              key={message._id}
                              onClick={() => !message.isRead && markMessageAsRead(message._id)}
                              className={`border rounded-xl p-4 transition cursor-pointer ${!message.isRead
                                ? 'bg-blue-50 border-blue-200 hover:border-blue-400'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 ${message.type === 'warning' ? 'bg-orange-500' :
                                  message.type === 'success' ? 'bg-green-500' :
                                    message.type === 'promo' ? 'bg-purple-500' :
                                      message.type === 'announcement' ? 'bg-indigo-500' :
                                        'bg-blue-500'
                                  }`}>
                                  {message.type === 'warning' ? '⚠️' :
                                    message.type === 'success' ? '✅' :
                                      message.type === 'promo' ? '🎁' :
                                        message.type === 'announcement' ? '📣' : '📢'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-800">{message.title}</h3>
                                    {!message.isRead && (
                                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Nouveau</span>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-sm mb-2">{message.content}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <span>{new Date(message.createdAt).toLocaleDateString('fr-FR', {
                                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}</span>
                                    {message.sender && (
                                      <span>De: {message.sender.firstName} {message.sender.lastName}</span>
                                    )}
                                  </div>
                                </div>
                                {!message.isRead && (
                                  <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Tab.Panel>
                )}

                {/* Devenir Vendeur Panel - For customers only */}
                {(user?.role === 'customer' || user?.role === 'customer_vip') && (
                  <Tab.Panel>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="text-center py-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                          <BuildingStorefrontIcon className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Devenez Vendeur sur Ooryxx</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                          Développez votre activité en rejoignant notre plateforme.
                          Commencez à vendre vos produits à des milliers de clients.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                          <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-2xl font-bold text-blue-600">50K+</p>
                            <p className="text-sm text-gray-600">Clients actifs</p>
                          </div>
                          <div className="bg-green-50 rounded-xl p-4">
                            <p className="text-2xl font-bold text-green-600">10%</p>
                            <p className="text-sm text-gray-600">Commission seulement</p>
                          </div>
                          <div className="bg-purple-50 rounded-xl p-4">
                            <p className="text-2xl font-bold text-purple-600">24h</p>
                            <p className="text-sm text-gray-600">Approbation rapide</p>
                          </div>
                        </div>

                        <Link
                          to="/become-vendor"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                        >
                          <BuildingStorefrontIcon className="w-6 h-6" />
                          Soumettre ma candidature
                        </Link>

                        <p className="text-xs text-gray-400 mt-4">
                          Préparez votre carte d'identité et vos documents d'entreprise
                        </p>
                      </div>
                    </div>
                  </Tab.Panel>
                )}

                {/* Paramètres Panel - For all users */}
                <Tab.Panel>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-bold">Paramètres</h2>
                        <p className="text-gray-500 text-sm">Gérer vos informations personnelles</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Informations générales */}
                      <div className="bg-gray-50 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <UserIcon className="w-5 h-5 text-blue-600" />
                          Informations générales
                        </h3>
                        <form onSubmit={updateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                            <input
                              type="text"
                              value={profileData.firstName}
                              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input
                              type="text"
                              value={profileData.lastName}
                              onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                            <input
                              type="tel"
                              value={profileData.phoneNumber}
                              onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="+216 XX XXX XXX"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                            <input
                              type="date"
                              value={profileData.birthdate}
                              onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <button
                              type="submit"
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                              Enregistrer les modifications
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Account Info */}
                      <div className="bg-gray-50 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Cog6ToothIcon className="w-5 h-5 text-blue-600" />
                          Compte
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Email</span>
                            <span className="font-medium">{user?.email}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Rôle</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user?.role === 'admin' ? 'bg-red-100 text-red-700' :
                              user?.role === 'vendor' ? 'bg-indigo-100 text-indigo-700' :
                                user?.role === 'customer_vip' ? 'bg-amber-100 text-amber-700' :
                                  'bg-blue-100 text-blue-700'
                              }`}>
                              {user?.role === 'admin' ? 'Administrateur' :
                                user?.role === 'vendor' ? 'Vendeur' :
                                  user?.role === 'customer_vip' ? 'Client VIP' :
                                    user?.role === 'moderator' ? 'Modérateur' : 'Client'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">Membre depuis</span>
                            <span className="font-medium">
                              {user?.createdAt && new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Photo de profil */}
                      <div className="bg-gray-50 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <CameraIcon className="w-5 h-5 text-blue-600" />
                          Photo de profil
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow">
                            {profileImagePreview || user?.profileImage ? (
                              <img
                                src={profileImagePreview || user.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadingPhoto}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                            >
                              {uploadingPhoto ? 'Téléchargement...' : 'Changer la photo'}
                            </button>
                            <p className="text-xs text-gray-500 mt-1">JPG, PNG ou GIF. Max 5MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

              </Tab.Panels>
            </div>
          </div>
        </Tab.Group>

        {/* Modal Adresse */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">
                {editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
              </h3>
              <form onSubmit={saveAddress} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                  <input
                    type="text"
                    value={addressData.label}
                    onChange={(e) => setAddressData({ ...addressData, label: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Maison, Bureau..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rue</label>
                  <input
                    type="text"
                    value={addressData.street}
                    onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                    <input
                      type="text"
                      value={addressData.postalCode}
                      onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                    <input
                      type="text"
                      value={addressData.city}
                      onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                  <input
                    type="text"
                    value={addressData.country}
                    onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={addressData.isDefault}
                    onChange={(e) => setAddressData({ ...addressData, isDefault: e.target.checked })}
                    className="w-4 h-4 text-blue-600"
                    id="isDefault"
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                    Définir comme adresse par défaut
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressModal(false);
                      setEditingAddress(null);
                    }}
                    className="flex-1 border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Réclamation */}
        {showReclamationForm && (
          <ReclamationForm
            onClose={() => setShowReclamationForm(false)}
            onSuccess={async () => {
              // Refresh reclamations list after successful submission
              setShowReclamationForm(false);
              await loadUserData();
            }}
          />
        )}

        {/* Modal Détails Réclamation */}
        {selectedReclamation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingReclamation ? 'Modifier la réclamation' : 'Détails de la réclamation'}
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                      Créée le {new Date(selectedReclamation.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={closeReclamationModal}
                    className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {editingReclamation ? (
                  /* Mode Édition */
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                      <input
                        type="text"
                        value={reclamationEditData.subject}
                        onChange={(e) => setReclamationEditData({ ...reclamationEditData, subject: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={reclamationEditData.description}
                        onChange={(e) => setReclamationEditData({ ...reclamationEditData, description: e.target.value })}
                        rows={5}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                      <div className="flex gap-2">
                        {[
                          { value: 'low', label: 'Basse', color: 'gray' },
                          { value: 'medium', label: 'Moyenne', color: 'blue' },
                          { value: 'high', label: 'Haute', color: 'orange' },
                          { value: 'urgent', label: 'Urgente', color: 'red' }
                        ].map(p => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => setReclamationEditData({ ...reclamationEditData, priority: p.value })}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${reclamationEditData.priority === p.value
                              ? p.color === 'gray' ? 'bg-gray-200 text-gray-700 border-2 border-gray-400'
                                : p.color === 'blue' ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                                  : p.color === 'orange' ? 'bg-orange-100 text-orange-700 border-2 border-orange-400'
                                    : 'bg-red-100 text-red-700 border-2 border-red-400'
                              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                              }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Mode Affichage */
                  <div className="space-y-6">
                    {/* Badges Status */}
                    <div className="flex flex-wrap gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${selectedReclamation.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        selectedReclamation.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          selectedReclamation.status === 'resolved' ? 'bg-green-100 text-green-700' :
                            selectedReclamation.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                        }`}>
                        {selectedReclamation.status === 'pending' && <ClockIcon className="w-4 h-4" />}
                        {selectedReclamation.status === 'resolved' && <CheckCircleIcon className="w-4 h-4" />}
                        {selectedReclamation.status === 'rejected' && <XCircleIcon className="w-4 h-4" />}
                        Statut: {selectedReclamation.status === 'pending' ? 'En attente' :
                          selectedReclamation.status === 'in_progress' ? 'En cours' :
                            selectedReclamation.status === 'resolved' ? 'Résolu' :
                              selectedReclamation.status === 'rejected' ? 'Rejeté' : selectedReclamation.status}
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${selectedReclamation.type === 'produit' ? 'bg-purple-100 text-purple-700' :
                        selectedReclamation.type === 'livraison' ? 'bg-indigo-100 text-indigo-700' :
                          selectedReclamation.type === 'paiement' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        Type: {selectedReclamation.type}
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${selectedReclamation.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        selectedReclamation.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          selectedReclamation.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        Priorité: {selectedReclamation.priority === 'urgent' ? 'Urgente' :
                          selectedReclamation.priority === 'high' ? 'Haute' :
                            selectedReclamation.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </span>
                    </div>

                    {/* Sujet */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Sujet</h3>
                      <p className="text-lg font-semibold text-gray-900">{selectedReclamation.subject}</p>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedReclamation.description}</p>
                    </div>

                    {/* Réponse Admin */}
                    {selectedReclamation.response && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <h3 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                          <CheckCircleIcon className="w-5 h-5" />
                          Réponse de l'équipe
                        </h3>
                        <p className="text-green-800 whitespace-pre-wrap">{selectedReclamation.response}</p>
                        {selectedReclamation.respondedAt && (
                          <p className="text-xs text-green-600 mt-2">
                            Répondu le {new Date(selectedReclamation.respondedAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Commande liée */}
                    {selectedReclamation.orderId && (
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h3 className="text-sm font-medium text-blue-700 mb-1">Commande associée</h3>
                        <p className="text-blue-900 font-medium">
                          #{selectedReclamation.orderId.orderNumber || selectedReclamation.orderId}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                {editingReclamation ? (
                  <>
                    <button
                      onClick={saveReclamationEdit}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Enregistrer les modifications
                    </button>
                    <button
                      onClick={() => setEditingReclamation(false)}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    {selectedReclamation.status === 'pending' && (
                      <button
                        onClick={startEditReclamation}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <PencilIcon className="w-5 h-5" />
                        Modifier
                      </button>
                    )}
                    <button
                      onClick={closeReclamationModal}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Fermer
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Admin Message */}
        {showMessageForm && (
          <AdminMessageForm
            onClose={() => setShowMessageForm(false)}
            onSuccess={() => setShowMessageForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
