import apiClient from '../api/client';

/**
 * Get current user profile (requires auth).
 */
export async function getProfile() {
  try {
    const { data } = await apiClient.get('/users/profile');
    if (data.success && data.data) return data.data;
    throw new Error(data.message || 'Failed to load profile');
  } catch (err) {
    console.error('API Error (getProfile):', err.response?.data || err.message);
    throw err;
  }
}

/**
 * Get current user enrollments.
 */
export async function getUserEnrollments() {
  try {
    const { data } = await apiClient.get('/users/me/enrollments');
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error('API Error (getUserEnrollments):', err.response?.data || err.message);
    throw err;
  }
}

/**
 * Get current user purchased blogs.
 */
export async function getPurchasedBlogs() {
  try {
    const { data } = await apiClient.get('/users/me/purchased-blogs');
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error('API Error (getPurchasedBlogs):', err.response?.data || err.message);
    throw err;
  }
}
