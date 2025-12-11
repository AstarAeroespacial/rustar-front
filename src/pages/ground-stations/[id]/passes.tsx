import { type NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, useState, useEffect } from 'react';
import { format } from 'date-fns';
import GroundStationLayout from '~/components/GroundStationLayout';
import PassTimeline from '~/components/PassTimeline';
import { api } from '~/utils/api';
import { Button } from '~/components/ui/Button';

const GroundStationPasses: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const groundStationId = id as string;

    const [hoveredPassId, setHoveredPassId] = useState<string | null>(null);
    const [trackingJobs, setTrackingJobs] = useState<Record<string, boolean>>(
        {}
    );

    // State to force recalculation of timeframe
    const [refreshKey, setRefreshKey] = useState(0);

    const { data: station } = api.groundStation.getGroundStationById.useQuery(
        { id: groundStationId },
        { enabled: !!groundStationId }
    );

    // Recalculate timeframe at midnight every day
    useEffect(() => {
        const scheduleNextUpdate = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            // Calculate time until next midnight
            const timeUntilMidnight = tomorrow.getTime() - now.getTime();

            // Schedule refresh at midnight
            return setTimeout(() => {
                setRefreshKey((prev) => prev + 1);
                // Recursively schedule next update
                scheduleNextUpdate();
            }, timeUntilMidnight);
        };

        const timeout = scheduleNextUpdate();

        return () => clearTimeout(timeout);
    }, [refreshKey]);

    // Calculate time range (from now until end of tomorrow)
    const timeframe = useMemo(() => {
        const now = new Date();

        const startTime = now.getTime();

        // End of tomorrow (23:59:59.999)
        const endOfTomorrow = new Date(now);
        endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
        endOfTomorrow.setHours(23, 59, 59, 999);

        return {
            startTime: startTime,
            endTime: endOfTomorrow.getTime(),
        };
    }, [refreshKey]); // Recalculate when refreshKey changes

    // Fetch passes for this ground station
    const { data: passes } = api.groundStation.getGroundStationPasses.useQuery(
        {
            groundStationId: groundStationId,
            startTime: timeframe.startTime,
            endTime: timeframe.endTime,
        },
        {
            enabled: !!groundStationId,
            staleTime: 24 * 60 * 60 * 1000, // Consider data fresh for 24 hours
            refetchOnMount: false, // Don't refetch when component mounts
            refetchOnWindowFocus: false, // Don't refetch when window regains focus
        }
    );

    // Sort passes by AOS time
    const sortedPasses = useMemo(() => {
        if (!passes) return [];
        return [...passes].sort((a, b) => a.aos - b.aos);
    }, [passes]);

    // Transform passes to timeline items
    const timelineItems = useMemo(() => {
        return sortedPasses.map((pass) => ({
            id: pass.id,
            groupId: pass.satelliteId,
            groupName: pass.satelliteName,
            startTime: pass.aos,
            endTime: pass.los,
        }));
    }, [sortedPasses]);

    // Helper function to format duration
    const formatDuration = (aos: number, los: number) => {
        const durationMinutes = Math.round((los - aos) / 60000);
        return `${durationMinutes} min`;
    };

    const handleTrack = async (pass: (typeof sortedPasses)[0]) => {
        try {
            setTrackingJobs((prev) => ({ ...prev, [pass.id]: true }));

            const requestBody = {
                gs_id: groundStationId,
                sat_id: pass.satelliteId,
                start: new Date(pass.aos).toISOString(),
                end: new Date(pass.los).toISOString(),
                commands: [],
            };

            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `Failed to create job: ${response.status} - ${
                        errorData.error || 'Unknown error'
                    }`
                );
            }
        } catch (error) {
            console.error('Error creating job:', error);
            // Re-enable the button on error
            setTrackingJobs((prev) => ({ ...prev, [pass.id]: false }));
            alert(
                `Failed to create tracking job: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    };

    return (
        <>
            <Head>
                <title>{station?.name ?? 'Ground Station'} - Passes</title>
                <meta
                    name='description'
                    content='Ground station passes'
                />
                <link
                    rel='icon'
                    href='/favicon.ico'
                />
            </Head>
            <GroundStationLayout>
                <div className='py-6'>
                    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                        <h1 className='text-3xl font-bold text-white'>
                            Passes
                        </h1>
                    </div>

                    {/* Pass Timeline Section */}
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
                            <div className='overflow-x-auto'>
                                <table className='min-w-full divide-y divide-[#13181D]'>
                                    <thead className='bg-[#0B0D10]'>
                                        <tr>
                                            <th className='px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                                                Satellite
                                            </th>
                                            <th className='px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                                                AOS
                                            </th>
                                            <th className='px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                                                LOS
                                            </th>
                                            <th className='px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                                                Duration
                                            </th>
                                            <th className='px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                                                Max Elevation
                                            </th>
                                            <th className='px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-[#13181D]'>
                                        {sortedPasses.map((pass) => (
                                            <tr
                                                key={pass.id}
                                                onMouseEnter={() =>
                                                    setHoveredPassId(pass.id)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredPassId(null)
                                                }
                                                className={`transition-colors cursor-pointer ${
                                                    hoveredPassId === pass.id
                                                        ? 'bg-[#1a2632]'
                                                        : 'hover:bg-[#1a2632]/50'
                                                }`}
                                            >
                                                <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-white text-center'>
                                                    {pass.satelliteName}
                                                </td>
                                                <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center'>
                                                    {format(
                                                        new Date(pass.aos),
                                                        'MMM d, HH:mm:ss'
                                                    )}
                                                </td>
                                                <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center'>
                                                    {format(
                                                        new Date(pass.los),
                                                        'MMM d, HH:mm:ss'
                                                    )}
                                                </td>
                                                <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center'>
                                                    {formatDuration(
                                                        pass.aos,
                                                        pass.los
                                                    )}
                                                </td>
                                                <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center'>
                                                    {pass.maxElevation.toFixed(
                                                        1
                                                    )}
                                                    °
                                                </td>
                                                <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-center'>
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleTrack(pass);
                                                        }}
                                                        disabled={
                                                            trackingJobs[
                                                                pass.id
                                                            ]
                                                        }
                                                        className='bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded text-xs font-medium'
                                                    >
                                                        {trackingJobs[pass.id]
                                                            ? 'To be tracked'
                                                            : 'Track'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </GroundStationLayout>
        </>
    );
};

export default GroundStationPasses;
