// src/pages/TrackOrderPage.jsx
import React, { useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const DEFAULT_STEPS = [
  { key: "PLACED", label: "Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { key: "DELIVERED", label: "Delivered" }
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const cleanId = orderId.trim();

  const stepIndex = useMemo(() => {
    if (!order?.status) return -1;
    const idx = DEFAULT_STEPS.findIndex(s => s.key === order.status);
    return idx >= 0 ? idx : -1;
  }, [order]);

  const progressPct = useMemo(() => {
    if (stepIndex < 0) return 0;
    const last = DEFAULT_STEPS.length - 1;
    return Math.round((stepIndex / last) * 100);
  }, [stepIndex]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!cleanId) {
      toast.error("Please enter a valid Order ID");
      return;
    }
    setLoading(true);
    setOrder(null);
    await toast.promise(
      (async () => {
        const url = `${API_BASE}/api/orders/track?orderId=${encodeURIComponent(cleanId)}`;
        const { data } = await axios.get(url, { withCredentials: true });
        if (!data || !data.orderId) {
          const err = new Error("Order not found");
          err.code = "NOT_FOUND";
          throw err;
        }
        setOrder(data);
        return "Order found";
      })(),
      {
        loading: "Checking order…",
        success: (msg) => msg || "Loaded",
        error: (err) => err?.message || "Unable to fetch order"
      }
    ).finally(() => setLoading(false));
  };

  return (
    <div className="container py-5">
      <header className="text-center mb-4">
        <h1 className="fw-bold">Track your order</h1>
        <p className="text-muted mb-0">Enter the Order ID to see live status and details</p>
      </header>

      {/* Search form */}
      <form className="row g-3 justify-content-center mb-4" onSubmit={onSubmit} noValidate>
        <div className="col-12 col-md-8">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="orderIdInput"
              placeholder="ORD-123456"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              aria-describedby="orderIdHelp"
              inputMode="text"
              autoComplete="off"
            />
            <label htmlFor="orderIdInput">Order ID</label>
          </div>
          <div id="orderIdHelp" className="form-text">
            Example: ORD-123456 (as in the email confirmation)
          </div>
        </div>
        <div className="col-auto d-flex align-items-end">
          <button type="submit" className="btn btn-danger btn-lg px-4" disabled={loading}>
            {loading ? "Loading…" : "Track"}
          </button>
        </div>
      </form>

      {/* Empty state */}
      {!order && !loading && (
        <div className="text-center text-muted mt-4">
          Enter an Order ID above to see status and details
        </div>
      )}

      {/* Results */}
      {order && (
        <section className="rounded-4 shadow-sm p-4 bg-white">
          {/* Header + progress */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-lg-between gap-3 mb-4">
            <div className="text-truncate">
              <h2 className="h4 mb-1 text-truncate">Order #{order.orderId}</h2>
              <span className="badge bg-danger">
                {DEFAULT_STEPS.find(s => s.key === order.status)?.label || "Unknown"}
              </span>
            </div>

            {/* Accessible progress with label */}
            <div
              className="w-100 w-lg-50"
              role="progressbar"
              aria-label="Order progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPct}
              title={`Order progress: ${progressPct}%`}
            >
              <div className="progress" style={{ height: 10 }}>
                <div className="progress-bar bg-danger" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="d-flex justify-content-between mt-2 small text-muted">
                {DEFAULT_STEPS.map((s, i) => (
                  <span
                    key={s.key}
                    className={`text-truncate ${i <= stepIndex ? "text-dark fw-semibold" : ""}`}
                    style={{ maxWidth: i === 2 ? 110 : 92 }}
                    title={s.label}
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Status + shipping + totals */}
          <div className="row row-cols-1 row-cols-lg-3 g-4 align-items-stretch">
            <div className="col d-flex">
              <div className="card border-0 shadow-sm w-100 h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Timeline</h5>
                  <ul className="list-unstyled mb-0 small">
                    <li className="mb-2"><span className="fw-semibold">Placed:</span> {order.placedAt || "—"}</li>
                    <li className="mb-2"><span className="fw-semibold">Confirmed:</span> {order.confirmedAt || "—"}</li>
                    <li className="mb-2"><span className="fw-semibold">Shipped:</span> {order.shippedAt || "—"}</li>
                    <li className="mb-2"><span className="fw-semibold">Out for delivery:</span> {order.outForDeliveryAt || "—"}</li>
                    <li><span className="fw-semibold">Delivered:</span> {order.deliveredAt || "—"}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col d-flex">
              <div className="card border-0 shadow-sm w-100 h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Shipping</h5>
                  <div className="small text-muted mb-1">Recipient</div>
                  <div className="mb-2 text-truncate">{order?.customer?.name || "—"}</div>
                  <div className="small text-muted mb-1">Phone</div>
                  <div className="mb-2">{order?.customer?.phone || "—"}</div>
                  <div className="small text-muted mb-1">Address</div>
                  <div className="mb-0">{order?.customer?.address || "—"}</div>
                </div>
              </div>
            </div>

            <div className="col d-flex">
              <div className="card border-0 shadow-sm w-100 h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Payment & totals</h5>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Items</span>
                    <span>{Array.isArray(order?.items) ? order.items.length : 0}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Subtotal</span>
                    <span>{order?.subtotal ?? "—"}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Shipping</span>
                    <span>{order?.shipping ?? "—"}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-semibold mt-auto">
                    <span>Total</span>
                    <span>{order?.total ?? "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mt-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Items</h5>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                  {(order?.items || []).map((it, idx) => (
                    <div key={idx} className="col d-flex">
                      <div className="d-flex gap-3 align-items-center p-2 rounded border w-100">
                        <img
                          src={it.image}
                          alt=""
                          width={64}
                          height={64}
                          style={{ objectFit: "cover", borderRadius: 8 }}
                          onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold text-truncate" title={it.title}>{it.title}</div>
                          <div className="small text-muted">Qty: {it.qty}</div>
                        </div>
                        <div className="fw-semibold">{it.price}</div>
                      </div>
                    </div>
                  ))}
                  {(!order?.items || order.items.length === 0) && (
                    <div className="col">
                      <div className="text-muted">No items found</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
