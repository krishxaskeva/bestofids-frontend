import apiClient from '../api/client';

export async function getEducationList(params = {}) {
  const { data } = await apiClient.get('/education', { params });
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}

export async function getEducationById(id) {
  const { data } = await apiClient.get(`/education/${id}`);
  if (data.success && data.data) return data.data;
  throw new Error(data.message || 'Content not found');
}

export async function enroll(educationId) {
  const { data } = await apiClient.post('/education/enroll', { educationId });
  if (data.success) return data;
  throw new Error(data.message || 'Enroll failed');
}

export async function getMyEnrollments() {
  const { data } = await apiClient.get('/education/my/enrollments');
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}

export async function checkEnrolled(educationId) {
  const { data } = await apiClient.get(`/education/${educationId}/check-enrolled`);
  return data.success && data.enrolled === true;
}

export async function updateAccess(educationId, progress) {
  const { data } = await apiClient.patch(`/education/${educationId}/access`, progress != null ? { progress } : {});
  if (data.success) return data.data;
  throw new Error(data.message || 'Update failed');
}

export async function createEducation(payload) {
  const { data } = await apiClient.post('/education', payload);
  if (data.success && data.data) return data.data;
  throw new Error(data.message || 'Create failed');
}

export async function updateEducation(id, payload) {
  const { data } = await apiClient.put(`/education/${id}`, payload);
  if (data.success && data.data) return data.data;
  throw new Error(data.message || 'Update failed');
}

export async function deleteEducation(id) {
  const { data } = await apiClient.delete(`/education/${id}`);
  if (data.success) return true;
  throw new Error(data.message || 'Delete failed');
}

export async function getEnrollmentsAll() {
  const { data } = await apiClient.get('/education/enrollments/all');
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}
