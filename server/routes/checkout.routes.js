// server/routes/checkout.routes.js
import { Router } from 'express';
import { createPaymentIntent, createCodOrder } from '../controllers/checkout.controller.js';

const router = Router();

router.post('/payment-intent', createPaymentIntent);
router.post('/cod-order', createCodOrder);

export default router;
