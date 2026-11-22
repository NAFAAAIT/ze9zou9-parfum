import { Router } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import Product from '../models/Product.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();
const uploadDirectory = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${crypto.randomBytes(16).toString('hex')}${extension}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return callback(Object.assign(new Error('Only JPG, PNG, and WebP images are allowed.'), { status: 400 }));
    }
    callback(null, true);
  }
});
router.post('/upload', authenticateAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Please select an image.' });
  const origin = `${req.protocol}://${req.get('host')}`;
  res.status(201).json({ path: `${origin}/uploads/${req.file.filename}` });
});
router.get('/', async (req, res, next) => {
  try {
    const { search, gender, brand, size, min, max, featured, isNew, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (search) filter.$text = { $search: String(search) };
    if (gender) filter.gender = gender;
    if (brand) filter.brand = brand;
    if (size) filter.sizes = size;
    if (featured === 'true') filter.isFeatured = true;
    if (isNew === 'true') filter.isNew = true;
    if (min || max) filter.price = { ...(min ? { $gte: Number(min) } : {}), ...(max ? { $lte: Number(max) } : {}) };
    const pageNumber = Math.max(1, Number(page)); const pageLimit = Math.min(48, Math.max(1, Number(limit)));
    const [products, total, brands] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip((pageNumber - 1) * pageLimit).limit(pageLimit),
      Product.countDocuments(filter), Product.distinct('brand')
    ]);
    res.json({ products, pagination: { page: pageNumber, limit: pageLimit, total, pages: Math.ceil(total / pageLimit) }, brands });
  } catch (error) { next(error); }
});
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid product ID.' });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (error) { next(error); }
});
router.post('/', authenticateAdmin, async (req, res, next) => {
  try { res.status(201).json(await Product.create(req.body)); } catch (error) { next(error); }
});
router.put('/:id', authenticateAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid product ID.' });
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (error) { next(error); }
});
router.delete('/:id', authenticateAdmin, async (req, res, next) => {
  try { await Product.findByIdAndDelete(req.params.id); res.status(204).end(); } catch (error) { next(error); }
});
export default router;
