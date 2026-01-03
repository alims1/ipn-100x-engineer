/**
 * Distance calculation utilities
 * Uses the Haversine formula to calculate distance between two points
 */

// Earth's radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Format distance for display
 * @param distanceKm Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

// Default coordinates for San Francisco (used when no location is provided)
export const DEFAULT_COORDINATES = {
  latitude: 37.7749,
  longitude: -122.4194,
};

/**
 * Simple geocoding mock - in production, use a real geocoding API
 * This provides approximate coordinates for common search terms
 */
export function mockGeocode(address: string): { latitude: number; longitude: number } | null {
  const addressLower = address.toLowerCase();

  // Simple keyword matching for demo purposes
  const locationMap: Record<string, { latitude: number; longitude: number }> = {
    // San Francisco locations
    'san francisco': { latitude: 37.7749, longitude: -122.4194 },
    'downtown': { latitude: 37.7879, longitude: -122.4074 },
    'mission': { latitude: 37.7599, longitude: -122.4148 },
    'soma': { latitude: 37.7785, longitude: -122.3950 },
    'marina': { latitude: 37.8025, longitude: -122.4382 },
    'castro': { latitude: 37.7609, longitude: -122.4350 },
    'haight': { latitude: 37.7692, longitude: -122.4481 },
    'north beach': { latitude: 37.8060, longitude: -122.4103 },
    'chinatown': { latitude: 37.7941, longitude: -122.4078 },
    'financial district': { latitude: 37.7946, longitude: -122.3999 },
    // Houston locations
    'houston': { latitude: 29.7604, longitude: -95.3698 },
    'houston tx': { latitude: 29.7604, longitude: -95.3698 },
    // DFW (Dallas-Fort Worth) locations
    'dallas': { latitude: 32.7767, longitude: -96.7970 },
    'dallas tx': { latitude: 32.7767, longitude: -96.7970 },
    'fort worth': { latitude: 32.7555, longitude: -97.3308 },
    'fort worth tx': { latitude: 32.7555, longitude: -97.3308 },
    'dfw': { latitude: 32.7767, longitude: -96.7970 },
    'arlington': { latitude: 32.7357, longitude: -97.1081 },
    'plano': { latitude: 33.0198, longitude: -96.6989 },
    'irving': { latitude: 32.8140, longitude: -96.9489 },
    '94102': { latitude: 37.7813, longitude: -122.4167 },
    '94103': { latitude: 37.7726, longitude: -122.4119 },
    '94104': { latitude: 37.7914, longitude: -122.4020 },
    '94105': { latitude: 37.7894, longitude: -122.3953 },
    '94107': { latitude: 37.7658, longitude: -122.3970 },
    '94108': { latitude: 37.7920, longitude: -122.4080 },
    '94109': { latitude: 37.7942, longitude: -122.4215 },
    '94110': { latitude: 37.7486, longitude: -122.4153 },
    '94117': { latitude: 37.7709, longitude: -122.4420 },
    '94118': { latitude: 37.7822, longitude: -122.4617 },
    '94122': { latitude: 37.7586, longitude: -122.4859 },
    '94123': { latitude: 37.8008, longitude: -122.4358 },
    '94133': { latitude: 37.8009, longitude: -122.4103 },
  };

  // Check for exact matches first
  for (const [key, coords] of Object.entries(locationMap)) {
    if (addressLower.includes(key)) {
      return coords;
    }
  }

  // Default to San Francisco city center if no match
  return DEFAULT_COORDINATES;
}
