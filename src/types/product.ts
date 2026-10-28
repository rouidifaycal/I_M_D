export type Product = {
  id: number;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  price: number;
};

export type ProductInput = Omit<Product, "id">;
