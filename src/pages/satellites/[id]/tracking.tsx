import { type NextPage } from 'next';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { format } from 'date-fns';
import SatellitesLayout from '~/components/SatellitesLayout';
import { api } from '~/utils/api';
import PassTimeline from '~/components/PassTimeline';

const SatellitePasses: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const satelliteId = id as string;

    // State for hover interaction between table and timeline
    const [hoveredPassId, setHoveredPassId] = useState<string | null>(null);

    // Fetch single satellite by ID
    const { data: selectedSatData } = api.satellite.getSatelliteById.useQuery(
        { id: satelliteId },
        { enabled: !!satelliteId }
    );

    // Fetch satellite passes for the selected satellite
    const timeframe = useMemo(() => {
        const now = new Date();

        // Start of today (00:00:00)
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        // End of tomorrow (23:59:59.999)
        const endOfTomorrow = new Date(now);
        endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
        endOfTomorrow.setHours(23, 59, 59, 999);

        return {
            startTime: startOfToday.getTime(),
            endTime: endOfTomorrow.getTime(),
        };
    }, []);

    const { data: passes } = api.satellite.getSatellitePasses.useQuery(
        {
            satelliteId: satelliteId,
            startTime: timeframe.startTime,
            endTime: timeframe.endTime,
        },
        { enabled: !!satelliteId }
    );

    // Sort passes by AOS time
    const sortedPasses = useMemo(() => {
        if (!passes) return [];
        return [...passes].sort((a, b) => a.aos - b.aos);
    }, [passes]);

    // Transform passes to generic timeline items
    const timelineItems = useMemo(() => {
        return sortedPasses.map((pass) => ({
            id: pass.id,
            groupId: pass.groundStationId,
            groupName: pass.groundStationName,
            startTime: pass.aos,
            endTime: pass.los,
        }));
    }, [sortedPasses]);

    // Helper function to format duration
    const formatDuration = (aos: number, los: number) => {
        const durationMinutes = Math.round((los - aos) / 60000);
        return `${durationMinutes} min`;
    };

    return (
        <>
            <Head>
                <title>
                    {selectedSatData?.name || 'Satellite'} - Tracking
                </title>
                <meta
                    name='description'
                    content='Satellite pass predictions'
                />
                <link
                    rel='icon'
                    href='/favicon.ico'
                />
            </Head>
            <SatellitesLayout>
                <div className='py-6'>
                    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                        <h1 className='text-3xl font-bold text-white'>
                            Tracking
                        </h1>
                    </div>

                    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8'>
                        <PassTimeline
                            items={timelineItems}
                            startTime={timeframe.startTime}
                            endTime={timeframe.endTime}
                            hoveredItemId={hoveredPassId}
                            onItemHover={setHoveredPassId}
                            tooltipContent={(item) => item.groupName}
                        />
                    </div>

                    {/* Pass Details Table */}
                    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8'>
                        <div className='bg-[#141B23] rounded-xl border border-[#13181D] shadow-md overflow-hidden'>
                            <table className='min-w-full divide-y divide-[#13181D]'>
                                <thead className='bg-[#0B0D10]'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                            Ground Station
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                            AOS
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                            LOS
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                            Duration
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                            Max Elevation
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-[#13181D]'>
                                    {sortedPasses.map((pass) => (
                                        <tr
                                            key={pass.id}
                                            onMouseEnter={() => setHoveredPassId(pass.id)}
                                            onMouseLeave={() => setHoveredPassId(null)}
                                            className={`transition-colors cursor-pointer ${hoveredPassId === pass.id
                                                ? 'bg-[#1a2632]'
                                                : 'hover:bg-[#1a2632]/50'
                                                }`}
                                        >
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-white'>
                                                {pass.groundStationName}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                                {format(new Date(pass.aos), 'MMM d, HH:mm:ss')}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                                {format(new Date(pass.los), 'MMM d, HH:mm:ss')}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                                {formatDuration(pass.aos, pass.los)}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                                {pass.maxElevation.toFixed(1)}°
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </SatellitesLayout>
        </>
    );
};

export default SatellitePasses;
