import { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useDashboardData } from '../hooks/useDashboardData';
import MetricCard from '../components/dashboard/MetricCard';
import ChartCard from '../components/dashboard/ChartCard';
import PendingActionsCard from '../components/dashboard/PendingActionsCard';
import DriverCollectionsCard from '../components/dashboard/DriverCollectionsCard';
import ExpenseApprovalsCard from '../components/dashboard/ExpenseApprovalsCard';
import NonCashReceiptsCard from '../components/dashboard/NonCashReceiptsCard';

// Local (not UTC) YYYY-MM-DD so the default range matches the cashier's calendar day.
function todayIso() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

function Dashboard() {
  // Default the date filter to today so the dashboard opens on today's data.
  const [dateRange, setDateRange] = useState(() => {
    const today = todayIso();
    return { startDate: today, endDate: today };
  });
  const { data, loading, error } = useDashboardData(dateRange);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="page-content">
        <Header dateRange={dateRange} onApplyRange={setDateRange} />
        <main className="dashboard-grid">
          {loading ? (
            <div className="loading-shell">Loading dashboard…</div>
          ) : error ? (
            <div className="error-shell">{error}</div>
          ) : (
            <>
              <section className="summary-row">
                {data.metrics.map((metric) => (
                  <MetricCard key={metric.title} metric={metric} />
                ))}
              </section>

              <section className="dashboard-main">
                <ChartCard chart={data.chart} />
                <PendingActionsCard actions={data.actions} />
              </section>

              <section className="dashboard-subgrid">
                <DriverCollectionsCard drivers={data.drivers} />
                <ExpenseApprovalsCard approvals={data.approvals} />
                <NonCashReceiptsCard receipts={data.receipts} />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
