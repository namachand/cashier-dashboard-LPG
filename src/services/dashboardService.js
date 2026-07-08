import { getCashierDashboard } from './cashierApi';

export async function getDashboardData(range = {}) {
  return getCashierDashboard(range);
}
