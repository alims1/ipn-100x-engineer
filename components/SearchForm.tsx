'use client';

import { useState, FormEvent } from 'react';

interface SearchFormProps {
  onSearch: (location: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [location, setLocation] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location.trim());
    }
  };

  // TODO: Workshop Exercise 3 - Add geolocation support
  // Add a "Use my location" button that gets the user's current coordinates

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg shadow-md p-6 border border-slate-700">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="location" className="block text-sm font-medium text-gray-200 mb-2">
            Enter your location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter address, city, or zip code..."
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-gray-100 placeholder-gray-400"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={isLoading || !location.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Searching...' : 'Find Restaurants'}
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-400">
        💡 Tip: Try searching for &quot;San Francisco&quot;, &quot;Houston&quot;, &quot;Dallas&quot;, or &quot;Fort Worth&quot;
      </p>
    </form>
  );
}
