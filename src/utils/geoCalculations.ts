import * as turf from '@turf/turf';

// 1 Guntha = 1089 sq ft = 101.17141056 sq meters
export const SQ_METERS_PER_GUNTHA = 101.1714;
// 1 Acre = 40 Gunthas = 4046.8564224 sq meters
export const SQ_METERS_PER_ACRE = 4046.856;

export interface GeoCalculationsResult {
  sqMeters: number;
  gunthas: number;
  acres: number;
  sqFeet: number;
  perimeterMeters: number;
  geoJson: GeoJSON.Feature<GeoJSON.Polygon>;
}

/**
 * Converts array of Leaflet [lat, lng] coordinates into Turf polygon and computes accurate spatial metrics.
 */
export function calculatePlotMetrics(latLngs: [number, number][]): GeoCalculationsResult | null {
  if (latLngs.length < 3) {
    return null;
  }

  // Turf requires [lng, lat] and a closed ring (first point == last point)
  const ring = latLngs.map(([lat, lng]) => [lng, lat]);
  if (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1]) {
    ring.push([...ring[0]]);
  }

  try {
    const polygon = turf.polygon([ring]);
    const sqMeters = turf.area(polygon);
    const line = turf.polygonToLine(polygon);
    const perimeterMeters = (turf.length(line, { units: 'kilometers' })) * 1000;

    const gunthas = sqMeters / SQ_METERS_PER_GUNTHA;
    const acres = sqMeters / SQ_METERS_PER_ACRE;
    const sqFeet = sqMeters * 10.7639;

    return {
      sqMeters: Math.round(sqMeters * 100) / 100,
      gunthas: Math.round(gunthas * 100) / 100,
      acres: Math.round(acres * 1000) / 1000,
      sqFeet: Math.round(sqFeet * 10) / 10,
      perimeterMeters: Math.round(perimeterMeters * 10) / 10,
      geoJson: polygon,
    };
  } catch (err) {
    console.error('Failed to compute plot metrics:', err);
    return null;
  }
}

/**
 * Format Indian Rupees with standard comma grouping (Lakhs / Crores)
 */
export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Full Indian formatted currency string with commas
 */
export function formatFullINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}
