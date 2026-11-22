import jwt from 'jsonwebtoken';

export function authenticateAdmin(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required.' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    if (req.admin.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}
