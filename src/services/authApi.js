import { fetchJson } from './api.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export function identifyAuthMethod(identifier) {
  return fetchJson(`${API_BASE}/auth/identify`, {
    method: 'POST',
    body: JSON.stringify({ identifier }),
  });
}

export function loginWithPassword(identifier, password) {
  return fetchJson(`${API_BASE}/auth/login/password`, {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}

export function requestOtp(identifier) {
  return fetchJson(`${API_BASE}/auth/login/otp/request`, {
    method: 'POST',
    body: JSON.stringify({ identifier }),
  });
}

export function verifyOtp(identifier, otp) {
  return fetchJson(`${API_BASE}/auth/login/otp/verify`, {
    method: 'POST',
    body: JSON.stringify({ identifier, otp }),
  });
}
