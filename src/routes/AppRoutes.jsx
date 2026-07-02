import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import OpeningCash from '../pages/OpeningCash';
import CashIn from '../pages/CashIn';
import CashOut from '../pages/CashOut';
import LivePosition from '../pages/LivePosition';
import OtherPayments from '../pages/OtherPayments';
import Closing from '../pages/Closing';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Login from '../pages/Login';

const AUTH_TOKEN_KEY = 'cashier_auth_token';
const AUTH_USER_KEY = 'cashier_auth_user';

function RequireCashier({ children }) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userRaw = localStorage.getItem(AUTH_USER_KEY);

  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userRaw);
    if (user?.role !== 'CASHIER') {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireCashier>
            <Dashboard />
          </RequireCashier>
        }
      />
      <Route
        path="/opening-cash"
        element={
          <RequireCashier>
            <OpeningCash />
          </RequireCashier>
        }
      />
      <Route
        path="/cash-in"
        element={
          <RequireCashier>
            <CashIn />
          </RequireCashier>
        }
      />
      <Route
        path="/cash-out"
        element={
          <RequireCashier>
            <CashOut />
          </RequireCashier>
        }
      />
      <Route
        path="/live-position"
        element={
          <RequireCashier>
            <LivePosition />
          </RequireCashier>
        }
      />
      <Route
        path="/other-payments"
        element={
          <RequireCashier>
            <OtherPayments />
          </RequireCashier>
        }
      />
      <Route
        path="/closing"
        element={
          <RequireCashier>
            <Closing />
          </RequireCashier>
        }
      />
      <Route
        path="/reports"
        element={
          <RequireCashier>
            <Reports />
          </RequireCashier>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireCashier>
            <Settings />
          </RequireCashier>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
