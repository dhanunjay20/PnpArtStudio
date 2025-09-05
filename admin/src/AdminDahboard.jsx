// admin/src/pages/AdminDashboard.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Edit, Trash2, Image as ImageIcon, DollarSign, Tag, Layers,
  Package, BookOpen, GraduationCap, Calendar, Users
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminDashboard.css";

// API base
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const CLASSES_URL = `${API_BASE}/api/classes`;
const PRODUCTS_URL = `${API_BASE}/api/products`;

// Cloudinary env
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Prefix relative API paths with API origin; absolute Cloudinary URLs pass through
const withBase = (p) => (p && !/^https?:\/\//i.test(p) ? `${API_BASE}${p}` : p);

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
  images: [], // Cloudinary secure_url strings
  description: "",
  published: true,
};

const EMPTY_CLASS = {
  id: "",
  title: "",
  mode: "Online",
  startDate: "",
  durationWeeks: 4,
  seats: 10,
  price: "",
  level: "Beginner",
  cover: "", // Cloudinary secure_url string
  description: "",
  published: true,
};

const mapClassFromApi = (doc) => ({
  id: doc._id,
  title: doc.title || "",
  mode: doc.mode || "Online",
  startDate: doc.startDate || "",
  durationWeeks: typeof doc.durationWeeks === "number" ? doc.durationWeeks : 4,
  seats: typeof doc.seats === "number" ? doc.seats : 10,
  price: typeof doc.price === "number" ? doc.price : 0,
  level: doc.level || "Beginner",
  cover: doc.cover || "",
  description: doc.description || "",
  published: !!doc.published,
});

const mapProductFromApi = (doc) => ({
  id: doc._id,
  title: doc.title || "",
  category: doc.category || "Paintings",
  price: typeof doc.price === "number" ? doc.price : 0,
  salePrice: doc.salePrice === null ? null : typeof doc.salePrice === "number" ? doc.salePrice : null,
  stock: typeof doc.stock === "number" ? doc.stock : 0,
  images: Array.isArray(doc.images) ? doc.images : [],
  description: doc.description || "",
  published: !!doc.published,
  slug: doc.slug || "",
});

// Upload one file to Cloudinary (unsigned)
async function uploadToCloudinary(file, folder = "app") {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary env missing (VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET)");
  }
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  fd.append("folder", folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: fd,
  });
  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }
  return { url: data.secure_url, publicId: data.public_id };
}

