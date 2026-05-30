import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const navItems = [
  { label: 'Dashboard', path: '/', icon: 'dashboard' },
  { label: 'Opening Cash', path: '/opening-cash', icon: 'notebook' },
  { label: 'Cash In', path: '/cash-in', icon: 'cashIn' },
  { label: 'Cash Out', path: '/cash-out', icon: 'cashOut' },
  { label: 'Live Position', path: '/live-position', icon: 'location' },
  { label: 'Other Payments', path: '/other-payments', icon: 'payments' },
  { label: 'Closing', path: '/closing', icon: 'lock' },
  { label: 'Reports', path: '/reports', icon: 'chart' },
  { label: 'Settings', path: '/settings', icon: 'settings' },
];

const iconMap = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 11.5L12 4L20 11.5V20C20 20.5523 19.5523 21 19 21H15C14.4477 21 14 20.5523 14 20V15H10V20C10 20.5523 9.55228 21 9 21H5C4.44772 21 4 20.5523 4 20V11.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  notebook: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4H14C14.5523 4 15 4.44772 15 5V19C15 19.5523 14.5523 20 14 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
      <path d="M15 8H18C18.5523 8 19 8.44772 19 9V17C19 17.5523 18.5523 18 18 18H15" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
      <path d="M8 7H12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M8 11H12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M8 15H12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  cashIn: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M18 12L12 6L6 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  cashOut: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 20V4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M6 12L12 18L18 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  location: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C12 21 5 13.8607 5 9.5C5 6.46243 7.46243 4 10.5 4C13.5376 4 16 6.46243 16 9.5C16 13.8607 9 21 9 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10.5" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.7"/>
    </svg>
  ),
  payments: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="7" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M4 11H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M7 15H7.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="11" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M8 11V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 17L11 13L15 17L17 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 21H19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M7 13V6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M11 17V10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M15 21V14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M19.4 12.9999C19.4 12.3999 19.3 11.7999 19.1 11.1999L21.5 9.29992L19.2 5.69992L16.4 6.99992C15.8 6.49992 15.1 6.09992 14.3 5.89992L13.7 3.09992H10.3L9.7 5.89992C8.9 6.09992 8.2 6.49992 7.6 6.99992L4.8 5.69992L2.5 9.29992L4.9 11.1999C4.7 11.7999 4.6 12.3999 4.6 12.9999C4.6 13.5999 4.7 14.1999 4.9 14.7999L2.5 16.6999L4.8 20.2999L7.6 19.0C8.2 19.5 8.9 19.9 9.7 20.1L10.3 22.9H13.7L14.3 20.1C15.1 19.9 15.8 19.5 16.4 19.0L19.2 20.3L21.5 16.7L19.1 14.8C19.3 14.2 19.4 13.6 19.4 12.9999Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
    </svg>
  ),
};

function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-title">Operations</div>
        <div className="brand-panel">
          <div className="brand-mark">
            <img src={logo} alt="Cashflow logo" />
          </div>
          <div>
            <p className="brand-name">Cashflow</p>
            <span className="brand-subtitle">Bharat Gas Agency</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <span className="nav-icon" aria-hidden="true">{iconMap[item.icon]}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot active" />
        <div>
          <p className="footer-title">Day Active</p>
          <p className="footer-meta">Started at 08:42 AM by Rajesh K.</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
