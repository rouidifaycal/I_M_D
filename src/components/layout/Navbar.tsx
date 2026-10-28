import { useEffect, useRef } from "react";

type NavbarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export default function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleSearchShortcut(event: KeyboardEvent) {
      if (
        event.key.toLocaleLowerCase() === "k" &&
        (event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    }

    window.addEventListener("keydown", handleSearchShortcut);
    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, []);

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Pages</span>
        <span>/</span>
        <strong>Dashboard</strong>
      </div>

      <div className="topbar-actions">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Search products by name or SKU..."
            aria-label="Search inventory"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <kbd aria-hidden="true">Ctrl/⌘ K</kbd>
        </label>
        <div className="topbar-avatar">AD</div>
      </div>
    </header>
  );
}
