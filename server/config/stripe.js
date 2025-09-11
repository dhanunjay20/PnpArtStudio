// server/config/stripe.js
import Stripe from 'stripe';

export function getStripe() {
  const key = process.env.STRIPE_URL;
  if (!key) throw new Error('STRIPE_URL missing');
  return new Stripe(key, { apiVersion: '2024-11-20' });
}
