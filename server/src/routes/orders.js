import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();
const phonePattern = /^(0|\+213)(5|6|7)[0-9]{8}$/;
router.post('/', async (req, res, next) => {
  const { customerName, phone, wilaya, commune, address, items } = req.body;
  if (!customerName?.trim() || !phonePattern.test(phone || '') || !wilaya || !commune || !address?.trim() || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: 'Please provide valid delivery details and at least one item.' });
  }
  try {
    let order;
    const ids = items.map((item) => item.product);
    if (ids.some((id) => !mongoose.isValidObjectId(id))) throw Object.assign(new Error('Invalid product.'), { status: 400 });
    const products = await Product.find({ _id: { $in: ids } });
      const byId = new Map(products.map((product) => [String(product._id), product]));
      let subtotal = 0;
      const orderItems = items.map((item) => {
        const product = byId.get(String(item.product)); const quantity = Number(item.quantity);
        if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > product.stock || !product.sizes.includes(item.size)) throw Object.assign(new Error('An item is unavailable or out of stock.'), { status: 409 });
        const unitPrice = Math.round(product.price * (1 - product.discount / 100));
        subtotal += unitPrice * quantity;
        return { product: product._id, name: product.name, image: product.images[0], size: item.size, quantity, unitPrice };
      });
      for (const item of orderItems) {
        const updated = await Product.findOneAndUpdate({ _id: item.product, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } }, { new: true });
        if (!updated) throw Object.assign(new Error('Stock changed. Please review your cart.'), { status: 409 });
      }
      order = await Order.create({ orderNumber: `ZP-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`, customerName: customerName.trim(), phone, wilaya, commune, address: address.trim(), items: orderItems, subtotal, total: subtotal });
    res.status(201).json(order);
  } catch (error) { next(error); }
});
router.get('/:id', async (req, res, next) => {
  try { const order = await Order.findOne({ orderNumber: req.params.id }); if (!order) return res.status(404).json({ message: 'Order not found.' }); res.json(order); } catch (error) { next(error); }
});
router.get('/', authenticateAdmin, async (req, res, next) => {
  try { res.json(await Order.find().sort({ createdAt: -1 }).limit(100)); } catch (error) { next(error); }
});
router.patch('/:id', authenticateAdmin, async (req, res, next) => {
  try { const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }); if (!order) return res.status(404).json({ message: 'Order not found.' }); res.json(order); } catch (error) { next(error); }
});
export default router;
