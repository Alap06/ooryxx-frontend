// Admin Service - API calls for admin operations
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const handleResponse = async (response) => {
    let data;
    // Check content type to avoid parsing HTML as JSON
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        const text = await response.text();
        data = { message: response.statusText || 'Erreur non-JSON', detail: text };
    }

    if (!response.ok) {
        // Handle 401 specifically
        if (response.status === 401) {
            console.warn('Authentication required or token expired');
            // Dispatch logout event
            window.dispatchEvent(new Event('auth:unauthorized'));
        }
        throw new Error(data.message || 'Erreur serveur');
    }
    return data;
};

const adminService = {
    // ============== PRODUCTS ==============

    // Get all products with filters
    async getAllProducts(params = {}) {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.search) queryParams.append('search', params.search);
        if (params.barcode) queryParams.append('barcode', params.barcode);
        if (params.category) queryParams.append('category', params.category);
        if (params.status) queryParams.append('status', params.status);
        if (params.vendorId) queryParams.append('vendorId', params.vendorId);
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        const response = await fetch(
            `${API_URL}/admin/products?${queryParams.toString()}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // Create a new product
    async createProduct(productData) {
        const response = await fetch(`${API_URL}/admin/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData)
        });
        return handleResponse(response);
    },

    // Update a product
    async updateProduct(id, productData) {
        const response = await fetch(`${API_URL}/admin/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData)
        });
        return handleResponse(response);
    },

    // Delete a product
    async deleteProduct(id) {
        const response = await fetch(`${API_URL}/admin/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Approve a product
    async approveProduct(id) {
        const response = await fetch(`${API_URL}/admin/products/${id}/approve`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Reject a product
    async rejectProduct(id, reason) {
        const response = await fetch(`${API_URL}/admin/products/${id}/reject`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ reason })
        });
        return handleResponse(response);
    },

    // Get pending products
    async getPendingProducts() {
        const response = await fetch(`${API_URL}/admin/products/pending`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // ============== DASHBOARD ==============

    async getDashboard() {
        const response = await fetch(`${API_URL}/admin/dashboard`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // ============== USERS ==============

    async getUsers(params = {}) {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.role) queryParams.append('role', params.role);

        const response = await fetch(
            `${API_URL}/admin/users?${queryParams.toString()}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    async getUserById(id) {
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    async createUser(userData) {
        const response = await fetch(`${API_URL}/admin/users`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    },

    async updateUser(id, userData) {
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    },

    async updateUserStatus(id, status) {
        const response = await fetch(`${API_URL}/admin/users/${id}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        return handleResponse(response);
    },

    async toggleUserVIP(id) {
        const response = await fetch(`${API_URL}/admin/users/${id}/vip`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    async updateUserRole(id, role) {
        const response = await fetch(`${API_URL}/admin/users/${id}/role`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ role })
        });
        return handleResponse(response);
    },

    async updateUserPassword(id, newPassword) {
        const response = await fetch(`${API_URL}/admin/users/${id}/password`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ newPassword })
        });
        return handleResponse(response);
    },

    async updateUserEmail(id, newEmail) {
        const response = await fetch(`${API_URL}/admin/users/${id}/email`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ newEmail })
        });
        return handleResponse(response);
    },

    async deleteUser(id) {
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // ============== VENDORS ==============

    async getVendors(params = {}) {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.status) queryParams.append('status', params.status);

        const response = await fetch(
            `${API_URL}/admin/vendors?${queryParams.toString()}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // ============== CATEGORIES ==============

    // Get all admin categories with hierarchy and stats
    async getAllAdminCategories(params = {}) {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);
        if (params.parentId !== undefined) queryParams.append('parentId', params.parentId);

        const response = await fetch(
            `${API_URL}/admin/categories?${queryParams.toString()}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // Get category by ID
    async getCategoryById(id) {
        const response = await fetch(`${API_URL}/admin/categories/${id}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Create a new category
    async createCategory(categoryData) {
        const response = await fetch(`${API_URL}/admin/categories`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(categoryData)
        });
        return handleResponse(response);
    },

    // Update a category
    async updateCategory(id, categoryData) {
        const response = await fetch(`${API_URL}/admin/categories/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(categoryData)
        });
        return handleResponse(response);
    },

    // Delete a category
    async deleteCategory(id, params = {}) {
        const queryParams = new URLSearchParams();
        if (params.reassignTo) queryParams.append('reassignTo', params.reassignTo);
        if (params.deleteChildren) queryParams.append('deleteChildren', params.deleteChildren);

        const response = await fetch(
            `${API_URL}/admin/categories/${id}?${queryParams.toString()}`,
            {
                method: 'DELETE',
                headers: getAuthHeaders()
            }
        );
        return handleResponse(response);
    },

    // Get public categories (for selectors)
    async getCategories() {
        // Categories are public, no auth needed
        const response = await fetch(`${API_URL}/categories`);
        return handleResponse(response);
    },

    // ============== IMAGE UPLOAD ==============

    async uploadImage(file) {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_URL}/upload/image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        return handleResponse(response);
    },

    // ============== ORDERS ==============

    async getAllOrders(params = {}) {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key]) queryParams.append(key, params[key]);
        });

        const response = await fetch(
            `${API_URL}/admin/orders?${queryParams.toString()}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // ============== MODERATORS ==============

    async getModerators(params = {}) {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key]) queryParams.append(key, params[key]);
        });
        const response = await fetch(
            `${API_URL}/admin/moderators?${queryParams.toString()}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    async createModerator(data) {
        const response = await fetch(`${API_URL}/admin/moderators`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    async updateModerator(id, data) {
        const response = await fetch(`${API_URL}/admin/moderators/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    async toggleModeratorBlock(id) {
        const response = await fetch(`${API_URL}/admin/moderators/${id}/block`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    async revokeModerator(id) {
        const response = await fetch(`${API_URL}/admin/moderators/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    async getModeratorActivity(id, params = {}) {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key]) queryParams.append(key, params[key]);
        });
        const response = await fetch(
            `${API_URL}/admin/moderators/${id}/activity?${queryParams.toString()}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    async getAllModeratorActivities(params = {}) {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key]) queryParams.append(key, params[key]);
        });
        const response = await fetch(
            `${API_URL}/admin/moderators/activities?${queryParams.toString()}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // ============== COUPONS ==============

    async getAllCoupons(params = {}) {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.search) queryParams.append('search', params.search);
        if (params.promoType) queryParams.append('promoType', params.promoType);
        if (params.status) queryParams.append('status', params.status);

        const response = await fetch(
            `${API_URL}/admin/coupons?${queryParams.toString()}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    async getCouponStats() {
        const response = await fetch(`${API_URL}/admin/coupons/stats`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    async getCouponById(id) {
        const response = await fetch(`${API_URL}/admin/coupons/${id}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    async createCoupon(couponData) {
        const response = await fetch(`${API_URL}/admin/coupons`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(couponData)
        });
        return handleResponse(response);
    },

    async updateCoupon(id, couponData) {
        const response = await fetch(`${API_URL}/admin/coupons/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(couponData)
        });
        return handleResponse(response);
    },

    async deleteCoupon(id) {
        const response = await fetch(`${API_URL}/admin/coupons/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    async toggleCouponStatus(id) {
        const response = await fetch(`${API_URL}/admin/coupons/${id}/toggle`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // ============== NEWSLETTER ==============

    async getNewsletterSubscribers(params = {}) {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);

        const response = await fetch(
            `${API_URL}/admin/newsletter/subscribers?${queryParams.toString()}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    async getNewsletterStats() {
        const response = await fetch(`${API_URL}/admin/newsletter/stats`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    async addNewsletterSubscriber(subscriberData) {
        const response = await fetch(`${API_URL}/admin/newsletter/subscribers`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(subscriberData)
        });
        return handleResponse(response);
    },

    async removeNewsletterSubscriber(id) {
        const response = await fetch(`${API_URL}/admin/newsletter/subscribers/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    async sendNewsletter(newsletterData) {
        const response = await fetch(`${API_URL}/admin/newsletter/send`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(newsletterData)
        });
        return handleResponse(response);
    }
};

export default adminService;
