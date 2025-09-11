// admin/src/pages/ClassesPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Image as ImageIcon, DollarSign, Calendar, Users, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "./admin.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const CLASSES_URL = `${API_BASE}/api/classes`; // must match server mount /api + /classes [1][2]

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

axios.defaults.withCredentials = true;

const EMPTY_CLASS = {
  id: "",
  title: "",
  mode: "Online",
  startDate: "",
  durationWeeks: 4,
  seats: 10,
  price: "",
  level: "Beginner",
  cover: "",
  description: "",
  published: true
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
  published: !!doc.published
}); // aligns with backend JSON doc fields [1]

async function uploadToCloudinary(file, folder = "pnpart/ecommerce/classes") {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary env missing (VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET)");
  } // preset must exist for unsigned uploads [3][4]
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  fd.append("folder", folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  } // handle Cloudinary API response correctly [3]
  return { url: data.secure_url, publicId: data.public_id };
} // unsigned upload: file + upload_preset (+ folder if preset allows) [4]

export default function ClassesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(EMPTY_CLASS);

  const [coverPreview, setCoverPreview] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const fileRef = useRef(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await axios.get(CLASSES_URL, { withCredentials: true });
      const list = Array.isArray(res.data?.items) ? res.data.items.map(mapClassFromApi) : [];
      setItems(list);
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.status === 404 ? "Route not found (/api/classes)" : "Failed to load classes");
    } finally {
      setLoading(false);
    }
  }; // GET /api/classes -> { items } [1]

  useEffect(() => { load(); }, []);

  const handleCoverFile = async (file) => {
    if (!file) {
      setCoverPreview(form.cover ? form.cover : "");
      setForm((f) => ({ ...f, cover: "" }));
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    try {
      setUploadingCover(true);
      setCoverPreview(URL.createObjectURL(file));
      const { url } = await uploadToCloudinary(file);
      setForm((f) => ({ ...f, cover: url }));
      setCoverPreview(url);
      toast.success("Cover uploaded");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Cloudinary upload failed");
    } finally {
      setUploadingCover(false);
    }
  }; // stores single cover URL as string to match backend schema [3]

  const resetForm = () => {
    setForm(EMPTY_CLASS);
    setEditingId("");
    setCoverPreview("");
    if (fileRef.current) fileRef.current.value = "";
  }; // simple form reset on success [1]

  const saveClass = async (e) => {
    e?.preventDefault?.();
    if (!form.title.trim()) { toast.warning("Class title is required"); return; }
    if (!form.startDate) { toast.warning("Start date is required"); return; }
    try {
      const payload = {
        title: form.title,
        mode: form.mode,
        startDate: form.startDate,
        durationWeeks: Number(form.durationWeeks || 1),
        seats: Number(form.seats || 1),
        price: form.price ? Number(form.price) : 0,
        level: form.level,
        cover: form.cover,
        description: form.description || "",
        published: !!form.published
      }; // JSON body matches backend router expectations [1]

      if (editingId) {
        const res = await axios.put(`${CLASSES_URL}/${editingId}`, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }); // PUT /api/classes/:id [1]
        const updated = mapClassFromApi(res.data);
        setItems((arr) => arr.map((it) => (it.id === editingId ? updated : it)));
        toast.success("Class updated");
      } else {
        const res = await axios.post(CLASSES_URL, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }); // POST /api/classes [1]
        const created = mapClassFromApi(res.data);
        setItems((arr) => [created, ...arr]);
        toast.success("Class created");
      }
      resetForm();
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.status === 404 ? "Route not found (/api/classes)" : "Failed to save class");
    }
  }; // uses same endpoint base for create/update to match server routes [1]

  const editClass = (id) => {
    const found = items.find((c) => c.id === id);
    if (!found) return;
    setEditingId(id);
    setForm({ ...found });
    setCoverPreview(found.cover || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }; // local fill for editing without extra GET [1]

  const deleteClass = async (id) => {
    if (!window.confirm("Delete this class?")) return;
    try {
      await axios.delete(`${CLASSES_URL}/${id}`, { withCredentials: true }); // DELETE /api/classes/:id [1]
      setItems((arr) => arr.filter((c) => c.id !== id));
      if (editingId === id) resetForm();
      toast.success("Class deleted");
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.status === 404 ? "Route not found (/api/classes/:id)" : "Failed to delete class");
    }
  }; // consistent DELETE path bound to server router [1]

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h1 className="h4 fw-bold mb-0">Art Classes</h1>
          <small className="text-muted">Create and manage upcoming classes</small>
        </div>
        {loading && <span className="text-muted small">Loading…</span>}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3 p-lg-4">
          <div className="d-flex align-items-center justify-content-between">
            <h2 className="h6 fw-semibold mb-3">{editingId ? "Edit Art Class" : "Add New Art Class"}</h2>
          </div>

          <form onSubmit={saveClass}>
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-lg-6">
                <label className="form-label small fw-semibold">Title</label>
                <input
                  className="form-control"
                  placeholder="e.g., Acrylic Basics Weekend"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold">Mode</label>
                <select
                  className="form-select"
                  value={form.mode}
                  onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value }))}
                >
                  <option>Online</option>
                  <option>Studio</option>
                </select>
              </div>

              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold"><Calendar size={14} className="me-1" />Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  required
                />
              </div>

              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold">Duration (weeks)</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.durationWeeks}
                  onChange={(e) => setForm((f) => ({ ...f, durationWeeks: Number(e.target.value || 1) }))}
                />
              </div>

              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold"><Users size={14} className="me-1" />Seats</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.seats}
                  onChange={(e) => setForm((f) => ({ ...f, seats: Number(e.target.value || 1) }))}
                />
              </div>

              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold"><DollarSign size={14} className="me-1" />Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
              </div>

              <div className="col-6 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold">Level</label>
                <select
                  className="form-select"
                  value={form.level}
                  onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                >
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
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleCoverFile(e.target.files?.[0] || null)}
                    />
                    <ImageIcon size={18} className="me-1" />
                    {uploadingCover ? "Uploading…" : "Choose image"}
                  </label>

                  {(coverPreview || form.cover) && (
                    <img
                      src={coverPreview || form.cover}
                      alt="cover preview"
                      style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 8 }}
                    />
                  )}

                  {(coverPreview || form.cover) && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleCoverFile(null)}
                    >
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
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Outline, materials, and outcomes."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <label className="form-label small fw-semibold">Visibility</label>
                <select
                  className="form-select"
                  value={form.published ? "published" : "draft"}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.value === "published" }))}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="col-12 d-flex flex-column flex-sm-row gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn btn-danger d-inline-flex align-items-center justify-content-center gap-2"
                  disabled={uploadingCover}
                >
                  {editingId ? <Edit size={18} /> : <Plus size={18} />}
                  {editingId ? "Update Class" : "Create Class"}
                </motion.button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                  disabled={uploadingCover}
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
          <div className="table-responsive-sm">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 64 }}>Cover</th>
                  <th>Title</th>
                  <th className="d-none d-sm-table-cell">Mode</th>
                  <th>Start</th>
                  <th className="text-end d-none d-sm-table-cell">Seats</th>
                  <th className="text-end d-none d-md-table-cell">Price</th>
                  <th className="d-none d-md-table-cell">Status</th>
                  <th style={{ width: 130 }} className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => {
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
                      <td className="d-none d-sm-table-cell">{c.mode}</td>
                      <td>{c.startDate || "-"}</td>
                      <td className="text-end d-none d-sm-table-cell">{c.seats}</td>
                      <td className="text-end d-none d-md-table-cell">{price !== null ? `₹${price.toFixed(2)}` : "-"}</td>
                      <td className="d-none d-md-table-cell">
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
                {items.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-4">No classes yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
