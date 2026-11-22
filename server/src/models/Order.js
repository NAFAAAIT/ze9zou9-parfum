import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  customerName: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  wilaya: { type: String, required: true },
  commune: { type: String, required: true },
  address: { type: String, required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    size: String,
    quantity: { type: Number, min: 1 },
    unitPrice: Number
  }],
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash on Delivery'], default: 'Cash on Delivery' },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
