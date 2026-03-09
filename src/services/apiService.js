import apiClient from '../api/client';

export async function getUsers() {
  try {
    const { data } = await apiClient.get('/users');
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error('API Error (getUsers):', err.response?.data || err.message);
    throw err;
  }
}

export async function getUserEnrollments(userId) {
  try {
    const { data } = await apiClient.get(`/users/${userId}/enrollments`);
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error('API Error (getUserEnrollments):', err.response?.data || err.message);
    throw err;
  }
}

export async function getUserPurchasedBlogs(userId) {
  try {
    const { data } = await apiClient.get(`/users/${userId}/purchased-blogs`);
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error('API Error (getUserPurchasedBlogs):', err.response?.data || err.message);
    throw err;
  }
}

export async function getPayments() {
  try {
    const { data } = await apiClient.get('/payments');
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error('API Error (getPayments):', err.response?.data || err.message);
    throw err;
  }
}

export async function getBlogPurchases() {
  try {
    const { data } = await apiClient.get('/payments/blog-purchases');
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error('API Error (getBlogPurchases):', err.response?.data || err.message);
    throw err;
  }
}

export async function getStats() {
  try {
    const { data } = await apiClient.get('/stats');
    if (data.success && data.data) return data.data;
    throw new Error(data.message || 'Failed to load stats');
  } catch (err) {
    console.error('API Error (getStats):', err.response?.data || err.message);
    throw err;
  }
}
