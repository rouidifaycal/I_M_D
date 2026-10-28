import type { Product } from "../../types/product";

type CategoryValueChartProps = {
  categories: string[];
  products: Product[];
};

const chartWidth = 600;
const labelWidth = 145;
const valueLabelWidth = 90;
const barWidth = chartWidth - labelWidth - valueLabelWidth - 20;

export default function CategoryValueChart({
  categories,
  products,
}: CategoryValueChartProps) {
  const values = categories
    .slice()
    .sort((first, second) => first.localeCompare(second))
    .map((category) => ({
      category,
      value: products
        .filter((product) => product.category === category)
        .reduce((total, product) => total + product.price * product.quantity, 0),
    }));
  const maxValue = Math.max(...values.map(({ value }) => value), 0);
  const chartHeight = Math.max(100, values.length * 38 + 22);

  return (
    <section className="report-card" aria-labelledby="category-value-heading">
      <div className="report-card-heading">
        <div>
          <h2 id="category-value-heading">Inventory value by category</h2>
          <p>Product price multiplied by current quantity.</p>
        </div>
      </div>
      {values.length === 0 ? (
        <p className="report-empty">Add categories to see inventory value.</p>
      ) : (
        <div className="chart-scroll">
          <svg
            className="category-value-chart"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            role="img"
            aria-labelledby="category-value-title"
            aria-describedby="category-value-description"
          >
            <title id="category-value-title">
              Inventory value by category
            </title>
            <desc id="category-value-description">
              Horizontal bars compare the total inventory value for each
              category. Each bar includes its exact value in MAD.
            </desc>
            {values.map(({ category, value }, index) => {
              const y = index * 38 + 14;
              const width = maxValue > 0 ? (value / maxValue) * barWidth : 0;
              const shortenedCategory =
                category.length > 21 ? `${category.slice(0, 18)}...` : category;

              return (
                <g key={category}>
                  <title>
                    {category}: {value.toLocaleString("en-US")} MAD
                  </title>
                  <text
                    className="chart-category-label"
                    x="4"
                    y={y + 13}
                  >
                    {shortenedCategory}
                  </text>
                  <rect
                    className="chart-bar-background"
                    x={labelWidth}
                    y={y}
                    width={barWidth}
                    height="19"
                    rx="5"
                  />
                  <rect
                    className="chart-bar"
                    x={labelWidth}
                    y={y}
                    width={width}
                    height="19"
                    rx="5"
                  />
                  <text
                    className="chart-value-label"
                    x={labelWidth + barWidth + 8}
                    y={y + 13}
                  >
                    {value.toLocaleString("en-US")}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </section>
  );
}
