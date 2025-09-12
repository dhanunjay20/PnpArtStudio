// admin/src/pages/CouponsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { TicketPercent, RefreshCw, Pencil, Trash2, Power, PowerOff, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const LIST_URL = `${API_BASE}/api/coupons`;

export default function CouponsPage() {
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState(10);
  const [maxUses, setMaxUses] = useState(0);
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  // editor modal state
  const [editing, setEditing] = useState(null); // coupon object or null
  const [editData, setEditData] = useState({ code: "", percent: 10, maxUses: 0, expiresAt: "", active: true });

  const disabled = !code.trim() || percent <= 0 || percent > 100;

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(LIST_URL, { withCredentials: true });
      setList(Array.isArray(data?.items) ? data.items : []);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (disabled) return;
    try {
      setLoading(true);
      const payload = {
        code: code.trim().toUpperCase(),
        percent,
        maxUses: Number(maxUses) || 0,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
      };
      const { data } = await axios.post(LIST_URL, payload, { withCredentials: true });
      toast.success(`Coupon ${data?.code} added`);
      setCode(""); setPercent(10); setMaxUses(0); setExpiresAt("");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to add coupon");
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const toggleActive = async (id, next) => {
    try {
      await axios.patch(`${LIST_URL}/${id}/status`, { active: next }, { withCredentials: true });
      toast.success(`Coupon ${next ? "activated" : "deactivated"}`);
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await axios.delete(`${LIST_URL}/${id}`, { withCredentials: true });
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const openEdit = (c) => {
    setEditing(c);
    setEditData({
      code: c.code || "",
      percent: c.percent || 10,
      maxUses: c.maxUses || 0,
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0,16) : "",
      active: !!c.active
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${LIST_URL}/${editing._id}`, {
        code: editData.code.trim().toUpperCase(),
        percent: Number(editData.percent),
        maxUses: Number(editData.maxUses) || 0,
        expiresAt: editData.expiresAt ? new Date(editData.expiresAt).toISOString() : null,
        active: !!editData.active
      }, { withCredentials: true });
      toast.success("Updated");
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h4 d-flex align-items-center gap-2 mb-0">
          <TicketPercent size={20} /> Coupons
        </h2>
        <button className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2" onClick={load} disabled={loading}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Create coupon</h6>
              <form onSubmit={onCreate} className="vstack gap-3">
                <div>
                  <label className="form-label">Code</label>
                  <input className="form-control" placeholder="e.g. ART10" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required />
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Percent off</label>
                    <input type="number" min={1} max={100} className="form-control" value={percent} onChange={(e) => setPercent(Number(e.target.value))} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Max uses (0 = unlimited)</label>
                    <input type="number" min={0} className="form-control" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Expires at (optional)</label>
                  <input type="datetime-local" className="form-control" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
                </div>
                <button className="btn btn-danger" disabled={disabled || loading}>{loading ? "Saving…" : "Save coupon"}</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">All coupons</h6>
              {list.length === 0 ? (
                <div className="text-muted">No coupons yet</div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Percent</th>
                        <th>Uses</th>
                        <th>Max</th>
                        <th>Status</th>
                        <th>Expires</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((c) => (
                        <tr key={c._id}>
                          <td className="fw-semibold">{c.code}</td>
                          <td>{c.percent}%</td>
                          <td>{c.uses || 0}</td>
                          <td>{c.maxUses === 0 ? "∞" : c.maxUses}</td>
                          <td>
                            {c.active ? <span className="badge bg-success">Active</span> : <span className="badge bg-secondary">Inactive</span>}
                          </td>
                          <td>{c.expiresAt ? new Date(c.expiresAt).toLocaleString() : "—"}</td>
                          <td className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary" title="Edit" onClick={() => openEdit(c)}>
                              <Pencil size={16} />
                            </button>
                            {c.active ? (
                              <button className="btn btn-sm btn-outline-warning" title="Deactivate" onClick={() => toggleActive(c._id, false)}>
                                <PowerOff size={16} />
                              </button>
                            ) : (
                              <button className="btn btn-sm btn-outline-success" title="Activate" onClick={() => toggleActive(c._id, true)}>
                                <Power size={16} />
                              </button>
                            )}
                            <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => del(c._id)}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,.4)" }} onClick={() => setEditing(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit coupon</h5>
                <button type="button" className="btn btn-sm btn-light" onClick={() => setEditing(null)}><X size={16} /></button>
              </div>
              <form onSubmit={saveEdit}>
                <div className="modal-body vstack gap-3">
                  <div>
                    <label className="form-label">Code</label>
                    <input className="form-control" value={editData.code} onChange={(e) => setEditData({ ...editData, code: e.target.value.toUpperCase() })} required />
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Percent</label>
                      <input type="number" min={1} max={100} className="form-control" value={editData.percent} onChange={(e) => setEditData({ ...editData, percent: Number(e.target.value) })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Max uses</label>
                      <input type="number" min={0} className="form-control" value={editData.maxUses} onChange={(e) => setEditData({ ...editData, maxUses: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Expires at</label>
                    <input type="datetime-local" className="form-control" value={editData.expiresAt} onChange={(e) => setEditData({ ...editData, expiresAt: e.target.value })} />
                  </div>
                  <div className="form-check">
                    <input id="editActive" className="form-check-input" type="checkbox" checked={editData.active} onChange={(e) => setEditData({ ...editData, active: e.target.checked })} />
                    <label htmlFor="editActive" className="form-check-label">Active</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setEditing(null)}>Cancel</button>
                  <button type="submit" className="btn btn-danger">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
