import { useState } from 'react';

export default function OrbitalTracking() {
    const [selectedSatellite, setSelectedSatellite] =
        useState<string>('RUSTAR-1');

    const satellites = [
        {
            id: 'RUSTAR-1',
            name: 'RUSTAR-1',
            status: 'ACTIVE',
            altitude: '420 km',
            velocity: '7.66 km/s',
            lat: -34.6037,
            lng: -58.3816,
            nextPass: '14:30 UTC',
        },
        {
            id: 'RUSTAR-2',
            name: 'RUSTAR-2',
            status: 'STANDBY',
            altitude: '435 km',
            velocity: '7.64 km/s',
            lat: 25.2048,
            lng: 55.2708,
            nextPass: '16:45 UTC',
        },
    ];

    return (
        <div className='space-y-6'>
            {/* Orbital Parameters Header */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6'>
                <div className='bg-slate-800/95 border border-slate-700 rounded-lg p-4 lg:p-5'>
                    <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-sm lg:text-base font-mono text-slate-300'>
                            ACTIVE SATELLITES
                        </h3>
                        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    </div>
                    <div className='text-xl lg:text-2xl font-bold text-green-400 font-mono'>
                        {
                            satellites.filter((sat) => sat.status === 'ACTIVE')
                                .length
                        }
                    </div>
                </div>

                <div className='bg-slate-800/95 border border-slate-700 rounded-lg p-4 lg:p-5'>
                    <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-sm lg:text-base font-mono text-slate-300'>
                            ORBITAL PERIOD
                        </h3>
                        <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                    </div>
                    <div className='text-xl lg:text-2xl font-bold text-blue-400 font-mono'>
                        92.8 MIN
                    </div>
                </div>

                <div className='bg-slate-800/95 border border-slate-700 rounded-lg p-4 lg:p-5'>
                    <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-sm lg:text-base font-mono text-slate-300'>
                            NEXT PASS
                        </h3>
                        <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                    </div>
                    <div className='text-xl lg:text-2xl font-bold text-yellow-400 font-mono'>
                        14:30 UTC
                    </div>
                </div>
            </div>

            {/* Main Tracking Interface */}
            <div className='grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6'>
                {/* World Map Section */}
                <div className='xl:col-span-3'>
                    <div className='bg-slate-900/90 border border-slate-700 rounded-lg overflow-hidden'>
                        {/* Map Header */}
                        <div className='flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-5 bg-slate-800/95 border-b border-slate-700 space-y-2 sm:space-y-0'>
                            <div className='flex items-center space-x-3'>
                                <div className='w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600'>
                                    <span className='text-lg'>🌍</span>
                                </div>
                                <div>
                                    <h3 className='text-base lg:text-lg font-semibold text-slate-100'>
                                        Global Satellite Tracking
                                    </h3>
                                    <p className='text-xs lg:text-sm text-slate-400 font-mono'>
                                        Real-time orbital position monitoring
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-center space-x-3'>
                                <div className='flex items-center space-x-2 text-xs font-mono text-slate-400'>
                                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                    <span className='hidden sm:inline'>
                                        TRACKING
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Map Container */}
                        <div className='relative h-64 sm:h-80 lg:h-96 xl:h-[500px] bg-slate-900 overflow-hidden'>
                            <iframe
                                src='http://localhost:3000/d-solo/969ec7ae-42e2-4c86-a870-ac1a207ea9bf/rustar?orgId=1&from=1757965121990&to=1758051521990&timezone=browser&refresh=5m&panelId=7&__feature.dashboardSceneSolo=true'
                                title='Orbital Tracking Map'
                                className='h-full w-full border-0 rounded-b-lg'
                                sandbox='allow-same-origin allow-scripts'
                                loading='lazy'
                            />
                        </div>
                    </div>
                </div>

                {/* Satellite List & Controls */}
                <div className='space-y-4'>
                    {/* Satellite Selection */}
                    <div className='bg-slate-800/95 border border-slate-700 rounded-lg p-4 lg:p-5'>
                        <h3 className='text-sm lg:text-base font-mono text-slate-300 mb-4'>
                            SATELLITE STATUS
                        </h3>
                        <div className='space-y-3'>
                            {satellites.map((satellite) => (
                                <button
                                    key={satellite.id}
                                    onClick={() =>
                                        setSelectedSatellite(satellite.id)
                                    }
                                    className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                                        selectedSatellite === satellite.id
                                            ? 'bg-slate-700 border-green-500 text-slate-100'
                                            : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-500'
                                    }`}
                                >
                                    <div className='flex items-center justify-between mb-1'>
                                        <span className='font-mono text-sm font-semibold'>
                                            {satellite.name}
                                        </span>
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                satellite.status === 'ACTIVE'
                                                    ? 'bg-green-500'
                                                    : 'bg-yellow-500'
                                            }`}
                                        ></div>
                                    </div>
                                    <div className='text-xs font-mono text-slate-400'>
                                        ALT: {satellite.altitude}
                                    </div>
                                    <div className='text-xs font-mono text-slate-400'>
                                        VEL: {satellite.velocity}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selected Satellite Details */}
                    {selectedSatellite && (
                        <div className='bg-slate-800/95 border border-slate-700 rounded-lg p-4 lg:p-5'>
                            <h3 className='text-sm lg:text-base font-mono text-slate-300 mb-4'>
                                ORBITAL DATA
                            </h3>
                            {satellites
                                .filter((sat) => sat.id === selectedSatellite)
                                .map((satellite) => (
                                    <div
                                        key={satellite.id}
                                        className='space-y-3'
                                    >
                                        <div className='flex justify-between'>
                                            <span className='text-xs font-mono text-slate-400'>
                                                LAT:
                                            </span>
                                            <span className='text-xs font-mono text-slate-200'>
                                                {satellite.lat.toFixed(4)}°
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-xs font-mono text-slate-400'>
                                                LNG:
                                            </span>
                                            <span className='text-xs font-mono text-slate-200'>
                                                {satellite.lng.toFixed(4)}°
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-xs font-mono text-slate-400'>
                                                ALT:
                                            </span>
                                            <span className='text-xs font-mono text-slate-200'>
                                                {satellite.altitude}
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-xs font-mono text-slate-400'>
                                                VEL:
                                            </span>
                                            <span className='text-xs font-mono text-slate-200'>
                                                {satellite.velocity}
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-xs font-mono text-slate-400'>
                                                NEXT:
                                            </span>
                                            <span className='text-xs font-mono text-slate-200'>
                                                {satellite.nextPass}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* Tracking Controls */}
                    <div className='bg-slate-800/95 border border-slate-700 rounded-lg p-4 lg:p-5'>
                        <h3 className='text-sm lg:text-base font-mono text-slate-300 mb-4'>
                            TRACKING CONTROLS
                        </h3>
                        <div className='space-y-3'>
                            <button className='w-full p-2 bg-green-800 hover:bg-green-700 border border-green-600 rounded text-xs font-mono text-green-200 transition-colors'>
                                START TRACKING
                            </button>
                            <button className='w-full p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded text-xs font-mono text-slate-300 transition-colors'>
                                CENTER ON SATELLITE
                            </button>
                            <button className='w-full p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded text-xs font-mono text-slate-300 transition-colors'>
                                SHOW ORBIT PATH
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
