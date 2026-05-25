import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { PageWrapper } from '../components/motion/Motion';
import { useCartStore } from '../store/cartStore';

export function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <PageWrapper className="max-w-lg mx-auto text-center py-20 px-4">
        <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
        <Link to="/restaurants" className="text-brand-600 font-semibold hover:underline">Browse restaurants</Link>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear all</button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm"
          >
            {item.image && <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover" />}
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-gray-500">{item.restaurantName}</p>
              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border flex items-center justify-center" aria-label="Decrease">
                  <Minus className="w-3 h-3" />
                </button>
                <motion.span key={item.quantity} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="font-medium">{item.quantity}</motion.span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center" aria-label="Increase">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">${((item.price + item.customizations.reduce((s, c) => s + c.price, 0)) * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeItem(item.id)} className="mt-2 text-red-400 hover:text-red-600" aria-label="Remove">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Subtotal</span>
          <span>${getSubtotal().toFixed(2)}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/checkout')}
          className="w-full py-3 bg-brand-500 text-white rounded-xl font-semibold"
        >
          Proceed to Checkout
        </motion.button>
      </div>
    </PageWrapper>
  );
}
