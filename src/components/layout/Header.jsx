import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const AUTH_TOKEN_KEY = 'cashier_auth_token';
const AUTH_USER_KEY = 'cashier_auth_user';

function Header() {
  const navigate = useNavigate();

  const date = useMemo(
    () => new Date().toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
    }),
    [],
  );

  const handleSignOut = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    navigate('/login');
  };

  return (
    <header className="page-header">
      <div>
        <p className="page-title">Dashboard</p>
        <p className="page-description">Real time overview of today's cash operations</p>
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
            <small className="profile-role">Cashier</small>
          </div>
          <button type="button" className="logout-btn" onClick={handleSignOut}>Sign out</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