const AdminDashboard = () => {
  const isAdmin = true;
  const seeded = useMemo(() => [], []);
  const [tab, setTab] = useState("products");

  // PRODUCTS
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingProductId, setEditingProductId] = useState("");
  const [pForm, setPForm] = useState(EMPTY_PRODUCT);
  const [uploadingProductImgs, setUploadingProductImgs] = useState(false);
  const fileInputRef = useRef(null);

  // CLASSES
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [editingClassId, setEditingClassId] = useState("");
  const [cForm, setCForm] = useState(EMPTY_CLASS);
  const [coverPreview, setCoverPreview] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await axios.get(PRODUCTS_URL, { withCredentials: true });
      const items = Array.isArray(res.data?.items) ? res.data.items.map(mapProductFromApi) : [];
      setProducts(items);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch classes
  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const res = await axios.get(CLASSES_URL, { withCredentials: true });
      const items = Array.isArray(res.data?.items) ? res.data.items.map(mapClassFromApi) : [];
      setClasses(items);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load classes.");
    } finally {
      setLoadingClasses(false);
    }
  };

  useEffect(() => {
    if (tab === "products") fetchProducts();
    if (tab === "classes") fetchClasses();
  }, [tab]);

  // Product files -> upload to Cloudinary -> add URLs to pForm.images
  const handleProductFiles = async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    try {
      setUploadingProductImgs(true);
      const urls = [];
      for (const f of list) {
        const { url } = await uploadToCloudinary(f, "pnpart/ecommerce/products");
        urls.push(url);
      }
      setPForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      toast.success("Images uploaded.");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Cloudinary upload failed.");
    } finally {
      setUploadingProductImgs(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeProductImageAt = (idx) => {
    setPForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const resetProductForm = () => {
    setPForm(EMPTY_PRODUCT);
    setEditingProductId("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Save product via JSON (no multipart)
  const saveProduct = async (e) => {
    e?.preventDefault?.();
    if (!pForm.title.trim()) return toast.error("Product title is required.");
    if (!pForm.price || Number(pForm.price) <= 0) return toast.error("Valid price is required.");
    try {
      const payload = {
        title: pForm.title,
        category: pForm.category,
        price: Number(pForm.price),
        salePrice: pForm.salePrice !== "" && pForm.salePrice !== null ? Number(pForm.salePrice) : null,
        stock: Number(pForm.stock || 0),
        images: pForm.images, // Cloudinary URLs
        description: pForm.description || "",
        published: !!pForm.published,
      };
      if (editingProductId) {
        const res = await axios.put(`${PRODUCTS_URL}/${editingProductId}`, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const updated = mapProductFromApi(res.data);
        setProducts((arr) => arr.map((it) => (it.id === editingProductId ? updated : it)));
        toast.success("Product updated.");
      } else {
        const res = await axios.post(PRODUCTS_URL, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const created = mapProductFromApi(res.data);
        setProducts((arr) => [created, ...arr]);
        toast.success("Product created.");
      }
      resetProductForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product.");
    }
  };

  const editProduct = (id) => {
    const found = products.find((p) => p.id === id);
    if (!found) return;
    setEditingProductId(id);
    setPForm({
      id,
      title: found.title || "",
      category: found.category || "Paintings",
      price: found.price ?? "",
      salePrice: found.salePrice ?? "",
      stock: typeof found.stock === "number" ? found.stock : 0,
      images: Array.isArray(found.images) ? found.images : [],
      description: found.description || "",
      published: !!found.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${PRODUCTS_URL}/${id}`, { withCredentials: true });
      setProducts((arr) => arr.filter((p) => p.id !== id));
      if (editingProductId === id) resetProductForm();
      toast.success("Product deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.");
    }
  };

  // Cover file -> upload to Cloudinary -> set cForm.cover
  const handleCoverFile = async (file) => {
    if (!file) {
      setCoverPreview(cForm.cover ? cForm.cover : "");
      setCForm((f) => ({ ...f, cover: "" }));
      return;
    }
    try {
      setUploadingCover(true);
      setCoverPreview(URL.createObjectURL(file));
      const { url } = await uploadToCloudinary(file, "pnpart/ecommerce/classes");
      setCForm((f) => ({ ...f, cover: url }));
      setCoverPreview(url);
      toast.success("Cover uploaded.");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Cloudinary upload failed.");
    } finally {
      setUploadingCover(false);
    }
  };

  const resetClassForm = () => {
    setCForm(EMPTY_CLASS);
    setEditingClassId("");
    setCoverPreview("");
  };

  // Save class via JSON (no multipart)
  const saveClass = async (e) => {
    e?.preventDefault?.();
    if (!cForm.title.trim()) return toast.error("Class title is required.");
    if (!cForm.startDate) return toast.error("Start date is required.");
    try {
      const payload = {
        title: cForm.title,
        mode: cForm.mode,
        startDate: cForm.startDate,
        durationWeeks: Number(cForm.durationWeeks || 1),
        seats: Number(cForm.seats || 1),
        price: cForm.price ? Number(cForm.price) : 0,
        level: cForm.level,
        cover: cForm.cover, // Cloudinary URL
        description: cForm.description || "",
        published: !!cForm.published,
      };
      if (editingClassId) {
        const res = await axios.put(`${CLASSES_URL}/${editingClassId}`, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const updated = mapClassFromApi(res.data);
        setClasses((arr) => arr.map((it) => (it.id === editingClassId ? updated : it)));
        toast.success("Class updated.");
      } else {
        const res = await axios.post(CLASSES_URL, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const created = mapClassFromApi(res.data);
        setClasses((arr) => [created, ...arr]);
        toast.success("Class created.");
      }
      resetClassForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save class.");
    }
  };

  const editClass = (id) => {
    const found = classes.find((c) => c.id === id);
    if (!found) return;
    setEditingClassId(id);
    setCForm({ ...found });
    setCoverPreview(found.cover || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteClass = async (id) => {
    if (!window.confirm("Delete this class?")) return;
    try {
      await axios.delete(`${CLASSES_URL}/${id}`, { withCredentials: true });
      setClasses((arr) => arr.filter((c) => c.id !== id));
      if (editingClassId === id) resetClassForm();
      toast.success("Class deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete class.");
    }
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
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false}
        closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

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

      {/* PRODUCTS */}
      {tab === "products" && (
        <>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-3 p-lg-4">
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="h5 fw-semibold mb-3">{editingProductId ? "Edit Product" : "Add New Product"}</h2>
                {loadingProducts && <span className="text-muted small">Loading…</span>}
              </div>

              <form onSubmit={saveProduct}>
                <div className="row g-3">
                  <div className="col-12 col-lg-6">
                    <label className="form-label small fw-semibold">Title</label>
                    <input className="form-control" placeholder="e.g., Sunset Over Waves" value={pForm.title}
                      onChange={(e) => setPForm((f) => ({ ...f, title: e.target.value }))} required />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">Category</label>
                    <select className="form-select" value={pForm.category}
                      onChange={(e) => setPForm((f) => ({ ...f, category: e.target.value }))}>
                      {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">Slug</label>
                    <input className="form-control" value={slugify(pForm.title)} disabled />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold"><DollarSign size={14} className="me-1" />Price</label>
                    <input type="number" step="0.01" min="0" className="form-control" placeholder="0.00" value={pForm.price}
                      onChange={(e) => setPForm((f) => ({ ...f, price: e.target.value }))} required />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold"><Tag size={14} className="me-1" />Sale Price (optional)</label>
                    <input type="number" step="0.01" min="0" className="form-control" placeholder="0.00" value={pForm.salePrice}
                      onChange={(e) => setPForm((f) => ({ ...f, salePrice: e.target.value }))} />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold"><Layers size={14} className="me-1" />Stock</label>
                    <input type="number" min="0" className="form-control" value={pForm.stock}
                      onChange={(e) => setPForm((f) => ({ ...f, stock: Number(e.target.value || 0) }))} />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">Visibility</label>
                    <select className="form-select" value={pForm.published ? "published" : "draft"}
                      onChange={(e) => setPForm((f) => ({ ...f, published: e.target.value === "published" }))}>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold"><BookOpen size={14} className="me-1" />Description</label>
                    <textarea className="form-control" rows={3} placeholder="Short description for storefront and SEO."
                      value={pForm.description} onChange={(e) => setPForm((f) => ({ ...f, description: e.target.value }))} />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold d-block">Images</label>
                    <div className="d-flex gap-2 flex-wrap">
                      {Array.isArray(pForm.images) && pForm.images.length > 0 &&
                        pForm.images.map((src, i) => (
                          <div key={`img-${i}`} className="img-tile">
                            <img src={src} alt={`img-${i}`} />
                            <button
                              type="button"
                              className="btn btn-sm btn-light remove"
                              onClick={() => removeProductImageAt(i)}
                              aria-label="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))
                      }

                      <label className="img-uploader">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleProductFiles(e.target.files)}
                          disabled={uploadingProductImgs}
                          hidden
                        />
                        <ImageIcon size={18} className="me-1" />
                        {uploadingProductImgs ? "Uploading…" : "Add images"}
                      </label>
                    </div>
                  </div>

                  <div className="col-12 d-flex gap-2">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                      className="btn btn-danger d-inline-flex align-items-center gap-2" disabled={uploadingProductImgs}>
                      {editingProductId ? <Edit size={18} /> : <Plus size={18} />}
                      {editingProductId ? "Update Product" : "Create Product"}
                    </motion.button>
                    <button type="button" className="btn btn-outline-secondary" onClick={resetProductForm} disabled={uploadingProductImgs}>
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

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
                      const first = Array.isArray(p.images) && p.images.length > 0 ? p.images : null;
                      const price = Number(p.price || 0);
                      const sale = p.salePrice !== null ? Number(p.salePrice) : null;

                      return (
                        <tr key={p.id}>
                          <td>
                            {first ? (
                              <img
                                src={first}
                                alt={p.title}
                                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
                              />
                            ) : (
                              <div className="bg-light d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, borderRadius: 8 }}>
                                <ImageIcon size={16} className="text-secondary" />
                              </div>
                            )}
                          </td>
                          <td className="fw-semibold">{p.title}</td>
                          <td>{p.category}</td>
                          <td className="text-end">
                            {sale !== null ? (
                              <>
                                <span className="text-muted text-decoration-line-through me-1">₹{price.toFixed(2)}</span>
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
                    {products.length === 0 && !loadingProducts && (
                      <tr><td colSpan={7} className="text-center text-muted py-4">No products yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CLASSES */}
      {tab === "classes" && (
        <>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-3 p-lg-4">
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="h5 fw-semibold mb-3">{editingClassId ? "Edit Art Class" : "Add New Art Class"}</h2>
                {loadingClasses && <span className="text-muted small">Loading…</span>}
              </div>

              <form onSubmit={saveClass}>
                <div className="row g-3">
                  <div className="col-12 col-lg-6">
                    <label className="form-label small fw-semibold">Title</label>
                    <input className="form-control" placeholder="e.g., Acrylic Basics Weekend" value={cForm.title}
                      onChange={(e) => setCForm((f) => ({ ...f, title: e.target.value }))} required />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">Mode</label>
                    <select className="form-select" value={cForm.mode} onChange={(e) => setCForm((f) => ({ ...f, mode: e.target.value }))}>
                      <option>Online</option>
                      <option>Offline</option>
                    </select>
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold"><Calendar size={14} className="me-1" />Start Date</label>
                    <input type="date" className="form-control" value={cForm.startDate}
                      onChange={(e) => setCForm((f) => ({ ...f, startDate: e.target.value }))} required />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">Duration (weeks)</label>
                    <input type="number" min="1" className="form-control" value={cForm.durationWeeks}
                      onChange={(e) => setCForm((f) => ({ ...f, durationWeeks: Number(e.target.value || 1) }))} />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold"><Users size={14} className="me-1" />Seats</label>
                    <input type="number" min="1" className="form-control" value={cForm.seats}
                      onChange={(e) => setCForm((f) => ({ ...f, seats: Number(e.target.value || 1) }))} />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold"><DollarSign size={14} className="me-1" />Price</label>
                    <input type="number" step="0.01" min="0" className="form-control" value={cForm.price}
                      onChange={(e) => setCForm((f) => ({ ...f, price: e.target.value }))} />
                  </div>

                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold">Level</label>
                    <select className="form-select" value={cForm.level} onChange={(e) => setCForm((f) => ({ ...f, level: e.target.value }))}>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>

                  {/* Cover */}
                  <div className="col-12">
                    <label className="form-label small fw-semibold d-block">Cover Image</label>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      <label className="img-uploader m-0">
                        <input type="file" accept="image/*" onChange={(e) => handleCoverFile(e.target.files?.[0] || null)} hidden />
                        <ImageIcon size={18} className="me-1" />
                        {uploadingCover ? "Uploading…" : "Choose image"}
                      </label>

                      {(coverPreview || cForm.cover) && (
                        <img
                          src={coverPreview || cForm.cover}
                          alt="cover preview"
                          style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 8 }}
                        />
                      )}

                      {(coverPreview || cForm.cover) && (
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => handleCoverFile(null)}>
                          Remove
                        </button>
                      )}
                    </div>
                    <small className="text-muted d-block mt-1">
                      JPG/PNG/WEBP up to 10MB; uploaded to Cloudinary and saved by URL.
                    </small>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea className="form-control" rows={3} placeholder="Outline, materials, and outcomes."
                      value={cForm.description} onChange={(e) => setCForm((f) => ({ ...f, description: e.target.value }))} />
                  </div>

                  <div className="col-12 col-lg-3">
                    <label className="form-label small fw-semibold">Visibility</label>
                    <select className="form-select" value={cForm.published ? "published" : "draft"}
                      onChange={(e) => setCForm((f) => ({ ...f, published: e.target.value === "published" }))}>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="col-12 d-flex gap-2">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                      className="btn btn-danger d-inline-flex align-items-center gap-2" disabled={uploadingCover}>
                      {editingClassId ? <Edit size={18} /> : <Plus size={18} />}
                      {editingClassId ? "Update Class" : "Create Class"}
                    </motion.button>
                    <button type="button" className="btn btn-outline-secondary" onClick={resetClassForm} disabled={uploadingCover}>
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

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
                              <div className="bg-light d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, borderRadius: 8 }}>
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
                    {classes.length === 0 && !loadingClasses && (
                      <tr><td colSpan={8} className="text-center text-muted py-4">No classes yet.</td></tr>
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
