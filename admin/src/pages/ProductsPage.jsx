import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Image as ImageIcon, DollarSign, Tag, Layers, Plus, Star } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "./admin.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const PRODUCTS_URL = `${API_BASE}/api/products`;

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

axios.defaults.withCredentials = true;

// Categories aligned with backend enums
const CATEGORIES = [
  "Paintings",
  "Indian Products",
  "Workshops",
  "Custom Orders",
  "Digital Prints",
  "Handcrafted Items",
  "Limited Editions"
];

// Subcategories for Indian Products
const INDIAN_SUBCATEGORIES = [
  "Kolam coasters",
  "Kolam peetham",
  "Traditional magnets",
  "Trays",
  "Diya holders"
];

const currentYear = new Date().getFullYear();

const EMPTY_PRODUCT = {
  id: "",
  title: "",
  category: "Paintings",
  subcategory: "", // only used when category = Indian Products
  price: "",
  salePrice: "",
  stock: 1,
  images: [],
  description: "",
  published: true,

  // Extra fields
  dimensions: "",
  medium: "",
  year: currentYear,
  inStock: true,
  featured: false,
};

const mapProductFromApi = (doc) => {
  const images =
    Array.isArray(doc?.images) && doc.images.length
      ? doc.images
      : doc?.image
      ? [doc.image]
      : [];
  // FIX: single main URL, not the whole array
  const main = doc?.image || (images.length ? images : "");

  return {
    id: doc._id,
    title: doc.title || "",
    category: doc.category || "Paintings",
    subcategory: doc.subcategory || "",
    price: typeof doc.price === "number" ? doc.price : 0,
    salePrice:
      doc.salePrice === null
        ? null
        : typeof doc.salePrice === "number"
        ? doc.salePrice
        : null,
    stock: typeof doc.stock === "number" ? doc.stock : 0,
    images,
    image: main, // single cover for convenience
    description: doc.description || "",
    published: !!doc.published,
    slug: doc.slug || "",

    // Extra fields
    dimensions: doc.dimensions || "",
    medium: doc.medium || "",
    year: Number.isInteger(doc?.year) ? doc.year : currentYear,
    inStock:
      typeof doc?.inStock === "boolean"
        ? doc.inStock
        : typeof doc?.stock === "number"
        ? doc.stock > 0
        : true,
    featured: !!doc?.featured,
  };
};

