import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { getLastClosingBalance, startCashierDay } from '../services/cashierApi';

function OpeningCash() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [lastClosingBalance, setLastClosingBalance] = useState(null);

  const [denominations, setDenominations] = useState([
    { label: '₹500', value: 500, count: 0 },
    { label: '₹200', value: 200, count: 0 },
    { label: '₹100', value: 100, count: 0 },
    { label: '₹50', value: 50, count: 0 },
    { label: '₹20', value: 20, count: 0 },
    { label: '₹10', value: 10, count: 0 },
  ]);

  const totalNotes = denominations.reduce((sum, d) => sum + d.count, 0);
  const totalBalance = denominations.reduce((sum, d) => sum + d.value * d.count, 0);

  useEffect(() => {
    async function loadLastClosing() {
      try {
        const response = await getLastClosingBalance();
        if (response?.success) {
          setLastClosingBalance(response.total_cash);
        }
      } catch (err) {
        console.error('Failed to fetch last closing balance:', err);
      }
    }

    loadLastClosing();
  }, []);

  const handleStartDay = async () => {
    setMessage('');
    setError('');

    if (lastClosingBalance !== null && lastClosingBalance !== 0 && Number(totalBalance) !== Number(lastClosingBalance)) {
      setError(`Opening balance must match last closing balance of ₹${lastClosingBalance.toLocaleString('en-IN')}`);
      return;
    }

    const response = await startCashierDay({
      totalAmount: totalBalance,
      denominations: denominations.map((denom) => ({
        label: denom.label,
        value: denom.value,
        count: denom.count,
        subtotal: denom.value * denom.count,
      })),
    });

    if (response?.success) {
      setMessage(response.message);
    } else {
      setError(response?.message || 'Unable to start day.');
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="page-content">
        <Header />
        <main className="page-main">
          <div className="page-header-section">
            <h1>Opening Cash</h1>
            <p>Start your day by counting opening balance</p>
          </div>

          <div className="opening-cash-grid">
            <section className="denomination-card">
              <h2>Denomination Entry</h2>
              <p className="card-subtitle">Count each note carefully — this becomes your day's opening balance</p>

              <div className="denomination-list">
                {denominations.map((denom, index) => (
                  <div key={denom.label} className="denomination-row">
                    <div className="denom-value">{denom.label}</div>
                    <span className="denom-multiply">×</span>
                    <input
                      className="denom-input"
                      type="number"
                      min="0"
                      value={denom.count}
                      onChange={(event) => {
                        const count = Number(event.target.value);
                        if (Number.isNaN(count) || count < 0) return;
                        setDenominations((prev) =>
                          prev.map((item, idx) =>
                            idx === index ? { ...item, count } : item
                          )
                        );
                      }}
                    />
                    <div className="denom-unit">notes</div>
                    <div className="denom-right">
                      <span className="denom-label">Subtotal</span>
                      <span className="denom-subtotal">₹{(denom.value * denom.count).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="opening-summary">
              <div className="summary-card teal">
                <div className="summary-label">TOTAL OPENING BALANCE</div>
                <h3 className="summary-amount">₹{totalBalance.toLocaleString('en-IN')}</h3>
                <div className="summary-details">
                  <div className="detail-item">
                    <span>Total notes</span>
                    <strong>{totalNotes}</strong>
                  </div>
                  <div className="detail-item">
                    <span>Date</span>
                    <strong>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                  </div>
                </div>
              </div>

              <button className="start-day-button" type="button" onClick={handleStartDay}>
                Start Day ⊙
              </button>

              {message && <div className="success-box">{message}</div>}
              {error && <div className="error-box">{error}</div>}

              <div className="info-box">
                <span className="info-icon">⚠</span>
                <p>
                  Opening balance should match the previous closing balance for today. If this is the first day, it will be accepted as the starting cash.
                </p>
                <p>
                  Previous closing balance: ₹{lastClosingBalance !== null ? lastClosingBalance.toLocaleString('en-IN') : '0'}
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default OpeningCash;
