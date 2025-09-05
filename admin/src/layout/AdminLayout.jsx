// admin/src/layout/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/pnplogo.png"; // Replace with your logo path

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar: visible on lg+, togglable drawer on < lg */}
      <aside
        className="border-end bg-white d-none d-lg-block"
        style={{ width: 260, position: "sticky", top: 0, height: "100vh" }}
      >
        <AdminSidebar />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="position-fixed top-0 start-0 h-100 w-100"
          style={{ background: "rgba(0,0,0,.2)", zIndex: 1040 }}
          onClick={() => setOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`position-fixed top-0 start-0 bg-white border-end d-lg-none ${open ? "" : "d-none"}`}
        style={{ width: 260, height: "100vh", zIndex: 1041 }}
        aria-hidden={!open}
      >
        <div className="d-flex justify-content-end p-2">
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setOpen(false)} aria-label="Close sidebar">
            ×
          </button>
        </div>
        <AdminSidebar />
      </aside>

      {/* Main content */}
      <main className="flex-grow-1">
        {/* Top bar with hamburger (left) and logo (right) on mobile */}
        <div className="border-bottom bg-white d-flex align-items-center px-3 py-2">
          <button
            className="btn btn-outline-secondary d-lg-none me-2"
            onClick={() => setOpen(true)}
            aria-label="Open sidebar"
            aria-controls="admin-sidebar"
            aria-expanded={open}
          >
            ☰
          </button>

          {/* Spacer pushes logo to the right on mobile */}
          <div className="d-lg-none ms-auto">
            {/* Replace src with your logo path; height adjusted for top bar */}
            <img
              src={logo}
              alt="ArtistryStudio"
              height="28"
              className="d-inline-block align-middle"
            />
          </div>
        </div>

        <div className="container py-4">
          <Outlet />
        </div>
      </main>

      {/* Toasts once at layout level */}
      <ToastContainer position="top-right" autoClose={2000} newestOnTop />
    </div>
  );
};

export default AdminLayout;
