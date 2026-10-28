import { useState } from "react";
import type { Product } from "../../types/product";
import { getStockStatus } from "../../utils/stockStatus";

type ProductTableProps = {
  products: Product[];
  categories: string[];
  searchQuery: string;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductTable({
  products,
  categories,
  searchQuery,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const activeCategory = categories.includes(selectedCategory)
    ? selectedCategory
    : "all";

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLocaleLowerCase().includes(normalizedQuery) ||
      product.sku.toLocaleLowerCase().includes(normalizedQuery);
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="inventory-panel" id="products">
      <div className="panel-heading">
        <div>
          <h2>Products</h2>
          <p>Monitor and manage your inventory items.</p>
        </div>
        <div className="panel-controls">
          <label className="category-filter">
            <span>Category</span>
            <select
              aria-label="Filter products by category"
              value={activeCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <button
            className="secondary-button"
            type="button"
            onClick={() => window.print()}
          >
            View / Export
          </button>
        </div>
      </div>

      <div
        className="table-wrapper"
        role="region"
        aria-label="Product inventory"
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>SKU</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>QUANTITY</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const status = getStockStatus(product.quantity);

              return (
                <tr key={product.id}>
                  <td>
                    <div className="product-name">
                      <div className="product-image">
                        {product.name.charAt(0)}
                      </div>
                      <strong>{product.name}</strong>
                    </div>
                  </td>
                  <td className="muted">{product.sku}</td>
                  <td>{product.category}</td>
                  <td className="price">
                    {product.price.toLocaleString("en-US")} MAD
                  </td>
                  <td>{product.quantity}</td>
                  <td>
                    <span className={`status-badge ${status.className}`}>
                      <span className="status-dot" />
                      {status.label}
                    </span>
                  </td>
                  <td className="product-actions">
                    <button
                      className="text-action"
                      type="button"
                      onClick={() => onEdit(product)}
                      aria-label={`Edit ${product.name}`}
                    >
                      Edit
                    </button>
                    <button
                      className="text-action delete-action"
                      type="button"
                      onClick={() => onDelete(product)}
                      aria-label={`Delete ${product.name}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td className="empty-state" colSpan={7}>
                  <strong>No products found</strong>
                  <span>
                    {normalizedQuery || activeCategory !== "all"
                      ? "Try a different product name or SKU, or choose another category."
                      : "There are no products to display."}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span>
          Showing {filteredProducts.length} of {products.length} products
        </span>
      </div>
    </section>
  );
}
