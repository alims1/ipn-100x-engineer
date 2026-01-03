import { NextRequest, NextResponse } from 'next/server';
import restaurantData from '@/data/restaurants.json';
import dfwRestaurantData from '@/data/restaurants-dfw.json';
import { calculateDistance, mockGeocode, DEFAULT_COORDINATES } from '@/utils/distance';
import { loadRestaurantsFromCSV } from '@/utils/csvParser';
import { Restaurant } from '@/types/restaurant';

// Number of restaurants to return
const RESULTS_LIMIT = 5;

// Load and combine restaurants from all sources
function getAllRestaurants(): Restaurant[] {
  const sfRestaurants = restaurantData.restaurants;
  const houstonRestaurants = loadRestaurantsFromCSV();
  const dfwRestaurants = dfwRestaurantData.restaurants;
  return [...sfRestaurants, ...houstonRestaurants, ...dfwRestaurants];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    let userLat: number;
    let userLng: number;

    // Determine user coordinates
    if (lat && lng) {
      userLat = parseFloat(lat);
      userLng = parseFloat(lng);

      // Validate coordinates
      if (isNaN(userLat) || isNaN(userLng)) {
        return NextResponse.json(
          { error: 'Invalid coordinates provided' },
          { status: 400 }
        );
      }
    } else if (address) {
      // Use mock geocoding for the address
      const coords = mockGeocode(address);
      if (coords) {
        userLat = coords.latitude;
        userLng = coords.longitude;
      } else {
        // Fall back to default coordinates
        userLat = DEFAULT_COORDINATES.latitude;
        userLng = DEFAULT_COORDINATES.longitude;
      }
    } else {
      // No location provided, use default
      userLat = DEFAULT_COORDINATES.latitude;
      userLng = DEFAULT_COORDINATES.longitude;
    }

    // Get all restaurants from both JSON and CSV sources
    const allRestaurants = getAllRestaurants();

    // Calculate distance for each restaurant and sort by distance
    const restaurantsWithDistance = allRestaurants.map((restaurant: Restaurant) => ({
      ...restaurant,
      distance: calculateDistance(
        userLat,
        userLng,
        restaurant.latitude,
        restaurant.longitude
      ),
    }));

    // Sort by distance and take the closest ones
    const sortedRestaurants = restaurantsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, RESULTS_LIMIT);

    return NextResponse.json({
      restaurants: sortedRestaurants,
      searchLocation: {
        latitude: userLat,
        longitude: userLng,
        address: address || 'Default location (San Francisco)',
      },
    });
  } catch (error) {
    console.error('Error in restaurants API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST method - currently not used but kept for future expansion
export async function POST(request: NextRequest) {
  // TODO: Workshop Exercise 4 - Add unit tests for this endpoint
  try {
    const body = await request.json();
    const { latitude, longitude, filters } = body;

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Get all restaurants from both JSON and CSV sources
    let restaurants = getAllRestaurants();

    // Apply filters if provided
    if (filters) {
      if (filters.cuisine) {
        restaurants = restaurants.filter(
          (r: Restaurant) => r.cuisine.toLowerCase() === filters.cuisine.toLowerCase()
        );
      }
      if (filters.minRating) {
        restaurants = restaurants.filter((r: Restaurant) => r.rating >= filters.minRating);
      }
      if (filters.priceRange) {
        restaurants = restaurants.filter((r: Restaurant) => r.priceRange === filters.priceRange);
      }
    }

    // Calculate distances and sort
    const restaurantsWithDistance = restaurants.map((restaurant: Restaurant) => ({
      ...restaurant,
      distance: calculateDistance(
        latitude,
        longitude,
        restaurant.latitude,
        restaurant.longitude
      ),
    }));

    const sortedRestaurants = restaurantsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, RESULTS_LIMIT);

    return NextResponse.json({
      restaurants: sortedRestaurants,
    });
  } catch (error) {
    console.error('Error in POST /api/restaurants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
