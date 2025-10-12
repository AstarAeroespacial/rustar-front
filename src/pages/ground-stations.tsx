import { type NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import type { GroundStation } from "~/types/api";

const GroundStations: NextPage = () => {
  const { data: groundStations, isLoading, refetch } = api.groundStation.getGroundStations.useQuery();
  const { data: satellites } = api.satellite.getSatellites.useQuery();
  
  // Single ground station state
  const [currentStation, setCurrentStation] = useState<GroundStation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStation, setEditedStation] = useState<Partial<GroundStation>>({});
  
  // TLE modal state
  const [showTLEModal, setShowTLEModal] = useState(false);
  const [newTLE, setNewTLE] = useState({ line1: "", line2: "" });
  const [selectedSatelliteId, setSelectedSatelliteId] = useState("");
  const [isNewSatellite, setIsNewSatellite] = useState(false);
  const [newSatelliteId, setNewSatelliteId] = useState("");

  // Load first ground station when data is available
  useEffect(() => {
    if (groundStations && groundStations.length > 0 && !currentStation) {
      const firstStation = groundStations[0]!;
      setCurrentStation(firstStation);
      setEditedStation(firstStation);
    }
  }, [groundStations, currentStation]);

  const updateTLEMutation = api.groundStation.updateStationTLE.useMutation({
    onSuccess: () => {
      setShowTLEModal(false);
      refetch();
    },
  });

  const updateStationMutation = api.groundStation.updateGroundStation.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      refetch();
    },
  });

  const handleUpdateTLE = () => {
    if (!currentStation) return;
    
    if (isNewSatellite) {
      if (!newSatelliteId || !newTLE.line1 || !newTLE.line2) return;
      
      updateTLEMutation.mutate({
        stationId: currentStation.id,
        satelliteId: newSatelliteId,
        tle: newTLE,
        isNewSatellite: true,
      });
    } else {
      if (!selectedSatelliteId) return;
      
      const selectedSat = satellites?.find(sat => sat.id === selectedSatelliteId);
      if (!selectedSat) return;

      updateTLEMutation.mutate({
        stationId: currentStation.id,
        satelliteId: selectedSatelliteId,
        satelliteName: selectedSat.name,
        tle: selectedSat.tle || newTLE,
        isNewSatellite: false,
      });
    }
  };

  const handleSaveStation = () => {
    if (!currentStation || !editedStation.name || !editedStation.location) return;
    
    updateStationMutation.mutate({
      id: currentStation.id,
      name: editedStation.name,
      location: editedStation.location,
      status: editedStation.status || currentStation.status,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedStation(currentStation || {});
  };

  const openTLEModal = () => {
    if (!currentStation) return;
    setSelectedSatelliteId(currentStation.trackingSatellite?.id || "");
    setNewTLE(currentStation.trackingSatellite?.tle || { line1: "", line2: "" });
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

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Ground Station - SatCom</title>
          <meta name="description" content="Ground station management and monitoring" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <div className="py-6">
            <div className="text-center text-dark-400 py-12">
              Cargando estación terrestre...
            </div>
          </div>
        </Layout>
      </>
    );
  }

  if (!currentStation) {
    return (
      <>
        <Head>
          <title>Ground Station - SatCom</title>
          <meta name="description" content="Ground station management and monitoring" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <div className="py-6">
            <div className="text-center text-dark-400 py-12">
              No hay estaciones terrestres configuradas
            </div>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Ground Station - SatCom</title>
        <meta name="description" content="Ground station management and monitoring" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="py-6">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white">Estación Terrestre</h1>
              <div className="flex items-center space-x-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Editar Estación
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="bg-dark-600 hover:bg-dark-500 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveStation}
                      disabled={updateStationMutation.isLoading}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      {updateStationMutation.isLoading ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-dark-800 rounded-lg border border-dark-700 p-8">
              {/* Station Status */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center ${getStatusColor(currentStation.status).split(' ')[0]}`}>
                    <div className={`w-4 h-4 rounded-full mr-3 ${getStatusColor(currentStation.status).split(' ')[1]}`} />
                    <span className="text-lg font-medium">{getStatusText(currentStation.status)}</span>
                  </div>
                </div>
                <div className="text-dark-300 text-sm">
                  ID: {currentStation.id}
                </div>
              </div>

              {/* Station Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Información Básica</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Nombre de la Estación
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedStation.name || ''}
                        onChange={(e) => setEditedStation({ ...editedStation, name: e.target.value })}
                        className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="text-white font-medium text-lg">{currentStation.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Estado
                    </label>
                    {isEditing ? (
                      <select
                        value={editedStation.status || currentStation.status}
                        onChange={(e) => setEditedStation({ ...editedStation, status: e.target.value as 'active' | 'inactive' | 'maintenance' })}
                        className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="active">Activa</option>
                        <option value="inactive">Inactiva</option>
                        <option value="maintenance">Mantenimiento</option>
                      </select>
                    ) : (
                      <div className="text-white font-medium">{getStatusText(currentStation.status)}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Última Actualización
                    </label>
                    <div className="text-white font-medium">
                      {currentStation.lastUpdate.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Ubicación</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-2">
                        Latitud
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          step="any"
                          value={editedStation.location?.latitude || currentStation.location.latitude}
                          onChange={(e) => setEditedStation({ 
                            ...editedStation, 
                            location: { 
                              ...editedStation.location, 
                              ...currentStation.location,
                              latitude: parseFloat(e.target.value) || 0 
                            } 
                          })}
                          className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <div className="text-white font-medium">{currentStation.location.latitude.toFixed(6)}°</div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-2">
                        Longitud
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          step="any"
                          value={editedStation.location?.longitude || currentStation.location.longitude}
                          onChange={(e) => setEditedStation({ 
                            ...editedStation, 
                            location: { 
                              ...editedStation.location, 
                              ...currentStation.location,
                              longitude: parseFloat(e.target.value) || 0 
                            } 
                          })}
                          className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <div className="text-white font-medium">{currentStation.location.longitude.toFixed(6)}°</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Altitud (metros)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedStation.location?.altitude || currentStation.location.altitude}
                        onChange={(e) => setEditedStation({ 
                          ...editedStation, 
                          location: { 
                            ...editedStation.location, 
                            ...currentStation.location,
                            altitude: parseInt(e.target.value) || 0 
                          } 
                        })}
                        className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="text-white font-medium">{currentStation.location.altitude}m</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Satellite Tracking Section */}
              <div className="border-t border-dark-700 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Satélite en Seguimiento</h3>
                  <button
                    onClick={openTLEModal}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {currentStation.trackingSatellite ? 'Cambiar TLE' : 'Asignar Satélite'}
                  </button>
                </div>

                {currentStation.trackingSatellite ? (
                  <div className="bg-dark-900 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-4">
                          <span className="text-dark-400 text-sm">Nombre del Satélite:</span>
                          <div className="text-white font-medium text-lg">
                            {currentStation.trackingSatellite.name}
                          </div>
                        </div>
                        <div>
                          <span className="text-dark-400 text-sm">ID del Satélite:</span>
                          <div className="text-white font-medium">
                            {currentStation.trackingSatellite.id}
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-dark-400 text-sm">Datos TLE:</span>
                        <div className="mt-2 p-3 bg-dark-800 rounded text-xs font-mono text-dark-200">
                          <div className="mb-1">{currentStation.trackingSatellite.tle.line1}</div>
                          <div>{currentStation.trackingSatellite.tle.line2}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-dark-400">
                    <div className="text-lg mb-2">Sin satélite asignado</div>
                    <div className="text-sm">Haz clic en "Asignar Satélite" para configurar el seguimiento</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TLE Update Modal */}
        {showTLEModal && currentStation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">
                Actualizar TLE - {currentStation.name}
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

      </Layout>
    </>
  );
};

export default GroundStations;
