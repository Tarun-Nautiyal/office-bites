import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Restaurant } from '../models/Restaurant.js';
import { MenuItem } from '../models/MenuItem.js';
import { PromoCode } from '../models/PromoCode.js';
import { Review } from '../models/Review.js';

const seed = async () => {
  await connectDB();
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany(),
    Restaurant.deleteMany(),
    MenuItem.deleteMany(),
    PromoCode.deleteMany(),
    Review.deleteMany(),
  ]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@officebite.com',
    password: 'admin123',
    role: 'admin',
  });

  const user = await User.create({
    name: 'John Office',
    email: 'user@officebite.com',
    password: 'user123',
    phone: '+1 555-0100',
    addresses: [{
      label: 'Main Office',
      building: 'Tech Tower',
      floor: '12',
      officeName: 'Acme Corp',
      street: '100 Innovation Drive',
      city: 'San Francisco',
      zipCode: '94105',
      isDefault: true,
    }],
  });

  const restaurantData = [
    {
      name: 'Green Bowl Kitchen',
      slug: 'green-bowl-kitchen',
      description: 'Fresh salads and healthy bowls for busy professionals',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
      coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200',
      cuisine: ['Healthy', 'Salads', 'Vegan'],
      rating: 4.8,
      reviewCount: 234,
      deliveryTime: 25,
      deliveryFee: 1.99,
      minOrder: 12,
      isFeatured: true,
      tags: ['healthy', 'lunch', 'office'],
      openHours: { open: '08:00', close: '20:00' },
    },
    {
      name: 'Spice Route Indian',
      slug: 'spice-route-indian',
      description: 'Authentic Indian curries and tandoor specials',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600',
      coverImage: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200',
      cuisine: ['Indian', 'Curry', 'Spicy'],
      rating: 4.6,
      reviewCount: 189,
      deliveryTime: 35,
      deliveryFee: 2.49,
      minOrder: 15,
      isFeatured: true,
      tags: ['indian', 'curry', 'lunch'],
      openHours: { open: '11:00', close: '22:00' },
    },
    {
      name: 'Burger Hub Express',
      slug: 'burger-hub-express',
      description: 'Gourmet burgers and loaded fries delivered fast',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
      coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200',
      cuisine: ['American', 'Burgers', 'Fast Food'],
      rating: 4.4,
      reviewCount: 412,
      deliveryTime: 20,
      deliveryFee: 1.49,
      minOrder: 10,
      isFeatured: true,
      tags: ['burgers', 'fast', 'comfort'],
      openHours: { open: '10:00', close: '23:00' },
    },
    {
      name: 'Sushi Zen',
      slug: 'sushi-zen',
      description: 'Premium sushi rolls and Japanese bento boxes',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600',
      cuisine: ['Japanese', 'Sushi', 'Asian'],
      rating: 4.9,
      reviewCount: 156,
      deliveryTime: 40,
      deliveryFee: 3.99,
      minOrder: 20,
      isFeatured: true,
      tags: ['sushi', 'premium', 'japanese'],
    },
    {
      name: 'Mediterranean Plate',
      slug: 'mediterranean-plate',
      description: 'Falafel, hummus, and grilled kebabs',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600',
      cuisine: ['Mediterranean', 'Middle Eastern'],
      rating: 4.5,
      reviewCount: 98,
      deliveryTime: 30,
      isFeatured: false,
    },
    {
      name: 'Pizza Corner Office',
      slug: 'pizza-corner-office',
      description: 'Wood-fired pizzas perfect for team lunches',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
      cuisine: ['Italian', 'Pizza'],
      rating: 4.3,
      reviewCount: 567,
      deliveryTime: 28,
      isFeatured: true,
      tags: ['pizza', 'team lunch'],
    },
  ];

  const restaurants = await Restaurant.insertMany(restaurantData);

  const menuData = [
    { restaurant: 0, items: [
      { name: 'Protein Power Bowl', description: 'Quinoa, grilled chicken, avocado, edamame', price: 14.99, category: 'Bowls', isPopular: true, isVegetarian: false, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', customizations: [{ name: 'Protein', options: [{ label: 'Chicken', price: 0 }, { label: 'Tofu', price: 0 }, { label: 'Salmon', price: 3 }], required: true }] },
      { name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, caesar dressing', price: 11.99, category: 'Salads', isPopular: true, isVegetarian: false, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
      { name: 'Vegan Buddha Bowl', description: 'Brown rice, chickpeas, roasted veggies, tahini', price: 13.49, category: 'Bowls', isVegetarian: true, image: 'https://images.unsplash.com/photo-1511690743698-d9a85d060081?w=400' },
      { name: 'Green Smoothie', description: 'Spinach, banana, almond milk, chia seeds', price: 6.99, category: 'Drinks', isVegetarian: true },
    ]},
    { restaurant: 1, items: [
      { name: 'Butter Chicken', description: 'Creamy tomato curry with basmati rice', price: 16.99, category: 'Curries', isPopular: true, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b744381?w=400', customizations: [{ name: 'Spice Level', options: [{ label: 'Mild', price: 0 }, { label: 'Medium', price: 0 }, { label: 'Hot', price: 0 }], required: true }] },
      { name: 'Paneer Tikka Masala', description: 'Grilled paneer in spiced tomato sauce', price: 14.99, category: 'Curries', isVegetarian: true, isPopular: true },
      { name: 'Garlic Naan', description: 'Fresh baked garlic naan bread', price: 3.99, category: 'Sides' },
      { name: 'Mango Lassi', description: 'Sweet yogurt mango drink', price: 4.99, category: 'Drinks' },
    ]},
    { restaurant: 2, items: [
      { name: 'Classic Cheeseburger', description: 'Angus beef, cheddar, lettuce, tomato, special sauce', price: 12.99, category: 'Burgers', isPopular: true, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', customizations: [{ name: 'Add-ons', options: [{ label: 'Bacon', price: 2 }, { label: 'Avocado', price: 1.5 }, { label: 'Extra Patty', price: 4 }], maxSelections: 3 }] },
      { name: 'BBQ Bacon Burger', description: 'Smoky BBQ sauce, crispy bacon, onion rings', price: 14.99, category: 'Burgers', isPopular: true },
      { name: 'Truffle Fries', description: 'Crispy fries with truffle oil and parmesan', price: 6.99, category: 'Sides', isPopular: true },
      { name: 'Chocolate Shake', description: 'Rich chocolate milkshake', price: 5.99, category: 'Drinks' },
    ]},
    { restaurant: 3, items: [
      { name: 'Dragon Roll', description: 'Eel, avocado, cucumber, spicy mayo', price: 18.99, category: 'Rolls', isPopular: true, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
      { name: 'Salmon Nigiri Set', description: '8 pieces premium salmon nigiri', price: 22.99, category: 'Nigiri', isPopular: true },
      { name: 'Chicken Teriyaki Bento', description: 'Rice, salad, miso soup, teriyaki chicken', price: 17.99, category: 'Bento' },
    ]},
    { restaurant: 5, items: [
      { name: 'Margherita Pizza', description: 'Fresh mozzarella, basil, tomato sauce', price: 15.99, category: 'Pizza', isPopular: true, image: 'https://images.unsplash.com/photo-1574071318508-7fd74297a974?w=400', customizations: [{ name: 'Size', options: [{ label: 'Medium', price: 0 }, { label: 'Large', price: 4 }], required: true }] },
      { name: 'Pepperoni Feast', description: 'Double pepperoni, extra cheese', price: 18.99, category: 'Pizza', isPopular: true },
      { name: 'Garlic Bread', description: 'Toasted with herb butter', price: 5.99, category: 'Sides' },
    ]},
  ];

  for (const { restaurant: idx, items } of menuData) {
    for (const item of items) {
      await MenuItem.create({ ...item, restaurant: restaurants[idx]._id });
    }
  }

  await PromoCode.insertMany([
    { code: 'OFFICE20', description: '20% off office lunch', discountType: 'percentage', discountValue: 20, minOrder: 15, maxDiscount: 10 },
    { code: 'LUNCH5', description: '$5 off your order', discountType: 'fixed', discountValue: 5, minOrder: 20 },
    { code: 'WELCOME10', description: '10% welcome discount', discountType: 'percentage', discountValue: 10, minOrder: 10 },
  ]);

  await Review.insertMany([
    { user: user._id, restaurant: restaurants[0]._id, rating: 5, comment: 'Perfect healthy lunch for the office!', userName: user.name },
    { user: user._id, restaurant: restaurants[2]._id, rating: 4, comment: 'Fast delivery, burgers were amazing.', userName: user.name },
  ]);

  console.log('\n✅ Seed complete!\n');
  console.log('Admin: admin@officebite.com / admin123');
  console.log('User:  user@officebite.com / user123');
  console.log(`Restaurants: ${restaurants.length}`);
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
