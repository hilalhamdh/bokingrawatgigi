import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from "./components/AdminDashboard";
import LoginPage from "./components/LoginPage";

import BookingForm from "./components/BokingForms";
import PrivateRoute from "./components/PrivatRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingForm />} /> {/* Halaman utama form */}
        <Route path="/login" element={<LoginPage />} />{" "}
        {/* Halaman login admin */}
        <Route path="/admin" element={<AdminDashboard />} />{" "}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
