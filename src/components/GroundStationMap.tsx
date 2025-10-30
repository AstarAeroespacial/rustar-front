import 'leaflet/dist/leaflet.css';
import React, { useRef } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
} from 'react-leaflet';
import L from 'leaflet';
import FullscreenControl from '~/components/FullscreenControl';

interface GroundStationMapProps {
    latitude: number;
    longitude: number;
    name: string;
}

const GroundStationMap: React.FC<GroundStationMapProps> = ({
    latitude,
    longitude,
    name,
}) => {
    const mapRef = useRef<L.Map | null>(null);
    const position: [number, number] = [latitude, longitude];

    // Create a simple ground station marker icon
    const createGroundStationIcon = () => {
        return L.divIcon({
            html: `
                <div style="
                    width: 16px;
                    height: 16px;
                    background-color: #3b82f6;
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                "></div>
            `,
            className: 'custom-ground-station-icon',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        });
    };

    // Create a label for the ground station
    const createGroundStationLabel = (stationName: string) => {
        return L.divIcon({
            html: `
                <div style="
                    color: white;
                    font-weight: 600;
                    font-size: 14px;
                    text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
                    white-space: nowrap;
                    transform: translate(-50%, -200%);
                ">
                    ${stationName}
                </div>
            `,
            className: 'ground-station-label',
            iconSize: [0, 0],
            iconAnchor: [0, 0],
        });
    };

    return (
        <div className='relative h-full w-full rounded-lg overflow-hidden flex flex-col'>
            <div className='flex-1 min-h-[300px]'>
                <MapContainer
                    center={position}
                    zoom={8}
                    minZoom={2}
                    maxZoom={18}
                    zoomControl={true}
                    scrollWheelZoom={true}
                    doubleClickZoom={true}
                    attributionControl={false}
                    touchZoom={true}
                    dragging={true}
                    keyboard={true}
                    boxZoom={true}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                    className='z-0 h-full w-full'
                >
                    <FullscreenControl />

                    <TileLayer
                        url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                        attribution=''
                    />

                    {/* Ground Station Marker */}
                    <Marker
                        position={position}
                        icon={createGroundStationIcon()}
                    />

                    {/* Ground Station Label */}
                    <Marker
                        position={position}
                        icon={createGroundStationLabel(name)}
                        interactive={false}
                    />
                </MapContainer>
            </div>
        </div>
    );
};

export default GroundStationMap;
