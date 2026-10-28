import { useState } from "react";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <Dashboard searchQuery={searchQuery} />
      </div>
    </div>
  );
}
