import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartDropdown = () => {
  const { state, dispatch, totalPrice } = useCart();

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: id });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    }
  };

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"
            style={{ zIndex: 1040 }}
            onClick={() => dispatch({ type: "CLOSE_CART" })}
          />

          {/* Sidebar Cart */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="position-fixed top-0 end-0 h-100 bg-white shadow-lg"
            style={{ width: "22rem", zIndex: 1050, overflowY: "auto" }}
          >
            <div className="p-4">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Shopping Cart</h5>
                <button
                  onClick={() => dispatch({ type: "CLOSE_CART" })}
                  className="btn btn-light btn-sm rounded-circle"
                >
                  <X size={18} />
                </button>
              </div>

              {/* If cart empty */}
              {state.items.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">Your cart is empty</p>
                  <Link
                    to="/shop"
                    onClick={() => dispatch({ type: "CLOSE_CART" })}
                    className="btn btn-danger"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <>
                  {/* Cart items */}
                  <div className="mb-4">
                    {state.items.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex align-items-center mb-3 p-2 border rounded"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="rounded me-3"
                          style={{ width: "64px", height: "64px", objectFit: "cover" }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.title}</h6>
                          <p className="text-danger fw-bold mb-1">${item.price}</p>
                          <div className="d-flex align-items-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="btn btn-outline-secondary btn-sm me-2"
                            >
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="btn btn-outline-secondary btn-sm ms-2"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                          className="btn btn-outline-danger btn-sm ms-2"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Footer total */}
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-3">
                      <span className="fw-bold">Total:</span>
                      <span className="fw-bold text-danger">${totalPrice.toFixed(2)}</span>
                    </div>
                    <Link
                      to="/cart"
                      onClick={() => dispatch({ type: "CLOSE_CART" })}
                      className="btn btn-secondary w-100 mb-2"
                    >
                      View Cart
                    </Link>
                    <Link
                      to="/checkout"
                      onClick={() => dispatch({ type: "CLOSE_CART" })}
                      className="btn btn-danger w-100"
                    >
                      Checkout
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDropdown;
