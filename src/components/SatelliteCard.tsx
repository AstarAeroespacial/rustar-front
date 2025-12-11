import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { Satellite } from '~/types/api';

interface SatelliteCardProps {
    satellite: Satellite;
}

const SatelliteCard: React.FC<SatelliteCardProps> = ({ satellite }) => {
    if (!satellite.last_contact) {
        satellite.last_contact = new Date(
            Date.now() - (3 + Math.random() * 3) * 60 * 60 * 1000
        );
    }

    return (
        <Link href={`/satellites/${satellite.id}`}>
            <div className='bg-[#141B23] rounded-xl border border-[#13181D] p-5 shadow-md hover:border-[#11435d] transition-colors cursor-pointer'>
                {/* Header */}
                <div className='mb-5'>
                    <h2 className='text-lg font-semibold text-white tracking-wide'>
                        {satellite.name}
                    </h2>
                    <p className='text-dark-400 text-sm font-mono'>
                        {satellite.id}
                    </p>
                </div>

                {/* Info Section */}
                <div className='space-y-3'>
                    <div>
                        <div className='text-gray-400 text-sm'>
                            Last contact
                        </div>
                        <div className='text-white font-medium text-sm'>
                            {formatDistanceToNow(
                                satellite.last_contact instanceof Date
                                    ? satellite.last_contact
                                    : new Date(satellite.last_contact),
                                { addSuffix: true }
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SatelliteCard;
