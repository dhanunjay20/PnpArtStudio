// src/pages/ArtClassesPage.jsx
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar, Clock, Users, MapPin, Paintbrush, CheckCircle2, Info, GraduationCap, Wifi
} from "lucide-react";

// Card hover variants (applied to the card only)
const cardHover = {
  y: -4,
  scale: 1.01,
  boxShadow: "0 12px 28px rgba(17, 24, 39, 0.12)"
};

// Subtle image zoom on hover (on the image only)
const imgHover = { scale: 1.04 };

const ArtClassesPage = () => {
  const [mode, setMode] = useState("online"); // 'online' | 'offline'

  // Online sessions with images
  const onlineSessions = useMemo(
    () => [
      {
        id: "ws-101",
        title: "Foundations: Drawing & Composition",
        level: "Beginner",
        date: "Sep 14, 2025",
        time: "10:30 AM – 1:00 PM IST",
        seats: 50,
        location: "Online (Zoom)",
        price: 49,
        image:
          "https://images.pexels.com/photos/3817582/pexels-photo-3817582.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
        highlights: ["Pencil techniques", "Line & shape", "Basic composition"]
      },
      {
        id: "ws-201",
        title: "Acrylics: Color & Texture",
        level: "Intermediate",
        date: "Sep 21, 2025",
        time: "2:00 PM – 5:00 PM IST",
        seats: 50,
        location: "Online (Zoom)",
        price: 69,
        image:
          "https://images.pexels.com/photos/1798725/pexels-photo-1798725.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
        highlights: ["Color mixing", "Layering", "Palette knife"]
      },
      {
        id: "ws-301",
        title: "Watercolor Landscapes",
        level: "All Levels",
        date: "Sep 28, 2025",
        time: "10:30 AM – 1:00 PM IST",
        seats: 50,
        location: "Online (Zoom)",
        price: 59,
        image:
          "https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
        highlights: ["Wet-on-wet", "Atmosphere", "Brush control"]
      },
      {
        id: "ws-401",
        title: "Ink & Wash Urban Sketching",
        level: "All Levels",
        date: "Oct 05, 2025",
        time: "4:00 PM – 6:30 PM IST",
        seats: 60,
        location: "Online (Zoom)",
        price: 45,
        image:
          "https://images.pexels.com/photos/312839/pexels-photo-312839.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
        highlights: ["Line confidence", "Quick value maps", "Urban scenes"]
      }
    ],
    []
  );

  // Studio classes now open
  const offlineSessions = useMemo(
    () => [
      {
        id: "st-101",
        title: "Studio: Acrylic Basics Weekend",
        level: "Beginner",
        date: "Sep 20, 2025",
        time: "11:00 AM – 2:00 PM",
        seats: 14,
        location: "Studio — Indiranagar, Bengaluru",
        price: 79,
        image:
          "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
        highlights: ["Materials handling", "Underpainting", "Brush control"]
      },
      {
        id: "st-202",
        title: "Studio: Portraits in Charcoal",
        level: "Intermediate",
        date: "Sep 27, 2025",
        time: "3:00 PM – 6:00 PM",
        seats: 12,
        location: "Studio — Indiranagar, Bengaluru",
        price: 89,
        image:
          "https://images.pexels.com/photos/3651608/pexels-photo-3651608.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
        highlights: ["Proportions", "Planes of the head", "Light & shadow"]
      },
      {
        id: "st-303",
        title: "Studio: Watercolor Botanicals",
        level: "All Levels",
        date: "Oct 04, 2025",
        time: "10:00 AM – 1:00 PM",
        seats: 16,
        location: "Studio — Indiranagar, Bengaluru",
        price: 85,
        image:
          "https://images.pexels.com/photos/21261/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
        highlights: ["Glazing", "Edges", "Botanical forms"]
      }
    ],
    []
  );

  const sessions = mode === "online" ? onlineSessions : offlineSessions;

  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(135deg,#fff1f2,#fff7ed)" }}>
      {/* Top container with GIF hero */}
      <div className="container pt-4 mb-4 mb-lg-5"> {/* extra bottom margin added */}
        <div className="row g-3 mb-3">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="row g-0 align-items-center">
                <div className="col-12 col-lg-6">
                  {/* Art classes animated GIF (replace with project asset if available) */}
                  <img
                    src="https://media.giphy.com/media/26xBukh0w9I9Pj1yA/giphy.gif"
                    alt="Art classes in action"
                    className="w-100"
                    loading="lazy"
                    style={{ height: 320, objectFit: "cover" }}
                  />
                </div>
                <div className="col-12 col-lg-6">
                  <div className="p-4 p-lg-5">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{ width: 64, height: 64, background: "#ffe4e6", color: "#d63384" }}
                    >
                      <GraduationCap size={28} />
                    </div>
                    <h2 className="fw-bold mb-2">Learn, Create, Thrive</h2>
                    <p className="text-muted mb-0">
                      Join live online sessions or enroll in immersive studio workshops guided by experienced instructors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* end hero container */}

      {/* Main content container with extra top/bottom padding */}
      <div className="container pt-3 pb-5"> {/* added pt-3 and larger pb-5 */}
        {/* Availability banner */}
        <div className="alert alert-light border-0 shadow-sm rounded-4 d-flex align-items-center gap-2 mb-4">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36, background: "#ffe4e6", color: "#d63384" }}
          >
            <Wifi size={18} />
          </div>
          <div className="flex-grow-1">
            <div className="fw-semibold">Online and Studio class registrations are open</div>
            <div className="text-muted small">Pick a mode below to explore upcoming sessions</div>
          </div>
        </div>

        {/* Mode toggle */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-4 mb-lg-5" /* slightly larger margin below */
        >
          <div className="text-center mb-3">
            <h1 className="fw-bold display-6 mb-2">Art Classes & Workshops</h1>
            <p className="text-muted mb-0">
              Live, guided sessions to master techniques across drawing, watercolor, and acrylics — learn from anywhere or join in studio.
            </p>
          </div>

          <div className="d-flex justify-content-center">
            <div className="btn-group" role="group" aria-label="Class delivery mode">
              <button
                type="button"
                className={`btn ${mode === "online" ? "btn-danger" : "btn-outline-secondary"}`}
                onClick={() => setMode("online")}
              >
                Online
              </button>
              <button
                type="button"
                className={`btn ${mode === "offline" ? "btn-danger" : "btn-outline-secondary"}`}
                onClick={() => setMode("offline")}
              >
                Studio
              </button>
            </div>
          </div>
        </motion.section>

        {/* What’s included */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="row g-3 g-lg-4 mb-4 mb-lg-5" /* keep healthy gap below */
        >
          {[
            { icon: <Paintbrush size={18} />, title: "Guided Techniques", text: "Step‑by‑step demos and personalized feedback." },
            { icon: <Users size={18} />, title: "Small Cohorts", text: "Limited seats to maximize instructor attention." },
            { icon: <CheckCircle2 size={18} />, title: "Materials Guidance", text: "Get pre‑class materials list and alternatives." },
          ].map((f, i) => (
            <div key={i} className="col-12 col-lg-4">
              <motion.div whileHover={cardHover} className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body d-flex gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40, background: "#fff1f2", color: "#d63384" }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-1">{f.title}</h5>
                    <p className="text-muted mb-0">{f.text}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.section>

        {/* Sessions list */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-4 mb-lg-5" /* more bottom room before enquiry */
        >
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <h2 className="fw-bold h4 mb-0">
              {mode === "online" ? "Upcoming Online Sessions" : "Upcoming Studio Sessions"}
            </h2>
            <span className="text-muted small">{(mode === "online" ? onlineSessions : offlineSessions).length} scheduled</span>
          </div>

          <div className="row g-3 g-lg-4">
            {sessions.map((s, idx) => (
              <div key={s.id} className="col-12 col-lg-4">
                {/* Apply hover only to the card, not the column */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={cardHover}
                  className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
                >
                  {/* Taller image height, cover fit */}
                  <motion.img
                    src={s.image}
                    alt={s.title}
                    className="card-img-top"
                    loading="lazy"
                    style={{ height: 220, objectFit: "cover" }}
                    whileHover={imgHover}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  />

                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span
                        className="badge rounded-pill"
                        style={{
                          background: mode === "online" ? "#e0f2fe" : "#e6ffe6",
                          color: mode === "online" ? "#0369a1" : "#14532d",
                        }}
                      >
                        {mode === "online" ? "Online Live" : "Studio"}
                      </span>
                      <div className="fw-semibold" style={{ color: "#d63384" }}>
                        ${s.price}
                      </div>
                    </div>

                    <h3 className="h5 fw-bold mb-2">{s.title}</h3>

                    <ul className="list-unstyled text-muted small vstack gap-2 mb-3">
                      <li className="d-flex align-items-center gap-2">
                        <Calendar size={16} /> <span>{s.date}</span>
                      </li>
                      <li className="d-flex align-items-center gap-2">
                        <Clock size={16} /> <span>{s.time}</span>
                      </li>
                      <li className="d-flex align-items-center gap-2">
                        <Users size={16} /> <span>{s.seats} seats</span>
                      </li>
                      <li className="d-flex align-items-center gap-2">
                        <MapPin size={16} /> <span>{s.location}</span>
                      </li>
                    </ul>

                    {s.highlights?.length > 0 && (
                      <div className="mb-3">
                        <div className="text-muted small mb-1">You’ll practice:</div>
                        <div className="d-flex flex-wrap gap-1">
                          {s.highlights.map((h) => (
                            <span key={h} className="badge bg-light text-dark rounded-pill border">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      className="btn btn-danger w-100 rounded-pill"
                      onClick={() =>
                        alert(`Enquiry for ${s.title} (${mode === "online" ? "Online" : "Studio"})`)
                      }
                    >
                      Enquire / Reserve Seat
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Quick enquiry */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-4 mb-lg-5" /* consistent section gap */
        >
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4 p-lg-5">
              <h2 className="fw-bold h5 mb-2">Enrollment Enquiry</h2>
              <p className="text-muted">
                Share details below and the coordinator will follow up with schedules, materials, and payment options.
              </p>
              <form
                className="row g-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Thanks! We’ll reach out about ${mode === "online" ? "online" : "studio"} classes shortly.`);
                }}
              >
                <div className="col-12 col-md-6">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" required placeholder="Your name" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" required placeholder="you@example.com" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Phone</label>
                  <input className="form-control" required placeholder="+91 9XXXXXXXXX" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Preferred Mode</label>
                  <select className="form-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="online">Online (Live)</option>
                    <option value="offline">Studio</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Message</label>
                  <textarea rows={4} className="form-control" placeholder="Tell us what you’d like to learn…" />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-danger rounded-pill px-4">
                    Send Enquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.section>
      </div> {/* end main container */}
    </div>
  );
};

export default ArtClassesPage;
