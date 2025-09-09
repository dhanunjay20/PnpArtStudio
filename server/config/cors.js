// config/cors.js
import cors from 'cors';

export const corsAllWithCreds = cors({
  origin: true, // reflect request Origin dynamically
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  exposedHeaders: ['Content-Length','X-Request-Id'],
  optionsSuccessStatus: 204,
  preflightContinue: false
});
