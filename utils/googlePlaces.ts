import { Restaurant } from '@/types/restaurant';

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';

interface PlaceResult {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  price_level?: number;
  types: string[];
  opening_hours?: {
    open_now?: boolean;
  };
}

interface PlaceDetails {
  result: {
    formatted_phone_number?: string;
    opening_hours?: {
      weekday_text?: string[];
      periods?: Array<{
        open: { time: string };
        close: { time: string };
      }>;
    };
    editorial_summary?: {
      overview?: string;
    };
  };
}

/**
 * Convert Google price level (0-4) to our format ($-$$$$)
 */
function convertPriceLevel(priceLevel?: number): string {
  if (!priceLevel) return '$$';

  const priceMap: Record<number, string> = {
    1: '$',
    2: '$$',
    3: '$$$',
    4: '$$$$',
  };

  return priceMap[priceLevel] || '$$';
}

/**
 * Extract cuisine type from Google place types
 */
function extractCuisine(types: string[]): string {
  const cuisineMap: Record<string, string> = {
    'chinese_restaurant': 'Chinese',
    'italian_restaurant': 'Italian',
    'mexican_restaurant': 'Mexican',
    'japanese_restaurant': 'Japanese',
    'american_restaurant': 'American',
    'indian_restaurant': 'Indian',
    'vietnamese_restaurant': 'Vietnamese',
    'mediterranean_restaurant': 'Mediterranean',
    'korean_restaurant': 'Korean',
    'french_restaurant': 'French',
    'thai_restaurant': 'Thai',
    'seafood_restaurant': 'Seafood',
    'greek_restaurant': 'Greek',
    'spanish_restaurant': 'Spanish',
    'steakhouse': 'Steakhouse',
    'barbecue_restaurant': 'BBQ',
  };

  for (const type of types) {
    if (cuisineMap[type]) {
      return cuisineMap[type];
    }
  }

  // Fallback to checking if it contains 'restaurant'
  if (types.includes('restaurant')) {
    return 'American';
  }

  return 'Restaurant';
}

/**
 * Get place details including phone and hours
 */
async function getPlaceDetails(placeId: string): Promise<PlaceDetails['result'] | null> {
  if (!GOOGLE_PLACES_API_KEY) return null;

  try {
    const url = `${PLACES_API_URL}/details/json?place_id=${placeId}&fields=formatted_phone_number,opening_hours,editorial_summary&key=${GOOGLE_PLACES_API_KEY}`;
    const response = await fetch(url);
    const data: PlaceDetails = await response.json();

    if (data.result) {
      return data.result;
    }

    return null;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}

/**
 * Parse opening hours from Google format
 */
function parseOpeningHours(periods?: Array<{ open: { time: string }; close: { time: string } }>): {
  openingHours: string;
  closingHours: string;
} {
  if (!periods || periods.length === 0) {
    return {
      openingHours: '09:00',
      closingHours: '21:00',
    };
  }

  // Use the first period (typically Monday)
  const firstPeriod = periods[0];

  // Google uses format like "0900" for 9:00 AM
  const openTime = firstPeriod.open.time;
  const closeTime = firstPeriod.close.time;

  const formatTime = (time: string) => {
    if (time.length === 4) {
      return `${time.slice(0, 2)}:${time.slice(2)}`;
    }
    return time;
  };

  return {
    openingHours: formatTime(openTime),
    closingHours: formatTime(closeTime),
  };
}

/**
 * Search for restaurants near a location using Google Places API
 */
export async function searchRestaurantsNearby(
  latitude: number,
  longitude: number,
  radius: number = 5000, // 5km radius
  limit: number = 20
): Promise<Restaurant[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key not configured');
  }

  try {
    // Nearby search for restaurants
    const url = `${PLACES_API_URL}/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Take first N results
    const results: PlaceResult[] = data.results.slice(0, limit);

    // Convert to our Restaurant format
    const restaurants: Restaurant[] = await Promise.all(
      results.map(async (place, index) => {
        // Fetch additional details
        const details = await getPlaceDetails(place.place_id);

        const hours = parseOpeningHours(details?.opening_hours?.periods);
        const cuisine = extractCuisine(place.types);

        return {
          id: `google-${place.place_id}`,
          name: place.name,
          address: place.vicinity,
          cuisine,
          rating: place.rating || 4.0,
          priceRange: convertPriceLevel(place.price_level),
          openingHours: hours.openingHours,
          closingHours: hours.closingHours,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          phone: details?.formatted_phone_number || 'N/A',
          description: details?.editorial_summary?.overview || `Enjoy ${cuisine} cuisine`,
        };
      })
    );

    return restaurants;
  } catch (error) {
    console.error('Error searching Google Places:', error);
    throw error;
  }
}

/**
 * Check if Google Places API is configured
 */
export function isGooglePlacesConfigured(): boolean {
  return !!GOOGLE_PLACES_API_KEY && GOOGLE_PLACES_API_KEY !== '';
}
