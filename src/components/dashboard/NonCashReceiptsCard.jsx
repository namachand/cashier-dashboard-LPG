function NonCashReceiptsCard({ receipts }) {
  const total = receipts.reduce((sum, item) => {
    const value = Number(item.amount.replace(/[^0-9]/g, ''));
    return sum + value;
  }, 0);

  return (
    <section className="summary-card">
      <div className="card-heading">
        <div>
          <p className="section-label">Non-Cash Receipts</p>
          <h2>Excluded from cash balance</h2>
        </div>
      </div>
      <div className="receipt-list-card">
        {receipts.map((item, index) => (
          <div key={item.type} className="receipt-row">
            <div className="receipt-icon">{item.icon}</div>
            <div className="receipt-details">
              <p className="item-title">{item.type}</p>
              <p className="item-meta">{item.count} transactions</p>
            </div>
            <p className="expense-amount receipt-amount">{item.amount}</p>
          </div>
        ))}
      </div>
      <div className="receipt-total">
        <span>Total</span>
        <strong>₹{total.toLocaleString('en-IN')}</strong>
      </div>
    </section>
  );
}

export default NonCashReceiptsCard;
