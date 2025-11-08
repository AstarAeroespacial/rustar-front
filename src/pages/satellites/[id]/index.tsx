import { type NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import SatellitesLayout from '~/components/SatellitesLayout';
import { api } from '~/utils/api';
import dynamic from 'next/dynamic';
import type { Satellite } from '~/types/api';
import SatelliteInfoCard from '~/components/SatelliteInfoCard';
import { Button } from '~/components/ui/Button';

// Dynamically import the map component to avoid SSR issues
const SatelliteMap = dynamic(() => import('~/components/SatelliteMap'), {
    ssr: false,
    loading: () => (
        <div className='h-full bg-[#0B0D10] rounded-lg flex items-center justify-center text-gray-400'>
            Loading map...
        </div>
    ),
});

const SatelliteTracking: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const satelliteId = parseInt(id as string);

    // Fetch single satellite by ID for better performance
    const {
        data: selectedSatData,
        isLoading,
        refetch,
    } = api.satellite.getSatelliteById.useQuery(
        { id: satelliteId },
        { enabled: !isNaN(satelliteId) }
    );

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSatellite, setEditingSatellite] = useState<Satellite | null>(
        null
    );
    const [newTLE, setNewTLE] = useState('');
    const [satellitePosition, setSatellitePosition] = useState<{
        latitude: number;
        longitude: number;
        altitude: number;
    } | null>(null);

    const updateSatelliteMutation = api.satellite.updateSatellite.useMutation({
        onSuccess: () => {
            setShowEditModal(false);
            setEditingSatellite(null);
            refetch();
        },
    });

    const handleEditSatellite = (satellite: Satellite) => {
        setEditingSatellite(satellite);
        setNewTLE(satellite.tle || '');
        setShowEditModal(true);
    };

    return (
        <>
            <Head>
                <title>{selectedSatData?.name || 'Satellite'} - Rustar</title>
                <meta
                    name='description'
                    content='Satellite tracking and monitoring'
                />
                <link
                    rel='icon'
                    href='/favicon.ico'
                />
            </Head>
            <SatellitesLayout>
                <div className='mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 mt-6'>
                    <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                        <div className='lg:col-span-9 h-[600px]'>
                            <SatelliteMap
                                satellites={
                                    selectedSatData ? [selectedSatData] : []
                                }
                                selectedSatellite={satelliteId || null}
                                onPositionUpdate={setSatellitePosition}
                            />
                        </div>
                        <div className='lg:col-span-3'>
                            <SatelliteInfoCard
                                satellite={selectedSatData || null}
                                isLoading={isLoading}
                                onEdit={handleEditSatellite}
                                position={satellitePosition}
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
                        <div className='relative z-10 w-full max-w-xl rounded-lg border border-[#13181D] bg-[#141B23] p-6 shadow-xl'>
                            <h3 className='text-xl font-semibold text-white mb-4'>
                                Edit TLE
                            </h3>

                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                                        TLE (Two-Line Element Set)
                                    </label>
                                    <textarea
                                        value={newTLE}
                                        onChange={(e) =>
                                            setNewTLE(e.target.value)
                                        }
                                        rows={6}
                                        className='w-full bg-[#0B0F14] border border-[#13181D] rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#11435D]'
                                        placeholder='Line 1&#10;Line 2'
                                    />
                                </div>
                            </div>

                            <div className='mt-6 flex items-center justify-end gap-3'>
                                <Button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingSatellite(null);
                                    }}
                                    variant='secondary'
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (!editingSatellite) return;
                                        updateSatelliteMutation.mutate({
                                            id: editingSatellite.id,
                                            tle: newTLE,
                                        });
                                    }}
                                    disabled={
                                        updateSatelliteMutation.isLoading ||
                                        !newTLE.trim()
                                    }
                                    variant='primary'
                                    loading={updateSatelliteMutation.isLoading}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </SatellitesLayout>
        </>
    );
};

export default SatelliteTracking;
