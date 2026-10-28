import type { Product } from "../types/product";

const products: Product[] = [
  { id: 1, name: "MacBook Air M3", category: "Electronics", sku: "PRD-001", quantity: 24, price: 12500 },
  { id: 2, name: "Wireless Mouse", category: "Accessories", sku: "PRD-002", quantity: 8, price: 180 },
  { id: 3, name: "Mechanical Keyboard", category: "Accessories", sku: "PRD-003", quantity: 0, price: 650 },
  { id: 4, name: "Dell Monitor 27", category: "Electronics", sku: "PRD-004", quantity: 15, price: 2300 },
  { id: 5, name: "USB-C Hub", category: "Accessories", sku: "PRD-005", quantity: 4, price: 320 },
];

export default products;
