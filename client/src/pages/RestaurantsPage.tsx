import { useEffect, useState, useCallback } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { api } from '../lib/api';
import type { ApiSuccess } from '../lib/api';
import { PageWrapper, ScrollReveal, SkeletonCard } from '../components/motion/Motion';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';

const CUISINES = ['Healthy', 'Indian', 'American', 'Japanese', 'Italian', 'Mediterranean', 'Pizza', 'Burgers'];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxDeliveryTime, setMaxDeliveryTime] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const debouncedSearch = useDebounce(search, 400);

  const fetchRestaurants = useCallback(async (pageNum: number, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pageNum), limit: '12' });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (cuisine) params.set('cuisine', cuisine);
      if (minRating) params.set('minRating', minRating);
      if (maxDeliveryTime) params.set('maxDeliveryTime', maxDeliveryTime);

      const res = await api.get<unknown, ApiSuccess<{ restaurants: Record<string, unknown>[] }> & { meta: { pages: number } }>(
        `/restaurants?${params}`
      );
      setRestaurants(append ? (prev) => [...prev, ...res.data.restaurants] : res.data.restaurants);
      setHasMore(pageNum < (res.meta?.pages || 1));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, cuisine, minRating, maxDeliveryTime]);

  useEffect(() => {
    setPage(1);
    fetchRestaurants(1, false);
  }, [fetchRestaurants]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchRestaurants(next, true);
  };

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Restaurants</h1>
      <p className="text-gray-500 mb-8">Find the perfect lunch for your office</p>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search restaurants or cuisines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            aria-label="Search restaurants"
          />
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <SlidersHorizontal className="w-5 h-5 text-gray-400 hidden sm:block" aria-hidden="true" />
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            aria-label="Filter by cuisine"
          >
            <option value="">All Cuisines</option>
            {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            aria-label="Filter by rating"
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5+</option>
            <option value="4">4.0+</option>
            <option value="3.5">3.5+</option>
          </select>
          <select
            value={maxDeliveryTime}
            onChange={(e) => setMaxDeliveryTime(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            aria-label="Filter by delivery time"
          >
            <option value="">Any Time</option>
            <option value="25">Under 25 min</option>
            <option value="30">Under 30 min</option>
            <option value="40">Under 40 min</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && restaurants.length === 0
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : restaurants.map((r, i) => (
            <ScrollReveal key={String(r._id)} index={i % 6}>
              <RestaurantCard restaurant={r as Parameters<typeof RestaurantCard>[0]['restaurant']} />
            </ScrollReveal>
          ))}
      </div>

      {!loading && restaurants.length === 0 && (
        <p className="text-center text-gray-500 py-12">No restaurants found. Try adjusting filters.</p>
      )}

      {hasMore && restaurants.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </PageWrapper>
  );
}
