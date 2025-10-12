import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import dynamic from 'next/dynamic';
import type { Satellite } from "~/types/api";

// Dynamically import the map component to avoid SSR issues
const SatelliteMap = dynamic(() => import('~/components/SatelliteMap'), {
  ssr: false,
  loading: () => <div className="h-full bg-dark-700 rounded-lg flex items-center justify-center text-dark-400">Loading map...</div>
});

const Home: NextPage = () => {
  const { data: satellites, isLoading, refetch } = api.satellite.getSatellites.useQuery();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSatellite, setEditingSatellite] = useState<Satellite | null>(null);
  const [newTLE, setNewTLE] = useState({ line1: "", line2: "" });
  
  // Get the first active satellite or the first satellite as default
  const selectedSatData = satellites?.find(sat => sat.status === 'active') || satellites?.[0];

  const updateSatelliteMutation = api.satellite.updateSatellite.useMutation({
    onSuccess: () => {
      setShowEditModal(false);
      setEditingSatellite(null);
      refetch();
    },
  });

  const handleEditSatellite = (satellite: Satellite) => {
    setEditingSatellite(satellite);
    setNewTLE(satellite.tle || { line1: "", line2: "" });
    setShowEditModal(true);
  };

  const handleUpdateSatellite = () => {
    if (!editingSatellite) return;
    
    updateSatelliteMutation.mutate({
      id: editingSatellite.id,
      tle: newTLE,
    });
  };

  return (
    <>
      <Head>
        <title>Satellite Tracking - SatCom</title>
        <meta name="description" content="Satellite tracking and positioning" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Seguimiento de Satélite</h1>
          </div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
              
              {/* Map */}
              <div className="lg:col-span-2 bg-dark-800 rounded-lg border border-dark-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Mapa de Seguimiento</h2>
                <div className="h-full">
                  <SatelliteMap satellites={satellites || []} selectedSatellite={selectedSatData?.id || null} />
                </div>
              </div>

              {/* Satellite Details */}
              <div className="lg:col-span-1 bg-dark-800 rounded-lg border border-dark-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Datos del Satélite</h2>
                
                {isLoading ? (
                  <div className="text-dark-400">Loading satellite data...</div>
                ) : selectedSatData ? (
                  <div className="space-y-6">
                    <div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-dark-400 text-sm">Nombre:</span>
                          <div className="text-white font-medium text-lg">{selectedSatData.name}</div>
                        </div>
                        <div>
                          <span className="text-dark-400 text-sm">ID:</span>
                          <div className="text-white font-medium">{selectedSatData.id}</div>
                        </div>
                        <div>
                          <span className="text-dark-400 text-sm">Estado:</span>
                          <div className={`font-medium flex items-center ${
                            selectedSatData.status === 'active' ? 'text-green-400' : 
                            selectedSatData.status === 'inactive' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            <div className={`w-3 h-3 rounded-full mr-2 ${
                              selectedSatData.status === 'active' ? 'bg-green-500' : 
                              selectedSatData.status === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            {selectedSatData.status === 'active' ? 'Activo' : 'Inactivo'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-dark-700 pt-6">
                      <h3 className="text-white font-medium mb-4">Posición</h3>
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

                    {selectedSatData.tle && (
                      <div className="border-t border-dark-700 pt-6">
                        <h3 className="text-white font-medium mb-4">TLE (Two-Line Elements)</h3>
                        <div className="bg-dark-900 rounded p-3 font-mono text-xs text-dark-300">
                          <div className="mb-1">{selectedSatData.tle.line1}</div>
                          <div>{selectedSatData.tle.line2}</div>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-dark-700 pt-6">
                      <h3 className="text-white font-medium mb-4">Último Contacto</h3>
                      <div className="text-dark-300">
                        {selectedSatData.lastContact?.toLocaleString() || 'No disponible'}
                      </div>
                    </div>

                    <div className="border-t border-dark-700 pt-6">
                      <button
                        onClick={() => handleEditSatellite(selectedSatData)}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                      >
                        Editar Datos del Satélite
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-dark-400">No hay datos de satélite disponibles</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Satellite Edit Modal */}
        {showEditModal && editingSatellite && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">
                Editar Satélite - {editingSatellite.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    ID del Satélite
                  </label>
                  <input
                    type="text"
                    value={editingSatellite.id}
                    disabled
                    className="w-full bg-dark-600 border border-dark-500 rounded-md px-3 py-2 text-dark-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-dark-400 mt-1">El ID no se puede modificar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Nombre del Satélite
                  </label>
                  <input
                    type="text"
                    value={editingSatellite.name}
                    disabled
                    className="w-full bg-dark-600 border border-dark-500 rounded-md px-3 py-2 text-dark-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-dark-400 mt-1">El nombre se obtiene automáticamente del TLE</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    TLE Línea 1
                  </label>
                  <input
                    type="text"
                    value={newTLE.line1}
                    onChange={(e) => setNewTLE({ ...newTLE, line1: e.target.value })}
                    className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="1 25544U 98067A   21001.00000000  .00002182  00000-0  40864-4 0  9990"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    TLE Línea 2
                  </label>
                  <input
                    type="text"
                    value={newTLE.line2}
                    onChange={(e) => setNewTLE({ ...newTLE, line2: e.target.value })}
                    className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="2 25544  51.6461 339.7939 0001882  83.2943 276.8623 15.48919103260532"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-dark-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateSatellite}
                  disabled={!newTLE.line1 || !newTLE.line2 || updateSatelliteMutation.isLoading}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  {updateSatelliteMutation.isLoading ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Home;
