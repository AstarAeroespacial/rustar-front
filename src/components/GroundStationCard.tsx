import React from 'react';

interface GroundStationCardProps {
    id?: string;
    name?: string;
    latitude?: number;
    longitude?: number;
    altitude?: number;
}

const GroundStationCard: React.FC<GroundStationCardProps> = ({
    id = 'GS-001',
    name = 'Ground Station Name',
    latitude = 0,
    longitude = 0,
    altitude = 0,
}) => {
    return (
        <div className='bg-dark-900 rounded-xl border border-dark-700 p-5 shadow-md'>
            {/* Header */}
            <div className='mb-5'>
                <h2 className='text-lg font-semibold text-white tracking-wide'>
                    {name}
                </h2>
                <p className='text-dark-400 text-sm font-mono'>{id}</p>
            </div>

            {/* Coordinates Section */}
            <div className='space-y-3'>
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <div className='text-dark-400 text-sm'>Latitude</div>
                        <div className='text-white font-medium text-sm'>{latitude.toFixed(4)}°</div>
                    </div>
                    <div>
                        <div className='text-dark-400 text-sm'>Longitude</div>
                        <div className='text-white font-medium text-sm'>{longitude.toFixed(4)}°</div>
                    </div>
                </div>

                <div>
                    <div className='text-dark-400 text-sm'>Altitude</div>
                    <div className='text-white font-medium text-sm'>{altitude} m</div>
                </div>
            </div>
        </div>
    );
};

export default GroundStationCard;
