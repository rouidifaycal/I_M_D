import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Product, ProductInput } from "../../types/product";
import {
  validateProductInput,
  type ProductInputErrors,
  type ProductInputValues,
} from "../../utils/productValidation";

type ProductFormProps = {
  products: Product[];
  categories: string[];
  product?: Product;
  onSave: (product: ProductInput) => void;
  onClose: () => void;
};

function getInitialValues(product?: Product): ProductInputValues {
  return {
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    category: product?.category ?? "",
    price: product ? String(product.price) : "",
    quantity: product ? String(product.quantity) : "",
  };
}

export default function ProductForm({
  products,
  categories,
  product,
  onSave,
  onClose,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductInputValues>(() =>
    getInitialValues(product)
  );
  const [errors, setErrors] = useState<ProductInputErrors>({});
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const requestCloseRef = useRef<() => void>(() => undefined);
  const isEditing = product !== undefined;
  const initialValues = getInitialValues(product);
  const hasUnsavedChanges = Object.keys(initialValues).some(
    (field) =>
      values[field as keyof ProductInputValues] !==
      initialValues[field as keyof ProductInputValues]
  );
  const requestClose = useCallback(() => {
    if (
      hasUnsavedChanges &&
      !window.confirm("Discard your unsaved product changes?")
    ) {
      return;
    }

    onClose();
  }, [hasUnsavedChanges, onClose]);

  useEffect(() => {
    requestCloseRef.current = requestClose;
  }, [requestClose]);

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    firstFieldRef.current?.focus();

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        requestCloseRef.current();
      }
    }

    document.addEventListener("keydown", handleEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  function updateField(field: keyof ProductInputValues, value: string) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateProductInput(
      values,
      products,
      product?.id
    );
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSave({
      name: values.name.trim(),
      sku: values.sku.trim(),
      category: values.category.trim(),
      price: Number(values.price),
      quantity: Number(values.quantity),
    });
  }

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") {
      return;
    }

    const focusableElements =
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
    if (!focusableElements?.length) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (
      event.shiftKey &&
      (document.activeElement === firstElement ||
        !dialogRef.current?.contains(document.activeElement))
    ) {
      event.preventDefault();
      lastElement.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === lastElement ||
        !dialogRef.current?.contains(document.activeElement))
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
    >
      <div
        className="product-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        aria-describedby="product-form-description"
        ref={dialogRef}
        onKeyDown={handleDialogKeyDown}
      >
        <div className="dialog-heading">
          <div>
            <h2 id="product-form-title">
              {isEditing ? "Edit product" : "Add product"}
            </h2>
            <p id="product-form-description">
              {isEditing
                ? "Update this product's inventory details."
                : "Enter the details for the new inventory item."}
            </p>
          </div>
          <button
            className="dialog-close"
            type="button"
            onClick={requestClose}
            aria-label="Close product form"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label className="form-field">
            <span>Product name</span>
            <input
              ref={firstFieldRef}
              type="text"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "product-name-error" : undefined}
              required
            />
            {errors.name && (
              <span
                className="field-error"
                id="product-name-error"
                aria-live="polite"
              >
                {errors.name}
              </span>
            )}
          </label>

          <label className="form-field">
            <span>SKU</span>
            <input
              type="text"
              value={values.sku}
              onChange={(event) => updateField("sku", event.target.value)}
              aria-invalid={Boolean(errors.sku)}
              aria-describedby={errors.sku ? "product-sku-error" : undefined}
              required
            />
            {errors.sku && (
              <span
                className="field-error"
                id="product-sku-error"
                aria-live="polite"
              >
                {errors.sku}
              </span>
            )}
          </label>

          <label className="form-field">
            <span>Category</span>
            <select
              value={values.category}
              onChange={(event) => updateField("category", event.target.value)}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={
                errors.category ? "product-category-error" : undefined
              }
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <span
                className="field-error"
                id="product-category-error"
                aria-live="polite"
              >
                {errors.category}
              </span>
            )}
          </label>

          <div className="form-number-fields">
            <label className="form-field">
              <span>Price (MAD)</span>
              <input
                type="number"
                min="0"
                step="any"
                value={values.price}
                onChange={(event) => updateField("price", event.target.value)}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={
                  errors.price ? "product-price-error" : undefined
                }
                required
              />
              {errors.price && (
                <span
                  className="field-error"
                  id="product-price-error"
                  aria-live="polite"
                >
                  {errors.price}
                </span>
              )}
            </label>

            <label className="form-field">
              <span>Quantity</span>
              <input
                type="number"
                min="0"
                step="1"
                value={values.quantity}
                onChange={(event) =>
                  updateField("quantity", event.target.value)
                }
                aria-invalid={Boolean(errors.quantity)}
                aria-describedby={
                  errors.quantity ? "product-quantity-error" : undefined
                }
                required
              />
              {errors.quantity && (
                <span
                  className="field-error"
                  id="product-quantity-error"
                  aria-live="polite"
                >
                  {errors.quantity}
                </span>
              )}
            </label>
          </div>

          <div className="dialog-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={requestClose}
            >
              Cancel
            </button>
            <button className="primary-button" type="submit">
              {isEditing ? "Save changes" : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
