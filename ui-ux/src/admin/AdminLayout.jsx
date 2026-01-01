import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import api from "../services/api";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.adminLogout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      navigate("/admin/login");
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    return `block px-4 py-2 rounded-md transition-colors ${
      isActive(path)
        ? "bg-primary text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">RedReserve</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>

        <nav className="px-4 space-y-2">
          <Link to="/admin/inventory" className={navLinkClass("/admin/inventory")}>
            📦 Inventory
          </Link>
          <Link to="/admin/requests" className={navLinkClass("/admin/requests")}>
            📋 Blood Requests
          </Link>
          <Link to="/admin/donations" className={navLinkClass("/admin/donations")}>
            🩸 Donations
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}