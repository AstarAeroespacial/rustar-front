import { type NextPage } from "next";
import Head from "next/head";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const SatelliteMap = dynamic(() => import('~/components/SatelliteMap'), {
  ssr: false,
  loading: () => <div className="h-full bg-dark-700 rounded-lg flex items-center justify-center text-dark-400">Loading map...</div>
});

const Home: NextPage = () => {
  const { data: satellites, isLoading } = api.satellite.getSatellites.useQuery();
  
  // Get the first active satellite or the first satellite as default
  const selectedSatData = satellites?.find(sat => sat.status === 'active') || satellites?.[0];

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

                    <div className="border-t border-dark-700 pt-6">
                      <h3 className="text-white font-medium mb-4">Último Contacto</h3>
                      <div className="text-dark-300">
                        {selectedSatData.lastContact?.toLocaleString() || 'No disponible'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-dark-400">No hay datos de satélite disponibles</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
