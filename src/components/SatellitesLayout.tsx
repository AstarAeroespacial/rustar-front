import React from 'react';
import { Satellite, BarChart3, Terminal, Calendar } from 'lucide-react';
import { useRouter } from 'next/router';
import NavBar from '~/components/NavBar';
import Footer from '~/components/Footer';
import Sidebar from '~/components/Sidebar';
import { api } from '~/utils/api';

interface SatellitesLayoutProps {
    children: React.ReactNode;
}

const SatellitesLayout: React.FC<SatellitesLayoutProps> = ({ children }) => {
    const router = useRouter();
    const { id } = router.query;
    const satelliteId = id ? parseInt(id as string) : undefined;

    // Fetch satellite data once at layout level
    const { data: selectedSatData } = api.satellite.getSatelliteById.useQuery(
        { id: satelliteId! },
        { enabled: satelliteId !== undefined && !isNaN(satelliteId) }
    );

    const menuItems = [
        {
            title: 'Tracking',
            url: satelliteId ? `/satellites/${satelliteId}` : '#',
            icon: <Satellite className='w-5 h-5' />,
        },
        {
            title: 'Monitoring',
            url: satelliteId ? `/satellites/${satelliteId}/monitoring` : '#',
            icon: <BarChart3 className='w-5 h-5' />,
        },
        {
            title: 'Passes',
            url: satelliteId ? `/satellites/${satelliteId}/passes` : '#',
            icon: <Calendar className='w-5 h-5' />,
        },
        {
            title: 'Commands',
            url: satelliteId ? `/satellites/${satelliteId}/commands` : '#',
            icon: <Terminal className='w-5 h-5' />,
        },
    ];

    return (
        <div className='min-h-screen bg-[#0B0F14] flex flex-col'>
            <NavBar />
            <div className='flex flex-1'>
                <Sidebar
                    items={menuItems}
                    satelliteName={selectedSatData?.name}
                />
                <main className='flex-1 overflow-auto pb-8'>{children}</main>
            </div>
            <Footer />
        </div>
    );
};

export default SatellitesLayout;
