// src/pages/AdminDashboard.jsx
import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Edit, Trash2, Image as ImageIcon, DollarSign, Tag, Layers,
  Package, BookOpen, GraduationCap, Calendar, Users
} from "lucide-react";
import { Link } from "react-router-dom";

// If available in your project:
import { useAuth } from "../context/AuthContext";
import { sampleProducts } from "../data/Products";
import './AdminDashboard.css'

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const slugify = (s) =>
  (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const CATEGORIES = [
  "Paintings",
  "Return Gifts",
  "Workshops",
  "Custom Orders",
  "Digital Prints",
  "Handcrafted Items",
  "Limited Editions",
];

const EMPTY_PRODUCT = {
  id: "",
  title: "",
  category: "Paintings",
  price: "",
  salePrice: "",
  stock: 1,
  images: [],
  description: "",
  published: true,
};

const EMPTY_CLASS = {
  id: "",
  title: "",
  mode: "Online", // Online | Offline
  startDate: "",
  durationWeeks: 4,
  seats: 10,
  price: "",
  level: "Beginner", // Beginner | Intermediate | Advanced
  cover: "",
  description: "",
  published: true,
};

const AdminDashboard = () => {
  // Safe call of useAuth (no optional-chaining invocation)
  const auth = typeof useAuth === "function" ? useAuth() : {};
  const { user } = auth || {};
  const isAdmin = user?.role === "admin" || true; // set to true until roles are wired

  // Seed a few products from sampleProducts if present
  const seeded = useMemo(
    () => (Array.isArray(sampleProducts) ? sampleProducts.slice(0, 8) : []),
    []
  );

  const [tab, setTab] = useState("products"); // 'products' | 'classes'

  // Products state
  const [products, setProducts] = useState(
    seeded.map((p, i) => ({
      id: p.id || uid() + i,
      title: p.title || p.name || "",
      category: p.category || "Paintings",
      price: p.price ?? "",
      salePrice: p.salePrice ?? "",
      stock: typeof p.stock === "number" ? p.stock : 1,
      images: Array.isArray(p.images) ? p.images : p.image ? [p.image] : [],
      description: p.description || "",
      published: true,
    }))
  );
  const [editingProductId, setEditingProductId] = useState("");
  const [pForm, setPForm] = useState(EMPTY_PRODUCT);
  const fileInputRef = useRef(null);

  // Classes state
  const [classes, setClasses] = useState([]);
  const [editingClassId, setEditingClassId] = useState("");
  const [cForm, setCForm] = useState(EMPTY_CLASS);

  // UI alerts
  const [msg, setMsg] = useState({ type: "", text: "" });
  const toast = (type, text) => {
    setMsg({ type, text });
    window.clearTimeout((toast)._t);
    (toast)._t = window.setTimeout(() => setMsg({ type: "", text: "" }), 2200);
  };

  // Image input handler (local object URLs for preview)
  const handleImageFiles = (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    const urls = list.map((f) => URL.createObjectURL(f));
    setPForm((f) => ({ ...f, images: [...f.images, ...urls] }));
  };

  // PRODUCTS
  const saveProduct = (e) => {
    e?.preventDefault?.();
    if (!pForm.title.trim()) return toast("danger", "Product title is required.");
    if (!pForm.price || Number(pForm.price) <= 0)
      return toast("danger", "Valid price is required.");

    if (editingProductId) {
      setProducts((arr) =>
        arr.map((it) => (it.id === editingProductId ? { ...it, ...pForm, id: editingProductId } : it))
      );
      setEditingProductId("");
      toast("success", "Product updated.");
    } else {
      const id = uid();
      setProducts((arr) => [{ ...pForm, id }, ...arr]);
      toast("success", "Product created.");
    }

    setPForm(EMPTY_PRODUCT);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const editProduct = (id) => {
    const found = products.find((p) => p.id === id);
    if (!found) return;
    setEditingProductId(id);
    setPForm({ ...found });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = (id) => {
    if (!window.confirm("Delete this product?")) return;
    setProducts((arr) => arr.filter((p) => p.id !== id));
    if (editingProductId === id) {
      setEditingProductId("");
      setPForm(EMPTY_PRODUCT);
    }
    toast("success", "Product deleted.");
  };

  // CLASSES
  const saveClass = (e) => {
    e?.preventDefault?.();
    if (!cForm.title.trim()) return toast("danger", "Class title is required.");
    if (!cForm.startDate) return toast("danger", "Start date is required.");

    if (editingClassId) {
      setClasses((arr) =>
        arr.map((it) => (it.id === editingClassId ? { ...it, ...cForm, id: editingClassId } : it))
      );
      setEditingClassId("");
      toast("success", "Class updated.");
    } else {
      const id = uid();
      setClasses((arr) => [{ ...cForm, id }, ...arr]);
      toast("success", "Class created.");
    }

    setCForm(EMPTY_CLASS);
  };

  const editClass = (id) => {
    const found = classes.find((c) => c.id === id);
    if (!found) return;
    setEditingClassId(id);
    setCForm({ ...found });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteClass = (id) => {
    if (!window.confirm("Delete this class?")) return;
    setClasses((arr) => arr.filter((c) => c.id !== id));
    if (editingClassId === id) {
      setEditingClassId("");
      setCForm(EMPTY_CLASS);
    }
    toast("success", "Class deleted.");
  };

  if (!isAdmin) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Admin access required. <Link to="/login" className="alert-link">Sign in</Link>.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h1 className="h3 fw-bold mb-0">Admin Dashboard</h1>
          <small className="text-muted">Manage products and art classes</small>
        </div>
        <div className="btn-group">
          <button
            className={`btn btn-sm ${tab === "products" ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => setTab("products")}
          >
            <Package size={16} className="me-1" /> Products
          </button>
          <button
            className={`btn btn-sm ${tab === "classes" ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => setTab("classes")}
          >
            <GraduationCap size={16} className="me-1" /> Art Classes
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`alert alert-${msg.type} py-2 mb-3`} role="alert">
          {msg.text}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {tab === "products" && (
        <>
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm rounded-4 mb-4"
          >
            <div className="card-body p-3 p-lg-4">
              <h2 className="h5 fw-semibold mb-3">
                {editingProductId ? "Edit Product" : "Add New Product"}
              </h2>

              <form onSubmit={saveProduct}>
                <div className="row g-3">
                  <div className="col-12 col-lg-6">
                    <label className="form-label small fw-semibold">Title</label>
                    <input
                      className="form-control"
                      placeholder="e.g., Sunset Over Waves"
                      value={pForm.title}
                      onChange={(e) => setPForm((f) => ({ ...f, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">Category</label>
                    <select
                      className="form-select"
                      value={pForm.category}
                      onChange={(e) => setPForm((f) => ({ ...f, category: e.target.value }))}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">Slug</label>
                    <input className="form-control" value={slugify(pForm.title)} disabled />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">
                      <DollarSign size={14} className="me-1" />
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      placeholder="0.00"
                      value={pForm.price}
                      onChange={(e) => setPForm((f) => ({ ...f, price: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">
                      <Tag size={14} className="me-1" />
                      Sale Price (optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      placeholder="0.00"
                      value={pForm.salePrice}
                      onChange={(e) => setPForm((f) => ({ ...f, salePrice: e.target.value }))}
                    />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">
                      <Layers size={14} className="me-1" />
                      Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={pForm.stock}
                      onChange={(e) => setPForm((f) => ({ ...f, stock: Number(e.target.value || 0) }))}
                    />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">Visibility</label>
                    <select
                      className="form-select"
                      value={pForm.published ? "published" : "draft"}
                      onChange={(e) => setPForm((f) => ({ ...f, published: e.target.value === "published" }))}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">
                      <BookOpen size={14} className="me-1" />
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Short description for storefront and SEO."
                      value={pForm.description}
                      onChange={(e) => setPForm((f) => ({ ...f, description: e.target.value }))}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold d-block">Images</label>
                    <div className="d-flex gap-2 flex-wrap">
                      {Array.isArray(pForm.images) && pForm.images.length > 0 &&
                        pForm.images.map((src, i) => (
                          <div key={i} className="img-tile">
                            <img src={src} alt={`p-${i}`} />
                            <button
                              type="button"
                              className="btn btn-sm btn-light remove"
                              onClick={() =>
                                setPForm((f) => ({
                                  ...f,
                                  images: f.images.filter((_, idx) => idx !== i),
                                }))
                              }
                              aria-label="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                      <label className="img-uploader">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageFiles(e.target.files)}
                          hidden
                        />
                        <ImageIcon size={18} className="me-1" />
                        Add images
                      </label>
                    </div>
                  </div>

                  <div className="col-12 d-flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="btn btn-danger d-inline-flex align-items-center gap-2"
                    >
                      {editingProductId ? <Edit size={18} /> : <Plus size={18} />}
                      {editingProductId ? "Update Product" : "Create Product"}
                    </motion.button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setPForm(EMPTY_PRODUCT);
                        setEditingProductId("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

          {/* List */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 64 }}>Image</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Stock</th>
                      <th>Status</th>
                      <th style={{ width: 130 }} className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const hasImg = Array.isArray(p.images) && p.images.length > 0 && p.images[0];
                      const price = Number(p.price || 0);
                      const sale = p.salePrice ? Number(p.salePrice) : null;

                      return (
                        <tr key={p.id}>
                          <td>
                            {hasImg ? (
                              <img
                                src={p.images[0]}
                                alt={p.title}
                                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
                              />
                            ) : (
                              <div
                                className="bg-light d-flex align-items-center justify-content-center"
                                style={{ width: 48, height: 48, borderRadius: 8 }}
                              >
                                <ImageIcon size={16} className="text-secondary" />
                              </div>
                            )}
                          </td>
                          <td className="fw-semibold">{p.title}</td>
                          <td>{p.category}</td>
                          <td className="text-end">
                            {sale !== null ? (
                              <>
                                <span className="text-muted text-decoration-line-through me-1">
                                  ₹{price.toFixed(2)}
                                </span>
                                <span className="fw-semibold">₹{sale.toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="fw-semibold">₹{price.toFixed(2)}</span>
                            )}
                          </td>
                          <td className="text-end">{p.stock}</td>
                          <td>
                            <span className={`badge ${p.published ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"}`}>
                              {p.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-secondary" onClick={() => editProduct(p.id)}>
                                <Edit size={16} />
                              </button>
                              <button className="btn btn-outline-danger" onClick={() => deleteProduct(p.id)}>
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-muted py-4">No products yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CLASSES TAB */}
      {tab === "classes" && (
        <>
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm rounded-4 mb-4"
          >
            <div className="card-body p-3 p-lg-4">
              <h2 className="h5 fw-semibold mb-3">
                {editingClassId ? "Edit Art Class" : "Add New Art Class"}
              </h2>

              <form onSubmit={saveClass}>
                <div className="row g-3">
                  <div className="col-12 col-lg-6">
                    <label className="form-label small fw-semibold">Title</label>
                    <input
                      className="form-control"
                      placeholder="e.g., Acrylic Basics Weekend"
                      value={cForm.title}
                      onChange={(e) => setCForm((f) => ({ ...f, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">Mode</label>
                    <select
                      className="form-select"
                      value={cForm.mode}
                      onChange={(e) => setCForm((f) => ({ ...f, mode: e.target.value }))}
                    >
                      <option>Online</option>
                      <option>Offline</option>
                    </select>
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">
                      <Calendar size={14} className="me-1" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={cForm.startDate}
                      onChange={(e) => setCForm((f) => ({ ...f, startDate: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">Duration (weeks)</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={cForm.durationWeeks}
                      onChange={(e) => setCForm((f) => ({ ...f, durationWeeks: Number(e.target.value || 1) }))}
                    />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">
                      <Users size={14} className="me-1" />
                      Seats
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={cForm.seats}
                      onChange={(e) => setCForm((f) => ({ ...f, seats: Number(e.target.value || 1) }))}
                    />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">
                      <DollarSign size={14} className="me-1" />
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      value={cForm.price}
                      onChange={(e) => setCForm((f) => ({ ...f, price: e.target.value }))}
                    />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">Level</label>
                    <select
                      className="form-select"
                      value={cForm.level}
                      onChange={(e) => setCForm((f) => ({ ...f, level: e.target.value }))}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Cover Image URL</label>
                    <input
                      className="form-control"
                      placeholder="https://..."
                      value={cForm.cover}
                      onChange={(e) => setCForm((f) => ({ ...f, cover: e.target.value }))}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Outline, materials, and outcomes."
                      value={cForm.description}
                      onChange={(e) => setCForm((f) => ({ ...f, description: e.target.value }))}
                    />
                  </div>

                  <div className="col-12 col-lg-3">
                    <label className="form-label small fw-semibold">Visibility</label>
                    <select
                      className="form-select"
                      value={cForm.published ? "published" : "draft"}
                      onChange={(e) => setCForm((f) => ({ ...f, published: e.target.value === "published" }))}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="col-12 d-flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="btn btn-danger d-inline-flex align-items-center gap-2"
                    >
                      {editingClassId ? <Edit size={18} /> : <Plus size={18} />}
                      {editingClassId ? "Update Class" : "Create Class"}
                    </motion.button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setCForm(EMPTY_CLASS);
                        setEditingClassId("");
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

          {/* List */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 64 }}>Cover</th>
                      <th>Title</th>
                      <th>Mode</th>
                      <th>Start</th>
                      <th className="text-end">Seats</th>
                      <th className="text-end">Price</th>
                      <th>Status</th>
                      <th style={{ width: 130 }} className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((c) => {
                      const hasCover = Boolean(c.cover);
                      const price = c.price ? Number(c.price) : null;
                      return (
                        <tr key={c.id}>
                          <td>
                            {hasCover ? (
                              <img
                                src={c.cover}
                                alt={c.title}
                                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
                              />
                            ) : (
                              <div
                                className="bg-light d-flex align-items-center justify-content-center"
                                style={{ width: 48, height: 48, borderRadius: 8 }}
                              >
                                <ImageIcon size={16} className="text-secondary" />
                              </div>
                            )}
                          </td>
                          <td className="fw-semibold">{c.title}</td>
                          <td>{c.mode}</td>
                          <td>{c.startDate || "-"}</td>
                          <td className="text-end">{c.seats}</td>
                          <td className="text-end">{price !== null ? `₹${price.toFixed(2)}` : "-"}</td>
                          <td>
                            <span className={`badge ${c.published ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"}`}>
                              {c.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-secondary" onClick={() => editClass(c.id)}>
                                <Edit size={16} />
                              </button>
                              <button className="btn btn-outline-danger" onClick={() => deleteClass(c.id)}>
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {classes.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center text-muted py-4">No classes yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
