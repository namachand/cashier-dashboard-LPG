import { fetchJson } from './api.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export async function getCashierDashboard() {
  return fetchJson(`${API_BASE}/cashier/dashboard`);
}

export async function getDriverCollections(page = 1, limit = 10) {
  return fetchJson(`${API_BASE}/cashier/driver-collections?page=${page}&limit=${limit}`);
}

export async function startCashierDay(payload) {
  return fetchJson(`${API_BASE}/cashier/opening`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function closeCashierDay(payload) {
  return fetchJson(`${API_BASE}/cashier/closing`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function recordOfficeSale(payload) {
  return fetchJson(`${API_BASE}/cashier/office-sale`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getTodayOfficeSales() {
  return fetchJson(`${API_BASE}/cashier/office-sales/today`);
}

export async function verifyDriverCollections(driverId) {
  return fetchJson(`${API_BASE}/cashier/driver-collections/${driverId}/verify`, {
    method: 'POST',
  });
}

export async function getDriverCollectionHistory(driverId, page = 1, limit = 5) {
  return fetchJson(`${API_BASE}/drivers/${driverId}/collection-history?page=${page}&limit=${limit}`);
}

export async function getLastClosingBalance() {
  return fetchJson(`${API_BASE}/cashier/opening/last-closing`);
}

export async function getClosingSummary() {
  return fetchJson(`${API_BASE}/cashier/closing/summary`);
}

export async function searchProducts(query) {
  return fetchJson(`${API_BASE}/drivers/products/search?search=${encodeURIComponent(query)}`);
}

export async function findCustomer(query) {
  return fetchJson(`${API_BASE}/cashier/customers/find?query=${encodeURIComponent(query)}`);
}

export async function recordCashierReceipt(payload) {
  return fetchJson(`${API_BASE}/cashier/receipt`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function recordOfficeExpense(payload) {
  return fetchJson(`${API_BASE}/cashier/office-expense`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getTodayOfficeExpenses() {
  return fetchJson(`${API_BASE}/cashier/office-expenses/today`);
}

export async function recordOtherPayment(payload) {
  return fetchJson(`${API_BASE}/cashier/other-payments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getOtherPayments() {
  return fetchJson(`${API_BASE}/cashier/other-payments`);
}

export async function getOtherPaymentsSummary() {
  return fetchJson(`${API_BASE}/cashier/other-payments/summary`);
}

export async function getTodaysCashFlow() {
  return fetchJson(`${API_BASE}/cashier/cash-flow/today`);
}
