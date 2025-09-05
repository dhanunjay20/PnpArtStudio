// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Instagram, Facebook, CheckCircle, Youtube } from 'lucide-react';

// Country codes (edit or extend as needed)
const COUNTRY_CODES = [
  { code: 'IN', name: 'India',         dial: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dial: '+1',  flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom',dial: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada',        dial: '+1',  flag: '🇨🇦' },
  { code: 'AU', name: 'Australia',     dial: '+61', flag: '🇦🇺' },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    customOrder: false,
    phone: '',
    countryCode: '+91', // default
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Compose a single phone string if needed for backend submission
    const fullPhone = `${formData.countryCode} ${formData.phone}`.trim();
    // TODO: send `fullPhone` with other payload fields to the backend

    setTimeout(() => {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Studio',
      details: '123 Art Street, Creative District',
      subDetails: 'City, State 12345',
      iconBg: '#ffe4e6',
      iconColor: '#e11d48'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+1 (713) 576‑9741',
      subDetails: 'Mon - Fri, 9am - 6pm',
      iconBg: '#ffedd5',
      iconColor: '#ea580c'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'pnp.artstudio7@gmail.com',
      subDetails: "We'll respond within 24 hours",
      iconBg: '#fef3c7',
      iconColor: '#d97706'
    },
    {
      icon: Clock,
      title: 'Studio Hours',
      details: 'Mon - Fri: 9am - 6pm',
      subDetails: 'Sat - Sun: 10am - 4pm',
      iconBg: '#d1fae5',
      iconColor: '#10b981'
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/pnp.artstudio/?igsh=MThxbzJsZHg1d29rYw%3D%3D#', label: 'Instagram', bg: '#ec4899' },
    { icon: Facebook,  href: 'https://www.facebook.com/people/PnP-art-studio/100064142585253/', label: 'Facebook',  bg: '#2563eb' },
    { icon: Youtube,   href: 'https://www.youtube.com/@pnpartstudio', label: 'Twitter',   bg: '#38bdf8' }
  ];

  return (
    <div
      className="min-vh-100"
      style={{ background: 'linear-gradient(135deg,#fff1f2,#fff7ed)' }}
    >
      <div className="container py-4 py-lg-5">
        {/* Header */}
        <div className="text-center mb-5">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="fw-bold display-5 mb-3"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lead text-muted mx-auto"
            style={{ maxWidth: 720 }}
          >
            Have questions about our artwork? Want to commission a custom piece? We&apos;d love to hear from you and discuss your artistic vision.
          </motion.p>
        </div>

        {/* Contact Info Cards */}
        <div className="row g-3 g-lg-4 mb-5">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div key={index} className="col-12 col-md-6 col-lg-3">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card h-100 shadow-sm border-0 rounded-4"
                >
                  <div className="card-body">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                      style={{ width: 48, height: 48, background: info.iconBg }}
                    >
                      <Icon size={22} style={{ color: info.iconColor }} />
                    </div>
                    <h3 className="h6 fw-semibold mb-2">{info.title}</h3>
                    <p className="mb-1 fw-medium">{info.details}</p>
                    <p className="text-muted small mb-0">{info.subDetails}</p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        <div className="row g-4">
          {/* Contact Form */}
          <div className="col-12 col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="card shadow-sm border-0 rounded-4"
            >
              <div className="card-body p-4 p-lg-5">
                <h2 className="h3 fw-bold mb-4">Send us a Message</h2>

                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="alert alert-success d-flex align-items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    <div className="fw-medium">Thank you! We&apos;ll get back to you soon.</div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Phone with country code select (flag + dial only) */}
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone Number</label>
                    <div className="input-group">
                      <select
                        name="countryCode"
                        aria-label="Country code"
                        className="form-select flex-shrink-0"
                        style={{ maxWidth: 110 }}  // tighter since we show only flag + dial
                        value={formData.countryCode}
                        onChange={handleChange}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.dial} title={`${c.name} (${c.dial})`}>
                            {c.flag} {c.dial}
                          </option>
                        ))}
                      </select>

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="1234567890"
                        inputMode="tel"
                        autoComplete="tel"
                      />
                    </div>
                    <small className="text-muted">
                      Enter local number only; the country code is selected on the left.
                    </small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="commission">Custom Order/Commission</option>
                      <option value="workshop">Workshop Information</option>
                      <option value="purchase">Purchase Inquiry</option>
                      <option value="exhibition">Exhibition/Gallery</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Tell us about your inquiry, custom order details, or any questions you have..."
                    />
                  </div>

                  <div className="col-12 d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      name="customOrder"
                      id="customOrder"
                      checked={formData.customOrder}
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label htmlFor="customOrder" className="form-check-label small">
                      I&apos;m interested in a custom order or commission
                    </label>
                  </div>

                  <div className="col-12">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn w-100 text-white fw-semibold py-3 shadow-sm"
                      style={{
                        background: 'linear-gradient(90deg,#d63384,#fd7e14)',
                        borderRadius: 12
                      }}
                    >
                      <span className="d-inline-flex align-items-center gap-2">
                        <Send size={18} />
                        Send Message
                      </span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Map + Extras */}
          <div className="col-12 col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="vstack gap-4"
            >
              {/* Studio Location */}
              <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="card-body">
                  <h3 className="h4 fw-bold mb-2">Visit Our Studio</h3>
                  <p className="text-muted mb-0">
                    Located in the heart of the creative district, our studio is open for visits, consultations, and workshops. Come see our latest works in person!
                  </p>
                </div>
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    height: 260,
                    background: 'linear-gradient(135deg,#ffe4e6,#ffedd5)'
                  }}
                >
                  <div className="text-center text-secondary">
                    <MapPin className="mb-2" size={40} />
                    <div>Interactive Map</div>
                    <div className="small">123 Art Street, Creative District</div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body">
                  <h3 className="h4 fw-bold mb-2">Follow Our Journey</h3>
                  <p className="text-muted">
                    Stay connected with us on social media to see behind-the-scenes content, new artwork reveals, and workshop updates.
                  </p>
                  <div className="d-flex gap-3">
                    {socialLinks.map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <motion.a
                          key={i}
                          href={s.href}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-white d-inline-flex align-items-center justify-content-center rounded-3 shadow-sm"
                          style={{ width: 44, height: 44, background: s.bg }}
                          aria-label={s.label}
                          target='_blank'
                        >
                          <Icon size={20} />
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Workshop Info */}
              <div
                className="rounded-4 border p-4"
                style={{
                  background: 'linear-gradient(135deg,#fffbeb,#fff7ed)',
                  borderColor: '#fde68a'
                }}
              >
                <h3 className="h5 fw-bold mb-2">🎨 Art Workshops Available</h3>
                <p className="mb-3 text-muted">
                  Join our hands-on workshops to learn painting techniques, explore creativity, and create a masterpiece to take home.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-white text-warning-emphasis border" style={{ borderColor: '#fde68a' }}>
                    Beginner Friendly
                  </span>
                  <span className="badge bg-white text-warning-emphasis border" style={{ borderColor: '#fde68a' }}>
                    All Materials Included
                  </span>
                  <span className="badge bg-white text-warning-emphasis border" style={{ borderColor: '#fde68a' }}>
                    Small Groups
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
