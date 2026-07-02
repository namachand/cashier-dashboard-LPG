function ExpenseApprovalsCard({ approvals }) {
  return (
    <section className="summary-card">
      <div className="card-heading summary-heading-block">
        <div>
          <p className="summary-title">Expense Approvals</p>
          <h2 className="summary-subtitle">Awaiting your review</h2>
        </div>
        <a href="#" className="view-link">View all →</a>
      </div>
      <div className="approvals-list">
        {approvals.map((item) => (
          <div key={item.label} className="approval-card">
            <div className="approval-top-row">
              <p className="approval-name">{item.label}</p>
              <p className="expense-amount approval-amount">{item.amount}</p>
            </div>
            <p className="approval-meta">{item.category} · {item.time}</p>
            <div className="approval-button-row">
              <button className="approve-button">Approve</button>
              <button className="reject-button">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExpenseApprovalsCard;
