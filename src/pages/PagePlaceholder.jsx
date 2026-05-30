import { useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

function PagePlaceholder({ title }) {
  const location = useLocation();

  return (
    <div className="app-shell">
      <Sidebar activePath={location.pathname} />
      <div className="page-content">
        <Header />
        <main className="page-placeholder">
          <div className="page-card">
            <h1>{title}</h1>
            <p>This screen is under development. Use the dashboard for the primary overview.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PagePlaceholder;
