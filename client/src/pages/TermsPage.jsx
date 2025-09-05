// src/pages/TermsPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LAST_UPDATED = "August 28, 2025";

const TermsPage = () => {
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
              <h1 className="fw-bold mb-0">Terms & Conditions</h1>
              <span className="text-muted small">Last updated: {LAST_UPDATED}</span>
            </div>

            <p className="text-muted">
              Please read these Terms & Conditions carefully before using the PnpArtStudio website and services. By accessing or using our site, the user agrees to be bound by these Terms. If the user disagrees with any part, the user should discontinue use of the services.
            </p>

            <h5 className="fw-semibold mt-4">1. Eligibility & Accounts</h5>
            <p className="text-muted">
              To place orders, the user may be required to create an account. The user agrees to provide accurate information and is responsible for maintaining the confidentiality of login credentials and for all activities under the account.
            </p>

            <h5 className="fw-semibold mt-4">2. Orders, Pricing & Availability</h5>
            <p className="text-muted">
              All orders are subject to acceptance and availability. Prices may change without notice. If an error in pricing or product details occurs, PnpArtStudio may cancel or adjust the order after notifying the user.
            </p>

            <h5 className="fw-semibold mt-4">3. Payments</h5>
            <p className="text-muted">
              Accepted payment methods are displayed at checkout. By submitting payment information, the user represents that they are authorized to use the selected method and authorizes charges for the order total, including taxes and shipping.
            </p>

            <h5 className="fw-semibold mt-4">4. Shipping & Delivery</h5>
            <p className="text-muted">
              Processing times and delivery estimates are outlined on our <Link to="/shipping">Shipping</Link> page. Risk of loss transfers upon delivery by the carrier to the address provided by the user.
            </p>

            <h5 className="fw-semibold mt-4">5. Returns & Refunds</h5>
            <p className="text-muted">
              Our return windows, conditions, and exclusions are described on the <Link to="/returns">Returns</Link> page. Custom orders and digital items are typically non‑returnable.
            </p>

            <h5 className="fw-semibold mt-4">6. Intellectual Property</h5>
            <p className="text-muted">
              All artworks, images, logos, and content on this site are owned by or licensed to PnpArtStudio and protected by applicable laws. The user may not reproduce, distribute, or create derivative works without prior written consent.
            </p>

            <h5 className="fw-semibold mt-4">7. User Content & Reviews</h5>
            <p className="text-muted">
              By submitting reviews or content, the user grants PnpArtStudio a non‑exclusive, royalty‑free license to use, reproduce, and display such content in connection with the services.
            </p>

            <h5 className="fw-semibold mt-4">8. Prohibited Uses</h5>
            <p className="text-muted mb-1">The user agrees not to:</p>
            <ul className="text-muted">
              <li>Violate laws or infringe third‑party rights</li>
              <li>Interfere with site security or functionality</li>
              <li>Upload malicious code or spam</li>
              <li>Misrepresent identity or purchase information</li>
            </ul>

            <h5 className="fw-semibold mt-4">9. Disclaimer & Limitation of Liability</h5>
            <p className="text-muted">
              The services are provided “as is” and “as available.” To the fullest extent permitted by law, PnpArtStudio disclaims all warranties and is not liable for indirect or consequential damages.
            </p>

            <h5 className="fw-semibold mt-4">10. Indemnification</h5>
            <p className="text-muted">
              The user agrees to indemnify and hold PnpArtStudio harmless from claims arising out of the user’s violation of these Terms or misuse of the services.
            </p>

            <h5 className="fw-semibold mt-4">11. Governing Law</h5>
            <p className="text-muted">
              These Terms are governed by the laws of the user’s local jurisdiction unless otherwise required by applicable law. Venue and jurisdiction shall be as permitted by law.
            </p>

            <h5 className="fw-semibold mt-4">12. Changes to Terms</h5>
            <p className="text-muted">
              We may update these Terms from time to time. Continued use after changes become effective constitutes acceptance of the revised Terms.
            </p>

            <h5 className="fw-semibold mt-4">13. Contact</h5>
            <p className="text-muted">
              Questions about these Terms can be sent to <a href="mailto:pnp.artstudio7@gmail.com">pnp.artstudio7@gmail.com</a>.
            </p>

            <div className="mt-4 alert alert-info mb-0">
              This page provides general information and does not constitute legal advice. Consider consulting a qualified attorney to tailor these terms to specific business needs.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
