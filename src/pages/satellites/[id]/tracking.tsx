import { type NextPage } from 'next';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import SatellitesLayout from '~/components/SatellitesLayout';
import { api } from '~/utils/api';
import PassTimeline from '~/components/PassTimeline';

const SatellitePasses: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const satelliteId = id as string;

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
                            passes={passes || []}
                            startTime={timeframe.startTime}
                            endTime={timeframe.endTime}
                        />
                    </div>
                </div>
            </SatellitesLayout>
        </>
    );
};

export default SatellitePasses;
