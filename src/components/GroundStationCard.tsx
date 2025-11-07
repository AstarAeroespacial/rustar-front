import React from 'react';
import Link from 'next/link';

interface GroundStationCardProps {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    altitude: number;
}

const GroundStationCard: React.FC<GroundStationCardProps> = ({
    id,
    name,
    latitude,
    longitude,
    altitude,
}) => {
    return (
        <Link href={`/ground-stations/${id}`}>
            <div className='bg-[#141B23] rounded-xl border border-[#13181D] p-5 shadow-md hover:border-[#11435d] transition-colors cursor-pointer'>
                {/* Header */}
                <div className='mb-5'>
                    <h2 className='text-lg font-semibold text-white tracking-wide'>
                        {name}
                    </h2>
                </div>

                {/* Coordinates Section */}
                <div className='space-y-3'>
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <div className='text-gray-400 text-sm'>
                                Latitude
                            </div>
                            <div className='text-white font-medium text-sm'>
                                {latitude.toFixed(4)}°
                            </div>
                        </div>
                        <div>
                            <div className='text-gray-400 text-sm'>
                                Longitude
                            </div>
                            <div className='text-white font-medium text-sm'>
                                {longitude.toFixed(4)}°
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className='text-gray-400 text-sm'>Altitude</div>
                        <div className='text-white font-medium text-sm'>
                            {altitude} m
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default GroundStationCard;
