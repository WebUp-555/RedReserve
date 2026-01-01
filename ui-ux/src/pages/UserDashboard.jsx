import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        navigate("/login", { replace: true });
      }
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      navigate("/login");
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isHome = location.pathname === "/dashboard";

  const navItems = [
    { path: "/dashboard", label: "Home", icon: "🏠" },
    { path: "/donate", label: "Donate Blood", icon: "🩸" },
    { path: "/request", label: "Request Blood", icon: "📋" },
    { path: "/my-donations", label: "My Donations", icon: "📊" },
    { path: "/my-requests", label: "My Requests", icon: "📝" },
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
                <p className="text-xs text-gray-500">Blood Donation</p>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        {sidebarOpen && user && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-br from-red-50 to-red-100/50">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-600 mt-1 truncate">{user.email}</p>
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

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {isHome ? (
          <div className="p-8">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="section-header">Welcome back, {user?.name || "User"}!</h1>
              <p className="section-subtitle text-base">You're making a difference in people's lives</p>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Link
                to="/donate"
                className="card-premium p-8 hover:shadow-lg group cursor-pointer overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4">🩸</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Donate Blood</h3>
                  <p className="text-gray-600 mb-4">Book an appointment to donate</p>
                  <p className="text-sm text-gray-600">
                    Every donation can save up to three lives. Schedule your donation appointment today.
                  </p>
                  <div className="mt-4 inline-flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                    <span>Get Started</span>
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>

              <Link
                to="/request"
                className="card-premium p-8 hover:shadow-lg group cursor-pointer overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4">📋</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Blood</h3>
                  <p className="text-gray-600 mb-4">Submit a blood request</p>
                  <p className="text-sm text-gray-600">
                    Need blood urgently? Submit a request and our team will assist you.
                  </p>
                  <div className="mt-4 inline-flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                    <span>Submit Request</span>
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="card-premium p-8 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="text-3xl">💪</div>
                  <h3 className="font-bold text-blue-900 text-xl">Why Donate Blood?</h3>
                </div>
                <ul className="space-y-2 text-sm text-blue-900">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Save up to 3 lives with one donation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Free health check-up</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Reduces risk of heart disease</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Improves overall health</span>
                  </li>
                </ul>
              </div>

              <div className="card-premium p-8 bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="text-3xl">📋</div>
                  <h3 className="font-bold text-green-900 text-xl">Donation Requirements</h3>
                </div>
                <ul className="space-y-2 text-sm text-green-900">
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Age: 18-65 years</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Weight: Minimum 50 kg</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Hemoglobin: 12.5 g/dL or above</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>No donation in last 3 months</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Blood Type Compatibility */}
            <div className="card-premium p-8">
              <h3 className="font-bold text-gray-900 text-xl mb-6">Blood Type Compatibility</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                  <div
                    key={type}
                    className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200 hover:shadow-md transition-shadow"
                  >
                    <div className="text-3xl font-bold text-primary">{type}</div>
                    <p className="text-xs text-gray-600 mt-2">Blood Type</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}