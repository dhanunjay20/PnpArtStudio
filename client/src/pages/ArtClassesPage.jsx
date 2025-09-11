// src/pages/ArtClassesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, MapPin, Paintbrush, CheckCircle2, GraduationCap, Wifi } from "lucide-react";
import axios from "axios";
import artvideo from "../assets/art_classes_video.mp4";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Card hover
const cardHover = { y: -4, scale: 1.01, boxShadow: "0 12px 28px rgba(17, 24, 39, 0.12)" };
// Image hover
const imgHover = { scale: 1.04 };

const ArtClassesPage = () => {
  const [mode, setMode] = useState("online"); // 'online' | 'offline'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/classes`, { withCredentials: true });
        if (!ignore) {
          const arr = Array.isArray(res.data?.items) ? res.data.items : [];
          setItems(arr);
          setErr("");
        }
      } catch (e) {
        if (!ignore) setErr("Failed to load classes");
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // Map API -> UI
  const mapped = useMemo(() => {
    return (items || []).map((c) => ({
      id: c._id,
      title: c.title,
      level: c.level || "",
      date: c.startDate || "",
      time: c.time || "",
      seats: typeof c.seats === "number" ? c.seats : 0,
      location: (c.mode === "Online" ? "Online (Live)" : "Studio"),
      price: typeof c.price === "number" ? c.price : 0,
      image: c.cover || "",
      highlights: (c.description ? c.description.split(",").map((s) => s.trim()).filter(Boolean) : []),
      mode: c.mode || "Online",
      published: !!c.published
    }));
  }, [items]);

  const onlineSessions = useMemo(() => mapped.filter((s) => s.mode === "Online" && s.published), [mapped]);
  const offlineSessions = useMemo(() => mapped.filter((s) => s.mode !== "Online" && s.published), [mapped]);
  const sessions = mode === "online" ? onlineSessions : offlineSessions;

  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(135deg,#fff1f2,#fff7ed)" }}>
      {/* Hero */}
      <div className="container pt-4 mb-4 mb-lg-5">
        <div className="row g-3 mb-3">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              {/* Stretch columns; make video fill column */}
              <div className="row g-0 align-items-stretch">
                <div className="col-12 col-lg-6 d-flex h-100">
                  <video
                    src={artvideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-100 h-100"
                    style={{ objectFit: "cover", display: "block" }}
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
      </div>


      {/* Main */}
      <div className="container pt-3 pb-5">
        {/* Availability */}
        <div className="alert alert-light border-0 shadow-sm rounded-4 d-flex align-items-center gap-2 mb-4">
          <div className="rounded-circle d-flex align-items-center justify-content-center"
               style={{ width: 36, height: 36, background: "#ffe4e6", color: "#d63384" }}>
            <Wifi size={18} />
          </div>
          <div className="flex-grow-1">
            <div className="fw-semibold">Online and Studio class registrations are open</div>
            <div className="text-muted small">Pick a mode below to explore upcoming sessions</div>
          </div>
        </div>

        {/* Toggle */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
                        className="mb-4 mb-lg-5">
          <div className="text-center mb-3">
            <h1 className="fw-bold display-6 mb-2">Art Classes & Workshops</h1>
            <p className="text-muted mb-0">
              Live, guided sessions to master techniques across drawing, watercolor, and acrylics — learn from anywhere or join in studio.
            </p>
          </div>

          <div className="d-flex justify-content-center">
            <div className="btn-group" role="group" aria-label="Class delivery mode">
              <button type="button"
                      className={`btn ${mode === "online" ? "btn-danger" : "btn-outline-secondary"}`}
                      onClick={() => setMode("online")}>
                Online
              </button>
              <button type="button"
                      className={`btn ${mode === "offline" ? "btn-danger" : "btn-outline-secondary"}`}
                      onClick={() => setMode("offline")}>
                Studio
              </button>
            </div>
          </div>
        </motion.section>

        {/* What's included */}
        <motion.section initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        transition={{ duration: 0.45 }} className="row g-3 g-lg-4 mb-4 mb-lg-5">
          {[
            { icon: <Paintbrush size={18} />, title: "Guided Techniques", text: "Step‑by‑step demos and personalized feedback." },
            { icon: <Users size={18} />, title: "Small Cohorts", text: "Limited seats to maximize instructor attention." },
            { icon: <CheckCircle2 size={18} />, title: "Materials Guidance", text: "Get pre‑class materials list and alternatives." },
          ].map((f, i) => (
            <div key={i} className="col-12 col-lg-4">
              <motion.div whileHover={cardHover} className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body d-flex gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center"
                       style={{ width: 40, height: 40, background: "#fff1f2", color: "#d63384" }}>
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

        {/* Sessions */}
        <motion.section initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        transition={{ duration: 0.45 }} className="mb-4 mb-lg-5">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <h2 className="fw-bold h4 mb-0">
              {mode === "online" ? "Upcoming Online Sessions" : "Upcoming Studio Sessions"}
            </h2>
            <span className="text-muted small">{sessions.length} scheduled</span>
          </div>

          {loading && <div className="text-muted">Loading classes…</div>}
          {!loading && err && <div className="text-danger">{err}</div>}

          <div className="row g-3 g-lg-4">
            {!loading && !err && sessions.map((s, idx) => (
              <div key={s.id} className="col-12 col-lg-4">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={cardHover}
                  className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
                >
                  <motion.img
                    src={s.image || "https://via.placeholder.com/800x500?text=Class+Cover"}
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
                          background: s.mode === "Online" ? "#e0f2fe" : "#e6ffe6",
                          color: s.mode === "Online" ? "#0369a1" : "#14532d",
                        }}
                      >
                        {s.mode === "Online" ? "Online Live" : "Studio"}
                      </span>
                      <div className="fw-semibold" style={{ color: "#d63384" }}>
                        ₹{Number(s.price || 0).toLocaleString()}
                      </div>
                    </div>

                    <h3 className="h5 fw-bold mb-2">{s.title}</h3>

                    <ul className="list-unstyled text-muted small vstack gap-2 mb-3">
                      <li className="d-flex align-items-center gap-2">
                        <Calendar size={16} /> <span>{s.date || "-"}</span>
                      </li>
                      {s.time ? (
                        <li className="d-flex align-items-center gap-2">
                          <Clock size={16} /> <span>{s.time}</span>
                        </li>
                      ) : null}
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
                      onClick={() => alert(`Enquire / Reserve Seat for ${s.title} (${s.mode})`)}
                    >
                      Enquire / Reserve Seat
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
            {!loading && !err && sessions.length === 0 && (
              <div className="col-12">
                <div className="text-muted">No sessions found for this mode.</div>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ArtClassesPage;
