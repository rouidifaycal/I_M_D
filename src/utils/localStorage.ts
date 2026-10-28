import type { Product } from "../types/product";

export const PRODUCTS_STORAGE_KEY = "invmanage.products.v1";
export const CATEGORIES_STORAGE_KEY = "invmanage.categories.v1";

export function isProductList(value: unknown): value is Product[] {
  if (!Array.isArray(value)) {
    return false;
  }

  const ids = new Set<number>();
  const skus = new Set<string>();
  for (const item of value as unknown[]) {
    if (
      typeof item !== "object" ||
      item === null ||
      !("id" in item) ||
      typeof item.id !== "number" ||
      !Number.isInteger(item.id) ||
      ids.has(item.id) ||
      !("name" in item) ||
      typeof item.name !== "string" ||
      !item.name.trim() ||
      !("sku" in item) ||
      typeof item.sku !== "string" ||
      !item.sku.trim() ||
      !("category" in item) ||
      typeof item.category !== "string" ||
      !item.category.trim() ||
      !("price" in item) ||
      typeof item.price !== "number" ||
      !Number.isFinite(item.price) ||
      item.price <= 0 ||
      !("quantity" in item) ||
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 0
    ) {
      return false;
    }

    const normalizedSku = item.sku.trim().toLocaleLowerCase();
    if (skus.has(normalizedSku)) {
      return false;
    }
    ids.add(item.id);
    skus.add(normalizedSku);
  }

  return true;
}

export function isCategoryList(value: unknown): value is string[] {
  if (!Array.isArray(value)) {
    return false;
  }

  const normalizedCategories = new Set<string>();
  for (const category of value as unknown[]) {
    if (
      typeof category !== "string" ||
      !category.trim() ||
      category !== category.trim()
    ) {
      return false;
    }

    const normalizedCategory = category.toLocaleLowerCase();
    if (normalizedCategories.has(normalizedCategory)) {
      return false;
    }
    normalizedCategories.add(normalizedCategory);
  }

  return true;
}

export function readLocalStorageValue<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T
): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) {
      return fallback;
    }

    const parsed: unknown = JSON.parse(storedValue);
    if (isValid(parsed)) {
      return parsed;
    }

    console.warn(`Ignoring invalid inventory data in localStorage key "${key}".`);
  } catch (error) {
    console.warn(`Unable to read inventory data from localStorage key "${key}".`, error);
  }

  return fallback;
}
