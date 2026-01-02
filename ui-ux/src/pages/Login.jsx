import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.emailOrUsername || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Determine if input is email or username
      const isEmail = formData.emailOrUsername.includes("@");
      const loginPayload = {
        password: formData.password,
        ...(isEmail ? { email: formData.emailOrUsername } : { username: formData.emailOrUsername })
      };

      const response = await api.login(loginPayload);
      
      if (response.data && response.data.accessToken) {
        // Set user token
        localStorage.setItem("userToken", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-primary to-primary-dark rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V8.25m0-5v5m0-5H10v5h5V3.25m-7.5 8.5h5m-5 3h5" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">RedReserve</h1>
          <p className="text-gray-600">Save lives. Donate blood. Make a difference.</p>
        </div>

        {/* Form Card */}
        <form className="card-premium p-8 space-y-6 mb-6" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
            <p className="text-gray-600 text-sm mt-1">Access your blood donation account</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-600 text-red-700 rounded-lg text-sm">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="emailOrUsername" className="block text-sm font-semibold text-gray-700">
              Email or Username
            </label>
            <input
              id="emailOrUsername"
              type="text"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              placeholder="you@example.com or username"
              className="input-premium"
              autoComplete="username"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-premium"
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 font-semibold flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center space-y-3">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Create one
            </Link>
          </p>
          
          {/* Admin Login Link */}
          <div className="pt-3 border-t border-gray-200">
            <Link
              to="/admin/login"
              className="inline-flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
