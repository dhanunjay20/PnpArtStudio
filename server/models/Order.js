// server/models/Order.js
import mongoose from 'mongoose';

const LineItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    unitPrice: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    customerEmail: { type: String, trim: true },
    customerName: { type: String, trim: true },
    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
    },

    currency: { type: String, default: (process.env.CURRENCY || 'INR').toLowerCase() },
    items: { type: [LineItemSchema], default: [] },

    amountSubtotal: { type: Number, required: true, min: 0 },
    shippingAmount: { type: Number, default: 0, min: 0 },
    taxAmount: { type: Number, default: 0, min: 0 },
    amountTotal: { type: Number, required: true, min: 0 },

    paymentMethod: { type: String, enum: ['stripe', 'cod'], required: true },
    paymentStatus: { type: String, default: 'pending' }, // stripe: requires_payment|processing|succeeded|failed|canceled, cod: pending
    status: { type: String, default: 'pending' }, // pending|paid|failed|canceled|fulfilled
    notes: { type: String, default: '' },

    // Stripe linkage
    stripePaymentIntentId: { type: String, index: true },
    stripeChargeId: { type: String },
    stripeReceiptUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Order', OrderSchema);
