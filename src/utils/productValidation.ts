import type { Product, ProductInput } from "../types/product";

export type ProductInputValues = {
  name: string;
  sku: string;
  category: string;
  price: string;
  quantity: string;
};

export type ProductInputErrors = Partial<
  Record<keyof ProductInput, string>
>;

export function validateProductInput(
  values: ProductInputValues,
  products: Product[],
  editingProductId?: number
): ProductInputErrors {
  const errors: ProductInputErrors = {};
  const name = values.name.trim();
  const sku = values.sku.trim();
  const category = values.category.trim();
  const price = Number(values.price);
  const quantity = Number(values.quantity);

  if (!name) {
    errors.name = "Product name is required.";
  }

  if (!sku) {
    errors.sku = "SKU is required.";
  } else if (
    products.some(
      (product) =>
        product.id !== editingProductId &&
        product.sku.trim().toLocaleLowerCase() === sku.toLocaleLowerCase()
    )
  ) {
    errors.sku = "This SKU is already in use.";
  }

  if (!category) {
    errors.category = "Category is required.";
  }

  if (!values.price.trim()) {
    errors.price = "Price is required.";
  } else if (!Number.isFinite(price) || price <= 0) {
    errors.price = "Enter a price greater than 0.";
  }

  if (!values.quantity.trim()) {
    errors.quantity = "Quantity is required.";
  } else if (!Number.isInteger(quantity) || quantity < 0) {
    errors.quantity = "Enter a whole number greater than or equal to 0.";
  }

  return errors;
}
