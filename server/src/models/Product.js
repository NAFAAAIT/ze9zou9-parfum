import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  brand: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true },
  gender: { type: String, enum: ['Men', 'Women', 'Unisex'], required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  sizes: [{ type: String, enum: ['15ml', '100ml'] }],
  notes: {
    topNotes: [String],
    heartNotes: [String],
    baseNotes: [String]
  },
  images: [{ type: String, required: true }],
  stock: { type: Number, min: 0, default: 0 },
  category: { type: String, default: 'Eau de Parfum' },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  discount: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true });

productSchema.index({ name: 'text', brand: 'text', 'notes.topNotes': 'text', 'notes.heartNotes': 'text', 'notes.baseNotes': 'text' });
export default mongoose.model('Product', productSchema);
