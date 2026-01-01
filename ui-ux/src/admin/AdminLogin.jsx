import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.adminLogin({ email, password });
      
      if (response.data && response.data.token) {
        // Clear user token if exists to prevent conflicts
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
        
        // Store admin token and data
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminUser", JSON.stringify(response.data.admin));
        
        navigate("/admin/inventory", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden md:flex w-1/2 bg-primary text-white items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">RedReserve</h1>
          <p className="text-sm opacity-80">
            Blood Bank Admin Portal
          </p>
        </div>
      </div>

      {/* Right login panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-[360px]"
        >
          <h2 className="text-2xl font-semibold mb-2">Welcome</h2>
          <p className="text-sm text-gray-500 mb-6">
            Please login to admin panel
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Authorized access only
          </p>
        </form>
      </div>
    </div>
  );
}