import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import type { GroundStation } from "~/types/api";

const GroundStations: NextPage = () => {
  const { data: groundStations, isLoading, refetch } = api.groundStation.getGroundStations.useQuery();
  const { data: satellites } = api.satellite.getSatellites.useQuery();
  
  const [selectedStation, setSelectedStation] = useState<GroundStation | null>(null);
  const [showTLEModal, setShowTLEModal] = useState(false);
  const [showNewStationModal, setShowNewStationModal] = useState(false);
  const [newTLE, setNewTLE] = useState({ line1: "", line2: "" });
  const [selectedSatelliteId, setSelectedSatelliteId] = useState("");
  const [isNewSatellite, setIsNewSatellite] = useState(false);
  const [newSatelliteId, setNewSatelliteId] = useState("");
  const [newStationData, setNewStationData] = useState({
    name: "",
    latitude: 0,
    longitude: 0,
    altitude: 0,
  });

  const updateTLEMutation = api.groundStation.updateStationTLE.useMutation({
    onSuccess: () => {
      setShowTLEModal(false);
      setSelectedStation(null);
      refetch();
    },
  });

  const createStationMutation = api.groundStation.createGroundStation.useMutation({
    onSuccess: () => {
      setShowNewStationModal(false);
      setNewStationData({ name: "", latitude: 0, longitude: 0, altitude: 0 });
      refetch();
    },
  });

  const handleUpdateTLE = () => {
    if (!selectedStation) return;
    
    if (isNewSatellite) {
      if (!newSatelliteId || !newTLE.line1 || !newTLE.line2) return;
      
      updateTLEMutation.mutate({
        stationId: selectedStation.id,
        satelliteId: newSatelliteId,
        tle: newTLE,
        isNewSatellite: true,
      });
    } else {
      if (!selectedSatelliteId) return;
      
      const selectedSat = satellites?.find(sat => sat.id === selectedSatelliteId);
      if (!selectedSat) return;

      updateTLEMutation.mutate({
        stationId: selectedStation.id,
        satelliteId: selectedSatelliteId,
        satelliteName: selectedSat.name,
        tle: selectedSat.tle || newTLE,
        isNewSatellite: false,
      });
    }
  };

  const handleCreateStation = () => {
    if (!newStationData.name || !newStationData.latitude || !newStationData.longitude) return;
    
    createStationMutation.mutate({
      name: newStationData.name,
      location: {
        latitude: newStationData.latitude,
        longitude: newStationData.longitude,
        altitude: newStationData.altitude,
      },
    });
  };

  const openTLEModal = (station: GroundStation) => {
    setSelectedStation(station);
    setSelectedSatelliteId(station.trackingSatellite?.id || "");
    setNewTLE(station.trackingSatellite?.tle || { line1: "", line2: "" });
    setIsNewSatellite(false);
    setNewSatelliteId("");
    setShowTLEModal(true);
  };

  const handleSatelliteTypeChange = (isNew: boolean) => {
    setIsNewSatellite(isNew);
    if (isNew) {
      setSelectedSatelliteId("");
      setNewTLE({ line1: "", line2: "" });
    } else {
      setNewSatelliteId("");
    }
  };

  const handleExistingSatelliteChange = (satelliteId: string) => {
    setSelectedSatelliteId(satelliteId);
    const selectedSat = satellites?.find(sat => sat.id === satelliteId);
    if (selectedSat?.tle) {
      setNewTLE(selectedSat.tle);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500';
      case 'inactive':
        return 'text-red-400 bg-red-500';
      case 'maintenance':
        return 'text-yellow-400 bg-yellow-500';
      default:
        return 'text-gray-400 bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'inactive':
        return 'Inactiva';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return 'Desconocido';
    }
  };

  return (
    <>
      <Head>
        <title>Ground Stations - SatCom</title>
        <meta name="description" content="Ground station management and monitoring" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Estaciones Terrestres</h1>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-dark-300">
                  {groundStations?.length || 0} estaciones configuradas
                </div>
                <button
                  onClick={() => setShowNewStationModal(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  + Nueva Estación
                </button>
              </div>
            </div>
          </div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
            {isLoading ? (
              <div className="text-center text-dark-400 py-12">
                Cargando estaciones terrestres...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groundStations?.map((station) => (
                  <div
                    key={station.id}
                    className="bg-dark-800 rounded-lg border border-dark-700 p-6 hover:border-primary-500 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{station.name}</h3>
                      <div className={`flex items-center ${getStatusColor(station.status).split(' ')[0]}`}>
                        <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(station.status).split(' ')[1]}`} />
                        <span className="text-sm font-medium">{getStatusText(station.status)}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div>
                        <span className="text-dark-400 text-sm">ID:</span>
                        <div className="text-white font-medium">{station.id}</div>
                      </div>
                      
                      <div>
                        <span className="text-dark-400 text-sm">Ubicación:</span>
                        <div className="text-white font-medium">
                          {station.location.latitude.toFixed(4)}°, {station.location.longitude.toFixed(4)}°
                        </div>
                        <div className="text-dark-300 text-sm">
                          Altitud: {station.location.altitude}m
                        </div>
                      </div>

                      <div>
                        <span className="text-dark-400 text-sm">Última actualización:</span>
                        <div className="text-white font-medium">
                          {station.lastUpdate.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-dark-700 pt-4">
                      <div className="mb-3">
                        <span className="text-dark-400 text-sm">Satélite en seguimiento:</span>
                        {station.trackingSatellite ? (
                          <div className="mt-2">
                            <div className="text-white font-medium">
                              {station.trackingSatellite.name}
                            </div>
                            <div className="text-dark-300 text-sm">
                              ID: {station.trackingSatellite.id}
                            </div>
                            <div className="mt-2 p-2 bg-dark-900 rounded text-xs font-mono text-dark-300">
                              <div className="truncate">{station.trackingSatellite.tle.line1}</div>
                              <div className="truncate">{station.trackingSatellite.tle.line2}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-dark-400 mt-1">Sin asignación</div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => openTLEModal(station)}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        {station.trackingSatellite ? 'Cambiar TLE' : 'Asignar Satélite'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TLE Update Modal */}
        {showTLEModal && selectedStation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">
                Actualizar TLE - {selectedStation.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Tipo de Satélite
                  </label>
                  <div className="flex space-x-4 mb-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="satelliteType"
                        checked={!isNewSatellite}
                        onChange={() => handleSatelliteTypeChange(false)}
                        className="mr-2"
                      />
                      <span className="text-white">Satélite Existente</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="satelliteType"
                        checked={isNewSatellite}
                        onChange={() => handleSatelliteTypeChange(true)}
                        className="mr-2"
                      />
                      <span className="text-white">Nuevo Satélite</span>
                    </label>
                  </div>
                </div>

                {!isNewSatellite ? (
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Satélite Existente
                    </label>
                    <select
                      value={selectedSatelliteId}
                      onChange={(e) => handleExistingSatelliteChange(e.target.value)}
                      className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Seleccionar satélite...</option>
                      {satellites?.map((sat) => (
                        <option key={sat.id} value={sat.id}>
                          {sat.name} ({sat.id})
                        </option>
                      ))}
                    </select>
                    {selectedSatelliteId && (
                      <p className="text-xs text-dark-400 mt-1">
                        Se cargará automáticamente el nombre y TLE del satélite seleccionado
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      ID del Nuevo Satélite
                    </label>
                    <input
                      type="text"
                      value={newSatelliteId}
                      onChange={(e) => setNewSatelliteId(e.target.value)}
                      className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="SAT-XXX"
                    />
                  </div>
                )}

                {(isNewSatellite || selectedSatelliteId) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-2">
                        TLE Línea 1
                      </label>
                      <input
                        type="text"
                        value={newTLE.line1}
                        onChange={(e) => setNewTLE({ ...newTLE, line1: e.target.value })}
                        disabled={!isNewSatellite && selectedSatelliteId !== ""}
                        className={`w-full border border-dark-600 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          !isNewSatellite && selectedSatelliteId !== "" 
                            ? 'bg-dark-600 cursor-not-allowed' 
                            : 'bg-dark-700'
                        }`}
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
                        disabled={!isNewSatellite && selectedSatelliteId !== ""}
                        className={`w-full border border-dark-600 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          !isNewSatellite && selectedSatelliteId !== "" 
                            ? 'bg-dark-600 cursor-not-allowed' 
                            : 'bg-dark-700'
                        }`}
                        placeholder="2 25544  51.6461 339.7939 0001882  83.2943 276.8623 15.48919103260532"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowTLEModal(false)}
                  className="px-4 py-2 text-dark-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateTLE}
                  disabled={
                    updateTLEMutation.isLoading ||
                    (isNewSatellite ? (!newSatelliteId || !newTLE.line1 || !newTLE.line2) : !selectedSatelliteId)
                  }
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  {updateTLEMutation.isLoading ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Ground Station Modal */}
        {showNewStationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 w-full max-w-lg">
              <h3 className="text-lg font-semibold text-white mb-4">
                Nueva Estación Terrestre
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Nombre de la Estación
                  </label>
                  <input
                    type="text"
                    value={newStationData.name}
                    onChange={(e) => setNewStationData({ ...newStationData, name: e.target.value })}
                    className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ej: Estación Buenos Aires"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Latitud
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={newStationData.latitude}
                      onChange={(e) => setNewStationData({ ...newStationData, latitude: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="-34.6037"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Longitud
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={newStationData.longitude}
                      onChange={(e) => setNewStationData({ ...newStationData, longitude: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="-58.3816"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Altitud (metros)
                  </label>
                  <input
                    type="number"
                    value={newStationData.altitude}
                    onChange={(e) => setNewStationData({ ...newStationData, altitude: parseInt(e.target.value) || 0 })}
                    className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewStationModal(false)}
                  className="px-4 py-2 text-dark-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateStation}
                  disabled={!newStationData.name || createStationMutation.isLoading}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  {createStationMutation.isLoading ? 'Creando...' : 'Crear Estación'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default GroundStations;
