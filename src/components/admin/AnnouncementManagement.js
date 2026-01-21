import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MegaphoneIcon,
  GiftIcon,
  ShareIcon,
  InformationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncement
} from '../../services/announcementService';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    type: 'message',
    content: '',
    link: '',
    linkText: '',
    icon: '📢',
    backgroundColor: 'from-primary-600 via-primary-500 to-primary-600',
    priority: 0,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: '',
    isActive: true,
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      tiktok: '',
      youtube: ''
    },
    contactInfo: {
      phone: '',
      email: '',
      address: ''
    }
  });

  const typeOptions = [
    { value: 'message', label: 'Message', icon: MegaphoneIcon, color: 'bg-blue-500' },
    { value: 'offer', label: 'Offre/Promo', icon: GiftIcon, color: 'bg-green-500' },
    { value: 'social', label: 'Réseaux Sociaux', icon: ShareIcon, color: 'bg-purple-500' },
    { value: 'info', label: 'Informations', icon: InformationCircleIcon, color: 'bg-orange-500' }
  ];

  const backgroundOptions = [
    { value: 'from-primary-600 via-primary-500 to-primary-600', label: 'Bleu Principal' },
    { value: 'from-green-600 via-green-500 to-green-600', label: 'Vert' },
    { value: 'from-purple-600 via-purple-500 to-purple-600', label: 'Violet' },
    { value: 'from-orange-600 via-orange-500 to-orange-600', label: 'Orange' },
    { value: 'from-red-600 via-red-500 to-red-600', label: 'Rouge' },
    { value: 'from-gray-800 via-gray-700 to-gray-800', label: 'Gris Foncé' },
    { value: 'from-pink-600 via-pink-500 to-pink-600', label: 'Rose' }
  ];

  const iconOptions = ['📢', '🎉', '🔥', '⭐', '💫', '🎁', '💰', '🚀', '💡', '📞', '✉️', '📍', '🌟', '💎'];

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await getAllAnnouncements();
      if (response.success) {
        setAnnouncements(response.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (announcement = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({
        type: announcement.type,
        content: announcement.content,
        link: announcement.link || '',
        linkText: announcement.linkText || '',
        icon: announcement.icon || '📢',
        backgroundColor: announcement.backgroundColor || 'from-primary-600 via-primary-500 to-primary-600',
        priority: announcement.priority || 0,
        startDate: announcement.startDate ? new Date(announcement.startDate).toISOString().slice(0, 16) : '',
        endDate: announcement.endDate ? new Date(announcement.endDate).toISOString().slice(0, 16) : '',
        isActive: announcement.isActive,
        socialLinks: announcement.socialLinks || { facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '' },
        contactInfo: announcement.contactInfo || { phone: '', email: '', address: '' }
      });
    } else {
      setEditingAnnouncement(null);
      setFormData({
        type: 'message',
        content: '',
        link: '',
        linkText: '',
        icon: '📢',
        backgroundColor: 'from-primary-600 via-primary-500 to-primary-600',
        priority: 0,
        startDate: new Date().toISOString().slice(0, 16),
        endDate: '',
        isActive: true,
        socialLinks: { facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '' },
        contactInfo: { phone: '', email: '', address: '' }
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        endDate: formData.endDate || null
      };

      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement._id, dataToSend);
      } else {
        await createAnnouncement(dataToSend);
      }
      fetchAnnouncements();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleAnnouncement(id);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnnouncement(id);
      setDeleteConfirm(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const getTypeInfo = (type) => {
    return typeOptions.find(t => t.value === type) || typeOptions[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Barre d'Annonces</h1>
          <p className="text-gray-600 mt-1">Gérez les messages, offres et informations affichés en haut du site</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nouvelle Annonce
        </button>
      </div>

      {/* Types Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {typeOptions.map((type) => {
          const count = announcements.filter(a => a.type === type.value && a.isActive).length;
          const Icon = type.icon;
          return (
            <div key={type.value} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${type.color} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{type.label}</p>
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Toutes les Annonces</h2>
        </div>

        {announcements.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MegaphoneIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune annonce pour le moment</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-4 text-primary-500 hover:text-primary-600 font-medium"
            >
              Créer votre première annonce
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {announcements.map((announcement) => {
              const typeInfo = getTypeInfo(announcement.type);
              const Icon = typeInfo.icon;
              return (
                <div key={announcement._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Icon & Type */}
                    <div className={`p-2 rounded-lg ${typeInfo.color} text-white flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{announcement.icon}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${announcement.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {announcement.isActive ? 'Actif' : 'Inactif'}
                        </span>
                        <span className="text-xs text-gray-400">
                          Priorité: {announcement.priority}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium truncate">{announcement.content}</p>
                      {announcement.link && (
                        <p className="text-sm text-primary-500 truncate">{announcement.link}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Du: {new Date(announcement.startDate).toLocaleDateString('fr-FR')}</span>
                        {announcement.endDate && (
                          <span>Au: {new Date(announcement.endDate).toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                    </div>

                    {/* Preview */}
                    <div className={`hidden lg:block w-64 h-8 rounded bg-gradient-to-r ${announcement.backgroundColor} text-white text-xs flex items-center justify-center`}>
                      <span className="truncate px-2">{announcement.content.substring(0, 30)}...</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(announcement._id)}
                        className={`p-2 rounded-lg transition-colors ${announcement.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        title={announcement.isActive ? 'Désactiver' : 'Activer'}
                      >
                        {announcement.isActive ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleOpenModal(announcement)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(announcement._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAnnouncement ? 'Modifier l\'annonce' : 'Nouvelle Annonce'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type d'annonce</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {typeOptions.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.value })}
                        className={`p-3 rounded-lg border-2 transition-all ${formData.type === type.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${formData.type === type.value ? 'text-primary-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${formData.type === type.value ? 'text-primary-700' : 'text-gray-600'}`}>
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenu *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  maxLength={200}
                  placeholder="Votre message..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{formData.content.length}/200 caractères</p>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icône</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${formData.icon === icon
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Couleur de fond</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {backgroundOptions.map((bg) => (
                    <button
                      key={bg.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, backgroundColor: bg.value })}
                      className={`h-10 rounded-lg bg-gradient-to-r ${bg.value} text-white text-xs font-medium border-2 ${formData.backgroundColor === bg.value
                        ? 'border-gray-900 ring-2 ring-offset-2 ring-primary-500'
                        : 'border-transparent'
                        }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Link */}
              {formData.type !== 'social' && formData.type !== 'info' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lien (optionnel)</label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Texte du lien</label>
                    <input
                      type="text"
                      value={formData.linkText}
                      onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="En savoir plus"
                    />
                  </div>
                </div>
              )}

              {/* Social Links */}
              {formData.type === 'social' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Réseaux Sociaux</label>
                  {['facebook', 'instagram', 'twitter', 'tiktok', 'youtube'].map((social) => (
                    <div key={social} className="flex items-center gap-2">
                      <span className="w-24 text-sm capitalize text-gray-600">{social}</span>
                      <input
                        type="url"
                        value={formData.socialLinks[social]}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, [social]: e.target.value }
                        })}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                        placeholder={`https://${social}.com/...`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Info */}
              {formData.type === 'info' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.contactInfo.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactInfo: { ...formData.contactInfo, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="+216..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.contactInfo.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactInfo: { ...formData.contactInfo, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="contact@..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                    <input
                      type="text"
                      value={formData.contactInfo.address}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactInfo: { ...formData.contactInfo, address: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Ville, Pays"
                    />
                  </div>
                </div>
              )}

              {/* Priority & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin (optionnel)</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Active */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Activer immédiatement
                </label>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aperçu</label>
                <div className={`bg-gradient-to-r ${formData.backgroundColor} text-white py-2 px-4 rounded-lg`}>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span>{formData.icon}</span>
                    <span>{formData.content || 'Votre message ici...'}</span>
                    {formData.linkText && (
                      <span className="underline cursor-pointer">{formData.linkText}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {editingAnnouncement ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cette annonce ?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementManagement;
