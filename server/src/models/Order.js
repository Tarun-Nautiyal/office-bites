import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  customizations: [{ option: String, choice: String, price: Number }],
  subtotal: Number,
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [orderItemSchema],
    deliveryAddress: {
      building: String,
      floor: String,
      officeName: String,
      street: String,
      city: String,
      zipCode: String,
    },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    promoCode: String,
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'dispatched', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['stripe', 'razorpay', 'paypal', 'cod'], default: 'stripe' },
    paymentIntentId: String,
    stripeSessionId: String,
    estimatedDelivery: Date,
    statusHistory: [{
      status: String,
      timestamp: { type: Date, default: Date.now },
      note: String,
    }],
    notes: String,
    receiptNumber: String,
  },
  { timestamps: true }
);

orderSchema.pre('save', function (next) {
  if (!this.receiptNumber) {
    this.receiptNumber = `OB-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

export const Order = mongoose.model('Order', orderSchema);
