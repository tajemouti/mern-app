const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = auth;
