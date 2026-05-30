import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useDashboardData } from '../hooks/useDashboardData';
import MetricCard from '../components/dashboard/MetricCard';
import ChartCard from '../components/dashboard/ChartCard';
import PendingActionsCard from '../components/dashboard/PendingActionsCard';
import DriverCollectionsCard from '../components/dashboard/DriverCollectionsCard';
import ExpenseApprovalsCard from '../components/dashboard/ExpenseApprovalsCard';
import NonCashReceiptsCard from '../components/dashboard/NonCashReceiptsCard';

function Dashboard() {
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return <div className="loading-shell">Loading dashboard…</div>;
  }

  if (error) {
    return <div className="error-shell">{error}</div>;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="page-content">
        <Header />
        <main className="dashboard-grid">
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
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
