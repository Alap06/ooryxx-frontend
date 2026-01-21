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

const assignmentService = {
    // Get available livreurs
    getAvailableLivreurs: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/assignment/livreurs?${queryString}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Get orders ready for assignment
    getOrdersReadyForAssignment: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/assignment/orders/ready?${queryString}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Assign order to livreur
    assignOrderToLivreur: async (orderId, livreurId) => {
        const response = await fetch(`${API_URL}/assignment/orders/${orderId}/assign`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ livreurId })
        });
        return handleResponse(response);
    },

    // Auto-assign order to best livreur
    autoAssignOrder: async (orderId) => {
        const response = await fetch(`${API_URL}/assignment/orders/${orderId}/auto-assign`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Unassign order (admin only)
    unassignOrder: async (orderId, reason) => {
        const response = await fetch(`${API_URL}/assignment/orders/${orderId}/unassign`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ reason })
        });
        return handleResponse(response);
    }
};

export default assignmentService;
