import React from 'react';
import Link from 'next/link';
import type { Satellite } from '~/types/api';

interface SatelliteCardProps {
    satellite: Satellite;
}

const SatelliteCard: React.FC<SatelliteCardProps> = ({ satellite }) => {
    return (
        <Link href={`/satellites/${satellite.id}`}>
            <div className='bg-[#141B23] rounded-xl border border-[#13181D] p-5 shadow-md hover:border-[#11435d] transition-colors cursor-pointer'>
                {/* Header */}
                <div className='mb-5'>
                    <h2 className='text-lg font-semibold text-white tracking-wide'>
                        {satellite.name}
                    </h2>
                </div>

                {/* Info Section */}
                <div className='space-y-3'>
                    {satellite.tle && (
                        <div>
                            <div className='text-gray-400 text-sm'>
                                TLE Available
                            </div>
                            <div className='text-white font-medium text-sm'>
                                <span className='text-green-500'>✓ Yes</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default SatelliteCard;
