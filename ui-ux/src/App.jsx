import { Routes, Route } from "react-router-dom";

// admin
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Inventory from "./admin/Inventory";
import BloodRequests from "./admin/BloodRequest";
import Donations from "./admin/Donations";

// user
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import DonateBlood from "./pages/DonateBlood";
import RequestBlood from "./pages/RequestBlood";
import MyDonations from "./pages/MyDonations";
import MyRequests from "./pages/MyRequests";

function App() {
  return (
    <Routes>
        {/* USER ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<UserDashboard />}>
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>
        <Route path="/donate" element={<UserDashboard />}>
          <Route index element={<DonateBlood />} />
        </Route>
        <Route path="/request" element={<UserDashboard />}>
          <Route index element={<RequestBlood />} />
        </Route>
        <Route path="/my-donations" element={<UserDashboard />}>
          <Route index element={<MyDonations />} />
        </Route>
        <Route path="/my-requests" element={<UserDashboard />}>
          <Route index element={<MyRequests />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="inventory" element={<Inventory />} />
          <Route path="requests" element={<BloodRequests />} />
          <Route path="donations" element={<Donations />} />
        </Route>

    </Routes>
  );
}

export default App;