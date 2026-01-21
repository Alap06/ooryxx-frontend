const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || 'Erreur serveur');
    }
    return data;
};

const livreurService = {
    // Get dashboard stats
    getDashboard: async () => {
        const response = await fetch(`${API_URL}/livreur/dashboard`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Get assigned orders
    getMyOrders: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/livreur/orders?${queryString}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Scan QR code
    scanQRCode: async (code) => {
        const response = await fetch(`${API_URL}/livreur/scan/${code}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Update order status
    updateOrderStatus: async (orderId, statusData) => {
        const response = await fetch(`${API_URL}/livreur/orders/${orderId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(statusData)
        });
        return handleResponse(response);
    },

    // Get delivery history
    getHistory: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/livreur/history?${queryString}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Update availability
    updateAvailability: async (isAvailable) => {
        const response = await fetch(`${API_URL}/livreur/availability`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ isAvailable })
        });
        return handleResponse(response);
    }
};

export default livreurService;
