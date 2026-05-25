import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import type { ApiSuccess } from '../lib/api';
import { PageWrapper, ScrollReveal, Skeleton } from '../components/motion/Motion';
import { useCartStore } from '../store/cartStore';
import type { CartCustomization } from '../store/cartStore';

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  isVegetarian?: boolean;
  customizations?: {
    name: string;
    options: { label: string; price: number }[];
    required?: boolean;
    maxSelections?: number;
  }[];
}

interface Restaurant {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  rating?: number;
  deliveryTime?: number;
  deliveryFee?: number;
  cuisine?: string[];
}

export function RestaurantDetailPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [customizeItem, setCustomizeItem] = useState<MenuItem | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    api.get<unknown, ApiSuccess<{ restaurant: Restaurant; menuItems: MenuItem[]; categories: string[] }>>(`/restaurants/${id}`)
      .then((res) => {
        setRestaurant(res.data.restaurant);
        setMenuItems(res.data.menuItems);
        setCategories(res.data.categories);
        setActiveCategory(res.data.categories[0] || '');
      })
      .catch(() => toast.error('Restaurant not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = (item: MenuItem, customizations: CartCustomization[] = []) => {
    if (!restaurant) return;
    addItem({
      menuItemId: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      customizations,
    });
    toast.success(`${item.name} added to cart!`, { icon: '🛒' });
    (window as Window & { openCart?: () => void }).openCart?.();
  };

  const confirmCustomize = () => {
    if (!customizeItem || !restaurant) return;
    const customizations: CartCustomization[] = [];
    customizeItem.customizations?.forEach((group) => {
      const choice = selections[group.name];
      if (choice) {
        const opt = group.options.find((o) => o.label === choice);
        if (opt) customizations.push({ option: group.name, choice: opt.label, price: opt.price });
      }
    });
    handleAddToCart(customizeItem, customizations);
    setCustomizeItem(null);
    setSelections({});
  };

  const filtered = menuItems.filter((m) => m.category === activeCategory);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full rounded-2xl mb-6" />
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40" />)}</div>
      </div>
    );
  }

  if (!restaurant) return <p className="text-center py-20">Restaurant not found</p>;

  return (
    <PageWrapper>
      <div className="relative h-56 sm:h-72 bg-gray-200">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 text-white">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-white/80 mt-1">{restaurant.cuisine?.join(' · ')}</p>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" />{restaurant.rating}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{restaurant.deliveryTime} min</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {restaurant.description && <p className="text-gray-600 mb-6">{restaurant.description}</p>}

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6" role="tablist" aria-label="Menu categories">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((item, i) => (
            <ScrollReveal key={item._id} index={i}>
              <motion.article
                layout
                className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" loading="lazy" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.isVegetarian && <span className="text-xs text-green-600 font-medium">🌱 Veg</span>}
                      {item.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                    </div>
                    <span className="font-bold text-brand-600 whitespace-nowrap">${item.price.toFixed(2)}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (item.customizations?.length) {
                        setCustomizeItem(item);
                        setSelections({});
                      } else {
                        handleAddToCart(item);
                      }
                    }}
                    className="mt-3 flex items-center gap-1 px-3 py-1.5 bg-brand-500 text-white text-sm rounded-lg font-medium hover:bg-brand-600"
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <Plus className="w-4 h-4" /> Add
                  </motion.button>
                </div>
              </motion.article>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {customizeItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50" onClick={() => setCustomizeItem(null)} />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 max-h-[80vh] overflow-y-auto"
              role="dialog"
              aria-label={`Customize ${customizeItem.name}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Customize {customizeItem.name}</h3>
                <button onClick={() => setCustomizeItem(null)} aria-label="Close"><X className="w-5 h-5" /></button>
              </div>
              {customizeItem.customizations?.map((group) => (
                <div key={group.name} className="mb-4">
                  <p className="font-medium mb-2">{group.name}{group.required && ' *'}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setSelections((s) => ({ ...s, [group.name]: opt.label }))}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          selections[group.name] === opt.label ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200'
                        }`}
                      >
                        {opt.label}{opt.price > 0 && ` (+$${opt.price})`}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={confirmCustomize}
                className="w-full py-3 bg-brand-500 text-white rounded-xl font-semibold mt-4"
              >
                Add to Cart
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
