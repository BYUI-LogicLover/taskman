// Centralized error handler. Routes/controllers throw or call next(err);
// this maps known error shapes to clean JSON responses.
module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'validation failed',
      details: Object.fromEntries(
        Object.entries(err.errors).map(([k, v]) => [k, v.message])
      ),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'invalid id' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: 'duplicate', keys: err.keyValue });
  }

  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error(err);
  res.status(500).json({ error: 'internal server error' });
};
