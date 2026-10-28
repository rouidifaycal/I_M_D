import { useState } from "react";
import type { Product } from "../../types/product";
import type { InventoryStats } from "../../utils/inventoryStats";
import { downloadInventoryCsv } from "../../utils/csvExport";
import CategoryValueChart from "./CategoryValueChart";
import StockDistributionChart from "./StockDistributionChart";

type InventoryReportsProps = {
  products: Product[];
  categories: string[];
  stats: InventoryStats;
};

export default function InventoryReports({
  products,
  categories,
  stats,
}: InventoryReportsProps) {
  const [exportFeedback, setExportFeedback] = useState("");

  function exportCsv() {
    try {
      const filename = downloadInventoryCsv(products);
      setExportFeedback(`Downloaded ${filename}.`);
    } catch (error) {
      console.error("Unable to export the inventory CSV.", error);
      setExportFeedback("The inventory CSV could not be exported.");
    }
  }

  return (
    <section className="reports-section" id="reports" aria-labelledby="reports-title">
      <div className="reports-heading">
        <div>
          <h2 id="reports-title">Inventory reports</h2>
          <p>Review current inventory levels and export the product list.</p>
        </div>
        <button className="primary-button csv-export-button" type="button" onClick={exportCsv}>
          Export CSV
        </button>
      </div>
      <p className="report-summary">
        <strong>{stats.totalProducts}</strong> products ·{" "}
        <strong>{stats.totalUnits}</strong> units ·{" "}
        <strong>{stats.totalValue.toLocaleString("en-US")} MAD</strong> total
        inventory value · <strong>{stats.lowStockProducts}</strong> low-stock
        · <strong>{stats.outOfStockProducts}</strong> out-of-stock ·{" "}
        <strong>{categories.length}</strong> categories
      </p>
      {exportFeedback && (
        <p className="export-feedback" role="status" aria-live="polite">
          {exportFeedback}
        </p>
      )}
      <div className="reports-grid">
        <CategoryValueChart
          categories={stats.productsByCategory.map((item) => item.category)}
          products={products}
        />
        <StockDistributionChart stats={stats} />
      </div>
    </section>
  );
}
