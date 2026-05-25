import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: String,
    image: String,
    coverImage: String,
    cuisine: [{ type: String }],
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    deliveryTime: { type: Number, default: 30 },
    deliveryFee: { type: Number, default: 2.99 },
    minOrder: { type: Number, default: 10 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    address: {
      street: String,
      city: String,
      zipCode: String,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
    openHours: { open: String, close: String },
  },
  { timestamps: true }
);

restaurantSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
