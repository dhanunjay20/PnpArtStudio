// src/pages/CheckoutPage.jsx
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, Percent, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

function CheckoutPage() {
  const { state } = useCart?.() || { state: { items: [] } };

  // Form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'IN',
    sameAsShipping: true,
    paymentMethod: 'cod', // cod | card (placeholder)
    promo: ''
  });

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [promoMsg, setPromoMsg] = useState('');

  // Cart totals
  const items = state.items || [];
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * (it.quantity || 1), 0),
    [items]
  );
  const shipping = subtotal > 500 ? 0 : 49; // example rule
  const tax = Math.round(subtotal * 0.05); // 5% example
  const discount = form.promo?.toUpperCase() === 'ART10' ? Math.round(subtotal * 0.1) : 0; // 10% off
  const total = Math.max(0, subtotal + shipping + tax - discount);

  // Validation (basic)
  const required = ['firstName', 'lastName', 'email', 'address1', 'city', 'state', 'zip'];
  const errors = useMemo(() => {
    const e = {};
    for (const k of required) {
      const v = (form[k] || '').trim();
      if (!v) e[k] = 'Required';
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    if (form.phone && !/^\+?[0-9 ()-]{7,}$/.test(form.phone)) e.phone = 'Invalid phone';
    return e;
  }, [form]);

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onBlur = (e) => {
    const name = e.target.name;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const applyPromo = (e) => {
    e.preventDefault();
    if (form.promo.trim().toUpperCase() === 'ART10') {
      setPromoMsg('Promo applied: 10% off');
    } else if (!form.promo.trim()) {
      setPromoMsg('Enter a code');
    } else {
      setPromoMsg('Invalid code');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched((t) => {
      const all = { ...t };
      required.forEach((k) => (all[k] = true));
      return all;
    });
    if (Object.keys(errors).length > 0) return; // block if invalid

    try {
      setSubmitting(true);
      // TODO: integrate payment here (e.g., Stripe Payment Element or COD flow)
      // After success:
      alert('Order placed successfully!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg,#fff1f2,#fff7ed)' }}>
      <div className="container py-4 py-lg-5">
        <div className="mb-4">
          <h1 className="fw-bold h3 mb-1">Checkout</h1>
          <p className="text-muted mb-0">Secure payment and fast delivery</p>
        </div>

        <div className="row g-4 g-lg-5">
          {/* Form */}
          <div className="col-12 col-lg-7">
            <form noValidate onSubmit={onSubmit} className="needs-validation">
              <div className="card border-0 shadow-sm rounded-4 mb-3">
                <div className="card-body">
                  <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2">
                    <Truck size={18} /> Shipping address
                  </h5>

                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label">First name</label>
                      <input
                        name="firstName"
                        type="text"
                        className={`form-control ${touched.firstName && errors.firstName ? 'is-invalid' : ''}`}
                        value={form.firstName}
                        onChange={(e) => setField('firstName', e.target.value)}
                        onBlur={onBlur}
                        required
                      />
                      <div className="invalid-feedback">First name is required</div>
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label">Last name</label>
                      <input
                        name="lastName"
                        type="text"
                        className={`form-control ${touched.lastName && errors.lastName ? 'is-invalid' : ''}`}
                        value={form.lastName}
                        onChange={(e) => setField('lastName', e.target.value)}
                        onBlur={onBlur}
                        required
                      />
                      <div className="invalid-feedback">Last name is required</div>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Email</label>
                      <input
                        name="email"
                        type="email"
                        className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                        value={form.email}
                        onChange={(e) => setField('email', e.target.value)}
                        onBlur={onBlur}
                        required
                      />
                      <div className="invalid-feedback">{errors.email || 'Valid email required'}</div>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Phone (optional)</label>
                      <input
                        name="phone"
                        type="tel"
                        className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                        value={form.phone}
                        onChange={(e) => setField('phone', e.target.value)}
                        onBlur={onBlur}
                        placeholder="+91 90000 00000"
                      />
                      <div className="invalid-feedback">{errors.phone}</div>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Address line 1</label>
                      <input
                        name="address1"
                        type="text"
                        className={`form-control ${touched.address1 && errors.address1 ? 'is-invalid' : ''}`}
                        value={form.address1}
                        onChange={(e) => setField('address1', e.target.value)}
                        onBlur={onBlur}
                        required
                      />
                      <div className="invalid-feedback">Address is required</div>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Address line 2 (optional)</label>
                      <input
                        name="address2"
                        type="text"
                        className="form-control"
                        value={form.address2}
                        onChange={(e) => setField('address2', e.target.value)}
                        onBlur={onBlur}
                      />
                    </div>

                    <div className="col-md-5">
                      <label className="form-label">Country</label>
                      <select
                        name="country"
                        className="form-select"
                        value={form.country}
                        onChange={(e) => setField('country', e.target.value)}
                      >
                        <option value="IN">India</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AE">UAE</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">State</label>
                      <input
                        name="state"
                        type="text"
                        className={`form-control ${touched.state && errors.state ? 'is-invalid' : ''}`}
                        value={form.state}
                        onChange={(e) => setField('state', e.target.value)}
                        onBlur={onBlur}
                        required
                      />
                      <div className="invalid-feedback">State is required</div>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">ZIP</label>
                      <input
                        name="zip"
                        type="text"
                        className={`form-control ${touched.zip && errors.zip ? 'is-invalid' : ''}`}
                        value={form.zip}
                        onChange={(e) => setField('zip', e.target.value)}
                        onBlur={onBlur}
                        required
                      />
                      <div className="invalid-feedback">ZIP is required</div>
                    </div>
                  </div>

                  <div className="form-check mt-3">
                    <input
                      id="sameAsShipping"
                      className="form-check-input"
                      type="checkbox"
                      checked={form.sameAsShipping}
                      onChange={(e) => setField('sameAsShipping', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="sameAsShipping">
                      Billing address same as shipping
                    </label>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-4 mb-3">
                <div className="card-body">
                  <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2">
                    <CreditCard size={18} /> Payment
                  </h5>

                  <div className="form-check mb-2">
                    <input
                      id="pm-cod"
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      checked={form.paymentMethod === 'cod'}
                      onChange={() => setField('paymentMethod', 'cod')}
                    />
                    <label className="form-check-label" htmlFor="pm-cod">
                      Cash on Delivery (COD)
                    </label>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      id="pm-card"
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      checked={form.paymentMethod === 'card'}
                      onChange={() => setField('paymentMethod', 'card')}
                    />
                    <label className="form-check-label" htmlFor="pm-card">
                      Card / UPI (coming soon)
                    </label>
                  </div>

                  <div className="alert alert-info d-flex align-items-center gap-2 mb-0">
                    <ShieldCheck size={18} />
                    <div className="small mb-0">
                      Payments are processed securely when enabled; card fields will appear here. Integrate a provider like Stripe’s Payment Element when ready. 
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-grid">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="btn btn-danger rounded-4 py-3 fw-semibold"
                >
                  {submitting ? 'Placing order...' : `Place order • ₹${total.toLocaleString()}`}
                </motion.button>
              </div>
            </form>
          </div>

          {/* Summary */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 mb-3">
              <div className="card-body">
                <h5 className="fw-semibold mb-3">Order summary</h5>
                {items.length === 0 ? (
                  <p className="text-muted mb-0">No items in cart.</p>
                ) : (
                  <div className="vstack gap-3">
                    {items.map((it) => (
                      <div key={it.id} className="d-flex align-items-center">
                        <img
                          src={it.image}
                          alt={it.title}
                          className="rounded me-3 object-fit-cover"
                          style={{ width: 56, height: 56 }}
                        />
                        <div className="flex-grow-1">
                          <div className="small fw-semibold">{it.title}</div>
                          <div className="small text-muted">
                            {it.category} • Qty {it.quantity || 1}
                          </div>
                        </div>
                        <div className="small fw-semibold">
                          ₹{(it.price * (it.quantity || 1)).toLocaleString()}
                        </div>
                      </div>
                    ))}
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between small">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between small">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                    </div>
                    <div className="d-flex justify-content-between small">
                      <span>Tax (est.)</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="d-flex justify-content-between small text-success">
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Promo */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <h6 className="fw-semibold mb-2 d-flex align-items-center gap-2">
                  <Tag size={16} /> Apply promo code
                </h6>
                <form onSubmit={applyPromo} className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter code (e.g., ART10)"
                    value={form.promo}
                    onChange={(e) => setField('promo', e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
                  >
                    <Percent size={16} />
                    Apply
                  </motion.button>
                </form>
                {promoMsg && <div className="small mt-2 text-muted">{promoMsg}</div>}
              </div>
            </div>
          </div>
        </div>

        <p className="text-muted small mt-4 mb-0">
          This layout follows Bootstrap’s checkout form patterns and client-side validation approach; integrate a payment provider when moving beyond COD. 
        </p>
      </div>
    </div>
  );
}

export default CheckoutPage;
