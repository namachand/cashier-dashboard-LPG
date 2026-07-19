import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useEffect, useState } from 'react';
import { findCustomer, getOtherPayments, getOtherPaymentsSummary, recordOtherPayment } from '../services/cashierApi';

const methodOptions = [
  { value: 'UPI', label: 'UPI' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'CARD', label: 'Card' },
];

const initialSummary = {
  UPI: { count: 0, totalAmount: 0 },
  BANK_TRANSFER: { count: 0, totalAmount: 0 },
  CARD: { count: 0, totalAmount: 0 },
};

// Local (not UTC) YYYY-MM-DD so the default range matches the cashier's calendar day.
function todayIso() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

const buildSummaryCards = (summary) => [
  {
    label: 'UPI',
    amount: `₹${summary.UPI.totalAmount.toLocaleString('en-IN')}`,
    note: `${summary.UPI.count} transactions`,
    method: 'UPI',
  },
  {
    label: 'Bank Transfer',
    amount: `₹${summary.BANK_TRANSFER.totalAmount.toLocaleString('en-IN')}`,
    note: `${summary.BANK_TRANSFER.count} transactions`,
    method: 'BANK_TRANSFER',
  },
  {
    label: 'Card',
    amount: `₹${summary.CARD.totalAmount.toLocaleString('en-IN')}`,
    note: `${summary.CARD.count} transactions`,
    method: 'CARD',
  },
];

