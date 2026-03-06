import apiClient from '../api/client';

/**
 * Get current user profile (requires auth).
 */
export async function getProfile() {
  const { data } = await apiClient.get('/users/profile');
  if (data.success && data.data) return data.data;
  throw new Error(data.message || 'Failed to load profile');
}

/**
 * Get current user enrollments.
 */
export async function getUserEnrollments() {
  const { data } = await apiClient.get('/users/me/enrollments');
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}

/**
 * Get current user purchased blogs.
 */
export async function getPurchasedBlogs() {
  const { data } = await apiClient.get('/users/me/purchased-blogs');
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}
