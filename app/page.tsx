'use client';

import { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import RestaurantCard from '@/components/RestaurantCard';
import { Restaurant } from '@/types/restaurant';

// TODO: Workshop Exercise 5 - Improve UI with better styling
// Consider adding animations, better loading states, and responsive design improvements

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (location: string) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/restaurants?address=${encodeURIComponent(location)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch restaurants');
      }

      setRestaurants(data.restaurants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-100">🍽️ Restaurant Finder</h1>
          <p className="mt-1 text-sm text-gray-300">
            Find the best restaurants near you
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Section */}
        <section className="mb-8">
          <SearchForm onSearch={handleSearch} isLoading={loading} />
        </section>

        {/* Results Section */}
        <section>
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              <span className="ml-3 text-gray-300">Finding restaurants...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {!loading && hasSearched && restaurants.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-400">No restaurants found. Try a different location.</p>
            </div>
          )}

          {!loading && restaurants.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-200 mb-4">
                Found {restaurants.length} restaurants near you
              </h2>
              {/* TODO: Workshop Exercise 1 - Add opening hours display */}
              {/* Currently the opening hours are available in the data but not displayed */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </div>
          )}

          {!hasSearched && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-300 text-lg">
                Enter your location to find nearby restaurants
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try searching for &quot;San Francisco&quot; or &quot;94102&quot;
              </p>
            </div>
          )}
        </section>

        {/* TODO: Workshop Exercise 3 - Integrate real maps API */}
        {/* Add a map view showing restaurant locations */}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            Restaurant Finder - AI Workshop Demo Application
          </p>
        </div>
      </footer>
    </main>
  );
}
