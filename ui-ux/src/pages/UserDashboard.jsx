import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

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
      // Also clear admin tokens in case they exist
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      navigate("/login");
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

  // If we're on the exact /dashboard route, show the home content
  const isHome = location.pathname === "/dashboard";

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">RedReserve</h1>
          <p className="text-sm text-gray-500 mt-1">Blood Bank System</p>
          {user && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link to="/dashboard" className={navLinkClass("/dashboard")}>
            🏠 Home
          </Link>
          <Link to="/donate" className={navLinkClass("/donate")}>
            🩸 Donate Blood
          </Link>
          <Link to="/request" className={navLinkClass("/request")}>
            📋 Request Blood
          </Link>
          <Link to="/my-donations" className={navLinkClass("/my-donations")}>
            📊 My Donations
          </Link>
          <Link to="/my-requests" className={navLinkClass("/my-requests")}>
            📝 My Requests
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {isHome ? (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name || "User"}!
              </h2>
              <p className="text-gray-600">
                Thank you for being part of our life-saving community.
              </p>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Link
                to="/donate"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary"
              >
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">🩸</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Donate Blood
                    </h3>
                    <p className="text-sm text-gray-600">
                      Book an appointment to donate
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  Every donation can save up to three lives. Schedule your donation appointment today.
                </p>
              </Link>

              <Link
                to="/request"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary"
              >
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">📋</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Request Blood
                    </h3>
                    <p className="text-sm text-gray-600">
                      Submit a blood request
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  Need blood urgently? Submit a request and our team will assist you.
                </p>
              </Link>
            </div>

            {/* Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3 text-lg">
                  Why Donate Blood?
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>✓ Save up to 3 lives with one donation</li>
                  <li>✓ Free health check-up</li>
                  <li>✓ Reduces risk of heart disease</li>
                  <li>✓ Burns calories and maintains weight</li>
                  <li>✓ Stimulates blood cell production</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-3 text-lg">
                  Donation Requirements
                </h3>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>✓ Age: 18-65 years</li>
                  <li>✓ Weight: Minimum 50 kg</li>
                  <li>✓ Hemoglobin: 12.5 g/dL or above</li>
                  <li>✓ Good health with no infections</li>
                  <li>✓ No donation in last 3 months</li>
                </ul>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                Blood Types Compatibility
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                  <div
                    key={type}
                    className="text-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="text-2xl font-bold text-primary">{type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}