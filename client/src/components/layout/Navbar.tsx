import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const itemCount = useCartStore((s) => s.itemCount());
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2" aria-label="OfficeBite home">
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              OfficeBite
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/restaurants" className="text-gray-600 hover:text-brand-600 transition-colors font-medium">Restaurants</Link>
            <Link to="/#office-lunch" className="text-gray-600 hover:text-brand-600 transition-colors font-medium">Office Lunch</Link>
            {user && <Link to="/dashboard" className="text-gray-600 hover:text-brand-600 transition-colors font-medium">Dashboard</Link>}
            {(user?.role === 'admin' || user?.role === 'restaurant') && (
              <Link to="/admin" className="text-gray-600 hover:text-brand-600 transition-colors font-medium flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cart')}
              className="relative p-2 rounded-full hover:bg-brand-50 transition-colors"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-brand-600">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

            <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t"
            >
              <div className="py-4 flex flex-col gap-3">
                <Link to="/restaurants" onClick={() => setOpen(false)}>Restaurants</Link>
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                    {(user.role === 'admin' || user.role === 'restaurant') && (
                      <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>
                    )}
                    <button onClick={() => { handleLogout(); setOpen(false); }}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                    <Link to="/register" onClick={() => setOpen(false)}>Sign Up</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
