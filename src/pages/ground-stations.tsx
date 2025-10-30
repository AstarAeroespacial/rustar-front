import { type NextPage } from 'next';
import Head from 'next/head';
import Layout from '~/components/Layout';
import GroundStationCard from '~/components/GroundStationCard';

const GroundStations: NextPage = () => {
    // Placeholder data for ground stations
    const placeholderStations = [
        {
            id: 'GS-001',
            name: 'Buenos Aires Ground Station',
            latitude: -34.6037,
            longitude: -58.3816,
            altitude: 25,
        },
        {
            id: 'GS-002',
            name: 'Córdoba Ground Station',
            latitude: -31.4201,
            longitude: -64.1888,
            altitude: 390,
        },
        {
            id: 'GS-003',
            name: 'Mendoza Ground Station',
            latitude: -32.8895,
            longitude: -68.8458,
            altitude: 760,
        },
        {
            id: 'GS-004',
            name: 'Ushuaia Ground Station',
            latitude: -54.8019,
            longitude: -68.3030,
            altitude: 30,
        },
    ];

    return (
        <>
            <Head>
                <title>Ground Stations - Rustar</title>
                <meta
                    name='description'
                    content='Ground station management and monitoring'
                />
                <link
                    rel='icon'
                    href='/favicon.ico'
                />
            </Head>
            <Layout>
                <div className='py-6'>
                    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                        {/* Grid of ground station cards */}
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                            {placeholderStations.map((station) => (
                                <GroundStationCard
                                    key={station.id}
                                    id={station.id}
                                    name={station.name}
                                    latitude={station.latitude}
                                    longitude={station.longitude}
                                    altitude={station.altitude}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default GroundStations;
