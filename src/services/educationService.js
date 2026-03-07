import apiClient from '../api/client';

export async function getEducationList(params = {}) {
  try {
    const { data } = await apiClient.get('/education', { params });
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error('API Error (getEducationList):', err.response?.data || err.message);
    throw err;
  }
}

export async function getEducationById(id) {
  try {
    const { data } = await apiClient.get(`/education/${id}`);
    if (data.success && data.data) return data.data;
    throw new Error(data.message || 'Content not found');
  } catch (err) {
    console.error('API Error (getEducationById):', err.response?.data || err.message);
    throw err;
  }
}

export async function enroll(educationId) {
  try {
    const { data } = await apiClient.post('/education/enroll', { educationId });
    if (data.success) return data;
    throw new Error(data.message || 'Enroll failed');
  } catch (err) {
    console.error('API Error (enroll):', err.response?.data || err.message);
    throw err;
  }
}

export async function getMyEnrollments() {
  try {
    const { data } = await apiClient.get('/education/my/enrollments');
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error('API Error (getMyEnrollments):', err.response?.data || err.message);
    throw err;
  }
}

export async function checkEnrolled(educationId) {
  try {
    const { data } = await apiClient.get(`/education/${educationId}/check-enrolled`);
    return data.success && data.enrolled === true;
  } catch (err) {
    console.error('API Error (checkEnrolled):', err.response?.data || err.message);
    throw err;
  }
}

export async function updateAccess(educationId, progress) {
  try {
    const { data } = await apiClient.patch(`/education/${educationId}/access`, progress != null ? { progress } : {});
    if (data.success) return data.data;
    throw new Error(data.message || 'Update failed');
  } catch (err) {
    console.error('API Error (updateAccess):', err.response?.data || err.message);
    throw err;
  }
}

export async function createEducation(payload) {
  try {
    const { data } = await apiClient.post('/education', payload);
    if (data.success && data.data) return data.data;
    throw new Error(data.message || 'Create failed');
  } catch (err) {
    console.error('API Error (createEducation):', err.response?.data || err.message);
    throw err;
  }
}

export async function updateEducation(id, payload) {
  try {
    const { data } = await apiClient.put(`/education/${id}`, payload);
    if (data.success && data.data) return data.data;
    throw new Error(data.message || 'Update failed');
  } catch (err) {
    console.error('API Error (updateEducation):', err.response?.data || err.message);
    throw err;
  }
}

export async function deleteEducation(id) {
  try {
    const { data } = await apiClient.delete(`/education/${id}`);
    if (data.success) return true;
    throw new Error(data.message || 'Delete failed');
  } catch (err) {
    console.error('API Error (deleteEducation):', err.response?.data || err.message);
    throw err;
  }
}

export async function getEnrollmentsAll() {
  try {
    const { data } = await apiClient.get('/education/enrollments/all');
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error('API Error (getEnrollmentsAll):', err.response?.data || err.message);
    throw err;
  }
}
