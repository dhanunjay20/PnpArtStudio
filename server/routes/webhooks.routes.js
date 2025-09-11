// server/routes/webhooks.routes.js
import { Router } from 'express';
import { handleStripeWebhook } from '../controllers/webhooks.controller.js';
import express from 'express';

const router = Router();

// Route-level raw body for Stripe signature verification
router.post('/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
