import { type NextPage } from 'next';
import Head from 'next/head';
import Layout from '~/components/Layout';
import GroundStationCard from '~/components/GroundStationCard';

const GroundStations: NextPage = () => {
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
                        {/* Single card for preview */}
                        <div className='max-w-sm'>
                            <GroundStationCard
                                id='GS-001'
                                name='Buenos Aires Ground Station'
                                latitude={-34.6037}
                                longitude={-58.3816}
                                altitude={25}
                            />
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default GroundStations;
