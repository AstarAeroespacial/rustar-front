import { type NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '~/components/Layout';

const GroundStationDetail: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <>
            <Head>
                <title>Ground Station {id} - Rustar</title>
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
                <div className='py-6'>
                    <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
                        {/* Ground Station Details */}
                        <div className='bg-dark-900 rounded-xl border border-dark-700 p-5 shadow-md'>
                            {/* Header */}
                            <div className='mb-5'>
                                <h2 className='text-lg font-semibold text-white tracking-wide'>
                                    Ground Station Name
                                </h2>
                                <p className='text-dark-400 text-sm font-mono'>{id}</p>
                            </div>

                            {/* Coordinates Section */}
                            <div className='space-y-3'>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div>
                                        <div className='text-dark-400 text-sm'>Latitude</div>
                                        <div className='text-white font-medium text-sm'>--°</div>
                                    </div>
                                    <div>
                                        <div className='text-dark-400 text-sm'>Longitude</div>
                                        <div className='text-white font-medium text-sm'>--°</div>
                                    </div>
                                </div>

                                <div>
                                    <div className='text-dark-400 text-sm'>Altitude</div>
                                    <div className='text-white font-medium text-sm'>-- m</div>
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
