import Head from 'next/head';
import React from 'react';
import NavBar from '~/components/NavBar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Head>
                <title>Satellite Tracking - Rustar</title>
                <meta
                    name='description'
                    content='Satellite tracking and positioning'
                />
                <link
                    rel='icon'
                    href='/favicon.ico'
                />
            </Head>
            <div className='min-h-screen bg-dark-900'>
                {/* Navigation */}
                <NavBar />

                {/* Main content */}
                <main className='flex-1 px-2 sm:px-3 md:px-4'>{children}</main>
            </div>
        </>
    );
};

export default Layout;
