import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const reports = [
  { title: 'Daily Cash Report', subtitle: 'Full day summary with opening, in/out, closing', icon: '📄' },
  { title: 'Expense Report', subtitle: 'All approved and pending expenses by category', icon: '⬆️' },
  { title: 'Collection Report', subtitle: 'Driver-wise and route-wise collections', icon: '⬇️' },
];

function Reports() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="page-content">
        <Header />
        <main className="page-main">
          <section className="page-header-section">
            <h1>Reports</h1>
            <p>Daily, expense and collection reports</p>
          </section>

          <section className="report-cards-row">
            {reports.map((report) => (
              <article key={report.title} className="report-card">
                <div className="report-icon">{report.icon}</div>
                <div>
                  <h2>{report.title}</h2>
                  <p>{report.subtitle}</p>
                </div>
                <div className="report-actions">
                  <button className="report-action-button">PDF</button>
                  <button className="report-action-button">Excel</button>
                </div>
              </article>
            ))}
          </section>

          <section className="report-filters-card">
            <div className="card-heading">
              <div>
                <p className="section-label">Filters</p>
                <h2>Refine your report data</h2>
              </div>
            </div>
            <div className="report-filters-grid">
              <div className="form-field">
                <label>From Date</label>
                <input type="text" value="01 Apr 2025" readOnly />
              </div>
              <div className="form-field">
                <label>To Date</label>
                <input type="text" value="18 Apr 2025" readOnly />
              </div>
              <div className="form-field">
                <label>Driver</label>
                <select>
                  <option>All drivers</option>
                </select>
              </div>
              <div className="form-field">
                <label>Category</label>
                <select>
                  <option>All categories</option>
                </select>
              </div>
            </div>
            <div className="filter-actions">
              <button className="secondary-button">Reset</button>
              <button className="primary-button">Apply Filters</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Reports;
