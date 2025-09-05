// src/pages/ShopPage.jsx — API-driven, URL-synced, compact list rows (fixed thumbnails)
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, Grid, List, Search } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

// Backend categories
const CATEGORIES = [
  "All Products",
  "Paintings",
  "Indian Products",
  "Workshops",
  "Custom Orders",
  "Digital Prints",
  "Handcrafted Items",
  "Limited Editions"
];

// Map route slug -> backend category label
const slugToCategory = (slug) => {
  if (!slug || slug === "all-products") return "";
  const map = {
    "paintings": "Paintings",
    "indian-products": "Indian Products",
    "workshops": "Workshops",
    "custom-orders": "Custom Orders",
    "digital-prints": "Digital Prints",
    "handcrafted-items": "Handcrafted Items",
    "limited-editions": "Limited Editions"
  };
  if (map[slug]) return map[slug];
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function ShopPage() {
  const { category: categorySlug } = useParams();
  const { items, total, page, totalPages, loading, error, params, updateParam } = useProducts();

  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(params.q || "");
  const [min, setMin] = useState(params.minPrice || "");
  const [max, setMax] = useState(params.maxPrice || "");
  const [sortUI, setSortUI] = useState(() => {
    if (params.sort === "price_asc") return "price-low";
    if (params.sort === "price_desc") return "price-high";
    if (params.sort === "name") return "name";
    if (params.sort === "featured") return "featured";
    return "newest";
  });

  useEffect(() => {
    const label = slugToCategory(categorySlug);
    updateParam("category", label);
  }, [categorySlug]); // sync URL category with route

  useEffect(() => { setSearchTerm(params.q || ""); }, [params.q]);
  useEffect(() => { setMin(params.minPrice || ""); setMax(params.maxPrice || ""); }, [params.minPrice, params.maxPrice]);
  useEffect(() => {
    if (params.sort === "price_asc") setSortUI("price-low");
    else if (params.sort === "price_desc") setSortUI("price-high");
    else if (params.sort === "name") setSortUI("name");
    else if (params.sort === "featured") setSortUI("featured");
    else setSortUI("newest");
  }, [params.sort]);

  const viewItems = useMemo(() => {
    let out = items.slice();
    if (sortUI === "featured") out.sort((a, b) => Number(b.featured) - Number(a.featured));
    else if (sortUI === "name") out.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    return out;
  }, [items, sortUI]);

  const applySearch = () => updateParam("q", searchTerm.trim());
  const applyPrice = (e) => { e?.preventDefault?.(); updateParam("minPrice", min.trim()); updateParam("maxPrice", max.trim()); };

  const handleSort = (val) => {
    setSortUI(val);
    if (val === "price-low") updateParam("sort", "price_asc");
    else if (val === "price-high") updateParam("sort", "price_desc");
    else if (val === "name") updateParam("sort", "name");
    else if (val === "featured") updateParam("sort", "featured");
    else updateParam("sort", "newest");
  };

  const handleCategoryChange = (label) => updateParam("category", label === "All Products" ? "" : label);

  const clearAll = () => {
    ["q","category","subcategory","minPrice","maxPrice","inStock","sort","page","limit"].forEach((k) => updateParam(k, ""));
    setSearchTerm(""); setMin(""); setMax(""); setSortUI("newest");
  };

  const niceCategory = useMemo(() => (params.category || "All Artworks"), [params.category]);
  const canLoadMore = viewItems.length < total;
  const loadMore = () => {
    const next = Number(params.limit || 12) + 12;
    updateParam("limit", next);
  };

  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(135deg,#fff1f2,#fff7ed)" }}>
      <div className="container py-4 py-lg-5">
        {/* Header */}
        <div className="mb-4">
          <h1 className="fw-bold display-6 mb-2">{niceCategory}</h1>
          <p className="text-muted mb-0">Discover unique, handcrafted artworks that bring beauty to your space</p>
        </div>

        {/* Search + Bar */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body">
            <div className="d-flex flex-column flex-lg-row gap-3 align-items-stretch align-items-lg-center justify-content-between">
              {/* Search */}
              <div className="w-100" style={{ maxWidth: 480 }}>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <Search size={18} className="text-secondary" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search artworks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") applySearch(); }}
                    onBlur={applySearch}
                    className="form-control"
                    aria-label="Search artworks"
                  />
                </div>
              </div>

              <div className="d-flex align-items-center gap-3 flex-wrap">
                {/* Sort */}
                <select
                  value={sortUI}
                  onChange={(e) => handleSort(e.target.value)}
                  className="form-select"
                  style={{ minWidth: 200 }}
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>

                {/* View mode */}
                <div className="btn-group" role="group" aria-label="View mode">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`btn btn-outline-secondary ${viewMode === "grid" ? "active" : ""}`}
                    title="Grid"
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`btn btn-outline-secondary ${viewMode === "list" ? "active" : ""}`}
                    title="List"
                  >
                    <List size={16} />
                  </button>
                </div>

                {/* Filters toggle */}
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
                >
                  <Filter size={16} />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-top">
                <div className="row g-4">
                  {/* Categories (single-select) */}
                  <div className="col-12 col-md-4">
                    <h6 className="fw-semibold mb-3">Categories</h6>
                    <div className="vstack gap-2">
                      {CATEGORIES.map((cat) => (
                        <label key={cat} className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name="cat"
                            className="form-check-input"
                            checked={(params.category || "") === (cat === "All Products" ? "" : cat)}
                            onChange={() => handleCategoryChange(cat)}
                          />
                          <span className="small">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="col-12 col-md-4">
                    <h6 className="fw-semibold mb-3">Price Range</h6>
                    <form className="d-flex gap-2" onSubmit={applyPrice}>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="Min"
                        value={min}
                        onChange={(e) => setMin(e.target.value)}
                        aria-label="Minimum price"
                      />
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="Max"
                        value={max}
                        onChange={(e) => setMax(e.target.value)}
                        aria-label="Maximum price"
                      />
                      <button type="submit" className="btn btn-outline-secondary">Apply</button>
                      <button type="button" className="btn btn-link text-danger text-decoration-none" onClick={() => { setMin(""); setMax(""); updateParam("minPrice",""); updateParam("maxPrice",""); }}>
                        Clear
                      </button>
                    </form>
                  </div>

                  {/* Availability */}
                  <div className="col-12 col-md-4">
                    <h6 className="fw-semibold mb-3">Availability</h6>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className={`btn btn-sm ${params.inStock === true ? "btn-danger" : "btn-outline-secondary"}`}
                        onClick={() => updateParam("inStock", params.inStock === true ? "" : "true")}
                      >
                        In stock
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${params.inStock === false ? "btn-danger" : "btn-outline-secondary"}`}
                        onClick={() => updateParam("inStock", params.inStock === false ? "" : "false")}
                      >
                        Out of stock
                      </button>
                      <button type="button" className="btn btn-link btn-sm text-danger text-decoration-none" onClick={clearAll}>
                        Clear all
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Results count and errors */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <p className="text-muted mb-0">Showing {viewItems.length} of {total} result{total !== 1 ? "s" : ""}</p>
          {error && <div className="alert alert-danger mb-0 py-1 px-2">Failed to load products: {error}</div>}
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="row g-3 g-lg-4">
            {Array.from({ length: Number(params.limit || 12) }).map((_, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 placeholder-glow" style={{ height: 320 }}>
                  <div className="placeholder w-100 h-100 rounded-4" />
                </div>
              </div>
            ))}
          </div>
        ) : viewItems.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-3 mb-2">🎨</div>
            <h3 className="h5 fw-semibold mb-2">No artworks found</h3>
            <p className="text-muted mb-0">Try adjusting filters or search terms</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="row g-3 g-lg-4 mb-4">
            {viewItems.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                viewport={{ once: true }}
                className="col-12 col-md-6 col-lg-4 col-xl-3"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          // List view: compact rows with fixed 96×96 thumbnail (prevents oversized images)
          <div className="vstack gap-3 mb-4">
            {viewItems.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                viewport={{ once: true }}
                className="card border-0 shadow-sm rounded-4"
              >
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="flex-shrink-0 rounded-3 overflow-hidden" style={{ width: 96, height: 96 }}>
                    <img
                      src={p.image}
                      alt={`${p.title} thumbnail`}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold mb-1">{p.title}</div>
                    <div className="text-muted small mb-1">{p.category}</div>
                    <div className="text-danger fw-bold">₹{Number(p.price).toLocaleString("en-IN")}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load more */}
        {!loading && viewItems.length > 0 && (
          <div className="text-center">
            <button
              className="btn btn-danger px-4 py-2 rounded-pill fw-semibold"
              onClick={loadMore}
              disabled={!canLoadMore}
              title={canLoadMore ? "Load more artworks" : "All results loaded"}
            >
              {canLoadMore ? "Load More Artworks" : "All results loaded"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
