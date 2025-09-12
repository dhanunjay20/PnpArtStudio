// service/src/routes/index.js
import { Router } from 'express';
import classesRouter from './classes.routes.js';
import galleryRouter from './gallery.routes.js';
import productsRouter from './products.routes.js';
import authRouter from './auth.routes.js';
import checkoutRouter from './checkout.routes.js';
import webhooksRouter from './webhooks.routes.js';
import couponsRouter from './coupon.routes.js';
import newsletterRouter from './newsletter.routes.js';

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/classes', classesRouter);
routes.use('/gallery', galleryRouter);
routes.use('/products', productsRouter);
routes.use('/checkout', checkoutRouter);
routes.use('/coupons', couponsRouter);
routes.use('/newsletters', newsletterRouter);

// Webhooks: mounted under /api/webhooks with raw body for Stripe on sub-route
routes.use('/webhooks', webhooksRouter);

export default routes;