const slugify = (s) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// Unsigned Cloudinary upload for one image
async function uploadToCloudinary(file, folder = "pnpart/ecommerce/products") {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary env missing (VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET)"
    );
  }
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  fd.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: fd }
  );
  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }
  return { url: data.secure_url, publicId: data.public_id };
}

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(EMPTY_PRODUCT);

  const [uploadingImgs, setUploadingImgs] = useState(false);
  const fileInputRef = useRef(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await axios.get(PRODUCTS_URL, { withCredentials: true });
      const items = Array.isArray(res.data?.items)
        ? res.data.items.map(mapProductFromApi)
        : [];
      setProducts(items);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Multiple files -> upload to Cloudinary -> add URLs to form.images
  const handleFiles = async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    try {
      setUploadingImgs(true);
      const urls = [];
      for (const f of list) {
        const { url } = await uploadToCloudinary(f);
        urls.push(url);
      }
      // optional de-dup
      setForm((prev) => {
        const next = [...(prev.images || []), ...urls];
        return { ...prev, images: Array.from(new Set(next)) };
      });
      toast.success("Images uploaded");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Cloudinary upload failed");
    } finally {
      setUploadingImgs(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImageAt = (idx) => {
    setForm((f) => ({
      ...f,
      images: (f.images || []).filter((_, i) => i !== idx),
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_PRODUCT);
    setEditingId("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const saveProduct = async (e) => {
    e?.preventDefault?.();

    // basic checks
    if (!form.title.trim()) {
      toast.warning("Product title is required");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.warning("Valid price is required");
      return;
    }
    if (form.category === "Indian Products" && !form.subcategory) {
      toast.warning("Select a subcategory");
      return;
    }
    if (
      form.salePrice !== "" &&
      form.salePrice !== null &&
      Number(form.salePrice) > Number(form.price)
    ) {
      toast.warning("Sale price cannot exceed price");
      return;
    }
    // year validation
    const y = Number(form.year);
    if (!Number.isInteger(y) || y < 1900 || y > currentYear) {
      toast.warning(`Enter a valid year between 1900 and ${currentYear}`);
      return;
    }

    try {
      const payload = {
        title: form.title,
        category: form.category,
        subcategory:
          form.category === "Indian Products" ? form.subcategory : undefined,
        price: Number(form.price),
        salePrice:
          form.salePrice !== "" && form.salePrice !== null
            ? Number(form.salePrice)
            : null,
        stock: Number(form.stock || 0),
        images: form.images || [],
        description: form.description || "",
        published: !!form.published,

        // extra fields
        dimensions: form.dimensions || "",
        medium: form.medium || "",
        year: y,
        inStock: !!form.inStock,
        featured: !!form.featured,

        // FIX: send only the first URL as a single string
        image:
          Array.isArray(form.images) && form.images.length > 0
            ? form.images
            : undefined,
      };

      if (editingId) {
        const res = await axios.put(`${PRODUCTS_URL}/${editingId}`, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const updated = mapProductFromApi(res.data);
        setProducts((arr) =>
          arr.map((it) => (it.id === editingId ? updated : it))
        );
        toast.success("Product updated");
      } else {
        const res = await axios.post(PRODUCTS_URL, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const created = mapProductFromApi(res.data);
        setProducts((arr) => [created, ...arr]);
        toast.success("Product created");
      }
      resetForm();
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.message || "Failed to save product";
      const det = e?.response?.data?.details
        ? ` (${Object.values(e.response.data.details).join(", ")})`
        : "";
      toast.error(msg + det);
    }
  };

  const editProduct = (id) => {
    const found = products.find((p) => p.id === id);
    if (!found) return;
    setEditingId(id);
    setForm({
      id,
      title: found.title || "",
      category: found.category || "Paintings",
      subcategory:
        found.category === "Indian Products" ? found.subcategory || "" : "",
      price: found.price ?? "",
      salePrice: found.salePrice ?? "",
      stock: typeof found.stock === "number" ? found.stock : 0,
      images: Array.isArray(found.images) ? found.images : [],
      description: found.description || "",
      published: !!found.published,

      // extra fields
      dimensions: found.dimensions || "",
      medium: found.medium || "",
      year: Number.isInteger(found.year) ? found.year : currentYear,
      inStock:
        typeof found.inStock === "boolean"
          ? found.inStock
          : typeof found.stock === "number"
          ? found.stock > 0
          : true,
      featured: !!found.featured,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${PRODUCTS_URL}/${id}`, { withCredentials: true });
      setProducts((arr) => arr.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
      toast.success("Product deleted");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h1 className="h4 fw-bold mb-0">Products</h1>
          <small className="text-muted">
            Manage items available in the storefront
          </small>
        </div>
        {loading && <span className="text-muted small">Loading…</span>}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-0 shadow-sm rounded-4 mb-4"
      >
        <div className="card-body p-3 p-lg-4">
          <div className="d-flex align-items-center justify-content-between">
            <h2 className="h6 fw-semibold mb-3">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
          </div>

          <form onSubmit={saveProduct}>
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-lg-6">
                <label className="form-label small fw-semibold">Title</label>
                <input
                  className="form-control"
                  placeholder="e.g., Sunset Over Waves"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold">Category</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((f) => ({
                      ...f,
                      category: value,
                      // clear subcategory when leaving Indian Products
                      subcategory:
                        value === "Indian Products" ? f.subcategory : "",
                    }));
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show subcategory only for Indian Products */}
              {form.category === "Indian Products" && (
                <div className="col-6 col-sm-6 col-lg-3">
                  <label className="form-label small fw-semibold">
                    Subcategory
                  </label>
                  <select
                    className="form-select"
                    value={form.subcategory}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, subcategory: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select…</option>
                    {INDIAN_SUBCATEGORIES.map((sc) => (
                      <option key={sc} value={sc}>
                        {sc}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold">Slug</label>
                <input
                  className="form-control"
                  value={slugify(form.title)}
                  disabled
                />
              </div>

              <div className="col-6 col-sm-6 col-lg-3">
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
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="col-6 col-sm-6 col-lg-3">
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
                  value={form.salePrice}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, salePrice: e.target.value }))
                  }
                />
              </div>

              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold">
                  <Layers size={14} className="me-1" />
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      stock: Number(e.target.value || 0),
                    }))
                  }
                />
              </div>

              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold">Visibility</label>
                <select
                  className="form-select"
                  value={form.published ? "published" : "draft"}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      published: e.target.value === "published",
                    }))
                  }
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Dimensions */}
              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold">Dimensions</label>
                <input
                  className="form-control"
                  placeholder="e.g., A5"
                  value={form.dimensions}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dimensions: e.target.value }))
                  }
                />
              </div>

              {/* Medium */}
              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold">Medium</label>
                <input
                  className="form-control"
                  placeholder="e.g., Mixed Materials"
                  value={form.medium}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, medium: e.target.value }))
                  }
                />
              </div>

              {/* Year */}
              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold">Year</label>
                <input
                  type="number"
                  className="form-control"
                  min={1900}
                  max={currentYear}
                  value={form.year}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      year: Number(e.target.value || currentYear),
                    }))
                  }
                />
              </div>

              {/* In Stock */}
              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold">In Stock</label>
                <select
                  className="form-select"
                  value={form.inStock ? "true" : "false"}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, inStock: e.target.value === "true" }))
                  }
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>

              {/* Featured */}
              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold">Featured</label>
                <select
                  className="form-select"
                  value={form.featured ? "true" : "false"}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, featured: e.target.value === "true" }))
                  }
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Short description for storefront and SEO."
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold d-block">Images</label>
                <div className="d-flex gap-2 flex-wrap">
                  {Array.isArray(form.images) &&
                    form.images.length > 0 &&
                    form.images.map((src, i) => (
                      <div key={`img-${i}`} className="img-tile">
                        <img src={src} alt={`img-${i}`} />
                        <button
                          type="button"
                          className="btn btn-sm btn-light remove"
                          onClick={() => removeImageAt(i)}
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                  <label className="img-uploader m-0">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFiles(e.target.files)}
                      disabled={uploadingImgs}
                      hidden
                    />
                    <ImageIcon size={18} className="me-1" />
                    {uploadingImgs ? "Uploading…" : "Add images"}
                  </label>
                </div>
              </div>

              <div className="col-12 d-flex flex-column flex-sm-row gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn btn-danger d-inline-flex align-items-center justify-content-center gap-2"
                  disabled={uploadingImgs}
                >
                  {editingId ? <Edit size={18} /> : <Plus size={18} />}
                  {editingId ? "Update Product" : "Create Product"}
                </motion.button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                  disabled={uploadingImgs}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          {/* Scroll on small screens only */}
          <div className="table-responsive-sm">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 64 }}>Image</th>
                  <th>Title</th>
                  <th className="d-none d-sm-table-cell">Category</th>
                  <th className="d-none d-lg-table-cell">Subcategory</th>
                  <th className="text-end">Price</th>
                  <th className="text-end d-none d-sm-table-cell">Stock</th>
                  <th className="d-none d-md-table-cell">Status</th>
                  <th style={{ width: 130 }} className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  // Use the first URL (or fallback to single image field)
                  const first =
                    Array.isArray(p.images) && p.images.length > 0
                      ? p.images
                      : p.image || null;

                  const price = Number(p.price || 0);
                  const sale = p.salePrice !== null ? Number(p.salePrice) : null;

                  return (
                    <tr key={p.id}>
                      <td>
                        {first ? (
                          <img
                            src={first}
                            alt={p.title}
                            style={{
                              width: 48,
                              height: 48,
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
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
                      <td className="d-none d-sm-table-cell">{p.category}</td>
                      <td className="d-none d-lg-table-cell">
                        {p.category === "Indian Products"
                          ? p.subcategory || "-"
                          : "-"}
                      </td>
                      <td className="text-end">
                        {sale !== null ? (
                          <>
                            <span className="text-muted text-decoration-line-through me-1">
                              ₹{price.toFixed(2)}
                            </span>
                            <span className="fw-semibold">
                              ₹{sale.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="fw-semibold">
                            ₹{price.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="text-end d-none d-sm-table-cell">
                        {p.stock}
                      </td>
                      <td className="d-none d-md-table-cell">
                        <div className="d-flex gap-1 flex-wrap">
                          <span
                            className={`badge ${
                              p.published
                                ? "bg-success-subtle text-success"
                                : "bg-secondary-subtle text-secondary"
                            }`}
                          >
                            {p.published ? "Published" : "Draft"}
                          </span>
                          {p.featured ? (
                            <span className="badge bg-warning-subtle text-warning d-inline-flex align-items-center gap-1">
                              <Star size={12} /> Featured
                            </span>
                          ) : null}
                          {!p.inStock || Number(p.stock || 0) === 0 ? (
                            <span className="badge bg-danger-subtle text-danger">
                              Out
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => editProduct(p.id)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => deleteProduct(p.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-4">
                      No products yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
