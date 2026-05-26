import { Link } from 'react-router-dom';
import { Star, Clock, Truck } from 'lucide-react';
import { HoverCard } from '../motion/Motion';

interface RestaurantCardProps {
  restaurant: {
    _id: string;
    slug?: string;
    name: string;
    image?: string;
    cuisine?: string[];
    rating?: number;
    deliveryTime?: number;
    deliveryFee?: number;
    reviewCount?: number;
  };
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const slug = restaurant.slug || restaurant._id;

  return (
    <HoverCard>
      <Link
        to={`/restaurants/${slug}`}
        className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        aria-label={`View ${restaurant.name}`}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {restaurant.cuisine?.[0] && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium text-gray-700">
              {restaurant.cuisine[0]}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900">{restaurant.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{restaurant.cuisine?.slice(0, 2).join(' · ')}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1 text-amber-500 font-medium">
              <Star className="w-4 h-4 fill-current" />
              {restaurant.rating?.toFixed(1) || '4.5'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {restaurant.deliveryTime || 30} min
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              ${restaurant.deliveryFee?.toFixed(2) || '2.99'}
            </span>
          </div>
        </div>
      </Link>
    </HoverCard>
  );
}
