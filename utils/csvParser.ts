import { Restaurant } from '@/types/restaurant';
import fs from 'fs';
import path from 'path';

/**
 * Simple CSV parser - splits by commas but respects quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Parse operating hours to extract opening and closing times
 * Example: "Mon-Thu: 11:30AM-2:30PM & 6:00PM-10:00PM; Fri-Sun: 11:30AM-10:30PM"
 * Returns the first opening time and last closing time found
 */
function parseOperatingHours(operatingHours: string): { opening: string; closing: string } {
  // Default values
  let opening = '11:00';
  let closing = '22:00';

  // Extract all time patterns (e.g., "11:30AM", "2:30PM", "10:00PM")
  const timePattern = /(\d{1,2}):(\d{2})(AM|PM)/gi;
  const matches = operatingHours.match(timePattern);

  if (matches && matches.length > 0) {
    // Convert first time to 24-hour format
    const firstTime = matches[0];
    opening = convertTo24Hour(firstTime);

    // Convert last time to 24-hour format
    const lastTime = matches[matches.length - 1];
    closing = convertTo24Hour(lastTime);
  }

  return { opening, closing };
}

/**
 * Convert 12-hour time to 24-hour format
 * Example: "11:30AM" -> "11:30", "2:30PM" -> "14:30"
 */
function convertTo24Hour(time12h: string): string {
  const match = time12h.match(/(\d{1,2}):(\d{2})(AM|PM)/i);
  if (!match) return '00:00';

  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

/**
 * Parse price range from format "$15-25" to format "$$"
 */
function parsePriceRange(priceRange: string): string {
  // Extract the max price from the range
  const match = priceRange.match(/\$(\d+)-(\d+)/);
  if (!match) return '$$';

  const maxPrice = parseInt(match[2]);

  // Map to $ symbols based on price
  if (maxPrice < 15) return '$';
  if (maxPrice < 25) return '$$';
  if (maxPrice < 40) return '$$$';
  return '$$$$';
}

/**
 * Load and parse the CSV file into Restaurant objects
 */
export function loadRestaurantsFromCSV(): Restaurant[] {
  const csvPath = path.join(process.cwd(), 'data', 'restaurants.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());

  // Skip header row
  const dataLines = lines.slice(1);

  // Houston city center coordinates (used as base for all restaurants)
  const houstonLat = 29.7604;
  const houstonLng = -95.3698;

  const restaurants: Restaurant[] = dataLines.map((line, index) => {
    const fields = parseCSVLine(line);

    const [
      name,
      address,
      phone,
      operatingHours,
      cuisine,
      vegetarianOptions,
      signatureDishes,
      priceRange,
      rating,
      website,
      specialFeatures
    ] = fields;

    const hours = parseOperatingHours(operatingHours);

    // Add slight random offset to coordinates to spread restaurants around Houston
    // This creates a more realistic distribution
    const latOffset = (Math.random() - 0.5) * 0.2; // ±0.1 degrees (~11km)
    const lngOffset = (Math.random() - 0.5) * 0.2;

    return {
      id: `csv-${index + 1}`,
      name: name || 'Unknown Restaurant',
      address: address || '',
      cuisine: cuisine || 'Indian',
      rating: parseFloat(rating) || 4.0,
      priceRange: parsePriceRange(priceRange),
      openingHours: hours.opening,
      closingHours: hours.closing,
      latitude: houstonLat + latOffset,
      longitude: houstonLng + lngOffset,
      phone: phone || '',
      description: specialFeatures || signatureDishes || 'Authentic cuisine'
    };
  });

  return restaurants;
}
