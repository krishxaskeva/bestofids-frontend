import apiClient from '../api/client';

/**
 * Public: get published patient care posts for website.
 */
export async function getPatientCarePosts() {
  try {
    const { data } = await apiClient.get('/patient-care');
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error('API Error (getPatientCarePosts):', err.response?.data || err.message);
    throw err;
  }
}

/**
 * Admin: get all posts (requires auth).
 */
export async function getPatientCareAdmin() {
  try {
    const { data } = await apiClient.get('/patient-care/admin');
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error('API Error (getPatientCareAdmin):', err.response?.data || err.message);
    throw err;
  }
}

export async function createPatientCarePost(payload) {
  try {
    const { data } = await apiClient.post('/patient-care', payload);
    if (data.success && data.data) return data.data;
    throw new Error(data.message || 'Create failed');
  } catch (err) {
    console.error('API Error (createPatientCarePost):', err.response?.data || err.message);
    throw err;
  }
}

export async function updatePatientCarePost(id, payload) {
  try {
    const { data } = await apiClient.put(`/patient-care/${id}`, payload);
    if (data.success && data.data) return data.data;
    throw new Error(data.message || 'Update failed');
  } catch (err) {
    console.error('API Error (updatePatientCarePost):', err.response?.data || err.message);
    throw err;
  }
}

export async function deletePatientCarePost(id) {
  try {
    const { data } = await apiClient.delete(`/patient-care/${id}`);
    if (data.success) return true;
    throw new Error(data.message || 'Delete failed');
  } catch (err) {
    console.error('API Error (deletePatientCarePost):', err.response?.data || err.message);
    throw err;
  }
}
