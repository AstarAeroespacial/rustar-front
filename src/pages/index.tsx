import { type NextPage } from 'next';
import Head from 'next/head';
import Layout from '~/components/Layout';
import SatelliteCard from '~/components/SatelliteCard';
import { api } from '~/utils/api';

const Home: NextPage = () => {
    const { data: satellites } = api.satellite.getSatellites.useQuery();

    const sortedSatellites = satellites?.slice().sort((a, b) => a.id.localeCompare(b.id));

    return (
        <>
            <Head>
                <title>Satellites - Rustar</title>
                <meta
                    name='description'
                    content='Satellite management and monitoring'
                />
                <link
                    rel='icon'
                    href='/favicon.ico'
                />
            </Head>
            <Layout>
                <div className='py-6'>
                    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                        {/* Grid of satellite cards */}
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                            {sortedSatellites?.map((satellite) => (
                                <SatelliteCard
                                    key={satellite.id}
                                    satellite={satellite}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Home;
