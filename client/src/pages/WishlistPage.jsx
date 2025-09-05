// src/pages/WishlistPage.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const WishlistPage = () => {
  const { state, dispatch } = useCart();

  const wishlist = state?.wishlist || []; // [{ id, title, price, image, category }]
  const hasItems = wishlist.length > 0;

  const total = useMemo(
    () => wishlist.reduce((sum, it) => sum + (it.price || 0), 0),
    [wishlist]
  );

  const removeFromWishlist = (id) => {
    dispatch?.({ type: "WISHLIST_REMOVE", payload: { id } });
  };

  const moveToCart = (item) => {
    dispatch?.({
      type: "ADD_ITEM",
      payload: {
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        category: item.category,
      },
    });
    dispatch?.({ type: "WISHLIST_REMOVE", payload: { id: item.id } });
  };

  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(135deg,#fff1f2,#fff7ed)" }}>
      <div className="container py-4 py-lg-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="fw-bold h3 mb-0 d-flex align-items-center gap-2">
            <Heart size={22} className="text-danger" />
            Wishlist
          </h1>
          {hasItems && (
            <div className="text-muted small">
              {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} • ${total.toLocaleString()}
            </div>
          )}
        </div>

        {!hasItems ? (
          <div className="text-center py-5">
            <div className="display-3 mb-2">💖</div>
            <h2 className="h5 fw-semibold mb-2">No favorites yet</h2>
            <p className="text-muted mb-4">
              Save artworks to the wishlist and return any time to complete the collection.
            </p>
            <Link to="/shop" className="btn btn-danger rounded-pill px-4">
              Browse Artworks
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* List */}
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                  <div className="list-group list-group-flush">
                    {wishlist.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.03 }}
                        className="list-group-item py-3"
                      >
                        <div className="d-flex align-items-center">
                          <Link to={`/product-details?id=${item.id}`} className="text-decoration-none">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="rounded object-fit-cover"
                              style={{ width: 72, height: 72 }}
                            />
                          </Link>

                          <div className="ms-3 flex-grow-1">
                            <Link
                              to={`/product-details?id=${item.id}`}
                              className="text-decoration-none text-dark"
                            >
                              <div className="fw-semibold">{item.title}</div>
                            </Link>
                            <div className="text-muted small">
                              {item.category} • ${item.price?.toLocaleString()}
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="btn btn-outline-secondary btn-sm rounded-pill d-inline-flex align-items-center gap-1"
                              onClick={() => moveToCart(item)}
                            >
                              <ShoppingCart size={16} />
                              <span>Add to cart</span>
                            </motion.button>

                            <button
                              className="btn btn-outline-danger btn-sm rounded-pill d-inline-flex align-items-center gap-1"
                              onClick={() => removeFromWishlist(item.id)}
                              aria-label="Remove from wishlist"
                            >
                              <Trash2 size={16} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                  <h5 className="fw-semibold mb-3">Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Items</span>
                    <span>{wishlist.length}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Estimated total</span>
                    <span className="fw-semibold">${total.toLocaleString()}</span>
                  </div>

                  <Link to="/shop" className="btn btn-danger w-100 rounded-pill">
                    Continue shopping
                  </Link>

                  <div className="text-muted small mt-3 mb-0">
                    Moving items from wishlist adds them to the cart for checkout.
                  </div>
                </div>
              </div>

              <div className="alert alert-info mt-3 mb-0">
                Tip: Use list groups for clean, actionable rows and badges for quick status labels.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;

