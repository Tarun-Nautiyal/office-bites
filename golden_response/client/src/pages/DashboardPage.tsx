import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, MapPin, Heart, Settings, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
import type { ApiSuccess } from '../lib/api';
import { PageWrapper, Skeleton } from '../components/motion/Motion';
import { useAuthStore } from '../store/authStore';

const tabs = [
  { id: 'orders', label: 'Order History', icon: Package },
  { id: 'addresses', label: 'Address Book', icon: MapPin },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'profile', label: 'Profile', icon: Settings },
] as const;

export function DashboardPage() {
  const { user, fetchMe } = useAuthStore();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('orders');
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  useEffect(() => {
    if (activeTab === 'orders') {
      setLoading(true);
      api.get<unknown, ApiSuccess<{ orders: Record<string, unknown>[] }>>('/orders/my')
        .then((res) => setOrders(res.data.orders))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    dispatched: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  };

  return (
    <PageWrapper className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, {user?.name}</p>

      <div className="flex flex-col lg:flex-row gap-8">
        <nav className="lg:w-56 flex lg:flex-col gap-2 overflow-x-auto" aria-label="Dashboard sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-brand-500 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 bg-white rounded-2xl shadow-sm p-6">
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Order History</h2>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
              ) : orders.length === 0 ? (
                <p className="text-gray-500">No orders yet. <Link to="/restaurants" className="text-brand-600">Order now</Link></p>
              ) : (
                <ul className="space-y-3">
                  {orders.map((order) => (
                    <motion.li key={String(order._id)} whileHover={{ x: 4 }} className="border rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{(order.restaurant as { name: string })?.name}</p>
                        <p className="text-sm text-gray-500">{order.receiptNumber as string} · ${(order.total as number)?.toFixed(2)}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status as string] || 'bg-gray-100'}`}>
                          {order.status as string}
                        </span>
                      </div>
                      <Link to={`/orders/${order._id}/track`} className="flex items-center gap-1 text-brand-600 text-sm font-medium">
                        Track <ChevronRight className="w-4 h-4" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Address Book</h2>
              {user?.addresses?.length ? (
                <ul className="space-y-3">
                  {user.addresses.map((addr, i) => (
                    <li key={i} className="border rounded-xl p-4">
                      <p className="font-medium">{addr.label} {addr.isDefault && <span className="text-xs text-brand-600">(Default)</span>}</p>
                      <p className="text-sm text-gray-500">{addr.building}, Floor {addr.floor} · {addr.officeName}</p>
                      <p className="text-sm text-gray-500">{addr.street}, {addr.city} {addr.zipCode}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No saved addresses. Add one during checkout.</p>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Favorite Restaurants</h2>
              {user?.favoriteRestaurants?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.favoriteRestaurants.map((r) => (
                    <Link key={r._id} to={`/restaurants/${r.slug || r._id}`} className="flex items-center gap-3 border rounded-xl p-3 hover:bg-gray-50">
                      <img src={r.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{r.name}</p>
                        <p className="text-sm text-amber-500">★ {r.rating}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No favorites yet.</p>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
              <dl className="space-y-3">
                <div><dt className="text-sm text-gray-500">Name</dt><dd className="font-medium">{user?.name}</dd></div>
                <div><dt className="text-sm text-gray-500">Email</dt><dd className="font-medium">{user?.email}</dd></div>
                <div><dt className="text-sm text-gray-500">Phone</dt><dd className="font-medium">{user?.phone || '—'}</dd></div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
