import { type NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '~/components/Layout';
import { api } from '~/utils/api';

// Dynamically import the map component to avoid SSR issues
const GroundStationMap = dynamic(
    () => import('~/components/GroundStationMap'),
    {
        ssr: false,
        loading: () => (
            <div className='h-full bg-[#0B0D10] rounded-lg flex items-center justify-center text-gray-400'>
                Loading map...
            </div>
        ),
    }
);

const GroundStationDetail: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data: station } = api.groundStation.getGroundStationById.useQuery(
        { id: id as string },
        { enabled: !!id }
    );

    return (
        <>
            <Head>
                <title>{station?.name ?? 'Ground Station'} - Rustar</title>
                <meta
                    name='description'
                    content='Ground station details'
                />
                <link
                    rel='icon'
                    href='/favicon.ico'
                />
            </Head>
            <Layout>
                <div className='mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 mt-6'>
                    <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                        <div className='lg:col-span-9 h-[600px]'>
                            {station && (
                                <GroundStationMap
                                    latitude={station.latitude}
                                    longitude={station.longitude}
                                    name={station.name}
                                />
                            )}
                        </div>
                        <div className='lg:col-span-3'>
                            {/* Ground Station Details */}
                            <div className='bg-[#141B23] rounded-xl border border-[#13181D] p-5 shadow-md'>
                                {/* Header */}
                                <div className='mb-5'>
                                    <h2 className='text-lg font-semibold text-white tracking-wide'>
                                        {station?.name ?? 'Loading...'}
                                    </h2>
                                    <p className='text-dark-400 text-sm font-mono'>{station?.id}</p>
                                </div>

                                {/* Coordinates Section */}
                                <div className='space-y-3'>
                                    <div className='grid grid-cols-2 gap-3'>
                                        <div>
                                            <div className='text-gray-400 text-sm'>
                                                Latitude
                                            </div>
                                            <div className='text-white font-medium text-sm'>
                                                {station?.latitude.toFixed(4) ??
                                                    '--'}
                                                °
                                            </div>
                                        </div>
                                        <div>
                                            <div className='text-gray-400 text-sm'>
                                                Longitude
                                            </div>
                                            <div className='text-white font-medium text-sm'>
                                                {station?.longitude.toFixed(
                                                    4
                                                ) ?? '--'}
                                                °
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className='text-gray-400 text-sm'>
                                            Altitude
                                        </div>
                                        <div className='text-white font-medium text-sm'>
                                            {station?.altitude ?? '--'} m
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default GroundStationDetail;
