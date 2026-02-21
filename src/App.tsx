import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserDonationPage from "./pages/UserDonationPage";
import AdminDashboard from "./pages/AdminDashboard";
import DonorDetailPage from "./pages/DonorDetailPage";
import FpxPayPage from "./pages/FpxPayPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user" element={<UserDonationPage />} />
        <Route path="/user/pay" element={<FpxPayPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/donor" element={<DonorDetailPage />} />
        <Route path="/" element={<Navigate to="/user" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
