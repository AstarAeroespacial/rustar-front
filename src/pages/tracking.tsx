import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const SatelliteMap = dynamic(() => import('~/components/SatelliteMap'), {
  ssr: false,
  loading: () => <div className="h-full bg-dark-700 rounded-lg flex items-center justify-center text-dark-400">Loading map...</div>
});

const Tracking: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSatellite, setSelectedSatellite] = useState<string | null>("SAT-01A");

  const { data: satellites, isLoading } = api.satellite.getSatellites.useQuery();

  const filteredSatellites = satellites?.filter(sat => 
    sat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sat.id.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const selectedSatData = satellites?.find(sat => sat.id === selectedSatellite);

  return (
    <>
      <Head>
        <title>Tracking - SatCom</title>
        <meta name="description" content="Satellite tracking and positioning" />
      </Head>
      <Layout>
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Seguimiento de Satélites</h1>
          </div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
              
              {/* Satellite List */}
              <div className="lg:col-span-1 bg-dark-800 rounded-lg border border-dark-700 p-6 overflow-hidden flex flex-col">
                <h2 className="text-lg font-semibold text-white mb-4">Satélites</h2>
                
                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Buscar satélite..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Satellite List */}
                <div className="flex-1 overflow-y-auto space-y-2">
                  {isLoading ? (
                    <div className="text-dark-400">Loading satellites...</div>
                  ) : (
                    filteredSatellites.map((satellite) => (
                      <div
                        key={satellite.id}
                        onClick={() => setSelectedSatellite(satellite.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedSatellite === satellite.id
                            ? 'border-primary-500 bg-primary-900/30'
                            : 'border-dark-600 hover:border-dark-500 hover:bg-dark-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">{satellite.name}</div>
                            <div className="text-dark-400 text-sm">{satellite.id}</div>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${
                            satellite.status === 'active' ? 'bg-green-500' : 
                            satellite.status === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </div>
                        <div className="mt-2 text-xs text-dark-400">
                          Estado: {satellite.status === 'active' ? 'Activo' : 'Inactivo'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Map and Details */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Map */}
                <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 h-2/3">
                  <h2 className="text-lg font-semibold text-white mb-4">Mapa de Seguimiento</h2>
                  <div className="h-full">
                    <SatelliteMap satellites={satellites || []} selectedSatellite={selectedSatellite} />
                  </div>
                </div>

                {/* Satellite Details */}
                <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 h-1/3">
                  <h2 className="text-lg font-semibold text-white mb-4">Datos del Satélite</h2>
                  
                  {selectedSatData ? (
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-dark-400 text-sm">Nombre:</span>
                            <div className="text-white font-medium">{selectedSatData.name}</div>
                          </div>
                          <div>
                            <span className="text-dark-400 text-sm">ID:</span>
                            <div className="text-white font-medium">{selectedSatData.id}</div>
                          </div>
                          <div>
                            <span className="text-dark-400 text-sm">Estado:</span>
                            <div className={`font-medium ${
                              selectedSatData.status === 'active' ? 'text-green-400' : 
                              selectedSatData.status === 'inactive' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {selectedSatData.status === 'active' ? 'Activo' : 'Inactivo'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-dark-400 text-sm">Latitud:</span>
                            <div className="text-white font-medium">
                              {selectedSatData.position?.latitude.toFixed(4)}°
                            </div>
                          </div>
                          <div>
                            <span className="text-dark-400 text-sm">Longitud:</span>
                            <div className="text-white font-medium">
                              {selectedSatData.position?.longitude.toFixed(4)}°
                            </div>
                          </div>
                          <div>
                            <span className="text-dark-400 text-sm">Altitud:</span>
                            <div className="text-white font-medium">
                              {selectedSatData.position?.altitude} km
                            </div>
                          </div>
                          <div>
                            <span className="text-dark-400 text-sm">Velocidad:</span>
                            <div className="text-white font-medium">7.8 km/s</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-dark-400">Selecciona un satélite para ver sus detalles</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Tracking;
