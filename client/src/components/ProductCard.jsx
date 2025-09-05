// src/components/ProductCard.jsx — explicit objectFit to avoid overflow in any layout
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { state, dispatch } = useCart();
  const isWishlisted = (state?.wishlist || []).some(w => w.id === product.id);

  const addToCart = () => {
    if (!product?.inStock) return;
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category
      }
    });
  };

  const toggleWishlist = () => {
    dispatch({
      type: 'WISHLIST_TOGGLE',
      payload: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category
      }
    });
  };

  return (
    <motion.article
      className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="position-relative">
        {/* Grid card hero keeps 1:1; objectFit ensures cover cropping */}
        <div className="ratio ratio-1x1">
          <img src={product.image} alt={`${product.title} thumbnail`} className="w-100 h-100" style={{ objectFit: "cover" }} />
        </div>

        <span className="badge bg-white text-dark border position-absolute top-0 start-0 m-2 rounded-pill">
          {product.category}
        </span>

        {product.inStock ? (
          product.featured && (
            <span className="badge bg-danger position-absolute top-0 end-0 m-2 rounded-pill">
              Featured
            </span>
          )
        ) : (
          <span className="badge bg-secondary position-absolute top-0 end-0 m-2 rounded-pill">
            Sold Out
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={toggleWishlist}
          className="btn btn-light rounded-circle p-0 d-flex align-items-center justify-content-center position-absolute"
          style={{ width: 38, height: 38, right: 8, bottom: 8 }}
        >
          <Heart
            size={18}
            className={isWishlisted ? 'text-danger' : 'text-secondary'}
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className="card-body d-flex flex-column">
        <h3 className="h6 fw-semibold mb-1 line-clamp-2">{product.title}</h3>
        <div className="text-muted small mb-2">
          {(product.medium || 'Artwork')} • {(product.year || '')}
        </div>
        <p className="text-muted small mb-3 line-clamp-2">{product.description}</p>

        <div className="mt-auto d-flex align-items-center justify-content-between">
          <div className="fw-bold">₹{Number(product.price).toLocaleString("en-IN")}</div>
          <div className="d-flex gap-2">
            <motion.button
              whileHover={{ scale: product.inStock ? 1.03 : 1 }}
              whileTap={{ scale: product.inStock ? 0.98 : 1 }}
              type="button"
              onClick={addToCart}
              disabled={!product.inStock}
              className="btn btn-outline-secondary btn-sm rounded-pill d-inline-flex align-items-center gap-1"
              title={product.inStock ? 'Add to cart' : 'Out of stock'}
            >
              <ShoppingCart size={16} />
              <span>Add</span>
            </motion.button>
            <Link to={`/product-details?id=${product.id}`} className="btn btn-danger btn-sm rounded-pill">
              View
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
