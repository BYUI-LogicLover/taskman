const jwt = require('jsonwebtoken');

module.exports = function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'missing bearer token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: payload.sub };
    next();
  } catch (_err) {
    res.status(401).json({ error: 'invalid token' });
  }
};
