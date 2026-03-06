import apiClient from '../api/client';

/**
 * Public: list published blogs.
 */
export async function getBlogs(params = {}) {
  const { data } = await apiClient.get('/blogs', { params });
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}

/**
 * Admin: list all blogs (pass { status: 'all' } with auth).
 */
export async function getBlogsAdmin() {
  const { data } = await apiClient.get('/blogs', { params: { status: 'all' } });
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}

export async function getBlogById(id) {
  const { data } = await apiClient.get(`/blogs/${id}`);
  if (data.success && data.data) return data.data;
  throw new Error(data.message || 'Blog not found');
}

export async function checkBlogPurchase(blogId) {
  const { data } = await apiClient.get(`/blogs/${blogId}/check-purchase`);
  return data.success && data.purchased === true;
}

export async function createBlogOrder(blogId) {
  const { data } = await apiClient.post(`/blogs/${blogId}/create-order`);
  if (data.success) return data;
  throw new Error(data.message || 'Failed to create order');
}

export async function verifyBlogPayment(blogId, payload) {
  const { data } = await apiClient.post(`/blogs/${blogId}/verify-payment`, payload);
  if (data.success) return data;
  throw new Error(data.message || 'Payment verification failed');
}

export async function purchaseBlog(blogId) {
  const { data } = await apiClient.post('/blogs/purchase', { blogId });
  if (data.success && data.data) return data.data;
  throw new Error(data.message || 'Purchase failed');
}

export async function createBlog(payload) {
  const { data } = await apiClient.post('/blogs', payload);
  if (data.success && data.data) return data.data;
  throw new Error(data.message || 'Create failed');
}

export async function updateBlog(id, payload) {
  const { data } = await apiClient.put(`/blogs/${id}`, payload);
  if (data.success && data.data) return data.data;
  throw new Error(data.message || 'Update failed');
}

export async function deleteBlog(id) {
  const { data } = await apiClient.delete(`/blogs/${id}`);
  if (data.success) return true;
  throw new Error(data.message || 'Delete failed');
}
