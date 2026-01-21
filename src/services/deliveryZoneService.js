/**
 * Service pour la gestion des zones de livraison
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const deliveryZoneService = {
    // ========================================
    // MÉTHODES PUBLIQUES
    // ========================================

    /**
     * Récupérer toutes les zones actives
     * @param {string} country - Code pays optionnel (TN, DZ, MA, etc.)
     */
    async getZones(country = null) {
        const params = new URLSearchParams();
        if (country) params.append('country', country);

        const response = await fetch(`${API_URL}/delivery-zones?${params}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des zones');
        }

        return response.json();
    },

    /**
     * Récupérer les pays disponibles
     */
    async getCountries() {
        const response = await fetch(`${API_URL}/delivery-zones/countries`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des pays');
        }

        return response.json();
    },

    /**
     * Trouver la zone d'une ville
     * @param {string} cityName - Nom de la ville
     * @param {string} country - Code pays
     */
    async getZoneByCity(cityName, country = 'TN') {
        const params = new URLSearchParams({ country });
        const response = await fetch(
            `${API_URL}/delivery-zones/by-city/${encodeURIComponent(cityName)}?${params}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Zone non trouvée');
        }

        return response.json();
    },

    /**
     * Trouver la zone par coordonnées GPS
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     */
    async getZoneByLocation(lat, lng) {
        const params = new URLSearchParams({ lat: lat.toString(), lng: lng.toString() });
        const response = await fetch(`${API_URL}/delivery-zones/by-location?${params}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Zone non trouvée');
        }

        return response.json();
    },

    /**
     * Calculer les frais de livraison
     * @param {string} city - Ville
     * @param {string} country - Code pays
     * @param {boolean} express - Livraison express
     */
    async calculateDeliveryFee(city, country = 'TN', express = false) {
        const response = await fetch(`${API_URL}/delivery-zones/calculate-fee`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city, country, express })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Impossible de calculer les frais');
        }

        return response.json();
    },

    // ========================================
    // MÉTHODES ADMIN
    // ========================================

    /**
     * Récupérer toutes les zones (admin)
     */
    async getAdminZones(params = {}) {
        const searchParams = new URLSearchParams(params);
        const response = await fetch(`${API_URL}/delivery-zones/admin?${searchParams}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des zones');
        }

        return response.json();
    },

    /**
     * Créer une nouvelle zone
     */
    async createZone(zoneData) {
        const response = await fetch(`${API_URL}/delivery-zones`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(zoneData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de la création');
        }

        return response.json();
    },

    /**
     * Mettre à jour une zone
     */
    async updateZone(zoneId, zoneData) {
        const response = await fetch(`${API_URL}/delivery-zones/${zoneId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(zoneData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de la mise à jour');
        }

        return response.json();
    },

    /**
     * Ajouter une ville à une zone
     */
    async addCityToZone(zoneId, cityData) {
        const response = await fetch(`${API_URL}/delivery-zones/${zoneId}/cities`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(cityData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de l\'ajout');
        }

        return response.json();
    },

    /**
     * Supprimer une ville d'une zone
     */
    async removeCityFromZone(zoneId, cityName) {
        const response = await fetch(
            `${API_URL}/delivery-zones/${zoneId}/cities/${encodeURIComponent(cityName)}`,
            {
                method: 'DELETE',
                headers: getAuthHeaders()
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de la suppression');
        }

        return response.json();
    },

    /**
     * Activer/Désactiver une zone
     */
    async toggleZone(zoneId) {
        const response = await fetch(`${API_URL}/delivery-zones/${zoneId}/toggle`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur');
        }

        return response.json();
    },

    /**
     * Supprimer une zone
     */
    async deleteZone(zoneId) {
        const response = await fetch(`${API_URL}/delivery-zones/${zoneId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de la suppression');
        }

        return response.json();
    },

    /**
     * Obtenir les statistiques d'une zone
     */
    async getZoneStats(zoneId) {
        const response = await fetch(`${API_URL}/delivery-zones/${zoneId}/stats`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des statistiques');
        }

        return response.json();
    }
};

export default deliveryZoneService;
