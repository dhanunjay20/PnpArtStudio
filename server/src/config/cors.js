import cors from 'cors';

export const corsAllWithCreds = cors({
  origin(origin, cb) {
    // Reflect origin for credentials; allow same-origin and tools
    cb(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
});
