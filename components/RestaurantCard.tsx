import { Restaurant } from '@/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className="text-yellow-400">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '½'}
        {'☆'.repeat(emptyStars)}
      </span>
    );
  };

  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case '$':
        return 'text-green-600';
      case '$$':
        return 'text-yellow-600';
      case '$$$':
        return 'text-orange-600';
      case '$$$$':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Placeholder image area */}
      <div className="h-40 bg-gradient-to-r from-red-700 to-orange-700 flex items-center justify-center">
        <span className="text-6xl">{getCuisineEmoji(restaurant.cuisine)}</span>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-100 truncate flex-1">
            {restaurant.name}
          </h3>
          <span className={`font-medium ml-2 ${getPriceColor(restaurant.priceRange)}`}>
            {restaurant.priceRange}
          </span>
        </div>

        <p className="text-sm text-gray-300 mb-2">{restaurant.cuisine}</p>

        <div className="flex items-center mb-2">
          {renderStars(restaurant.rating)}
          <span className="ml-2 text-sm text-gray-300">{restaurant.rating.toFixed(1)}</span>
        </div>

        <p className="text-sm text-gray-300 mb-2 truncate" title={restaurant.address}>
          📍 {restaurant.address}
        </p>

        <p className="text-sm text-gray-300 mb-2">
          🕒 {formatTime(restaurant.openingHours)} - {formatTime(restaurant.closingHours)}
        </p>

        <p className="text-sm text-gray-400 line-clamp-2">{restaurant.description}</p>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            View Details
          </button>
          <button className="px-3 py-2 text-sm border border-gray-600 rounded hover:bg-slate-700 transition-colors text-gray-200">
            📞
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to get cuisine emoji
function getCuisineEmoji(cuisine: string): string {
  const cuisineEmojis: Record<string, string> = {
    Chinese: '🥡',
    Italian: '🍝',
    Mexican: '🌮',
    Japanese: '🍣',
    American: '🍔',
    Indian: '🍛',
    Vietnamese: '🍜',
    Mediterranean: '🥙',
    Korean: '🍲',
    French: '🥐',
    Thai: '🍜',
    Vegan: '🥗',
    Seafood: '🦐',
    Greek: '🥙',
    Ethiopian: '🍲',
    Brazilian: '🥩',
    Peruvian: '🐟',
    Spanish: '🥘',
    BBQ: '🍖',
    Southern: '🍗',
    Steakhouse: '🥩',
    'Modern South Indian': '🍛',
    'Tamil/Vegetarian': '🥗',
    'North/South Indian': '🍛',
    'Modern Indian': '🍛',
    'Pakistani/South Indian': '🍛',
    'Indo-Pakistani': '🍛',
    'Gujarati/South Indian': '🍛',
    'Gujarati/Rajasthani': '🍛',
    'Pakistani/Indian': '🍛',
    'Karnataka/Udupi': '🍛',
    'Pakistani/Punjabi': '🍛',
    'Andhra/Telugu': '🍛',
    'Tamil/South Indian': '🍛',
  };

  return cuisineEmojis[cuisine] || '🍽️';
}
