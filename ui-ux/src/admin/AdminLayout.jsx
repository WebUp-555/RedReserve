import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminUser, setAdminUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login", { replace: true });
    }
    
    // Get admin user info
    const user = localStorage.getItem("adminUser");
    if (user) {
      try {
        setAdminUser(JSON.parse(user));
      } catch (err) {
        console.error("Failed to parse admin user:", err);
      }
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

  const navItems = [
    { path: "/admin/inventory", label: "📦 Inventory", icon: "📦" },
    { path: "/admin/requests", label: "📋 Blood Requests", icon: "📋" },
    { path: "/admin/donations", label: "🩸 Donations", icon: "🩸" },
    { path: "/admin/users", label: "👥 Users", icon: "👥" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-lg`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary to-primary-dark rounded-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V8.25m0-5v5m0-5H10v5h5V3.25m-7.5 8.5h5m-5 3h5" />
              </svg>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">RedReserve</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Info */}
        {sidebarOpen && adminUser && (
          <div className="px-6 py-4 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900">Administrator</p>
            <p className="text-xs text-gray-600 mt-1 truncate">{adminUser.email}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title={item.label}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-colors duration-200 ${!sidebarOpen && "justify-center"}`}
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            title={sidebarOpen ? "Collapse" : "Expand"}
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}