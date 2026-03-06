import apiClient, { setStoredAuth, clearStoredAuth } from '../api/client';

export async function signup(name, email, password, roleType, phone) {
  try {
    const { data } = await apiClient.post('/auth/signup', { name, email, password, roleType, phone });
    if (data.success && data.token && data.user) {
      setStoredAuth(data.token, data.user);
      return { user: data.user, token: data.token };
    }
    throw new Error(data.message || 'Signup failed');
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    throw new Error(message);
  }
}

export async function login(email, password) {
  try {
    const { data } = await apiClient.post('/auth/login', { email, password });
    if (data.success && data.token && data.user) {
      setStoredAuth(data.token, data.user);
      return { user: data.user, token: data.token };
    }
    throw new Error(data.message || 'Login failed');
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    throw new Error(message);
  }
}

export async function adminLogin(email, password) {
  try {
    const { data } = await apiClient.post('/auth/admin/login', { email, password });
    if (data.success && data.token && data.user) {
      setStoredAuth(data.token, data.user);
      return { user: data.user, token: data.token };
    }
    throw new Error(data.message || 'Admin login failed');
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    throw new Error(message);
  }
}

export async function getMe() {
  const { data } = await apiClient.get('/auth/me');
  if (data.success && data.user) return data.user;
  throw new Error(data.message || 'Failed to get user');
}

export function logout() {
  clearStoredAuth();
}

export async function forgotPassword(email) {
  try {
    const { data } = await apiClient.post('/auth/forgot-password', { email: email?.trim?.() || email });
    if (data.success) return data;
    throw new Error(data.message || 'Failed to send OTP');
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    throw new Error(message);
  }
}

export async function verifyResetOtp(email, otp, newPassword) {
  try {
    const { data } = await apiClient.post('/auth/verify-reset-otp', {
      email: email?.trim?.() || email,
      otp: String(otp).trim(),
      newPassword,
    });
    if (data.success) return data;
    throw new Error(data.message || 'Failed to reset password');
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    throw new Error(message);
  }
}
