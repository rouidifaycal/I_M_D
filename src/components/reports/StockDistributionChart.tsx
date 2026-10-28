import type { InventoryStats } from "../../utils/inventoryStats";

type StockDistributionChartProps = {
  stats: InventoryStats;
};

export default function StockDistributionChart({
  stats,
}: StockDistributionChartProps) {
  const values = [
    {
      label: "In Stock",
      count:
        stats.totalProducts -
        stats.lowStockProducts -
        stats.outOfStockProducts,
      className: "stock-in",
    },
    {
      label: "Low Stock",
      count: stats.lowStockProducts,
      className: "stock-low",
    },
    {
      label: "Out of Stock",
      count: stats.outOfStockProducts,
      className: "stock-out",
    },
  ];
  const chartWidth = 600;
  const segmentWidths = values.map((value) =>
    stats.totalProducts > 0
      ? (value.count / stats.totalProducts) * chartWidth
      : 0
  );

  return (
    <section className="report-card" aria-labelledby="stock-distribution-heading">
      <div className="report-card-heading">
        <div>
          <h2 id="stock-distribution-heading">Product stock distribution</h2>
          <p>Products grouped by their current stock status.</p>
        </div>
      </div>
      {stats.totalProducts === 0 ? (
        <p className="report-empty">Add products to see stock distribution.</p>
      ) : (
        <>
          <div className="chart-scroll">
            <svg
              className="stock-distribution-chart"
              viewBox={`0 0 ${chartWidth} 72`}
              role="img"
              aria-labelledby="stock-chart-title"
              aria-describedby="stock-chart-description"
            >
              <title id="stock-chart-title">Product stock distribution</title>
              <desc id="stock-chart-description">
                {values
                  .map(
                    (value) =>
                      `${value.label}: ${value.count} product${value.count === 1 ? "" : "s"}`
                  )
                  .join(". ")}
                .
              </desc>
              {values.map((value, index) => {
                const precedingWidth = segmentWidths
                  .slice(0, index)
                  .reduce((total, width) => total + width, 0);
                return (
                  <g key={value.label}>
                    <rect
                      className={`stock-segment ${value.className}`}
                      x={precedingWidth}
                      y="20"
                      width={segmentWidths[index]}
                      height="32"
                      rx={index === 0 || index === values.length - 1 ? 8 : 0}
                    >
                      <title>
                        {value.label}: {value.count} product
                        {value.count === 1 ? "" : "s"}
                      </title>
                    </rect>
                  </g>
                );
              })}
            </svg>
          </div>
          <ul className="stock-legend">
            {values.map((value) => (
              <li key={value.label}>
                <span className={`legend-swatch ${value.className}`} />
                <span>{value.label}</span>
                <strong>{value.count}</strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
