import apiClient from '../api/client';

export async function getUsers() {
  const { data } = await apiClient.get('/users');
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

export async function getCmsPages() {
  const { data } = await apiClient.get('/cms/pages');
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}

export async function getCmsPage(slug) {
  const { data } = await apiClient.get(`/cms/pages/${slug}`);
  if (data.success && data.data) return data.data;
  throw new Error(data.message || 'Page not found');
}

export async function upsertCmsPage(payload) {
  const { data } = await apiClient.post('/cms/pages', payload);
  if (data.success && data.data) return data.data;
  throw new Error(data.message || 'Save failed');
}

export async function updateCmsPage(slug, payload) {
  const { data } = await apiClient.put(`/cms/pages/${slug}`, { ...payload, slug });
  if (data.success && data.data) return data.data;
  throw new Error(data.message || 'Update failed');
}
