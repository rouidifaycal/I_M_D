import type { Product } from "../types/product";
import { getStockStatus } from "./stockStatus";

export type CategoryInventoryCount = {
  category: string;
  count: number;
};

export type InventoryStats = {
  totalProducts: number;
  totalUnits: number;
  totalValue: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  productsByCategory: CategoryInventoryCount[];
};

export function calculateInventoryStats(
  products: Product[],
  categories: string[]
): InventoryStats {
  const knownCategories = new Set([
    ...categories,
    ...products.map((product) => product.category),
  ]);
  const productsByCategory = [...knownCategories]
    .sort((first, second) => first.localeCompare(second))
    .map((category) => ({
      category,
      count: products.filter((product) => product.category === category).length,
    }));

  return {
    totalProducts: products.length,
    totalUnits: products.reduce((total, product) => total + product.quantity, 0),
    totalValue: products.reduce(
      (total, product) => total + product.quantity * product.price,
      0
    ),
    lowStockProducts: products.filter(
      (product) => getStockStatus(product.quantity).className === "low"
    ).length,
    outOfStockProducts: products.filter(
      (product) => getStockStatus(product.quantity).className === "out"
    ).length,
    productsByCategory,
  };
}
