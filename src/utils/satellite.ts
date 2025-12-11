import L from 'leaflet';
import * as satellite from 'satellite.js';

export function parseTLE(tle: string): { line1: string; line2: string } | null {
    const lines = tle
        .trim()
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    // TLE can be 2 or 3 lines (with satellite name as first line)
    // We need the lines that start with "1 " and "2 "
    const line1 = lines.find((line) => line.startsWith('1 '));
    const line2 = lines.find((line) => line.startsWith('2 '));

    if (line1 && line2) {
        return { line1, line2 };
    }
    return null;
}

// Normalize longitude to [-180, 180]
export function normalizeLongitude(lon: number): number {
    if (lon > 180) return lon - 360;
    if (lon < -180) return lon + 360;
    return lon;
}

// Create a colored satellite dot (default green/active color)
export const createSatelliteIcon = (): L.DivIcon => {
    const color = '#10b981';
    return L.divIcon({
        html: `
      <div style="
        width: 12px;
        height: 12px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
      "></div>
    `,
        className: 'custom-satellite-icon',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
    });
};

// Create a text label for the satellite
export const createSatelliteLabel = (name: string): L.DivIcon =>
    L.divIcon({
        html: `
      <div style="
        color: white;
        font-weight: 600;
        font-size: 12px;
        text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
        white-space: nowrap;
        transform: translate(-50%, -120%);
      ">
        ${name}
      </div>
    `,
        className: 'satellite-label',
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    });

// Generate ground track for the next ±N minutes (split at dateline)
export function getGroundTrack(
    tle1: string,
    tle2: string,
    minutes = 90
): [number, number][][] {
    const satrec = satellite.twoline2satrec(tle1, tle2);

    // Check for TLE parsing errors
    if (satrec.error) {
        console.error('TLE parsing error in getGroundTrack:', satrec.error);
        return [];
    }

    const now = new Date();
    const segments: [number, number][][] = [];
    let current: [number, number][] = [];
    let prevLon: number | null = null;

    for (let t = -minutes * 60; t <= minutes * 60; t += 5) {
        const time = new Date(now.getTime() + t * 1000);
        const pv = satellite.propagate(satrec, time);
        if (!pv?.position) continue;

        const gmst = satellite.gstime(time);
        const gd = satellite.eciToGeodetic(pv.position, gmst);
        const lat = satellite.degreesLat(gd.latitude);
        const lon = normalizeLongitude(satellite.degreesLong(gd.longitude));

        // Validate coordinates before adding
        if (isNaN(lat) || isNaN(lon)) {
            console.warn('Invalid coordinates generated:', { lat, lon });
            continue;
        }

        if (prevLon !== null && Math.abs(lon - prevLon) > 180) {
            segments.push(current);
            current = [];
        }

        current.push([lat, lon]);
        prevLon = lon;
    }

    if (current.length) segments.push(current);
    return segments;
}