function OtherPayments() {
  // Date filter defaults to today; changing it refetches the summary + list.
  const [dateRange, setDateRange] = useState(() => {
    const today = todayIso();
    return { startDate: today, endDate: today };
  });
  const [summary, setSummary] = useState(initialSummary);
  const [savedTransfers, setSavedTransfers] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [method, setMethod] = useState('UPI');
  const [transferId, setTransferId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [customerResults, setCustomerResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSummary = async () => {
    try {
      const res = await getOtherPaymentsSummary(dateRange);
      if (res.success) {
        setSummary({
          UPI: res.summary.UPI || initialSummary.UPI,
          BANK_TRANSFER: res.summary.BANK_TRANSFER || initialSummary.BANK_TRANSFER,
          CARD: res.summary.CARD || initialSummary.CARD,
        });
      }
    } catch (error) {
      console.error('Unable to load payment summary', error);
    }
  };

  const loadSavedTransfers = async () => {
    try {
      const res = await getOtherPayments(dateRange);
      if (res.success) {
        setSavedTransfers(res.data);
      }
    } catch (error) {
      console.error('Unable to load saved transfers', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadSummary(), loadSavedTransfers()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.startDate, dateRange.endDate]);

  const handleCustomerSearch = async (value) => {
    setCustomerName(value);

    if (!value || value.trim().length < 2) {
      setCustomerResults([]);
      return;
    }

    try {
      const response = await findCustomer(value.trim());
      if (response?.success && Array.isArray(response.data)) {
        setCustomerResults(response.data);
      } else {
        setCustomerResults([]);
      }
    } catch (error) {
      console.error('Customer search failed:', error);
      setCustomerResults([]);
    }
  };

  const handleSelectCustomer = (customer) => {
    setCustomerName(customer?.name || '');
    setCustomerResults([]);
  };

  const handleSaveTransfer = async () => {
    if (!customerName.trim()) return;
    if (!amount.trim() || Number.isNaN(Number(amount))) return;

    setSaving(true);
    try {
      const payload = {
        customer_name: customerName.trim(),
        method,
        transfer_id: transferId.trim() || null,
        amount: Number(amount),
        note: note.trim() || null,
      };

      const response = await recordOtherPayment(payload);
      if (response.success) {
        setCustomerName('');
        setMethod('UPI');
        setTransferId('');
        setAmount('');
        setNote('');
        await loadData();
      }
    } catch (error) {
      console.error('Failed to save transfer', error);
    } finally {
      setSaving(false);
    }
  };

  const getMethodLabel = (methodValue) => {
    if (methodValue === 'BANK_TRANSFER') return 'Bank Transfer';
    if (methodValue === 'CARD') return 'Card';
    return 'UPI';
  };

  const methodIcon = (methodValue) => {
    if (methodValue === 'BANK_TRANSFER') return '🏦';
    if (methodValue === 'CARD') return '💳';
    return '📱';
  };

  if (loading) {
    return <div className="loading-shell">Loading...</div>;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="page-content">
        <Header dateRange={dateRange} onApplyRange={setDateRange} />
        <main className="page-main">

          <section className="payments-summary-row">
            {buildSummaryCards(summary).map((card) => (
              <article key={card.label} className="payment-card">
                <div className="payment-card-icon">{methodIcon(card.method)}</div>
                <p className="payment-card-label">{card.label}</p>
                <h3>{card.amount}</h3>
                <p className="payment-card-note">{card.note}</p>
              </article>
            ))}
          </section>

          <section className="reconciliation-card">
            <div className="card-heading">
              <div>
                <p className="section-label">Bank Transfer Reconciliation</p>
                <h2>Save customer transfer IDs for reconciliation</h2>
              </div>
            </div>
            <div className="reconciliation-grid">
              <div className="reconciliation-form">
                <div className="form-field">
                  <label>Customer name</label>
                  <div className="customer-search-group">
                    <input
                      type="text"
                      placeholder="Customer name"
                      value={customerName}
                      onChange={(e) => handleCustomerSearch(e.target.value)}
                    />
                    {customerResults.length ? (
                      <div className="search-results">
                        {customerResults.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className="search-item"
                            onClick={() => handleSelectCustomer(item)}
                          >
                            <span>{item.name || 'Customer'}</span>
                            <span>{item.phone || '-'}</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="form-field">
                  <label>Method</label>
                  <select value={method} onChange={(e) => setMethod(e.target.value)}>
                    {methodOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Bank transfer ID / UTR</label>
                  <input
                    type="text"
                    placeholder="BANK TRANSFER ID / UTR"
                    value={transferId}
                    onChange={(e) => setTransferId(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Amount (₹)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Note (optional)</label>
                  <input
                    type="text"
                    placeholder="Note (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="save-transfer-btn"
                  onClick={handleSaveTransfer}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : '+ Save transfer ID'}
                </button>
              </div>
            </div>
          </section>

          <section className="saved-transfers-card">
            <div className="card-heading">
              <div>
                <p className="section-label">Saved customer transfer IDs</p>
              </div>
            </div>
            <div className="table-container">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Method</th>
                    <th>Transfer ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {savedTransfers.map((item) => (
                    <tr key={item.id}>
                      <td>{item.customer_name}</td>
                      <td>{getMethodLabel(item.method)}</td>
                      <td>{item.transfer_id || '-'}</td>
                      <td>{item.date}</td>
                      <td>₹{Number(item.amount).toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`status-pill ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button className="icon-btn">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="noncash-card">
            <div className="card-heading">
              <div>
                <p className="section-label">Non-Cash Transactions</p>
                <h2>These are tracked separately from cash balance</h2>
              </div>
            </div>
            <div className="table-container">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Method</th>
                    <th>Reference</th>
                    <th>From</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>14:48</td>
                    <td><span className="method-pill">Bank Transfer</span></td>
                    <td>TXN8842918</td>
                    <td>Hotel Greenview</td>
                    <td>₹48,000</td>
                  </tr>
                  <tr>
                    <td>13:20</td>
                    <td><span className="method-pill">UPI</span></td>
                    <td>PAY-AX9912</td>
                    <td>Sharma Restaurant</td>
                    <td>₹1,850</td>
                  </tr>
                  <tr>
                    <td>12:05</td>
                    <td><span className="method-pill">Card</span></td>
                    <td>VISA-3348</td>
                    <td>Patel Family</td>
                    <td>₹4,200</td>
                  </tr>
                  <tr>
                    <td>11:42</td>
                    <td><span className="method-pill">UPI</span></td>
                    <td>PAY-BC1828</td>
                    <td>Lakshmi Tea Stall</td>
                    <td>₹925</td>
                  </tr>
                  <tr>
                    <td>10:30</td>
                    <td><span className="method-pill">Bank Transfer</span></td>
                    <td>TXN8842348</td>
                    <td>Krishna Caterers</td>
                    <td>₹12,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default OtherPayments;
