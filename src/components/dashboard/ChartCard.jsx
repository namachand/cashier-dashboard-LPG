function ChartCard({ chart }) {
  const chartWidth = 760;
  const chartHeight = 240;
  const padding = 32;
  const maxValue = Math.max(...chart.cashIn, ...chart.cashOut);
  const points = (values) =>
    values
      .map((value, index) => {
        const x = padding + (index * (chartWidth - padding * 2)) / (values.length - 1);
        const y = chartHeight - padding - (value / maxValue) * (chartHeight - padding * 2);
        return `${x},${y}`;
      })
      .join(' ');

  return (
    <section className="chart-card">
      <div className="card-heading">
        <div>
          <p className="section-label">Cash Flow Today</p>
          <h2>Inflow vs Outflow · hourly</h2>
        </div>
        <div className="legend-pill">
          <span className="legend-dot success" /> Cash In
          <span className="legend-dot danger" /> Cash Out
        </div>
      </div>

      <div className="chart-visual">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="chart-svg" aria-hidden="true">
          <defs>
            <linearGradient id="inflowGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#34a853" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#34a853" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="outflowGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#eb5757" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#eb5757" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <polyline
            points={points(chart.cashIn)}
            fill="none"
            stroke="#34a853"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <polyline
            points={points(chart.cashOut)}
            fill="none"
            stroke="#eb5757"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <polygon
            points={`${points(chart.cashIn)} ${chartWidth - padding},${chartHeight - padding} ${padding},${chartHeight - padding}`}
            fill="url(#inflowGradient)"
            opacity="0.8"
          />
          <polygon
            points={`${points(chart.cashOut)} ${chartWidth - padding},${chartHeight - padding} ${padding},${chartHeight - padding}`}
            fill="url(#outflowGradient)"
            opacity="0.8"
          />
          {[1, 2, 3, 4].map((line) => (
            <line
              key={line}
              x1={padding}
              y1={padding + ((chartHeight - padding * 2) / 4) * line}
              x2={chartWidth - padding}
              y2={padding + ((chartHeight - padding * 2) / 4) * line}
              stroke="#e8edf7"
              strokeWidth="1"
            />
          ))}
        </svg>
        <div className="chart-axis">
          {chart.labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ChartCard;
