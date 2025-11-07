import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    Circle,
} from 'react-leaflet';
import L from 'leaflet';
import FullscreenControl from '~/components/FullscreenControl';
import * as satellite from 'satellite.js';
import type { Satellite } from '~/types/api';
import {
    normalizeLongitude,
    createSatelliteIcon,
    createSatelliteLabel,
    getGroundTrack,
    parseTLE,
} from '~/utils/satellite';

interface SatelliteMapProps {
    satellites: Satellite[];
    selectedSatellite: number | null;
    onPositionUpdate?: (position: { latitude: number; longitude: number; altitude: number } | null) => void;
}

const SatelliteMap: React.FC<SatelliteMapProps> = ({
    satellites,
    selectedSatellite,
    onPositionUpdate,
}) => {
    const mapRef = useRef<L.Map | null>(null);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [altitude, setAltitude] = useState<number | null>(null);
    const [track, setTrack] = useState<[number, number][][]>([]);
    const [utcTime, setUtcTime] = useState<string>(new Date().toUTCString());

    const selectedSatelliteObj = satellites.find(
        (s) => s.id === selectedSatellite
    );

    // 🕒 Update UTC clock
    useEffect(() => {
        const interval = setInterval(
            () => setUtcTime(new Date().toUTCString()),
            60000
        );
        return () => clearInterval(interval);
    }, []);

    // 🛰️ Update satellite position and track
    useEffect(() => {
        if (!selectedSatelliteObj?.tle) return;
        let cancelled = false;
        
        const tleData = parseTLE(selectedSatelliteObj.tle);
        if (!tleData) return;
        
        const { line1, line2 } = tleData;
        const satrec = satellite.twoline2satrec(line1, line2);

        const updatePosition = () => {
            if (cancelled) return;
            const now = new Date();
            const pv = satellite.propagate(satrec, now);
            if (!pv?.position) return;
            const gmst = satellite.gstime(now);
            const gd = satellite.eciToGeodetic(pv.position, gmst);
            const lat = satellite.degreesLat(gd.latitude);
            const lon = normalizeLongitude(satellite.degreesLong(gd.longitude));
            const alt = gd.height;
            
            setPosition([lat, lon]);
            setAltitude(alt);
            
            // Notify parent component of position update
            if (onPositionUpdate) {
                onPositionUpdate({
                    latitude: lat,
                    longitude: lon,
                    altitude: alt,
                });
            }
        };

        updatePosition();
        const interval = setInterval(updatePosition, 1000);
        setTrack(getGroundTrack(line1, line2));

        return () => {
            cancelled = true;
            clearInterval(interval);
            if (onPositionUpdate) {
                onPositionUpdate(null);
            }
        };
    }, [selectedSatelliteObj, onPositionUpdate]);

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

    return (
        <div className='relative h-full w-full rounded-lg overflow-hidden flex flex-col'>
            <div className='flex-1 min-h-[300px]'>
                <MapContainer
                    center={[0, 0]}
                    minZoom={1.5}
                    zoom={1.5}
                    maxZoom={6}
                    zoomControl={true}
                    scrollWheelZoom={true}
                    doubleClickZoom={false}
                    attributionControl={false}
                    touchZoom={true}
                    dragging={true}
                    keyboard={false}
                    boxZoom={false}
                    zoomSnap={0.5}
                    worldCopyJump={true}
                    maxBoundsViscosity={1.0}
                    maxBounds={L.latLngBounds([-85, -180], [85, 180])}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                    className='z-0 h-full w-full'
                >
                    <FullscreenControl />

                    <TileLayer
                        url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                        attribution=''
                    />

                    {/* 🟡 Ground track */}
                    {track.map((segment, i) => (
                        <Polyline
                            key={i}
                            positions={segment}
                            pathOptions={{
                                color: 'yellow',
                                weight: 1.2,
                                opacity: 1,
                            }}
                        />
                    ))}

                    {/* 🛰️ Satellite + visibility circle */}
                    {position && selectedSatelliteObj && (
                        <>
                            <Marker
                                position={position}
                                icon={createSatelliteIcon()}
                            />
                            <Circle
                                center={position}
                                radius={radiusKm * 1000}
                                pathOptions={{
                                    color: 'limegreen',
                                    weight: 2,
                                    opacity: 1,
                                    fillColor: 'white',
                                    fillOpacity: 0.3,
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

                {/* 🕓 UTC clock overlay */}
                <div className='absolute bottom-2 right-3 text-base text-white bg-black/60 px-3 py-1 rounded flex items-center'>
                    {utcTime}
                </div>
            </div>
        </div>
    );
};

export default SatelliteMap;
