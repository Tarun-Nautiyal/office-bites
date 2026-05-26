import mongoose from 'mongoose';

const customizationOptionSchema = new mongoose.Schema({
  name: String,
  options: [{ label: String, price: { type: Number, default: 0 } }],
  required: { type: Boolean, default: false },
  maxSelections: { type: Number, default: 1 },
});

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    description: String,
    image: String,
    price: { type: Number, required: true },
    category: { type: String, required: true },
    isPopular: { type: Boolean, default: false },
    isVegetarian: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    customizations: [customizationOptionSchema],
    calories: Number,
    prepTime: Number,
  },
  { timestamps: true }
);

menuItemSchema.index({ restaurant: 1, category: 1 });

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
