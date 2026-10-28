import { useCallback, useState } from "react";
import products from "../../data/products";
import CategoryManager from "../products/CategoryManager";
import ProductForm from "../products/ProductForm";
import InventoryReports from "../reports/InventoryReports";
import ProductTable from "./ProductTable";
import StatCard from "./StatCard";
import type { Product, ProductInput } from "../../types/product";
import {
  CATEGORIES_STORAGE_KEY,
  isCategoryList,
  isProductList,
  PRODUCTS_STORAGE_KEY,
} from "../../utils/localStorage";
import { usePersistentState } from "../../hooks/usePersistentState";
import { calculateInventoryStats } from "../../utils/inventoryStats";

type DashboardProps = {
  searchQuery: string;
};

export default function Dashboard({ searchQuery }: DashboardProps) {
  const {
    value: productList,
    setValue: setProductList,
    storageError,
  } = usePersistentState<Product[]>(
    PRODUCTS_STORAGE_KEY,
    products,
    isProductList
  );
  const {
    value: categories,
    setValue: setCategories,
    storageError: categoryStorageError,
  } = usePersistentState<string[]>(
    CATEGORIES_STORAGE_KEY,
    [...new Set(productList.map((product) => product.category))],
    isCategoryList
  );
  const [productBeingEdited, setProductBeingEdited] = useState<Product | null>(
    null
  );
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [feedback, setFeedback] = useState("");
  const inventoryStats = calculateInventoryStats(productList, categories);

  const closeProductForm = useCallback(() => {
    setProductBeingEdited(null);
    setIsAddingProduct(false);
  }, []);

  function saveProduct(productInput: ProductInput) {
    if (productBeingEdited) {
      setProductList((currentProducts) =>
        currentProducts.map((product) =>
          product.id === productBeingEdited.id
            ? { ...productInput, id: product.id }
            : product
        )
      );
      setFeedback(`${productInput.name} was updated.`);
    } else {
      setProductList((currentProducts) => {
        const nextId =
          currentProducts.reduce(
            (highestId, product) => Math.max(highestId, product.id),
            0
          ) + 1;
        return [...currentProducts, { ...productInput, id: nextId }];
      });
      setFeedback(`${productInput.name} was added.`);
    }

    closeProductForm();
  }

  function deleteProduct(product: Product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }

    setProductList((currentProducts) =>
      currentProducts.filter((item) => item.id !== product.id)
    );
    setFeedback(`${product.name} was deleted.`);
  }

  function addCategory(category: string) {
    setCategories((currentCategories) => [...currentCategories, category]);
  }

  function renameCategory(category: string, newName: string) {
    setCategories((currentCategories) =>
      currentCategories.map((item) => (item === category ? newName : item))
    );
    setProductList((currentProducts) =>
      currentProducts.map((product) =>
        product.category === category
          ? { ...product, category: newName }
          : product
      )
    );
  }

  function deleteCategory(category: string, reassignTo?: string) {
    setCategories((currentCategories) =>
      currentCategories.filter((item) => item !== category)
    );
    if (reassignTo) {
      setProductList((currentProducts) =>
        currentProducts.map((product) =>
          product.category === category
            ? { ...product, category: reassignTo }
            : product
        )
      );
    }
  }

  return (
    <main className="dashboard" id="dashboard">
      <div className="page-heading">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Here's what's happening with your inventory today.</p>
        </div>
        <div className="page-actions">
          <button
            className="primary-button"
            type="button"
            onClick={() => window.print()}
          >
            ↓ Export Report
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              setFeedback("");
              setIsAddingProduct(true);
            }}
          >
            + Add Product
          </button>
        </div>
      </div>

      <p className="feedback-message" role="status" aria-live="polite">
        {feedback}
      </p>
      {storageError && (
        <p className="storage-error" role="alert">
          {storageError}
        </p>
      )}
      {categoryStorageError && (
        <p className="storage-error" role="alert">
          {categoryStorageError}
        </p>
      )}

      <section className="stats-grid">
        <StatCard
          title="Total Products"
          value={String(inventoryStats.totalProducts)}
          change="Inventory"
          description="products registered"
          icon="▦"
          color="blue"
        />
        <StatCard
          title="Total Units"
          value={String(inventoryStats.totalUnits)}
          change="Quantity"
          description="units in stock"
          icon="◫"
          color="orange"
        />
        <StatCard
          title="Total Stock Value"
          value={`${inventoryStats.totalValue.toLocaleString("en-US")} MAD`}
          change="Current"
          description="estimated stock value"
          icon="◇"
          color="purple"
        />
        <StatCard
          title="Low Stock Items"
          value={String(inventoryStats.lowStockProducts)}
          change="Attention"
          description="items need restocking"
          icon="△"
          color="orange"
        />
        <StatCard
          title="Out of Stock"
          value={String(inventoryStats.outOfStockProducts)}
          change="Urgent"
          description="items unavailable"
          icon="⊘"
          color="red"
        />
      </section>

      <CategoryManager
        categories={categories}
        products={productList}
        onAdd={addCategory}
        onRename={renameCategory}
        onDelete={deleteCategory}
      />

      <ProductTable
        products={productList}
        categories={categories}
        searchQuery={searchQuery}
        onEdit={(product) => {
          setFeedback("");
          setProductBeingEdited(product);
        }}
        onDelete={deleteProduct}
      />

      {(isAddingProduct || productBeingEdited) && (
        <ProductForm
          key={productBeingEdited?.id ?? "new-product"}
          products={productList}
          categories={categories}
          product={productBeingEdited ?? undefined}
          onSave={saveProduct}
          onClose={closeProductForm}
        />
      )}

      <InventoryReports
        products={productList}
        categories={categories}
        stats={inventoryStats}
      />

      <footer className="dashboard-footer">
        Inventory Management System <span>•</span> Built with React &amp;
        TypeScript
      </footer>
    </main>
  );
}
