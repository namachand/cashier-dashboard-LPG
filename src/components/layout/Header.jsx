import { useMemo } from 'react';

function Header() {
  const date = useMemo(
    () => new Date().toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
    }),
    [],
  );

  return (
    <header className="page-header">
      <div>
        <p className="page-title">Dashboard</p>
        <p className="page-description">Real-time overview of today’s cash operations</p>
      </div>

      <div className="header-actions">
        <label className="search-pill">
          <span className="search-icon">🔍</span>
          <span>Search bills, drivers…</span>
        </label>
        <div className="date-pill">{date}</div>
        <button type="button" className="icon-button notification-button" aria-label="Notifications">
          <span>🔔</span>
        </button>
        <div className="profile-pill">
          <div className="avatar">RK</div>
          <div className="profile-details">
            <span className="profile-name">Rajesh K.</span>
            <small className="profile-role">Cashier · Manager</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
