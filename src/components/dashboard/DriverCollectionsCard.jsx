function DriverCollectionsCard({ drivers }) {
  return (
    <section className="summary-card driver-collections-card">
      <div className="card-heading summary-heading-block">
        <div>
          <p className="summary-title">Driver Collections</p>
          <h2 className="summary-subtitle">Verify today's deliveries</h2>
        </div>
        <a href="#" className="view-link">View all →</a>
      </div>
      <div className="driver-list">
        {drivers.map((driver, index) => (
          <div key={driver.name} className="driver-item">
            <div className="driver-item-left">
              <div className="item-avatar">{driver.initials}</div>
              <div className="driver-info">
                <p className="driver-name">{driver.name}</p>
                <p className="driver-subtitle">{driver.subtitle}</p>
              </div>
            </div>
            <div className="driver-item-right">
              <p className="driver-amount">{driver.amount}</p>
              <span className={`status-pill ${driver.status.toLowerCase()}`}>{driver.status}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DriverCollectionsCard;
