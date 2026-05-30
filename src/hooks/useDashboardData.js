import { useEffect, useState } from 'react';
import { getDashboardData } from '../services/dashboardService';

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardData()
      .then((dashboardData) => {
        setData(dashboardData);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load dashboard');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
