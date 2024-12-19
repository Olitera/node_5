const jwt = require('jsonwebtoken');
const { getManagerById } = require('../helpers/state');

const authMiddleware = async (req, res, next) => {
  if(/^\/auth\/.*/.test(req.url)) {
    return next();
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'Unauthorized: Missing or invalid Authorization header' });
  }

  const token = authHeader.substring(7);
  console.log(req.method)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    const userId = decoded.userId;
    const user = getManagerById(userId);
    if (!user) {
      return res.status(403).send({ error: 'Forbidden: User not found' });
    }
    if (req.method === 'POST' && !user.super) {
      return res.status(403).send({ error: 'Forbidden: User is not a super manager' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err)
    return res.status(403).send({ error: 'Forbidden: Invalid token' });
  }
};

module.exports = authMiddleware;
