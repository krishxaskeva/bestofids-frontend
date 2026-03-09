import apiClient from '../api/client';

/**
 * Admin notifications API (requires admin auth).
 */
export async function getNotifications(limit = 50) {
  const { data } = await apiClient.get('/notifications', { params: { limit } });
  if (data.success && Array.isArray(data.data)) return data.data;
  return [];
}

export async function getUnreadCount() {
  const { data } = await apiClient.get('/notifications/unread-count');
  if (data.success && typeof data.count === 'number') return data.count;
  return 0;
}

export async function markAllNotificationsRead() {
  const { data } = await apiClient.post('/notifications/mark-all-read');
  return data.success === true;
}
