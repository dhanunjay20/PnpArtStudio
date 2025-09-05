// src/pages/ReturnsPage.jsx
import React from "react";
import { motion } from "framer-motion";

const LAST_UPDATED = "August 28, 2025";

const ReturnsPage = () => {
  return (
    <div
      className="min-vh-100"
      style={{ background: "linear-gradient(135deg,#fff1f2,#fff7ed)" }}
    >
      <div className="container py-4 py-lg-5">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="card border-0 shadow-sm rounded-4"
        >
          <div className="card-body p-4 p-lg-5">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
              <h1 className="fw-bold mb-0">Returns & Refunds</h1>
              <span className="text-muted small">Last updated: {LAST_UPDATED}</span>
            </div>

            <h5 className="fw-semibold mt-2">Return Window</h5>
            <p className="text-muted">
              Returns are accepted within 7 days of delivery for eligible items. To be eligible, the item must be unused, in original condition, and in original packaging.
            </p>

            <h5 className="fw-semibold mt-4">Non‑returnable Items</h5>
            <ul className="text-muted">
              <li>Custom orders and commissions</li>
              <li>Digital downloads</li>
              <li>Gift cards</li>
              <li>Final sale or clearance items (if marked)</li>
            </ul>

            <h5 className="fw-semibold mt-4">Return Process</h5>
            <ol className="text-muted">
              <li>Email a return request with order number and reason to <a href="mailto:pnp.artstudio7@gmail.com">pnp.artstudio7@gmail.com</a>.</li>
              <li>Wait for return authorization and instructions.</li>
              <li>Pack securely and ship using a trackable method within 5 days of authorization.</li>
            </ol>

            <h5 className="fw-semibold mt-4">Refunds</h5>
            <p className="text-muted">
              Once received and inspected, approved refunds are issued to the original payment method within 5–10 business days. Shipping fees are non‑refundable unless the return is due to our error or a defective item.
            </p>

            <h5 className="fw-semibold mt-4">Damages & Issues</h5>
            <p className="text-muted">
              Please inspect the order upon delivery and contact us within 48 hours if the item is defective, damaged, or incorrect. Provide photos of the packaging and item to expedite resolution.
            </p>

            <h5 className="fw-semibold mt-4">Exchanges</h5>
            <p className="text-muted">
              Exchanges may be possible for equal or higher‑value items (price differences apply). Contact us for availability and instructions.
            </p>

            <div className="mt-4 alert alert-info mb-0">
              For any return questions, email <a href="mailto:pnp.artstudio7@gmail.com">pnp.artstudio7@gmail.com</a>. Policies may vary for international orders.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnsPage;
