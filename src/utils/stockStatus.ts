export const LOW_STOCK_THRESHOLD = 5;

export type StockStatus = {
  label: "In Stock" | "Low Stock" | "Out of Stock";
  className: "in" | "low" | "out";
};

export function getStockStatus(quantity: number): StockStatus {
  if (quantity <= 0) {
    return { label: "Out of Stock", className: "out" };
  }

  if (quantity <= LOW_STOCK_THRESHOLD) {
    return { label: "Low Stock", className: "low" };
  }

  return { label: "In Stock", className: "in" };
}
