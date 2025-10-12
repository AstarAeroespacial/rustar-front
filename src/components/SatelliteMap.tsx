import React, { useEffect, useRef, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    Circle,
    Polygon,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as satellite from 'satellite.js';
import type { Satellite } from '~/types/api';

// -----------------------------------------------------------------------------
// Marker icon setup
// -----------------------------------------------------------------------------
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
    ._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// -----------------------------------------------------------------------------
// Helper functions
// -----------------------------------------------------------------------------
function normalizeLongitude(lon: number): number {
    if (lon > 180) return lon - 360;
    if (lon < -180) return lon + 360;
    return lon;
}

const createSatelliteIcon = (status: string): L.DivIcon => {
    const color =
        status === 'active'
            ? '#10b981'
            : status === 'inactive'
            ? '#f59e0b'
            : '#ef4444';

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

// Satellite label (Orbitron-style)
const createSatelliteLabel = (name: string): L.DivIcon =>
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

// Generate ground track for the next N minutes (split at dateline)
function getGroundTrack(
    tle1: string,
    tle2: string,
    minutes = 90
): [number, number][][] {
    const satrec = satellite.twoline2satrec(tle1, tle2);
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

// Compute subsolar point (where the Sun is directly overhead)
function getSubsolarPoint(date: Date): [number, number] {
    const jd =
        satellite.jday(
            date.getUTCFullYear(),
            date.getUTCMonth() + 1,
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds()
        ) - 2451545.0;
    const n = jd / 36525.0;
    const L = (280.46 + 36000.77 * n) % 360;
    const g = (357.528 + 35999.05 * n) % 360;
    const lambda =
        L +
        1.915 * Math.sin((g * Math.PI) / 180) +
        0.02 * Math.sin((2 * g * Math.PI) / 180);
    const epsilon = 23.4393 - 0.013 * n;
    const decl = Math.asin(
        Math.sin((epsilon * Math.PI) / 180) * Math.sin((lambda * Math.PI) / 180)
    );
    const gst = satellite.gstime(date);
    const ra = Math.atan2(
        Math.cos((epsilon * Math.PI) / 180) *
            Math.sin((lambda * Math.PI) / 180),
        Math.cos((lambda * Math.PI) / 180)
    );
    const lon = normalizeLongitude((gst - ra) * (180 / Math.PI));
    return [decl * (180 / Math.PI), -lon];
}

// -----------------------------------------------------------------------------
// Component props
// -----------------------------------------------------------------------------
interface SatelliteMapProps {
    satellites: Satellite[];
    selectedSatellite: string | null;
}

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------
const SatelliteMap: React.FC<SatelliteMapProps> = ({
    satellites,
    selectedSatellite,
}) => {
    const mapRef = useRef<L.Map | null>(null);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [altitude, setAltitude] = useState<number | null>(null);
    const [track, setTrack] = useState<[number, number][][]>([]);
    const [subsolar, setSubsolar] = useState<[number, number]>([0, 0]);
    const [utcTime, setUtcTime] = useState<string>(new Date().toUTCString());

    const selectedSatelliteObj = satellites.find(
        (s) => s.id === selectedSatellite
    );

    useEffect(() => {
        const updateSun = () => {
            const now = new Date();
            setSubsolar(getSubsolarPoint(now));
            setUtcTime(now.toUTCString());
        };
        updateSun();
        const sunInterval = setInterval(updateSun, 60000);
        return () => clearInterval(sunInterval);
    }, []);

    useEffect(() => {
        if (!selectedSatelliteObj?.tle) return;
        let cancelled = false;
        const { line1, line2 } = selectedSatelliteObj.tle;
        const satrec = satellite.twoline2satrec(line1, line2);

        const updatePosition = () => {
            if (cancelled) return;
            const now = new Date();
            const pv = satellite.propagate(satrec, now);
            if (!pv?.position) return;
            const gmst = satellite.gstime(now);
            const gd = satellite.eciToGeodetic(pv.position, gmst);
            setPosition([
                satellite.degreesLat(gd.latitude),
                normalizeLongitude(satellite.degreesLong(gd.longitude)),
            ]);
            setAltitude(gd.height);
        };

        updatePosition();
        const interval = setInterval(updatePosition, 1000);
        setTrack(getGroundTrack(line1, line2));

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [selectedSatelliteObj]);

    const earthRadiusKm = 6371;
    const minElevationDeg = 10;
    const minElevationRad = (minElevationDeg * Math.PI) / 180;
    const theta = altitude
        ? Math.acos(
              (earthRadiusKm / (earthRadiusKm + altitude)) *
                  Math.cos(minElevationRad)
          ) - minElevationRad
        : 0;
    const radiusKm = Math.max(0, Math.min(earthRadiusKm * theta, 4000));

    // Create crude day/night terminator polygon
    const terminator: [number, number][] = [];
    for (let i = -180; i <= 180; i += 5) {
        const lat = -90 * Math.cos((Math.PI * (i - subsolar[1])) / 180);
        terminator.push([lat, i]);
    }

    return (
        <div className='relative h-full w-full rounded-lg overflow-hidden flex flex-col'>
            <div className='flex-1 min-h-[300px]'>
                <MapContainer
                    center={[0, 0]}
                    zoom={1.5}
                    minZoom={1.5}
                    maxZoom={1.5}
                    zoomControl={false}
                    scrollWheelZoom={false}
                    doubleClickZoom={false}
                    attributionControl={false}
                    touchZoom={false}
                    dragging={false}
                    keyboard={false}
                    boxZoom={false}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                    className='z-0 h-full w-full'
                >
                    <TileLayer
                        url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                        attribution=''
                    />

                    {/* Ground track (split into segments) */}
                    {track.length > 0 &&
                        track.map((segment, i) => (
                            <Polyline
                                key={i}
                                positions={segment as [number, number][]}
                                pathOptions={{
                                    color: 'yellow',
                                    weight: 1.2,
                                    opacity: 1,
                                }}
                            />
                        ))}

                    {/* Satellite marker + visibility circle */}
                    {position && selectedSatelliteObj && (
                        <>
                            <Marker
                                position={position}
                                icon={createSatelliteIcon(
                                    selectedSatelliteObj.status
                                )}
                            >
                                <Popup>
                                    <div className='text-sm'>
                                        <div className='font-semibold'>
                                            {selectedSatelliteObj.name}
                                        </div>
                                        <div className='text-gray-600'>
                                            {selectedSatelliteObj.id}
                                        </div>
                                        <div className='mt-1'>
                                            <div>
                                                Status:{' '}
                                                <span
                                                    className={`font-medium ${
                                                        selectedSatelliteObj.status ===
                                                        'active'
                                                            ? 'text-green-600'
                                                            : selectedSatelliteObj.status ===
                                                              'inactive'
                                                            ? 'text-yellow-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {
                                                        selectedSatelliteObj.status
                                                    }
                                                </span>
                                            </div>
                                            <div>
                                                Altitude: {altitude?.toFixed(1)}{' '}
                                                km
                                            </div>
                                            <div>
                                                Last Contact:{' '}
                                                {selectedSatelliteObj.lastContact?.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>

                            <Circle
                                center={position}
                                radius={radiusKm * 1000} // meters
                                pathOptions={{
                                    color: 'limegreen', // green border
                                    weight: 2,
                                    opacity: 1,
                                    fillColor: 'white', // white fill
                                    fillOpacity: 0.3, // semi-transparent
                                }}
                            />

                            <Marker
                                position={position}
                                icon={createSatelliteLabel(
                                    selectedSatelliteObj.name
                                )}
                                interactive={false}
                            />
                        </>
                    )}
                </MapContainer>

                {/* UTC clock overlay */}
                <div className='absolute bottom-2 right-3 text-base text-white bg-black/60 px-3 py-1 rounded flex items-center'>
                    {utcTime}
                </div>
            </div>
        </div>
    );
};

export default SatelliteMap;
