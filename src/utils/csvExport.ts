import type { Product } from "../types/product";
import { getStockStatus } from "./stockStatus";

function escapeCsvValue(value: string | number): string {
  const text = String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function createInventoryCsv(products: Product[]): string {
  const rows: (string | number)[][] = [
    [
      "Product Name",
      "SKU",
      "Category",
      "Price (MAD)",
      "Quantity",
      "Stock Status",
      "Inventory Value (MAD)",
    ],
    ...products.map((product) => [
      product.name,
      product.sku,
      product.category,
      product.price,
      product.quantity,
      getStockStatus(product.quantity).label,
      product.price * product.quantity,
    ]),
  ];

  return `\uFEFF${rows
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\r\n")}`;
}

export function downloadInventoryCsv(products: Product[]): string {
  const date = new Date().toISOString().slice(0, 10);
  const filename = `inventory-report-${date}.csv`;
  const blob = new Blob([createInventoryCsv(products)], {
    type: "text/csv;charset=utf-8",
  });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);

  return filename;
}
