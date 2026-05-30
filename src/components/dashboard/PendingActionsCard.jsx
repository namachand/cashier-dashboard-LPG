function PendingActionsCard({ actions }) {
  return (
    <section className="pending-card">
      <div className="card-heading">
        <div>
          <p className="section-label">Pending Actions</p>
          <h2>{actions.length} items need attention</h2>
        </div>
      </div>
      <div className="actions-list">
        {actions.map((action) => (
          <div className="action-row" key={action.title}>
            <div>
              <p className="action-title">{action.title}</p>
              <p className="action-description">{action.description}</p>
            </div>
            <span className={`action-count action-${action.theme}`}>{action.badge}</span>
          </div>
        ))}
      </div>
      <button className="review-button">Review all</button>
    </section>
  );
}

export default PendingActionsCard;
