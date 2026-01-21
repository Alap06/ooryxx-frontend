import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get active announcements (public)
export const getActiveAnnouncements = async () => {
  try {
    const response = await axios.get(`${API_URL}/announcements/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching active announcements:', error);
    return { success: false, data: [] };
  }
};

// Get all announcements (admin)
export const getAllAnnouncements = async (params = {}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/announcements`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

// Get single announcement
export const getAnnouncement = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/announcements/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching announcement:', error);
    throw error;
  }
};

// Create announcement
export const createAnnouncement = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/announcements`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

// Update announcement
export const updateAnnouncement = async (id, data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/announcements/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

// Delete announcement
export const deleteAnnouncement = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/announcements/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};

// Toggle announcement active status
export const toggleAnnouncement = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_URL}/announcements/${id}/toggle`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling announcement:', error);
    throw error;
  }
};
