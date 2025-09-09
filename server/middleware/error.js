// middleware/error.js
export function notFound(req, res) {
  return res.status(404).json({ message: 'Not Found' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(status).json({ message });
}
