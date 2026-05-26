import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Store, Package, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';
import type { ApiSuccess } from '../../lib/api';
import { getSocket, joinAdminRoom } from '../../lib/socket';
import { PageWrapper, Skeleton } from '../../components/motion/Motion';
import { useAuthStore } from '../../store/authStore';
import { Navigate } from 'react-router-dom';

export function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [revenueByDay, setRevenueByDay] = useState<{ _id: string; revenue: number; orders: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get<unknown, ApiSuccess<{ stats: Record<string, number>; revenueByDay: typeof revenueByDay; recentOrders: Record<string, unknown>[] }>>('/admin/stats'),
        api.get<unknown, ApiSuccess<{ orders: Record<string, unknown>[] }>>(`/admin/orders${statusFilter ? `?status=${statusFilter}` : ''}`),
      ]);
      setStats(statsRes.data.stats);
      setRevenueByDay(statsRes.data.revenueByDay);
      setOrders(ordersRes.data.orders);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'restaurant') return;
    fetchData();
    joinAdminRoom();
    const socket = getSocket();
    socket.on('admin-update', fetchData);
    return () => { socket.off('admin-update', fetchData); };
  }, [user, statusFilter]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchData();
    } catch (e: unknown) {
      toast.error((e as { message?: string }).message || 'Update failed');
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'restaurant')) {
    return <Navigate to="/login" replace />;
  }

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'bg-blue-500' },
    { label: 'Today Orders', value: stats.todayOrders, icon: BarChart3, color: 'bg-green-500' },
    { label: 'Revenue', value: `$${(stats.totalRevenue || 0).toFixed(0)}`, icon: DollarSign, color: 'bg-brand-500' },
    { label: 'Active Orders', value: stats.activeOrders, icon: Package, color: 'bg-purple-500' },
    { label: 'Users', value: stats.totalUsers, icon: Users, color: 'bg-indigo-500' },
    { label: 'Restaurants', value: stats.totalRestaurants, icon: Store, color: 'bg-pink-500' },
  ];

  const maxRevenue = Math.max(...revenueByDay.map((d) => d.revenue), 1);

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)
          : statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl text-white ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold">{card.value ?? 0}</p>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="font-semibold mb-4">Revenue (Last 7 Days)</h2>
        <div className="flex items-end gap-2 h-40" role="img" aria-label="Revenue chart">
          {revenueByDay.map((day) => (
            <div key={day._id} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                className="w-full bg-brand-500 rounded-t-lg min-h-[4px]"
                style={{ maxHeight: '120px' }}
              />
              <span className="text-xs text-gray-500">{day._id.slice(5)}</span>
            </div>
          ))}
          {revenueByDay.length === 0 && <p className="text-gray-400 text-sm">No revenue data yet</p>}
        </div>
      </div>

      {/* Orders management */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="font-semibold text-lg">Orders</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
            aria-label="Filter orders by status"
          >
            <option value="">All Statuses</option>
            {['pending', 'confirmed', 'preparing', 'ready', 'dispatched', 'delivered'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 pr-4">Receipt</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Restaurant</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={String(order._id)} className="border-b border-gray-50">
                  <td className="py-3 pr-4 font-mono text-xs">{order.receiptNumber as string}</td>
                  <td className="py-3 pr-4">{(order.user as { name: string })?.name}</td>
                  <td className="py-3 pr-4">{(order.restaurant as { name: string })?.name}</td>
                  <td className="py-3 pr-4">${(order.total as number)?.toFixed(2)}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 capitalize">{order.status as string}</span>
                  </td>
                  <td className="py-3">
                    <select
                      defaultValue=""
                      onChange={(e) => { if (e.target.value) updateStatus(order._id as string, e.target.value); e.target.value = ''; }}
                      className="text-xs border rounded px-2 py-1"
                      aria-label={`Update order ${order.receiptNumber}`}
                    >
                      <option value="">Update...</option>
                      {['confirmed', 'preparing', 'ready', 'dispatched', 'delivered'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-gray-500 text-center py-8">No orders found</p>}
        </div>
      </div>
    </PageWrapper>
  );
}
