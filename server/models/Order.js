// service/src/models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    orderNo: { type: String, index: true }, // optional human-friendly number
    customer: {
      name: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true }
    },
    customerName: { type: String, trim: true }, // fallback used by UI
    total: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'paid', 'cancelled', 'refunded', 'failed'], default: 'pending', index: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        title: String,
        qty: Number,
        price: Number
      }
    ],
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('Order', OrderSchema);
