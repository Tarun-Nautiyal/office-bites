import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Building2, Clock, Shield } from 'lucide-react';
import { api } from '../lib/api';
import type { ApiSuccess } from '../lib/api';
import { FadeIn, ScrollReveal, SkeletonCard } from '../components/motion/Motion';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';

const reviews = [
  { name: 'Sarah K.', role: 'Product Manager', text: 'OfficeBite saved our team lunch meetings. Delivery right to floor 12!', rating: 5 },
  { name: 'Mike T.', role: 'Software Engineer', text: 'Fast, reliable, and the tracking feature is spot on.', rating: 5 },
  { name: 'Lisa M.', role: 'HR Director', text: 'We use OfficeBite for weekly office lunches. Highly recommend!', rating: 5 },
];

export function HomePage() {
  const [featured, setFeatured] = useState<Record<string, unknown>[]>([]);
  const [dishes, setDishes] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<unknown, ApiSuccess<{ restaurants: Record<string, unknown>[] }>>('/restaurants/featured'),
      api.get<unknown, ApiSuccess<{ dishes: Record<string, unknown>[] }>>('/restaurants/popular-dishes'),
    ]).then(([f, d]) => {
      setFeatured(f.data.restaurants);
      setDishes(d.data.dishes);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur">
              🏢 Built for Office Professionals
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Lunch delivered to your desk, fast.
            </h1>
            <p className="mt-4 text-lg text-brand-100 max-w-lg">
              Order from top restaurants near your office. Track in real-time. Pay securely. No more lunch lines.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-600 rounded-xl font-semibold hover:bg-brand-50 transition-colors shadow-lg"
              >
                Order Now <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#office-lunch" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/50 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                Office Lunch Plans
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-96"
          >
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500"
              alt="Delicious office lunch"
              className="rounded-3xl shadow-2xl rotate-3"
              loading="eager"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Building2, title: 'Office Delivery', desc: 'Building & floor selection' },
            { icon: Clock, title: 'Real-Time Tracking', desc: 'Live order status updates' },
            { icon: Shield, title: 'Secure Payments', desc: 'Stripe-powered checkout' },
          ].map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.1}>
              <div className="flex items-center gap-4 p-4">
                <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
                  <f.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Featured Restaurants Slider */}
      <section className="py-16" aria-labelledby="featured-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <h2 id="featured-heading" className="text-2xl sm:text-3xl font-bold">Featured Restaurants</h2>
              <Link to="/restaurants" className="text-brand-600 font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="min-w-[280px] snap-start"><SkeletonCard /></div>)
              : featured.map((r, i) => (
                <ScrollReveal key={String(r._id)} index={i} className="min-w-[280px] snap-start flex-shrink-0">
                  <RestaurantCard restaurant={r as Parameters<typeof RestaurantCard>[0]['restaurant']} />
                </ScrollReveal>
              ))}
          </div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section id="popular" className="py-16 bg-gray-50" aria-labelledby="popular-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 id="popular-heading" className="text-2xl sm:text-3xl font-bold mb-8">Popular Dishes</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : dishes.map((d, i) => (
                <ScrollReveal key={String(d._id)} index={i}>
                  <Link
                    to={`/restaurants/${(d.restaurant as { slug?: string; _id: string })?.slug || (d.restaurant as { _id: string })?._id}`}
                    className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={(d.image as string) || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                      alt={d.name as string}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <p className="text-xs text-brand-600 font-medium">{(d.restaurant as { name: string })?.name}</p>
                      <h3 className="font-semibold mt-1">{d.name as string}</h3>
                      <p className="text-brand-600 font-bold mt-2">${(d.price as number)?.toFixed(2)}</p>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
          </div>
        </div>
      </section>

      {/* Office Lunch Promo */}
      <section id="office-lunch" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="bg-gradient-to-r from-brand-500 to-brand-700 rounded-3xl p-8 lg:p-12 text-white flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold">Office Lunch Plans</h2>
                <p className="mt-3 text-brand-100 text-lg">
                  Schedule team lunches, apply corporate promo codes, and get bulk delivery to your floor.
                  Use code <strong className="text-white">OFFICE20</strong> for 20% off.
                </p>
                <Link to="/restaurants" className="inline-block mt-6 px-6 py-3 bg-white text-brand-600 rounded-xl font-semibold hover:bg-brand-50 transition-colors">
                  Start Team Order
                </Link>
              </div>
              <img
                src="https://images.unsplash.com/photo-1528605110525-243c5c4af1f5?w=500"
                alt="Team enjoying office lunch"
                className="w-full max-w-sm rounded-2xl shadow-xl"
                loading="lazy"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50" aria-labelledby="reviews-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 id="reviews-heading" className="text-2xl sm:text-3xl font-bold text-center mb-10">What Professionals Say</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <ScrollReveal key={r.name} index={i}>
                <article className="bg-white p-6 rounded-2xl shadow-sm">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">&ldquo;{r.text}&rdquo;</p>
                  <div className="mt-4">
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-sm text-gray-500">{r.role}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
