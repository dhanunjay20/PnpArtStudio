// service/src/routes/index.js
import { Router } from 'express';
import classesRoutes from './classes.routes.js'
import galleryRouter from './gallery.routes.js';
import productsRouter from './products.routes.js';
import authRouter from './auth.routes.js';
import couponsRouter from './coupon.routes.js';
import newsletterRouter from './newsletter.routes.js';

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/classes', classesRoutes);
routes.use('/gallery', galleryRouter);
routes.use('/products', productsRouter);
routes.use('/coupons', couponsRouter);
routes.use('/newsletters', newsletterRouter);

export default routes;
