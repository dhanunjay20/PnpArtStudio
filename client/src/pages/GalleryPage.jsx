// src/pages/GalleryPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { X, Filter, Grid, Search, Heart, Share2, Copy, XCircle } from 'lucide-react';
import axios from 'axios';
import Masonry from 'react-masonry-css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Inline CSS for layout and effects
const CustomStyles = () => (
  <style>{`
    body { background-color: #f8f9fa; }
    .gallery-page-bg { background: linear-gradient(to bottom right, #fff1f2, #fff7ed); }

    /* react-masonry-css container + columns (from package docs) */
    .masonry-grid {
      display: -webkit-box; display: -ms-flexbox; display: flex;
      margin-left: -16px; /* gutter offset */
      width: auto;
    }
    .masonry-grid_column { padding-left: 16px; background-clip: padding-box; }
    .masonry-grid_column > .masonry-item { margin-bottom: 16px; }

    /* Card visuals; let images keep natural height */
    .gallery-card .card-img-top { display:block; width:100%; height:auto; transition: transform 0.6s ease; }
    .gallery-card:hover .card-img-top { transform: scale(1.03); }
    .gallery-card .card-img-overlay { background-color: rgba(0,0,0,0); transition: background-color 0.25s ease; }
    .gallery-card:hover .card-img-overlay { background-color: rgba(0,0,0,0.45); }
    .gallery-card .overlay-content { opacity: 0; transform: translateY(6px); transition: opacity 0.25s ease, transform 0.25s ease; }
    .gallery-card:hover .overlay-content { opacity: 1; transform: translateY(0); }

    /* Grid mode (non-masonry) */
    .grid-cols { display: grid; gap: 16px; }
    @media (min-width: 320px) { .grid-cols { grid-template-columns: 1fr; } }
    @media (min-width: 576px) { .grid-cols { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 992px) { .grid-cols { grid-template-columns: repeat(3, 1fr); } }
    @media (min-width: 1200px){ .grid-cols { grid-template-columns: repeat(4, 1fr); } }

    /* Modal polish: margin-top and visible close */
    .modal.show { background-color: rgba(0,0,0,0.85); }
    .modal-content { border: none; border-radius: 1rem; }
    .btn-close-modal { position: absolute; top: 12px; right: 12px; color: #111; background: #fff; border: 0; border-radius: 999px; width: 36px; height: 36px; display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 14px rgba(0,0,0,.25); cursor: pointer; }
    .btn-close-modal:hover { opacity: 0.92; }

    /* Active toggles */
    .view-toggle .btn.active { background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.08); }

    /* Tiny toast for "Copied" (0.5s auto-hide) */
    .mini-toast {
      position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%);
      background: rgba(17,17,17,.92); color: #fff; padding: 8px 12px; border-radius: 999px;
      font-size: 13px; line-height: 1; z-index: 2000; pointer-events: none;
      opacity: 1; transition: opacity .2s ease;
    }
    .mini-toast.hide { opacity: 0; }
  `}</style>
);

