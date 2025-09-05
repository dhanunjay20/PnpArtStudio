// CartPage.jsx (Bootstrap version)
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Minus, X, ShoppingBag, ArrowLeft, Gift, Truck, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { state, dispatch, totalPrice, totalItems } = useCart();

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const shippingCost = totalPrice > 100 ? 0 : 15;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shippingCost + tax;

  // Empty state
  if (state.items.length === 0) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ background: 'linear-gradient(135deg,#fff1f2,#fff7ed)' }}
      >
        <div className="text-center container" style={{ maxWidth: 520 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{ width: 128, height: 128 }}
          >
            <ShoppingBag size={64} className="text-secondary" />
          </motion.div>

          <h2 className="fw-bold mb-3">Your cart is empty</h2>
          <p className="text-muted mb-4">
            Looks like no beautiful artworks have been added yet. Explore the collection and find a favorite.
          </p>

          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-danger px-4 py-2 rounded-pill fw-semibold"
            >
              Start Shopping
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100"
      style={{ background: 'linear-gradient(135deg,#fff1f2,#fff7ed)' }}
    >
      <div className="container py-4 py-lg-5">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="display-6 fw-bold mb-1">Shopping Cart</h1>
            <p className="text-muted mb-0">
              {totalItems} item{totalItems !== 1 ? 's' : ''} in the cart
            </p>
          </div>

          <Link
            to="/shop"
            className="d-inline-flex align-items-center gap-2 text-danger text-decoration-none"
          >
            <ArrowLeft size={18} />
            <span className="fw-medium">Continue Shopping</span>
          </Link>
        </div>

        <div className="row g-4">
          {/* Cart Items + Benefits */}
          <div className="col-lg-8">
            {/* Items card */}
            <div className="card shadow-sm border-0 rounded-4 mb-4">
              <div className="card-header bg-white border-0 p-4 d-flex align-items-center justify-content-between">
                <h2 className="h5 fw-semibold mb-0">Your Items</h2>
                <button
                  onClick={clearCart}
                  className="btn btn-link link-danger p-0 text-decoration-none"
                >
                  Clear Cart
                </button>
              </div>

              <div className="list-group list-group-flush">
                {state.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="list-group-item p-4"
                  >
                    <div className="d-flex gap-3">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="rounded-3 object-fit-cover"
                          style={{ width: 96, height: 96 }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h3 className="h6 fw-semibold mb-1">{item.title}</h3>
                            <div className="text-muted small mb-2">{item.category}</div>
                            <div className="fs-5 fw-bold text-danger">${item.price}</div>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="btn btn-sm btn-link text-secondary"
                            title="Remove item"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                          {/* Quantity controls */}
                          <div className="d-inline-flex align-items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="btn btn-outline-secondary btn-sm rounded-3"
                              title="Decrease"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="fw-medium" style={{ minWidth: 32, textAlign: 'center' }}>
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="btn btn-outline-secondary btn-sm rounded-3"
                              title="Increase"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Line total */}
                          <div className="fw-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className="card h-100 text-center shadow-sm border-0 rounded-4">
                  <div className="card-body">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ width: 48, height: 48, background: '#dcfce7' }}
                    >
                      <Truck size={22} className="text-success" />
                    </div>
                    <h3 className="h6 fw-semibold mb-1">Free Shipping</h3>
                    <p className="small text-muted mb-0">On orders over $100</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card h-100 text-center shadow-sm border-0 rounded-4">
                  <div className="card-body">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ width: 48, height: 48, background: '#dbeafe' }}
                    >
                      <Shield size={22} className="text-primary" />
                    </div>
                    <h3 className="h6 fw-semibold mb-1">Secure Packaging</h3>
                    <p className="small text-muted mb-0">Art-safe materials</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card h-100 text-center shadow-sm border-0 rounded-4">
                  <div className="card-body">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ width: 48, height: 48, background: '#f3e8ff' }}
                    >
                      <Gift size={22} className="text-purple" />
                    </div>
                    <h3 className="h6 fw-semibold mb-1">Gift Wrapping</h3>
                    <p className="small text-muted mb-0">Available at checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-4 p-4 sticky-top" style={{ top: '2rem' }}>
              <h2 className="h5 fw-semibold mb-4">Order Summary</h2>

              <div className="mb-4">
                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-success fw-medium">Free</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="d-flex justify-content-between text-muted mb-3">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                {totalPrice < 100 && (
                  <div className="alert alert-primary py-2 small mb-3">
                    💡 Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
                  </div>
                )}

                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold fs-5">Total</span>
                    <span className="fw-bold fs-5">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2">
                <Link to="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-danger btn-lg w-100 rounded-4 fw-semibold shadow-sm"
                  >
                    Proceed to Checkout
                  </motion.button>
                </Link>

                <button className="btn btn-light w-100 rounded-4 fw-medium">
                  Save for Later
                </button>
              </div>

              <div className="mt-4 pt-3 border-top">
                <h3 className="h6 fw-semibold mb-3">Accepted Payment Methods</h3>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge text-bg-light px-3 py-2">VISA</span>
                  <span className="badge text-bg-light px-3 py-2">MASTERCARD</span>
                  <span className="badge text-bg-light px-3 py-2">PAYPAL</span>
                  <span className="badge text-bg-light px-3 py-2">APPLE PAY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>    
    </div>
  );
};

export default CartPage;
