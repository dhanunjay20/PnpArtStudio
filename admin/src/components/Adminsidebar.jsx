// admin/src/components/AdminSidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, Package, GraduationCap, Images, Receipt, LogOut, TicketPercent, Send } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const linkBase = "d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none";
const getClass = ({ isActive }) => `${linkBase} ${isActive ? "bg-danger text-white" : "text-dark"}`;

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const LOGOUT_URL = `${API_BASE}/api/auth/logout`;

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("accessToken");
      await axios.post(LOGOUT_URL, {}, { withCredentials: true });
      toast.success("Logged out");
      setTimeout(() => navigate("/admin/login", { replace: true }), 400);
    } catch {
      toast.error("Logout failed");
      setTimeout(() => navigate("/admin/login", { replace: true }), 400);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="px-3 py-3 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 40, height: 40, background: "linear-gradient(135deg,#fb7185,#f59f0b)" }}
          >
            <span className="text-white fw-bold">A</span>
          </div>
          <div className="fw-bold">Admin</div>
        </div>
      </div>

      <nav className="p-2 d-flex flex-column gap-1">
        <div className="px-3 text-muted small mb-1">Main</div>
        <NavLink to="/admin/products" className={getClass}>
          <Package size={18} /> Products
        </NavLink>
        <NavLink to="/admin/classes" className={getClass}>
          <GraduationCap size={18} /> Classes
        </NavLink>
        <NavLink to="/admin/gallery" className={getClass}>
          <Images size={18} /> Gallery
        </NavLink>
        <NavLink to="/admin/orders" className={getClass}>
          <Receipt size={18} /> Orders
        </NavLink>

        {/* New: Coupons */}
        <NavLink to="/admin/coupons" className={getClass}>
          <TicketPercent size={18} /> Coupons
        </NavLink>

        <NavLink to="/admin/newsletters" className={getClass}>
          <Send size={18} /> Newsletters
        </NavLink>

        <div className="px-3 text-muted small mt-3 mb-1">Overview</div>
        <NavLink to="/admin/products" className={getClass}>
          <LayoutGrid size={18} /> Dashboard
        </NavLink>
      </nav>

      <div className="mt-auto p-3 d-flex align-items-center justify-content-between">
        <button
          type="button"
          className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Logout
        </button>
        <span className="text-muted small">© {new Date().getFullYear()} ArtistryStudio</span>
      </div>
    </div>
  );
};

export default AdminSidebar;
