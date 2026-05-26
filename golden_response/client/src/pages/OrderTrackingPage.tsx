import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChefHat, Truck, Package, Clock } from 'lucide-react';
import { api } from '../lib/api';
import type { ApiSuccess } from '../lib/api';
import { getSocket, joinOrderRoom } from '../lib/socket';
import { PageWrapper, Skeleton } from '../components/motion/Motion';

const STEPS = [
  { key: 'confirmed', label: 'Confirmed', icon: Check },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'ready', label: 'Ready', icon: Package },
  { key: 'dispatched', label: 'On the way', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Check },
];

const STATUS_ORDER = ['pending', 'confirmed', 'preparing', 'ready', 'dispatched', 'delivered'];

export function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get<unknown, ApiSuccess<{ order: Record<string, unknown> }>>(`/orders/${id}`)
      .then((res) => setOrder(res.data.order))
      .finally(() => setLoading(false));

    joinOrderRoom(id);
    const socket = getSocket();
    const handler = (payload: { status: string; estimatedDelivery?: string }) => {
      setOrder((prev) => prev ? { ...prev, status: payload.status, estimatedDelivery: payload.estimatedDelivery } : prev);
    };
    socket.on('order-update', handler);
    return () => { socket.off('order-update', handler); };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!order) return <p className="text-center py-20">Order not found</p>;

  const currentIndex = STATUS_ORDER.indexOf(order.status as string);

  const eta = order.estimatedDelivery
    ? new Date(order.estimatedDelivery as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <PageWrapper className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <p className="text-sm text-gray-500">Order {order.receiptNumber as string}</p>
        <h1 className="text-2xl font-bold mt-1 capitalize">{order.status as string}</h1>
        <div className="flex items-center justify-center gap-2 mt-2 text-brand-600">
          <Clock className="w-4 h-4" />
          <span className="font-medium">ETA: {eta}</span>
        </div>
      </div>

      {/* Progress tracker */}
      <div className="relative mb-12" role="progressbar" aria-valuenow={currentIndex} aria-valuemin={0} aria-valuemax={STEPS.length} aria-label="Order progress">
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200" />
        <motion.div
          className="absolute left-6 top-6 w-0.5 bg-brand-500 origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: Math.max(0, (currentIndex - 1) / (STEPS.length - 1)) }}
          style={{ height: 'calc(100% - 48px)' }}
        />
        <ul className="space-y-8 relative">
          {STEPS.map((step, i) => {
            const stepIndex = STATUS_ORDER.indexOf(step.key);
            const isComplete = currentIndex >= stepIndex;
            const isActive = order.status === step.key;
            const Icon = step.icon;
            return (
              <motion.li
                key={step.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <motion.div
                  animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ repeat: isActive ? Infinity : 0, duration: 1.5 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                    isComplete ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <div>
                  <p className={`font-medium ${isComplete ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                  {isActive && <p className="text-sm text-brand-600">In progress...</p>}
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold mb-3">Order Items</h2>
        <ul className="space-y-2">
          {(order.items as { name: string; quantity: number; subtotal: number }[])?.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span>${item.subtotal?.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold mt-4 pt-4 border-t">
          <span>Total</span>
          <span>${(order.total as number)?.toFixed(2)}</span>
        </div>
      </div>

      {order.deliveryAddress ? (
        <div className="mt-4 bg-gray-50 rounded-2xl p-4 text-sm">
          <p className="font-medium text-gray-700">Delivering to</p>
          <p className="text-gray-500 mt-1">
            {(order.deliveryAddress as { building: string; floor: string; officeName: string }).building},
            Floor {(order.deliveryAddress as { floor: string }).floor} · {(order.deliveryAddress as { officeName: string }).officeName}
          </p>
        </div>
      ) : null}
    </PageWrapper>
  );
}
