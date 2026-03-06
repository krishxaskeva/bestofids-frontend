import apiClient from '../api/client';

/**
 * Public: get published patient care posts for website.
 */
export async function getPatientCarePosts() {
  const { data } = await apiClient.get('/patient-care');
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}

/**
 * Admin: get all posts (requires auth).
 */
export async function getPatientCareAdmin() {
  const { data } = await apiClient.get('/patient-care/admin');
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}

export async function createPatientCarePost(payload) {
  const { data } = await apiClient.post('/patient-care', payload);
  if (data.success && data.data) return data.data;
  throw new Error(data.message || 'Create failed');
}

export async function updatePatientCarePost(id, payload) {
  const { data } = await apiClient.put(`/patient-care/${id}`, payload);
  if (data.success && data.data) return data.data;
  throw new Error(data.message || 'Update failed');
}

export async function deletePatientCarePost(id) {
  const { data } = await apiClient.delete(`/patient-care/${id}`);
  if (data.success) return true;
  throw new Error(data.message || 'Delete failed');
}
