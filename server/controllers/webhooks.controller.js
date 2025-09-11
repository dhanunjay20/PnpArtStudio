// server/controllers/webhooks.controller.js
import { getStripe } from '../config/stripe.js';
import Order from '../models/Order.js';

// Note: mount with express.raw({ type: 'application/json' }) at the route level
export async function handleStripeWebhook(req, res) {
  const stripe = getStripe();
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        const order = await Order.findOne({ stripePaymentIntentId: pi.id });
        if (order) {
          const charge = Array.isArray(pi.charges?.data) && pi.charges.data.length ? pi.charges.data : null;
          order.paymentStatus = 'succeeded';
          order.status = 'paid';
          order.stripeChargeId = charge?.id || order.stripeChargeId;
          order.stripeReceiptUrl = charge?.receipt_url || order.stripeReceiptUrl;
          if (pi.shipping?.address) {
            order.shippingAddress = {
              line1: pi.shipping.address.line1 || '',
              line2: pi.shipping.address.line2 || '',
              city: pi.shipping.address.city || '',
              state: pi.shipping.address.state || '',
              postal_code: pi.shipping.address.postal_code || '',
              country: pi.shipping.address.country || '',
            };
          }
          await order.save();
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: pi.id },
          { paymentStatus: 'failed', status: 'failed' }
        );
        break;
      }
      case 'payment_intent.canceled': {
        const pi = event.data.object;
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: pi.id },
          { paymentStatus: 'canceled', status: 'canceled' }
        );
        break;
      }
      default:
        // ignore other events
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handling error:', err);
    res.status(500).send('Webhook handler failed');
  }
}
