import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { useRouter } from 'next/router';
import NavBar from '~/components/NavBar';
import Footer from '~/components/Footer';
import Sidebar from '~/components/Sidebar';
import { api } from '~/utils/api';

interface GroundStationLayoutProps {
    children: React.ReactNode;
}

const GroundStationLayout: React.FC<GroundStationLayoutProps> = ({
    children,
}) => {
    const router = useRouter();
    const { id } = router.query;
    const groundStationId = id as string;

    // Fetch ground station data once at layout level
    const { data: stationData } = api.groundStation.getGroundStationById.useQuery(
        { id: groundStationId },
        { enabled: !!groundStationId }
    );

    const menuItems = groundStationId ? [
        {
            title: 'Overview',
            url: `/ground-stations/${groundStationId}`,
            icon: <MapPin className='w-5 h-5' />,
        },
        {
            title: 'Passes',
            url: `/ground-stations/${groundStationId}/passes`,
            icon: <Calendar className='w-5 h-5' />,
        },
    ] : [];

    return (
        <div className='min-h-screen bg-[#0B0F14] flex flex-col'>
            <NavBar />
            <div className='flex flex-1'>
                <Sidebar
                    items={menuItems}
                    title={stationData?.name}
                />
                <main className='flex-1 overflow-auto pb-8'>{children}</main>
            </div>
            <Footer />
        </div>
    );
};

export default GroundStationLayout;
