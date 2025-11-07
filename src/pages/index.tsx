import { type NextPage } from 'next';
import { useState, useMemo } from 'react';
import Layout from '~/components/Layout';
import { api } from '~/utils/api';
import dynamic from 'next/dynamic';
import type { Satellite } from '~/types/api';
import SatelliteInfoCard from '~/components/SatelliteInfoCard';
import PassTimeline from '~/components/PassTimeline';

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
    const [newTLE, setNewTLE] = useState('');
    const [satellitePosition, setSatellitePosition] = useState<{
        latitude: number;
        longitude: number;
        altitude: number;
    } | null>(null);

    // Get the first satellite as default
    const selectedSatData = satellites?.[0];

    // Fetch satellite passes for the selected satellite
    const timeframe = useMemo(() => {
        const now = Date.now();
        return {
            now,
            startTime: now,
            endTime: now + 24 * 60 * 60 * 1000, // 24 hours from now
        };
    }, []);

    const { data: passes } = api.satellite.getSatellitePasses.useQuery(
        {
            satelliteId: selectedSatData?.id ?? 0,
            startTime: timeframe.startTime,
            endTime: timeframe.endTime,
        },
        { enabled: !!selectedSatData }
    );

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
            <Layout>
                <div className='mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 mt-6'>
                    <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                        <div className='lg:col-span-9 h-[600px]'>
                            <SatelliteMap
                                satellites={satellites || []}
                                selectedSatellite={selectedSatData?.id || null}
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

                    {/* Satellite Passes Timeline */}
                    <div className='mt-6'>
                        <h3 className='text-[16px] uppercase tracking-widest text-dark-400 mb-4'>
                            Next Passes
                        </h3>
                        <PassTimeline
                            passes={passes || []}
                            startTime={timeframe.startTime}
                            endTime={timeframe.endTime}
                        />
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
                                Edit TLE
                            </h3>

                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-dark-300 mb-2'>
                                        TLE (Two-Line Element Set)
                                    </label>
                                    <textarea
                                        value={newTLE}
                                        onChange={(e) => setNewTLE(e.target.value)}
                                        rows={6}
                                        className='w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                                        placeholder='Line 1&#10;Line 2'
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
                                    Cancel
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
                                        !newTLE.trim()
                                    }
                                    className='px-4 py-2 rounded-md bg-primary-700/90 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white'
                                >
                                    {updateSatelliteMutation.isLoading
                                        ? 'Saving...'
                                        : 'Save'}
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
