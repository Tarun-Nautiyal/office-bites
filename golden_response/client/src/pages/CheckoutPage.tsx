import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import type { ApiSuccess } from '../lib/api';
import { PageWrapper } from '../components/motion/Motion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export function CheckoutPage() {
  const { items, restaurantId, getSubtotal, getTotal, promoCode, discount, setPromo, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState({
    building: user?.addresses?.[0]?.building || '',
    floor: user?.addresses?.[0]?.floor || '',
    officeName: user?.addresses?.[0]?.officeName || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || 'San Francisco',
    zipCode: user?.addresses?.[0]?.zipCode || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const deliveryFee = 2.49;

  const applyPromo = async () => {
    try {
      const res = await api.post<unknown, ApiSuccess<{ code: string; discount: number }>>('/orders/validate-promo', {
        code: promoInput,
        subtotal: getSubtotal(),
      });
      setPromo(res.data.code, res.data.discount);
      toast.success(`Promo applied! Saved $${res.data.discount.toFixed(2)}`);
    } catch (e: unknown) {
      toast.error((e as { message?: string }).message || 'Invalid promo code');
    }
  };

  const placeOrder = async () => {
    if (!user) { navigate('/login'); return; }
    if (!items.length || !restaurantId) { toast.error('Cart is empty'); return; }

    setLoading(true);
    try {
      const orderRes = await api.post<unknown, ApiSuccess<{ order: { _id: string } }>>('/orders', {
        restaurantId,
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          quantity: i.quantity,
          customizations: i.customizations,
        })),
        deliveryAddress: address,
        promoCode,
        paymentMethod,
      });

      const orderId = orderRes.data.order._id;

      if (paymentMethod === 'stripe') {
        const payRes = await api.post<unknown, ApiSuccess<{ url?: string; demoMode?: boolean }>>(`/payments/checkout/${orderId}`);
        if (payRes.data.demoMode) {
          setSuccess(true);
          clearCart();
          setTimeout(() => navigate(`/orders/${orderId}/track`), 2000);
        } else if (payRes.data.url) {
          window.location.href = payRes.data.url;
        }
      } else {
        await api.post(`/payments/confirm/${orderId}`);
        setSuccess(true);
        clearCart();
        setTimeout(() => navigate(`/orders/${orderId}/track`), 2000);
      }
    } catch (e: unknown) {
      toast.error((e as { message?: string }).message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length && !success) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <button onClick={() => navigate('/restaurants')} className="text-brand-600 font-medium">Browse restaurants</button>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <CheckCircle className="w-20 h-20 text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-bold">Order Placed!</h2>
        <p className="text-gray-500">Redirecting to tracking...</p>
      </motion.div>
    );
  }

  return (
    <PageWrapper className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-sm" aria-labelledby="address-heading">
            <h2 id="address-heading" className="font-semibold flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-brand-500" /> Office Delivery Address
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(['building', 'floor', 'officeName', 'street', 'city', 'zipCode'] as const).map((field) => (
                <div key={field} className={field === 'street' ? 'col-span-2' : ''}>
                  <label className="text-xs text-gray-500 capitalize" htmlFor={field}>{field.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    id={field}
                    value={address[field]}
                    onChange={(e) => setAddress((a) => ({ ...a, [field]: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    required
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm" aria-labelledby="promo-heading">
            <h2 id="promo-heading" className="font-semibold flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-brand-500" /> Promo Code
            </h2>
            <div className="flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="e.g. OFFICE20"
                className="flex-1 px-3 py-2 border rounded-lg text-sm uppercase"
                aria-label="Promo code"
              />
              <button onClick={applyPromo} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">
                Apply
              </button>
            </div>
            {promoCode && <p className="text-sm text-green-600 mt-2">✓ {promoCode} applied (-${discount.toFixed(2)})</p>}
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-brand-500" /> Payment
            </h2>
            <div className="space-y-2">
              {['stripe', 'razorpay', 'paypal', 'cod'].map((m) => (
                <label key={m} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" value={m} checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} />
                  <span className="capitalize font-medium">{m === 'cod' ? 'Cash on Delivery' : m}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit sticky top-24">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between text-sm">
                <span>{i.quantity}x {i.name}</span>
                <span>${((i.price + i.customizations.reduce((s, c) => s + c.price, 0)) * i.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between"><span>Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span><span>${getTotal(deliveryFee).toFixed(2)}</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={placeOrder}
            disabled={loading}
            className="w-full mt-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Pay $${getTotal(deliveryFee).toFixed(2)}`}
          </motion.button>
        </div>
      </div>
    </PageWrapper>
  );
}
