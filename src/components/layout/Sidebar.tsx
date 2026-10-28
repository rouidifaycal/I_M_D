import { useEffect, useState } from "react";

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("#dashboard");

  useEffect(() => {
    function updateActiveSection() {
      setActiveSection(window.location.hash || "#dashboard");
    }

    updateActiveSection();
    window.addEventListener("hashchange", updateActiveSection);
    return () => window.removeEventListener("hashchange", updateActiveSection);
  }, []);

  function getNavProps(section: string) {
    return {
      className: `menu-item${activeSection === section ? " active" : ""}`,
      "aria-current": activeSection === section ? ("location" as const) : undefined,
    };
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">I</div>
        <span>InvManage</span>
      </div>

      <p className="menu-label">MAIN MENU</p>

      <nav className="menu" aria-label="Primary navigation">
        <a {...getNavProps("#dashboard")} href="#dashboard">
          <span className="menu-item-icon" aria-hidden="true">▦</span>
          <span className="menu-item-label">Dashboard</span>
        </a>
        <a {...getNavProps("#products")} href="#products">
          <span className="menu-item-icon" aria-hidden="true">□</span>
          <span className="menu-item-label">Products</span>
        </a>
        <a {...getNavProps("#categories")} href="#categories">
          <span className="menu-item-icon" aria-hidden="true">◫</span>
          <span className="menu-item-label">Categories</span>
        </a>
        <a {...getNavProps("#reports")} href="#reports">
          <span className="menu-item-icon" aria-hidden="true">▤</span>
          <span className="menu-item-label">Reports</span>
        </a>
      </nav>

      <div className="sidebar-bottom">
        <div className="help-box">
          <div className="help-icon">?</div>
          <strong>Need help?</strong>
          <p>Support contact options are not configured in this demo.</p>
        </div>
        <div className="user-profile">
          <div className="avatar">AD</div>
          <div>
            <strong>Admin User</strong>
            <p>Administrator</p>
          </div>
          <span className="profile-more">•••</span>
        </div>
      </div>
    </aside>
  );
}
