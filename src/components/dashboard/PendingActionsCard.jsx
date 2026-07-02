const actionIconMap = {
  warning: {
    backgroundColor: '#fff4d0',
    color: '#000000',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
      </svg>
    ),
  },
  danger: {
    backgroundColor: '#ee343b',
    color: '#ffffff',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
        <path d="M12 9v4"></path>
        <path d="M12 17h.01"></path>
      </svg>
    ),
  },
  info: {
    backgroundColor: '#0486d3',
    color: '#ffffff',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
    ),
  },
};

function PendingActionsCard({ actions }) {
  return (
    <section className="pending-card">
      <div className="card-heading">
        <div>
          <p className="pending-actions-title">Pending Actions</p>
          <h2 className="pending-actions-subtitle">{actions.length} items need attention</h2>
        </div>
      </div>
      <div className="actions-list">
        {actions.map((action) => {
          const iconConfig = actionIconMap[action.theme] || actionIconMap.info;

          return (
          <div className="action-row" key={action.title}>
            <div className="action-left">
              <span
                className="action-icon"
                style={{
                  backgroundColor: iconConfig.backgroundColor,
                  color: iconConfig.color,
                }}
              >
                {iconConfig.icon}
              </span>
            </div>
            <div>
              <p className="action-title">{action.title}</p>
              <p className="action-description">{action.description}</p>
            </div>
          </div>
          );
        })}
      </div>
      <button className="review-button">Review all</button>
    </section>
  );
}

export default PendingActionsCard;
