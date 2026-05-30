import { getCashierDashboard } from './cashierApi';

export async function getDashboardData() {
  return getCashierDashboard();
}
