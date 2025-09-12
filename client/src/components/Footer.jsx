// src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MapPin, Phone, Instagram, Facebook, Twitter, Youtube, ArrowRight
} from 'lucide-react';
import axios from 'axios';
import './Footer.css';
import logo from '../assets/pnplogo2.svg';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const year = new Date().getFullYear();

const Footer = () => {
  // Newsletter state
  const [subEmail, setSubEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'ok', text: '' });

  const showToast = (type, text) => {
    setToast({ show: true, type, text });
    // auto hide after 3s
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  const onSubscribe = async (e) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(
        `${API_BASE}/api/newsletters/subscribe`,
        { email: subEmail.trim() },
        { withCredentials: true }
      );
      setSubEmail('');
      showToast('ok', 'Subscribed. Check inbox for future updates.');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Subscription failed. Try again.';
      showToast('err', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer
      className="pt-5 text-light footer-root"
      style={{ background: 'linear-gradient(180deg,#0b1020 0%,#111827 100%)' }}
    >
      {/* Top divider */}
      <div
        className="w-100"
        style={{ height: 4, background: 'linear-gradient(90deg,#d63384,#fd7e14)' }}
      />

      <div className="container py-5">
        <div className="row g-4 g-lg-5">
          {/* Brand + About */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img
                src={logo}
                alt="PnpArtStudio — by Priyanka Vasishta"
                className="footer-logo"
                height={44}
                width={44}
                loading="eager"
                decoding="async"
              />
              <div className="lh-1">
                <div
                  className="fw-bold fs-5 footer-brand-gradient"
                  style={{
                    background: 'linear-gradient(90deg,#fda4af,#fdba74)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  PnpArtStudio
                </div>
                <small className="text-muted-contrast">
                  Original Paintings &amp; Art by Priyanka Vasishta
                </small>
              </div>
            </div>

            <p className="text-muted-contrast mb-3">
              Handcrafted originals, limited editions, and custom commissions made with archival
              materials and a collector‑first approach.
            </p>

            <div className="d-flex gap-2">
              <motion.a
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.instagram.com/pnp.artstudio?igsh=MThxbzJsZHg1d29rYw=="
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="btn btn-outline-light rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ width: 40, height: 40 }}
              >
                <Instagram size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.facebook.com/profile.php?id=100064142585253"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="btn btn-outline-light rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ width: 40, height: 40 }}
              >
                <Facebook size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                href="https://youtube.com/@pnpartstudio?si=XtS7itrq6cyrgOdw"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="btn btn-outline-light rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ width: 40, height: 40 }}
              >
                <Youtube size={18} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-semibold mb-3 text-white-50">Quick Links</h6>
            <ul className="list-unstyled vstack gap-2 mb-0">
              <li><Link className="text-decoration-none footer-link" to="/">Home</Link></li>
              <li><Link className="text-decoration-none footer-link" to="/about">About</Link></li>
              <li><Link className="text-decoration-none footer-link" to="/gallery">Gallery</Link></li>
              <li><Link className="text-decoration-none footer-link" to="/blog">Blog</Link></li>
              <li><Link className="text-decoration-none footer-link" to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Shop */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-semibold mb-3 text-white-50">Shop</h6>
            <ul className="list-unstyled vstack gap-2 mb-0">
              <li><Link className="text-decoration-none footer-link" to="/shop">All Products</Link></li>
              <li><Link className="text-decoration-none footer-link" to="/shop/category/paintings">Paintings</Link></li>
              <li><Link className="text-decoration-none footer-link" to="/shop/category/handcrafted-items">Handcrafted</Link></li>
              <li><Link className="text-decoration-none footer-link" to="/shop/category/digital-prints">Digital Prints</Link></li>
              <li><Link className="text-decoration-none footer-link" to="/custom-order">Custom Orders</Link></li>
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="col-12 col-md-6 col-lg-4">
            <h6 className="fw-semibold mb-3 text-white-50">Contact</h6>
            <div className="vstack gap-2 text-muted-contrast small mb-3">
              <div className="d-flex align-items-start gap-2">
                <MapPin size={16} className="mt-1" />
                <span>123 Art Street, Creative District, City, State 12345</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Phone size={16} />
                <a className="text-muted-contrast text-decoration-none footer-link" href="tel:+17135769741">
                  +1 (713) 576‑9741
                </a>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Mail size={16} />
                <a className="text-muted-contrast text-decoration-none footer-link" href="mailto:pnp.artstudio7@gmail.com">
                  pnp.artstudio7@gmail.com
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="rounded-4 p-3 bg-light-subtle position-relative overflow-visible">
              <div className="fw-semibold mb-2 text-white-75">Stay in the loop</div>
              <form className="d-flex gap-2" onSubmit={onSubscribe}>
                <input
                  type="email"
                  required
                  className="form-control rounded-pill"
                  placeholder="Email address"
                  aria-label="Email address"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  disabled={submitting}
                />
                <motion.button
                  whileHover={{ scale: submitting ? 1 : 1.03 }}
                  whileTap={{ scale: submitting ? 1 : 0.97 }}
                  type="submit"
                  className="btn btn-danger rounded-pill d-inline-flex align-items-center gap-1"
                  disabled={submitting}
                >
                  {submitting ? 'Subscribing…' : <>Subscribe <ArrowRight size={16} /></>}
                </motion.button>
              </form>
              {/* Animated toast */}
              <AnimatePresence>
                {toast.show && (
                  <motion.div
                    key="footer-toast"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className={`mt-2 px-3 py-2 rounded-3 small ${toast.type === 'ok' ? 'bg-success text-white' : 'bg-danger text-white'}`}
                    role="status"
                    aria-live="polite"
                  >
                    {toast.text}
                  </motion.div>
                )}
              </AnimatePresence>
              <small className="text-muted-contrast d-block mt-1">No spam. Unsubscribe anytime.</small>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-top border-light-subtle">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
            <small className="text-muted-contrast mb-0">© {year} PnpArtStudio. All rights reserved.</small>
            <div className="d-flex align-items-center gap-3 small">
              <Link to="/terms" className="text-decoration-none footer-link">Terms</Link>
              <Link to="/privacy" className="text-decoration-none footer-link">Privacy</Link>
              <Link to="/returns" className="text-decoration-none footer-link">Returns</Link>
              <Link to="/shipping" className="text-decoration-none footer-link">Shipping</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
