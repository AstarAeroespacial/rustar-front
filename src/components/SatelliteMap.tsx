import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Satellite } from '~/types/api';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom satellite icon
const createSatelliteIcon = (status: string) => {
  const color = status === 'active' ? '#10b981' : status === 'inactive' ? '#f59e0b' : '#ef4444';
  
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

interface SatelliteMapProps {
  satellites: Satellite[];
  selectedSatellite: string | null;
}

const SatelliteMap: React.FC<SatelliteMapProps> = ({ satellites, selectedSatellite }) => {
  const mapRef = useRef<L.Map | null>(null);

  // Generate orbital path for demonstration
  const generateOrbitPath = (satellite: Satellite) => {
    if (!satellite.position) return [];
    
    const { latitude, longitude } = satellite.position;
    const points: [number, number][] = [];
    
    // Generate a simple orbital path (this would be more complex in reality)
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * 2 * Math.PI;
      const lat = latitude + Math.sin(angle) * 10;
      const lng = longitude + Math.cos(angle) * 20;
      points.push([lat, lng]);
    }
    
    return points;
  };

  // Focus on selected satellite
  useEffect(() => {
    if (mapRef.current && selectedSatellite) {
      const satellite = satellites.find(s => s.id === selectedSatellite);
      if (satellite?.position) {
        mapRef.current.setView([satellite.position.latitude, satellite.position.longitude], 4);
      }
    }
  }, [selectedSatellite, satellites]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {satellites.map((satellite) => {
          if (!satellite.position) return null;
          
          const { latitude, longitude } = satellite.position;
          const isSelected = satellite.id === selectedSatellite;
          const orbitPath = generateOrbitPath(satellite);
          
          return (
            <React.Fragment key={satellite.id}>
              {/* Satellite marker */}
              <Marker
                position={[latitude, longitude]}
                icon={createSatelliteIcon(satellite.status)}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{satellite.name}</div>
                    <div className="text-gray-600">{satellite.id}</div>
                    <div className="mt-1">
                      <div>Status: <span className={`font-medium ${
                        satellite.status === 'active' ? 'text-green-600' : 
                        satellite.status === 'inactive' ? 'text-yellow-600' : 'text-red-600'
                      }`}>{satellite.status}</span></div>
                      <div>Altitude: {satellite.position.altitude} km</div>
                      <div>Last Contact: {satellite.lastContact?.toLocaleString()}</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
              
              {/* Orbital path for selected satellite */}
              {isSelected && orbitPath.length > 0 && (
                <Polyline
                  positions={orbitPath}
                  color="#3b82f6"
                  weight={2}
                  opacity={0.6}
                  dashArray="5, 10"
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default SatelliteMap;
