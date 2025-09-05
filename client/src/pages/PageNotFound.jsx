// src/pages/PageNotFound.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ShoppingBag, ArrowLeft } from 'lucide-react';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{ background: 'linear-gradient(135deg,#fff1f2,#fff7ed)' }}
    >
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card border-0 shadow-sm rounded-4 overflow-hidden"
            >
              <div className="card-body p-4 p-lg-5 text-center">
                <div className="d-flex justify-content-center mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 72,
                      height: 72,
                      background: '#ffe4e6',
                      color: '#d63384',
                    }}
                  >
                    <AlertTriangle size={30} />
                  </div>
                </div>

                <h1 className="fw-bold display-6 mb-2">Page not found</h1>
                <p className="text-muted mb-4">
                  The page being requested doesn’t exist or may have been moved. Check the URL or use the options below.
                </p>

                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  <Link to="/" className="btn btn-danger rounded-pill d-inline-flex align-items-center gap-2">
                    <Home size={18} />
                    Go Home
                  </Link>
                  <Link
                    to="/shop"
                    className="btn btn-outline-secondary rounded-pill d-inline-flex align-items-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    Browse Shop
                  </Link>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-secondary rounded-pill d-inline-flex align-items-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    Go Back
                  </button>
                </div>

                <hr className="my-4" />

                <div className="text-muted small">
                  Need help? Reach out from the Contact page or use the navigation links above.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
