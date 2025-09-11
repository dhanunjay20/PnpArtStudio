// server/controllers/checkout.controller.js
import { getStripe } from '../config/stripe.js';
import Order from '../models/Order.js';
import { Product } from '../models/Product.js'; // if your Product uses named export, switch to: import { Product } from '../models/Product.js';

const currency = (process.env.CURRENCY || 'INR').toLowerCase();

async function priceCart(serverCart = []) {
  // serverCart: [{ productId, qty }]
  const ids = serverCart.map((i) => i.productId).filter(Boolean);
  const products = await Product.find({ _id: { $in: ids } }).lean();
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const items = [];
  let subtotal = 0;
  for (const row of serverCart) {
    const p = byId.get(String(row.productId));
    if (!p) continue;
    const unitPrice = Number((p.salePrice ?? p.price) || 0);
    const qty = Math.max(1, Number(row.qty || 1));
    const lineSubtotal = unitPrice * qty;
    items.push({
      product: p._id,
      title: p.title,
      image: Array.isArray(p.images) && p.images.length ? String(p.images) : '',
      unitPrice,
      qty,
      subtotal: lineSubtotal,
    });
    subtotal += lineSubtotal;
  }

  // Example: reuse client-calculated shipping/tax rules if needed; keep trusted on server
  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;
  return { items, subtotal, shipping, tax, total };
}

// POST /api/checkout/payment-intent
// body: { cart: [{productId, qty}], customer: {email, name, address} }
export async function createPaymentIntent(req, res, next) {
  try {
    const { cart = [], customer = {} } = req.body || {};
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const { items, subtotal, shipping, tax, total } = await priceCart(cart);
    if (items.length === 0 || total <= 0) {
      return res.status(400).json({ message: 'No billable items' });
    }

    const stripe = getStripe();
    const amountInMinor = Math.round(total * 100);

    const intent = await stripe.paymentIntents.create({
      amount: amountInMinor,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        order_subtotal: String(subtotal),
        order_total: String(total),
        cart_count: String(items.length),
      },
    });

    const order = await Order.create({
      customerEmail: customer.email || '',
      customerName: customer.name || '',
      shippingAddress: customer.address || {},
      currency,
      items,
      amountSubtotal: subtotal,
      shippingAmount: shipping,
      taxAmount: tax,
      amountTotal: total,
      paymentMethod: 'stripe',
      paymentStatus: intent.status || 'requires_payment',
      stripePaymentIntentId: intent.id,
      status: 'pending',
    });

    return res.status(201).json({
      orderId: order._id,
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount: total,
      currency,
    });
  } catch (e) { next(e); }
}

// POST /api/checkout/cod-order
// body: { cart: [{productId, qty}], customer: {...}, note? }
export async function createCodOrder(req, res, next) {
  try {
    const { cart = [], customer = {}, note = '' } = req.body || {};
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const { items, subtotal, shipping, tax, total } = await priceCart(cart);
    if (items.length === 0 || total <= 0) {
      return res.status(400).json({ message: 'No billable items' });
    }

    const order = await Order.create({
      customerEmail: customer.email || '',
      customerName: customer.name || '',
      shippingAddress: customer.address || {},
      currency,
      items,
      amountSubtotal: subtotal,
      shippingAmount: shipping,
      taxAmount: tax,
      amountTotal: total,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      status: 'pending',
      notes: note,
    });

    return res.status(201).json({ orderId: order._id, ok: true });
  } catch (e) { next(e); }
}
