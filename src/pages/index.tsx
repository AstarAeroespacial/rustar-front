import { type NextPage } from 'next';
import { useState } from 'react';
import Layout from '~/components/Layout';
import { api } from '~/utils/api';
import dynamic from 'next/dynamic';
import type { Satellite } from '~/types/api';
import SatelliteInfoCard from '~/components/SatelliteInfoCard';

// Dynamically import the map component to avoid SSR issues
const SatelliteMap = dynamic(() => import('~/components/SatelliteMap'), {
    ssr: false,
    loading: () => (
        <div className='h-full bg-dark-700 rounded-lg flex items-center justify-center text-dark-400'>
            Loading map...
        </div>
    ),
});

const Home: NextPage = () => {
    const {
        data: satellites,
        isLoading,
        refetch,
    } = api.satellite.getSatellites.useQuery();
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSatellite, setEditingSatellite] = useState<Satellite | null>(
        null
    );
    const [newTLE, setNewTLE] = useState({ line1: '', line2: '' });

    // Get the first active satellite or the first satellite as default
    const selectedSatData =
        satellites?.find((sat) => sat.status === 'active') || satellites?.[0];

    const updateSatelliteMutation = api.satellite.updateSatellite.useMutation({
        onSuccess: () => {
            setShowEditModal(false);
            setEditingSatellite(null);
            refetch();
        },
    });

    const handleEditSatellite = (satellite: Satellite) => {
        setEditingSatellite(satellite);
        setNewTLE(satellite.tle || { line1: '', line2: '' });
        setShowEditModal(true);
    };

    return (
        <>
            <Layout>
                <div className='mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 mt-6'>
                    <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                        <div className='lg:col-span-9 h-[600px]'>
                            <SatelliteMap
                                satellites={satellites || []}
                                selectedSatellite={selectedSatData?.id || null}
                            />
                        </div>
                        <div className='lg:col-span-3'>
                            <SatelliteInfoCard
                                satellite={selectedSatData || null}
                                isLoading={isLoading}
                                onEdit={handleEditSatellite}
                            />
                        </div>
                    </div>
                </div>

                {showEditModal && editingSatellite && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center'>
                        {/* Backdrop */}
                        <div
                            className='absolute inset-0 bg-black/60'
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingSatellite(null);
                            }}
                        />

                        {/* Modal */}
                        <div className='relative z-10 w-full max-w-xl rounded-lg border border-dark-700 bg-dark-800 p-6 shadow-xl'>
                            <h3 className='text-xl font-semibold text-white mb-4'>
                                Editar TLE
                            </h3>

                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-dark-300 mb-2'>
                                        Línea 1
                                    </label>
                                    <textarea
                                        value={newTLE.line1}
                                        onChange={(e) =>
                                            setNewTLE((prev) => ({
                                                ...prev,
                                                line1: e.target.value,
                                            }))
                                        }
                                        rows={3}
                                        className='w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500'
                                        placeholder='TLE Line 1'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-dark-300 mb-2'>
                                        Línea 2
                                    </label>
                                    <textarea
                                        value={newTLE.line2}
                                        onChange={(e) =>
                                            setNewTLE((prev) => ({
                                                ...prev,
                                                line2: e.target.value,
                                            }))
                                        }
                                        rows={3}
                                        className='w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500'
                                        placeholder='TLE Line 2'
                                    />
                                </div>
                            </div>

                            <div className='mt-6 flex items-center justify-end gap-3'>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingSatellite(null);
                                    }}
                                    className='px-4 py-2 rounded-md bg-dark-700 hover:bg-dark-600 text-white border border-dark-600'
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        if (!editingSatellite) return;
                                        updateSatelliteMutation.mutate({
                                            id: editingSatellite.id,
                                            tle: newTLE,
                                        });
                                    }}
                                    disabled={
                                        updateSatelliteMutation.isLoading ||
                                        !newTLE.line1 ||
                                        !newTLE.line2
                                    }
                                    className='px-4 py-2 rounded-md bg-primary-700/90 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white'
                                >
                                    {updateSatelliteMutation.isLoading
                                        ? 'Guardando...'
                                        : 'Guardar'}
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
