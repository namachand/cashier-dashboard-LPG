import { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const initialSettings = [
  { key: 'access', title: 'Role-Based Access Control', subtitle: 'Cashiers, Managers, and Admins have separate permissions', enabled: true },
  { key: 'audit', title: 'Audit Trail', subtitle: 'Every action is logged with timestamp and user', enabled: true },
  { key: 'dayLock', title: 'Day Lock After Closing', subtitle: 'Prevent edits after day is closed without admin override', enabled: true },
  { key: 'alerts', title: 'Large Transaction Alerts', subtitle: 'Notify on transactions above ₹40,000', enabled: true },
  { key: 'offline', title: 'Offline Mode', subtitle: 'Save entries locally and sync when online', enabled: false },
  { key: 'duplicate', title: 'Duplicate Bill Prevention', subtitle: 'Block duplicate bill numbers automatically', enabled: true },
];

function Settings() {
  const [options, setOptions] = useState(initialSettings);

  const toggleOption = (key) => {
    setOptions((prev) => prev.map((item) => (item.key === key ? { ...item, enabled: !item.enabled } : item)));
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="page-content">
        <Header />
        <main className="page-main">

          <section className="settings-card">
            <div className="card-heading">
              <div>
                <p className="section-label">Settings & Security</p>
                <h2>Role-based access · audit trail enabled</h2>
              </div>
            </div>
            <div className="settings-grid">
              {options.map((item) => (
                <div key={item.key} className="setting-row">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                  <button
                    className={item.enabled ? 'toggle-switch active' : 'toggle-switch'}
                    onClick={() => toggleOption(item.key)}
                    type="button"
                  >
                    <span className="toggle-thumb" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Settings;
