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

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/opening-cash" element={<OpeningCash />} />
      <Route path="/cash-in" element={<CashIn />} />
      <Route path="/cash-out" element={<CashOut />} />
      <Route path="/live-position" element={<LivePosition />} />
      <Route path="/other-payments" element={<OtherPayments />} />
      <Route path="/closing" element={<Closing />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
