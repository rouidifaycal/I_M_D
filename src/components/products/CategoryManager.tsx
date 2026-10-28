import { useState } from "react";
import type { FormEvent } from "react";
import type { Product } from "../../types/product";

type CategoryManagerProps = {
  categories: string[];
  products: Product[];
  onAdd: (category: string) => void;
  onRename: (category: string, newName: string) => void;
  onDelete: (category: string, reassignTo?: string) => void;
};

export default function CategoryManager({
  categories,
  products,
  onAdd,
  onRename,
  onDelete,
}: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [reassignment, setReassignment] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  function isDuplicate(name: string, excluding?: string) {
    const normalizedName = name.toLocaleLowerCase();
    return categories.some(
      (category) =>
        category.toLocaleLowerCase() !== excluding?.toLocaleLowerCase() &&
        category.toLocaleLowerCase() === normalizedName
    );
  }

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const category = newCategory.trim();
    if (!category) {
      setError("Enter a category name.");
      return;
    }
    if (isDuplicate(category)) {
      setError("That category already exists.");
      return;
    }

    onAdd(category);
    setNewCategory("");
    setError("");
    setFeedback(`${category} was added.`);
  }

  function handleRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingCategory) {
      return;
    }

    const categoryName = editedName.trim();
    if (!categoryName) {
      setError("Enter a category name.");
      return;
    }
    if (isDuplicate(categoryName, editingCategory)) {
      setError("That category already exists.");
      return;
    }

    onRename(editingCategory, categoryName);
    setEditingCategory(null);
    setEditedName("");
    setError("");
    setFeedback(`${editingCategory} was renamed to ${categoryName}.`);
  }

  function handleDelete(category: string) {
    const affectedCount = products.filter(
      (product) => product.category === category
    ).length;
    const nextCategory =
      affectedCount > 0 &&
      categories.includes(reassignment) &&
      reassignment !== category
        ? reassignment
        : undefined;
    if (affectedCount > 0 && !nextCategory) {
      setError("Choose a category to receive the affected products.");
      return;
    }

    const confirmation = affectedCount
      ? `Delete "${category}" and reassign ${affectedCount} product${affectedCount === 1 ? "" : "s"} to "${nextCategory}"?`
      : `Delete "${category}"?`;
    if (!window.confirm(confirmation)) {
      return;
    }

    onDelete(category, nextCategory);
    setReassignment("");
    setError("");
    setFeedback(
      affectedCount
        ? `${category} was deleted and ${affectedCount} product${affectedCount === 1 ? "" : "s"} were reassigned to ${nextCategory}.`
        : `${category} was deleted.`
    );
  }

  return (
    <section className="category-panel" id="categories">
      <div className="panel-heading">
        <div>
          <h2>Categories</h2>
          <p>Organize products and see the number of items in each category.</p>
        </div>
      </div>

      <form className="category-add-form" onSubmit={handleAdd}>
        <label className="category-add-field">
          <span>Add a category</span>
          <input
            type="text"
            value={newCategory}
            onChange={(event) => {
              setNewCategory(event.target.value);
              setError("");
            }}
            aria-label="New category name"
            placeholder="e.g. Office supplies"
          />
        </label>
        <button className="primary-button" type="submit">
          Add category
        </button>
      </form>

      {error && (
        <p className="category-feedback error" role="alert">
          {error}
        </p>
      )}
      {!error && feedback && (
        <p className="category-feedback" role="status">
          {feedback}
        </p>
      )}

      <ul className="category-list">
        {categories.map((category) => {
          const productCount = products.filter(
            (product) => product.category === category
          ).length;
          const otherCategories = categories.filter(
            (candidate) => candidate !== category
          );
          const isEditing = editingCategory === category;

          return (
            <li className="category-row" key={category}>
              {isEditing ? (
                <form className="category-rename-form" onSubmit={handleRename}>
                  <label>
                    <span className="visually-hidden">Rename {category}</span>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(event) => {
                        setEditedName(event.target.value);
                        setError("");
                      }}
                      autoFocus
                      required
                      aria-invalid={Boolean(error)}
                    />
                  </label>
                  <button
                    className="text-action"
                    type="submit"
                    aria-label={`Save new name for ${category}`}
                  >
                    Save
                  </button>
                  <button
                    className="text-action delete-action"
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    aria-label={`Cancel renaming ${category}`}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div className="category-description">
                    <strong>{category}</strong>
                    <span>
                      {productCount} product{productCount === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="category-row-actions">
                    <button
                      className="text-action"
                      type="button"
                      onClick={() => {
                        setEditingCategory(category);
                        setEditedName(category);
                        setError("");
                      }}
                      aria-label={`Rename ${category}`}
                    >
                      Rename
                    </button>
                    {productCount > 0 && (
                      otherCategories.length > 0 ? (
                        <label className="reassign-control">
                          <span className="visually-hidden">
                            Reassign products in {category} to
                          </span>
                          <select
                            value={reassignment}
                            aria-label={`Reassign products in ${category} to`}
                            onChange={(event) =>
                              setReassignment(event.target.value)
                            }
                          >
                            <option value="">Reassign to...</option>
                            {otherCategories.map((otherCategory) => (
                              <option key={otherCategory} value={otherCategory}>
                                {otherCategory}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : (
                        <span className="reassign-note">
                          Add another category before deleting
                        </span>
                      )
                    )}
                    <button
                      className="text-action delete-action"
                      type="button"
                      disabled={productCount > 0 && otherCategories.length === 0}
                      onClick={() => handleDelete(category)}
                      aria-label={`Delete ${category}`}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          );
        })}
        {categories.length === 0 && (
          <li className="category-empty">
            No categories yet. Add one above to classify products.
          </li>
        )}
      </ul>

      <p className="category-counts-heading">Product count by category</p>
      <div className="category-count-grid">
        {categories.map((category) => (
          <div className="category-count-card" key={category}>
            <span>{category}</span>
            <strong>
              {products.filter((product) => product.category === category).length}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}
