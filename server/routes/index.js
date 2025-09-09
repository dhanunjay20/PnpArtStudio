// routes/index.js
import { Router } from 'express';
import authRouter from './auth.routes.js';
import productsRouter from './products.routes.js';
import classesRouter from './classes.routes.js';
import galleryRouter from './gallery.routes.js';

const routes = Router();
routes.use('/auth', authRouter);
routes.use('/products', productsRouter);
routes.use('/classes', classesRouter);
routes.use('/gallery', galleryRouter);

export default routes;
