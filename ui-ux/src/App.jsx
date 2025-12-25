import { Routes, Route, Navigate } from "react-router-dom";

// user pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RequestBlood from "./pages/RequestBlood";
import DonateBlood from "./pages/DonateBlood";
import MyRequests from "./pages/MyRequests";
import MyDonations from "./pages/MyDonations";

// admin pages
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Inventory from "./admin/Inventory";
import BloodRequests from "./admin/BloodRequest";
import Donations from "./admin/Donations";

function App() {
  return (
    <Routes>
      {/* User routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/request-blood" element={<RequestBlood />} />
      <Route path="/donate-blood" element={<DonateBlood />} />
      <Route path="/my-requests" element={<MyRequests />} />
      <Route path="/my-donations" element={<MyDonations />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="inventory" element={<Inventory />} />
        <Route path="requests" element={<BloodRequests />} />
        <Route path="donations" element={<Donations />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
}

export default App;