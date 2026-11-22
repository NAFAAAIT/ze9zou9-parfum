import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();
router.post('/login', async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: String(req.body.email || '').toLowerCase() });
    if (!admin || !(await bcrypt.compare(req.body.password || '', admin.passwordHash))) return res.status(401).json({ message: 'Invalid credentials.' });
    res.json({ token: jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '8h' }) });
  } catch (error) { next(error); }
});
router.get('/dashboard', authenticateAdmin, async (req, res, next) => {
  try {
    const [totalProducts, totalOrders, pending, delivered, cancelled, revenue] = await Promise.all([
      Product.countDocuments(), Order.countDocuments(), Order.countDocuments({ status: 'Pending' }), Order.countDocuments({ status: 'Delivered' }), Order.countDocuments({ status: 'Cancelled' }), Order.aggregate([{ $match: { status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$total' } } }])
    ]);
    res.json({ totalProducts, totalOrders, pending, delivered, cancelled, revenue: revenue[0]?.total || 0 });
  } catch (error) { next(error); }
});
export default router;
