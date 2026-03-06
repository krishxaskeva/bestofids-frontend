import apiClient from '../api/client';

export async function getUsers() {
  const { data } = await apiClient.get('/users');
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}

export async function getUserEnrollments(userId) {
  const { data } = await apiClient.get(`/users/${userId}/enrollments`);
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}

export async function getUserPurchasedBlogs(userId) {
  const { data } = await apiClient.get(`/users/${userId}/purchased-blogs`);
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}

export async function getPayments() {
  const { data } = await apiClient.get('/payments');
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}

export async function getBlogPurchases() {
  const { data } = await apiClient.get('/payments/blog-purchases');
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}

export async function getStats() {
  const { data } = await apiClient.get('/stats');
  if (data.success && data.data) return data.data;
  throw new Error(data.message || 'Failed to load stats');
}
