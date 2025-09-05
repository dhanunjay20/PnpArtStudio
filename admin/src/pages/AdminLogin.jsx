// admin/src/pages/AdminLogin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const LOGIN_URL = `${API_BASE}/api/auth/login`;
const EMAIL_KEY = "adminRememberEmail";

axios.defaults.withCredentials = true;

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/admin";

  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(EMAIL_KEY);
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      const msg = "Please enter both email and password.";
      setFormError(msg);
      toast.warning(msg);
      return;
    }

    try {
      setSubmitting(true);

      if (remember) localStorage.setItem(EMAIL_KEY, email);
      else localStorage.removeItem(EMAIL_KEY);

      const { data } = await axios.post(
        LOGIN_URL,
        { email: String(email).trim(), password },
        { withCredentials: true }
      );

      if (data?.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken);
      }

      toast.success("Signed in successfully");
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 600);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setFormError("Invalid email or password.");
        toast.error("Invalid email or password.");
      } else {
        setFormError("Unable to sign in right now.");
        toast.error("Unable to sign in right now.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#fdf2f8,#fff7ed)"
      }}
    >
      <ToastContainer position="top-right" autoClose={2000} newestOnTop />
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="card border-0 shadow rounded-4">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 48,
                  height: 48,
                  background: "linear-gradient(135deg,#fb7185,#f59f0b)"
                }}
              >
                <span className="text-white fw-bold">A</span>
              </div>
              <div className="lh-1">
                <div className="fw-bold">Admin</div>
                <small className="text-muted">Dashboard Access</small>
              </div>
            </div>

            <h1 className="h4 fw-bold mb-2">Sign in</h1>
            <p className="text-muted mb-2">
              Enter admin credentials to continue to dashboard.{" "}
              <Link to="/" className="text-decoration-none">Back to site</Link>
            </p>
            <p className="text-muted mb-4">
              New admin?{" "}
              <Link to="/admin/register" className="text-decoration-none">Create admin</Link>
            </p>

            {formError && (
              <div className="alert alert-danger py-2">{formError}</div>
            )}

            <form onSubmit={onSubmit} noValidate>
              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <Mail size={18} className="text-secondary" />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <Lock size={18} className="text-secondary" />
                  </span>
                  <input
                    type={showPw ? "text" : "password"}
                    className="form-control"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Row: remember + forgot */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="form-check">
                  <input
                    id="remember"
                    className="form-check-input"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label htmlFor="remember" className="form-check-label small">
                    Remember me
                  </label>
                </div>

                <span className="small text-muted">Forgot password?</span>
              </div>

              {/* Submit */}
              <div className="d-grid">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-danger rounded-4 d-inline-flex align-items-center justify-content-center gap-2 py-2"
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Sign in</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="small text-muted mt-4 mb-0">
              Session cookies are required for admin access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
