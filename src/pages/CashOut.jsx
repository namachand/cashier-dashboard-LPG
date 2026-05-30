import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useEffect, useState } from 'react';
import { recordOfficeExpense, getTodayOfficeExpenses } from '../services/cashierApi';

function CashOut() {
  const statsCards = [
    { icon: '⏱', label: 'Pending Approvals', value: '2' },
    { icon: '✓', label: 'Approved Today', value: '₹34,200' },
    { icon: '⚡', label: 'Avg Approval Time', value: '3.2s' },
  ];

  const driverExpenses = [
    {
      initials: 'SP',
      name: 'Suresh Patel',
      category: 'Vehicle Fuel',
      time: '2h ago',
      amount: '₹850',
    },
    {
      initials: 'MY',
      name: 'Mahesh Yadav',
      category: 'Tyre Repair',
      time: '3h ago',
      amount: '₹1,450',
    },
    {
      initials: 'VS',
      name: 'Vikram Singh',
      category: 'Toll Charges',
      time: '5h ago',
      amount: '₹240',
    },
  ];

  const recentExpenses = [
    { category: 'UTILITY', item: 'Electricity bill — March', amount: '₹8,400' },
    { category: 'STATIONERY', item: 'Receipt books, pens', amount: '₹1,240' },
    { category: 'REPAIR', item: 'Office printer service', amount: '₹2,200' },
    { category: 'TRAVEL', item: 'Bank visit — auto fare', amount: '₹180' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('Utility');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [todayExpenses, setTodayExpenses] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const res = await getTodayOfficeExpenses();
        if (res.success) setTodayExpenses(res.data || []);
      } catch (err) {
        // ignore for now
      }
    }

    fetchExpenses();
  }, []);

  const handleSelectCategory = (cat) => setSelectedCategory(cat);

  const handleSubmit = async () => {
    if (!selectedCategory || amount === '') return alert('Please enter category and amount');
    const numeric = Number(amount.toString().replace(/[^0-9.-]+/g, '')) || 0;
    setSubmitting(true);
    try {
      await recordOfficeExpense({ category: selectedCategory, amount: numeric, description });
      setAmount('');
      setDescription('');
      const res = await getTodayOfficeExpenses();
      if (res.success) setTodayExpenses(res.data || []);
    } catch (err) {
      alert('Failed to submit expense');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['Salary', 'Utility', 'Repair', 'Stationery', 'Travel', 'Other'];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="page-content">
        <Header />
        <main className="page-main">
          <div className="page-header-section">
            <h1>Cash Out</h1>
            <p>Approve expenses and track outflow</p>
          </div>

          <div className="cash-out-grid">
            <div className="stats-row">
              {statsCards.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
              ))}
            </div>

            <section className="expense-section">
              <h2>Driver Expense Requests</h2>
              <p>Quick approve — average review time 5 seconds</p>

              <div className="expense-list">
                {driverExpenses.map((expense) => (
                  <div key={expense.name} className="expense-item">
                    <div className="expense-left">
                      <div className="expense-avatar">{expense.initials}</div>
                      <div className="expense-details">
                        <strong>{expense.name}</strong>
                        <p>{expense.category} · {expense.time}</p>
                      </div>
                    </div>
                    <div className="expense-right">
                      <span className="expense-amount">{expense.amount}</span>
                      <button className="icon-btn">👁</button>
                      <button className="approve-pay-btn">✓ Approve & Pay</button>
                      <button className="reject-btn">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="expense-entry-grid">
              <section className="expense-entry">
                <h2>Office Expense Entry</h2>
                <p>Add operational expenses</p>

                <form className="office-expense-form">
                  <div className="form-group">
                    <label>Category</label>
                    <div className="category-buttons">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                          onClick={() => handleSelectCategory(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Amount</label>
                    <input value={amount} onChange={(e) => setAmount(e.target.value)} type="text" placeholder="₹ 0" />
                  </div>

                  <div className="form-field">
                    <label>Description</label>
                    <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" placeholder="What is this for?" />
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label>Upload Receipt</label>
                      <div className="file-upload-small">
                        <p>⬇ Upload Receipt</p>
                      </div>
                    </div>
                  </div>

                  <button type="button" disabled={submitting} onClick={handleSubmit} className="submit-expense-btn">{submitting ? 'Submitting...' : 'Submit Expense'}</button>
                </form>
              </section>

              <section className="recent-expenses">
                <h2>Recent Office Expenses</h2>
                <p className="section-date">Today</p>

                <div className="expense-category-list">
                  {todayExpenses.length ? (
                    todayExpenses.map((expense) => (
                      <div key={expense.id} className="expense-category-item">
                        <div className="category-label">{expense.category}</div>
                        <p className="expense-item-name">{expense.description || '-'}</p>
                        <span className="expense-item-amount">₹{Number(expense.amount).toLocaleString('en-IN')}</span>
                      </div>
                    ))
                  ) : (
                    <div className="expense-category-item">No expenses recorded today</div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CashOut;
