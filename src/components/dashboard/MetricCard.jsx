function MetricCard({ metric }) {
  return (
    <article className={`metric-card ${metric.variant || 'neutral'}`}>
      <div className="metric-card-header">
        <div className="metric-icon">{metric.icon}</div>
        {metric.badge ? <span className="metric-badge">{metric.badge}</span> : <span className="metric-spacer" />}
      </div>
      <p className="metric-title">{metric.title}</p>
      <p className="metric-value">{metric.value}</p>
      <p className="metric-description">{metric.description}</p>
    </article>
  );
}

export default MetricCard;
