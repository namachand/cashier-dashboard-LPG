import { useEffect, useState } from 'react';
import { getDashboardData } from '../services/dashboardService';

export function useDashboardData(range = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const startDate = range?.startDate || '';
  const endDate = range?.endDate || '';

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getDashboardData({ startDate, endDate })
      .then((dashboardData) => {
        if (active) setData(dashboardData);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load dashboard');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [startDate, endDate]);

  return { data, loading, error };
}
