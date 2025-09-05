// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Star,
  Users,
  Award,
  Palette,
  Sparkles,
  Paintbrush,
  Gem,
  Shield,
  GraduationCap,   // NEW
  Calendar         // NEW
} from 'lucide-react';
import img from '../assets/pexels-steve-1070534.jpg'

import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import { sampleProducts } from '../data/Products';

function HomePage() {
  const featuredProducts = sampleProducts.slice(0, 6);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      text:
        'The attention to detail in every piece is extraordinary. My custom painting exceeded all expectations!',
      rating: 5,
      avatar:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 2,
      name: 'Michael Chen',
      text:
        'Beautiful artwork that transforms my living space. The quality is outstanding and delivery was perfect.',
      rating: 5,
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      text:
        "I've ordered multiple pieces and each one is a masterpiece. Highly recommend for art lovers!",
      rating: 5,
      avatar:
        'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    }
  ];

  const blogTeasers = [
    {
      id: 'the-language-of-color',
      title: 'The Language of Color: Emotion in Abstract Art',
      image:
        img,
      excerpt:
        'Colors speak before shapes do. Explore how hue and contrast carry meaning and shape mood.',
    },
    {
      id: 'choosing-art-for-your-space',
      title: 'Choosing Art for Your Space: A Practical Guide',
      image:
        'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      excerpt:
        'Scale, light, and palette matter. Select artworks that harmonize with architecture and style.',
    },
    {
      id: 'oil-vs-acrylic',
      title: 'Oil vs. Acrylic: What Collectors Should Know',
      image:
        'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      excerpt:
        'Both mediums offer unique character. Understand drying, sheen, and long-term care.',
    }
  ];

  return (
    <div className="min-vh-100">
      {/* HERO */}
      <section className="position-relative vh-100 d-flex align-items-center justify-content-center overflow-hidden">
        <HeroCarousel />
        <div className="position-absolute" style={{ inset: 0, background: 'rgba(0,0,0,.40)' }} />

        <div className="position-relative text-center text-white container px-4" style={{ zIndex: 1, maxWidth: 960 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1
              className="fw-bold mb-4 display-3"
              style={{
                background: 'linear-gradient(90deg,#ffffff,#fda4af)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Discover Original Art
            </h1>

            <p className="lead mb-5 text-white-50 mx-auto" style={{ maxWidth: 720 }}>
              Handcrafted paintings and artworks that bring beauty, emotion, and inspiration to your space
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-danger d-inline-flex align-items-center gap-2 px-4 py-3 fw-semibold rounded-pill"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={18} />
                </motion.button>
              </Link>

              <Link to="/gallery">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn px-4 py-3 fw-semibold rounded-pill"
                  style={{
                    color: '#fff',
                    background: 'rgba(255,255,255,.20)',
                    border: '1px solid rgba(255,255,255,.35)',
                    backdropFilter: 'blur(6px)'
                  }}
                >
                  Explore Gallery
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row row-cols-2 row-cols-md-4 g-4 text-center">
            {[
              { icon: Palette, number: '500+', label: 'Artworks Created' },
              { icon: Users,   number: '1000+', label: 'Happy Customers' },
              { icon: Award,   number: '50+',   label: 'Awards Won' },
              { icon: Star,    number: '4.9',   label: 'Average Rating' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="d-flex justify-content-center mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center"
                       style={{ width: 64, height: 64, background: '#ffe4e6' }}>
                    <stat.icon size={30} color="#d63384" />
                  </div>
                </div>
                <div className="fs-3 fw-bold text-dark mb-1">{stat.number}</div>
                <div className="text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg,#fff1f2,#fff7ed)' }}>
        <div className="container">
          <div className="row g-3 g-lg-4">
            {[
              { icon: Paintbrush, title: 'Handcrafted Originals', text: 'One-of-a-kind artworks made with archival materials.' },
              { icon: Gem,        title: 'Limited Editions',      text: 'Signed, numbered editions with certificates of authenticity.' },
              { icon: Sparkles,   title: 'Custom Commissions',    text: 'Tailored pieces created for specific spaces and moods.' },
              { icon: Shield,     title: 'Art-Safe Packaging',    text: 'Secure shipping worldwide with protective materials.' }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="col-12 col-md-6 col-lg-3"
              >
                <div className="card h-100 border-0 shadow-sm rounded-4">
                  <div className="card-body">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                      style={{ width: 44, height: 44, background: '#fff1f2' }}
                    >
                      <item.icon size={20} style={{ color: '#d63384' }} />
                    </div>
                    <h6 className="fw-semibold mb-1">{item.title}</h6>
                    <p className="text-muted small mb-0">{item.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ART CLASSES (NEW) */}
      <section className="py-5 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-4 mb-lg-5"
          >
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                 style={{ width: 56, height: 56, background: '#ffe4e6', color: '#d63384' }}>
              <GraduationCap size={26} />
            </div>
            <h2 className="fw-bold mb-2">Learn with Art Classes</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: 720 }}>
              Live online sessions now, with offline studio classes coming soon—build skills in drawing, acrylics, and watercolor
            </p>
          </motion.div>

          <div className="row g-3 g-lg-4 mb-4">
            {[
              { icon: Users, title: 'Small Cohorts', text: 'Personalized feedback and focused attention in limited-size groups.' },
              { icon: Calendar, title: 'Flexible Schedule', text: 'Weekend and evening batches designed around busy calendars.' },
              { icon: Paintbrush, title: 'Guided Techniques', text: 'Step‑by‑step demos to master fundamentals and explore styles.' }
            ].map((f, i) => (
              <motion.div
                key={f.title}
                className="col-12 col-md-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="card h-100 border-0 shadow-sm rounded-4">
                  <div className="card-body">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                      style={{ width: 44, height: 44, background: '#fff1f2' }}
                    >
                      <f.icon size={20} style={{ color: '#d63384' }} />
                    </div>
                    <h6 className="fw-semibold mb-1">{f.title}</h6>
                    <p className="text-muted small mb-0">{f.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/art-classes" className="btn btn-danger px-4 py-3 fw-semibold rounded-pill d-inline-flex align-items-center gap-2">
              Explore Art Classes
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-5 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-4 mb-lg-5"
          >
            <h2 className="fw-bold mb-2">Featured Artworks</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: 720 }}>
              Discover our most popular and recently created masterpieces
            </p>
          </motion.div>

          <div className="row g-4 mb-4">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                className="col-12 col-md-6 col-lg-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/shop" className="btn btn-danger px-4 py-3 fw-semibold rounded-pill">
              View All Artworks
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg,#fff1f2,#fff7ed)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-4 mb-lg-5"
          >
            <h2 className="fw-bold mb-2">What Our Customers Say</h2>
            <p className="lead text-muted">Trusted by art lovers worldwide</p>
          </motion.div>

          <div className="row g-4">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.id}
                className="col-12 col-md-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="card h-100 border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <div className="d-flex mb-3">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={18} color="#f1c40f" fill="#f1c40f" />
                      ))}
                    </div>
                    <p className="fst-italic text-dark mb-4">“{t.text}”</p>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="rounded-circle object-fit-cover"
                        style={{ width: 48, height: 48 }}
                      />
                      <div>
                        <div className="fw-semibold">{t.name}</div>
                        <div className="text-muted small">Verified Customer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST FROM THE BLOG */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="fw-bold mb-0">From the Studio Blog</h2>
            <Link to="/blog" className="text-decoration-none" style={{ color: '#d63384' }}>
              View all
            </Link>
          </div>

          <div className="row g-3 g-lg-4">
            {blogTeasers.map((b, idx) => (
              <motion.div
                key={b.id}
                className="col-12 col-md-4"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <Link to={`/blog/${b.id}`} className="text-decoration-none text-dark">
                  <article className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="ratio ratio-16x9">
                      <img src={b.image} alt={b.title} className="w-100 h-100 object-fit-cover" />
                    </div>
                    <div className="card-body">
                      <h3 className="h5 fw-semibold mb-2 line-clamp-2">{b.title}</h3>
                      <p className="text-muted mb-0 line-clamp-3">{b.excerpt}</p>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-5" style={{ background: 'linear-gradient(90deg,#d63384,#fd7e14)' }}>
        <div className="container text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="fw-bold mb-2">Stay Connected</h2>
            <p className="lead text-white-50 mb-4">
              Subscribe to get updates on new artworks, exhibitions, and exclusive offers
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mx-auto" style={{ maxWidth: 460 }}>
              <input
                type="email"
                className="form-control form-control-lg rounded-pill"
                placeholder="Enter your email"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-light text-danger fw-semibold px-4 py-2 rounded-pill"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
