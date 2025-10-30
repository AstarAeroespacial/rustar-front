import { type NextPage } from 'next';
import Head from 'next/head';
import Layout from '~/components/Layout';
import GroundStationCard from '~/components/GroundStationCard';
import { api } from '~/utils/api';

const GroundStations: NextPage = () => {
    const { data: groundStations } = api.groundStation.getGroundStations.useQuery();

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
                            {groundStations?.map((station) => (
                                <GroundStationCard
                                    key={station.id}
                                    id={station.id}
                                    name={station.name}
                                    latitude={station.location.latitude}
                                    longitude={station.location.longitude}
                                    altitude={station.location.altitude}
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
