// admin/src/pages/GalleryPage.jsx
import React, { useEffect, useState } from "react";
import { Image as ImageIcon, Trash2, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "../pages/admin.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const GALLERY_URL = `${API_BASE}/api/gallery`;

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

axios.defaults.withCredentials = true;

async function uploadToCloudinary(file, folder = "pnpart/gallery") {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary env missing");
  }
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  fd.append("folder", folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: fd
  });
  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }
  return { url: data.secure_url, publicId: data.public_id };
}

const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const res = await axios.get(GALLERY_URL, { withCredentials: true });
      setItems(Array.isArray(res.data?.items) ? res.data.items : []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load gallery");
    }
  };

  useEffect(() => { load(); }, []);

  const onFiles = async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    setUploading(true);
    try {
      const uploads = [];
      for (const f of list) {
        const { url, publicId } = await uploadToCloudinary(f);
        uploads.push({ url, publicId });
      }
      const res = await axios.post(GALLERY_URL, { images: uploads }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      const created = Array.isArray(res.data?.items) ? res.data.items : [];
      setItems((prev) => [...created, ...prev]);
      toast.success("Images uploaded");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = async (idOrUrl) => {
    try {
      await axios.delete(`${GALLERY_URL}/${encodeURIComponent(idOrUrl)}`, { withCredentials: true });
      setItems((arr) => arr.filter((g) => (g._id || g.url) !== idOrUrl));
      toast.success("Image removed");
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h1 className="h4 fw-bold mb-0">Gallery</h1>
          <small className="text-muted">Upload images showcased on the public gallery</small>
        </div>
        <label className="img-uploader m-0">
          <input type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
          <Plus size={18} className="me-1" />
          {uploading ? "Uploading…" : "Add images"}
        </label>
      </div>

      {/* Mobile-friendly thumbnail grid using flex-wrap */}
      <div className="d-flex flex-wrap gap-2">
        {items.map((g, i) => {
          const key = g._id || g.url || i;
          const src = g.url || g;
          return (
            <div className="img-tile" key={key}>
              <img src={src} alt={`gallery-${i}`} />
              <button
                type="button"
                className="btn btn-sm btn-light remove"
                onClick={() => removeAt(g._id || g.url)}
                aria-label="Remove image"
                title="Remove"
              >
                ×
              </button>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="text-muted small d-flex align-items-center gap-2">
            <ImageIcon size={16} /> No images yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
