import apiClient from '../api/client';

/**
 * Public: list published blogs.
 */
export async function getBlogs(params = {}) {
  try {
    const { data } = await apiClient.get('/blogs', { params });
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error('API Error (getBlogs):', err.response?.data || err.message);
    throw err;
  }
}

/**
 * Admin: list all blogs (pass { status: 'all' } with auth).
 */
export async function getBlogsAdmin() {
  try {
    const { data } = await apiClient.get('/blogs', { params: { status: 'all' } });
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error('API Error (getBlogsAdmin):', err.response?.data || err.message);
    throw err;
  }
}

export async function getBlogById(id) {
  try {
    const { data } = await apiClient.get(`/blogs/${id}`);
    if (data.success && data.data) return data.data;
    throw new Error(data.message || 'Blog not found');
  } catch (err) {
    console.error('API Error (getBlogById):', err.response?.data || err.message);
    throw err;
  }
}

export async function checkBlogPurchase(blogId) {
  try {
    const { data } = await apiClient.get(`/blogs/${blogId}/check-purchase`);
    return data.success && data.purchased === true;
  } catch (err) {
    console.error('API Error (checkBlogPurchase):', err.response?.data || err.message);
    throw err;
  }
}

export async function createBlogOrder(blogId) {
  try {
    const { data } = await apiClient.post(`/blogs/${blogId}/create-order`);
    if (data.success) return data;
    throw new Error(data.message || 'Failed to create order');
  } catch (err) {
    console.error('API Error (createBlogOrder):', err.response?.data || err.message);
    throw err;
  }
}

export async function verifyBlogPayment(blogId, payload) {
  try {
    const { data } = await apiClient.post(`/blogs/${blogId}/verify-payment`, payload);
    if (data.success) return data;
    throw new Error(data.message || 'Payment verification failed');
  } catch (err) {
    console.error('API Error (verifyBlogPayment):', err.response?.data || err.message);
    throw err;
  }
}

export async function purchaseBlog(blogId) {
  try {
    const { data } = await apiClient.post('/blogs/purchase', { blogId });
    if (data.success && data.data) return data.data;
    throw new Error(data.message || 'Purchase failed');
  } catch (err) {
    console.error('API Error (purchaseBlog):', err.response?.data || err.message);
    throw err;
  }
}

export async function createBlog(payload) {
  try {
    const { data } = await apiClient.post('/blogs', payload);
    if (data.success && data.data) return data.data;
    throw new Error(data.message || 'Create failed');
  } catch (err) {
    console.error('API Error (createBlog):', err.response?.data || err.message);
    throw err;
  }
}

export async function updateBlog(id, payload) {
  try {
    const { data } = await apiClient.put(`/blogs/${id}`, payload);
    if (data.success && data.data) return data.data;
    throw new Error(data.message || 'Update failed');
  } catch (err) {
    console.error('API Error (updateBlog):', err.response?.data || err.message);
    throw err;
  }
}

export async function deleteBlog(id) {
  try {
    const { data } = await apiClient.delete(`/blogs/${id}`);
    if (data.success) return true;
    throw new Error(data.message || 'Delete failed');
  } catch (err) {
    console.error('API Error (deleteBlog):', err.response?.data || err.message);
    throw err;
  }
}
