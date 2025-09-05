// service/src/routes/Orders.Routes.js
import { Router } from "express";
import Order from "../models/Order.js";
// import { verifyAccess, verifyAdmin } from '../middleware/auth.js';

const router = Router();

// Allowed statuses
const ALLOWED_STATUS = new Set(["pending", "paid", "cancelled", "refunded", "failed"]);

// Helper: compute total from items
function computeTotal(items = []) {
  return items.reduce((sum, it) => {
    const qty = Number(it?.qty || 0);
    const price = Number(it?.price || 0);
    return sum + (qty > 0 && price >= 0 ? qty * price : 0);
  }, 0);
}

// GET /api/orders - list orders with newest first
router.get("/", /*verifyAccess, verifyAdmin,*/ async (req, res, next) => {
  try {
    const items = await Order.find().sort({ createdAt: -1 }).lean();
    res.json({ items });
  } catch (e) { next(e); }
});

// POST /api/orders - create a new order
router.post("/", /*verifyAccess, verifyAdmin,*/ async (req, res, next) => {
  try {
    const {
      orderNo,
      customer,
      customerName,
      items,
      total,
      status = "pending",
      billingAddress,
      shippingAddress,
      discounts,
      shipping,
      tax,
      subTotal,
      notes,
      meta
    } = req.body || {};

    // Basic validations (lightweight; no extra dependency)
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items array is required" });
    }
    for (const it of items) {
      if (!it || typeof it !== "object") {
        return res.status(400).json({ message: "each item must be an object" });
      }
      if (!("title" in it) || !("qty" in it) || !("price" in it)) {
        return res.status(400).json({ message: "each item requires title, qty, and price" });
      }
      if (Number(it.qty) <= 0 || Number.isNaN(Number(it.price))) {
        return res.status(400).json({ message: "invalid item qty or price" });
      }
    }

    if (status && !ALLOWED_STATUS.has(String(status))) {
      return res.status(400).json({ message: "invalid status" });
    }

    // Compute totals if not provided
    const computedSubTotal = typeof subTotal === "number" ? subTotal : computeTotal(items);
    const discountsTotal = Array.isArray(discounts)
      ? discounts.reduce((s, d) => s + Number(d?.amount || 0), 0)
      : 0;
    const shippingAmount = typeof shipping?.amount === "number" ? shipping.amount : 0;
    const taxAmount = typeof tax === "number" ? tax : 0;

    const finalTotal = typeof total === "number"
      ? total
      : Math.max(0, computedSubTotal - discountsTotal + shippingAmount + taxAmount);

    const doc = await Order.create({
      orderNo: orderNo || undefined,
      customer: customer || undefined,
      customerName: customerName || customer?.name || undefined,
      items,
      subTotal: computedSubTotal,
      discounts: Array.isArray(discounts) ? discounts : undefined,
      shipping: shipping || undefined,
      tax: taxAmount || undefined,
      total: finalTotal,
      status: status || "pending",
      billingAddress: billingAddress || undefined,
      shippingAddress: shippingAddress || undefined,
      notes: notes || undefined,
      meta: meta || undefined
    });

    // Respond with created document
    res.status(201).json(doc);
  } catch (e) { next(e); }
});

export default router;