// Data-URI SVG fallback
const fallbackImg = `data:image/svg+xml;charset=UTF-8,` + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
     <rect width="100%" height="100%" fill="#f3f4f6"/>
     <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="24" font-family="Arial">
       Artwork
     </text>
   </svg>`
);

const defaultCategories = ['All', 'Paintings', 'Handcrafted Items', 'Exhibitions', 'Other'];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [viewMode, setViewMode] = useState('masonry'); // 'masonry' or 'grid'
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]); // debounce to reduce API calls while typing [3]

  // API state
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [categories, setCategories] = useState(defaultCategories);

  // Tiny toast state
  const [toast, setToast] = useState({ show: false, text: '' });

  // Build params
  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (filterCategory && filterCategory !== 'All') p.set('category', filterCategory);
    if (debouncedSearch) p.set('q', debouncedSearch);
    p.set('page', String(page));
    p.set('limit', '24');
    return p.toString();
  }, [filterCategory, debouncedSearch, page]); // stable query string reflecting filters + pagination [3]

  // Optional dynamic categories
  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    (async () => {
      try {
        const url = `${API_BASE}/api/gallery?distinct=category`;
        const { data } = await axios.get(url, { withCredentials: true, signal: controller.signal });
        if (ignore) return;
        if (Array.isArray(data?.values) && data.values.length) {
          const opts = ['All', ...data.values.filter(Boolean)];
          setCategories(opts);
        }
      } catch { /* ignore */ }
    })();
    return () => { ignore = true; controller.abort(); };
  }, []); // hydrates categories if server supports it [3]

  // Fetch items (cancel stale)
  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const url = `${API_BASE}/api/gallery?${params}`;
        const { data } = await axios.get(url, { withCredentials: true, signal: controller.signal });
        if (ignore) return;
        setTotal(Number(data.total || 0));
        setPages(Number(data.pages || 1));
        const normalized = (Array.isArray(data.items) ? data.items : []).map((it) => ({
          ...it,
          src: it.src || it.url || ''
        }));
        if (page === 1) setItems(normalized);
        else setItems((prev) => [...prev, ...normalized]);
      } catch (e) {
        if (!ignore) {
          if (axios.isCancel?.(e)) { /* canceled */ }
          else { setErr('Failed to load gallery'); console.error(e); }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; controller.abort(); };
  }, [params, page]); // ensures only the freshest response updates UI [3]

  // Reset page on filters/search
  useEffect(() => { setPage(1); }, [filterCategory, debouncedSearch]); // new query => first page [3]

  const openLightbox = (image) => setSelectedImage(image); // open modal [3]
  const closeLightbox = () => setSelectedImage(null); // close modal [3]
  const onLoadMore = () => { if (page < pages && !loading) setPage((p) => p + 1); }; // paginate [3]

  // Download (Blob -> <a download>), fallback to open if blocked
  const downloadImage = async (src, name = 'artwork.jpg') => {
    try {
      const res = await fetch(src, { mode: 'cors' });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(src, '_blank', 'noopener');
    }
  }; // uses Blob + anchor download for robust client-side save behavior [5]

  // Share via Web Share API; fallback to copy URL toast
  const shareImage = async (img) => {
    const title = img?.title || 'Artwork';
    const text = `${title}${img?.description ? ' — ' + img.description : ''}`;
    const src = img?.src;

    try {
      if (navigator.canShare && navigator.share && src) {
        try {
          const res = await fetch(src, { mode: 'cors' });
          const blob = await res.blob();
          const file = new File([blob], `${title.replace(/\s+/g, '_')}.jpg`, { type: blob.type || 'image/jpeg' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title, text });
            return;
          }
        } catch { /* fall through to URL share */ }
      }
    } catch { /* unsupported */ }

    try {
      if (navigator.share && src) {
        await navigator.share({ title, text, url: src });
        return;
      }
    } catch { /* ignore */ }

    if (src && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(src);
        setToast({ show: true, text: 'Copied' });
        setTimeout(() => setToast({ show: false, text: '' }), 500);
        return;
      } catch { /* ignore */ }
    }
  }; // progressive Web Share API with URL/Files and Clipboard fallback for broad support [6]

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ show: true, text: 'Copied' });
    } catch {
      setToast({ show: true, text: 'Copy failed' });
    } finally {
      setTimeout(() => setToast({ show: false, text: '' }), 500);
    }
  }; // Clipboard API writeText is promise-based and works in secure contexts [5]

  // Masonry breakpoints (columns per width)
  const breakpointColumns = { default: 4, 1200: 4, 992: 3, 576: 2, 0: 1 }; // responsive columns per package guidance [2]

  const renderCard = (image) => {
    const src = image.src || fallbackImg;
    return (
      <div className="masonry-item">
        <div className="gallery-card card border-0 overflow-hidden rounded-4 shadow-sm position-relative">
          <img
            src={src}
            alt={image.title}
            className="card-img-top"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = fallbackImg; }}
          />
          <div className="card-img-overlay d-flex align-items-center justify-content-center p-4">
            <div className="overlay-content text-white text-center">
              <h3 className="h6 fw-semibold mb-2">{image.title || 'Untitled'}</h3>
              <p className="small mb-0">{image.medium || '—'} • {image.year || ''}</p>
            </div>
          </div>
          <button
            type="button"
            className="stretched-link"
            style={{ position: 'absolute', inset: 0, opacity: 0 }}
            onClick={() => openLightbox(image)}
            aria-label={`Open ${image.title || 'artwork'}`}
          />
          <span className="badge bg-light text-dark position-absolute top-0 start-0 m-3">
            {image.category || 'Other'}
          </span>
        </div>
      </div>
    );
  };

  const showingCount = items.length;

  return (
    <>
      <CustomStyles />
      <div className="min-vh-100 gallery-page-bg">
        <div className="container-xl py-5">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-dark mb-4">Art Gallery</h1>
            <p className="fs-5 text-muted mx-auto" style={{ maxWidth: '42rem' }}>
              Explore our complete collection of original artworks, exhibitions, and creative moments
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-4 shadow-lg p-4 mb-5">
            <div className="d-flex flex-column flex-lg-row gap-4 align-items-center justify-content-between">
              {/* Search with clear */}
              <div className="position-relative w-100" style={{ maxWidth: '480px' }}>
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={20} />
                <input
                  type="text"
                  placeholder="Search gallery..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control ps-5 py-2 pe-5"
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="position-absolute top-50 end-0 translate-middle-y me-2 btn btn-sm btn-light d-inline-flex align-items-center"
                    onClick={() => setSearchTerm('')}
                    title="Clear"
                    aria-label="Clear search"
                  >
                    <XCircle size={16} />
                  </button>
                )}
              </div>

              <div className="d-flex align-items-center gap-2 gap-md-4 flex-wrap justify-content-center">
                {/* Category Filter */}
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilterCategory(category)}
                      className={`btn rounded-pill ${filterCategory === category ? 'btn-danger' : 'btn-light text-secondary'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* View Mode */}
                <div className="btn-group bg-light p-1 rounded view-toggle">
                  <button
                    onClick={() => setViewMode('masonry')}
                    className={`btn border-0 ${viewMode === 'masonry' ? 'active' : ''}`}
                    title="Masonry View"
                  >
                    <Filter size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`btn border-0 ${viewMode === 'grid' ? 'active' : ''}`}
                    title="Grid View"
                  >
                    <Grid size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mb-4">
            <p className="text-muted">Showing {showingCount} of {total} artwork{total !== 1 ? 's' : ''}</p>
          </div>

          {/* Masonry or Grid */}
          {err && <div className="alert alert-danger">{err}</div>}

          {viewMode === 'masonry' ? (
            <Masonry
              breakpointCols={breakpointColumns}
              className="masonry-grid"
              columnClassName="masonry-grid_column"
            >
              {items.map((image) => (
                <div key={image._id || image.id || image.src}>
                  {renderCard(image)}
                </div>
              ))}
            </Masonry>
          ) : (
            <div className="grid-cols">
              {items.map((image) => (
                <div key={image._id || image.id || image.src}>
                  {renderCard(image)}
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          <div className="text-center mt-5">
            {page < pages && (
              <button className="btn btn-danger btn-lg rounded-pill px-5 py-3 fw-semibold" onClick={onLoadMore} disabled={loading}>
                {loading ? 'Loading…' : 'Load More Artworks'}
              </button>
            )}
            {page >= pages && !loading && total > 0 && <div className="text-muted">No more artworks</div>}
          </div>
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <>
            <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} />
            <div
              className="modal fade show"
              style={{ display: 'block', zIndex: 1055, marginTop: '20px' }}
              onClick={closeLightbox}
              role="dialog"
              aria-modal="true"
            >
              <div className="modal-dialog modal-xl modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content position-relative">
                  <button onClick={closeLightbox} className="btn-close-modal" aria-label="Close">
                    <X size={18} />
                  </button>

                  <img
                    src={selectedImage.src || fallbackImg}
                    alt={selectedImage.title}
                    className="img-fluid"
                    style={{ maxHeight: '70vh', objectFit: 'contain', display: 'block' }}
                    onError={(e) => { e.currentTarget.src = fallbackImg; }}
                  />

                  <div className="modal-body p-4">
                    <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
                      <div className="flex-grow-1">
                        <h2 className="h4 fw-bold text-dark mb-2">{selectedImage.title || 'Untitled'}</h2>
                        <p className="text-muted mb-2">{selectedImage.medium || '—'} • {selectedImage.year || ''}</p>
                        <p className="text-secondary">{selectedImage.description || ''}</p>

                        {selectedImage.src && (
                          <div className="mt-3">
                            <label className="form-label small fw-semibold">Share URL</label>
                            <div className="input-group">
                              <input className="form-control" readOnly value={selectedImage.src} />
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => copyToClipboard(selectedImage.src)}
                                title="Copy link"
                              >
                                <Copy size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-light text-danger d-inline-flex align-items-center gap-2"
                          onClick={() => downloadImage(selectedImage.src, `${(selectedImage.title || 'artwork').replace(/\s+/g,'_')}.jpg`)}
                          title="Download image"
                        >
                          <Heart size={20} />
                          Download
                        </button>
                        <button
                          className="btn btn-light d-inline-flex align-items-center gap-2"
                          onClick={() => shareImage(selectedImage)}
                          title="Share image"
                        >
                          <Share2 size={20} />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </>
        )}

        {/* Mini toast (0.5s) */}
        {toast.show && (
          <div className={`mini-toast${toast.show ? '' : ' hide'}`} role="status" aria-live="polite">
            {toast.text}
          </div>
        )}
      </div>
    </>
  );
}
