export default function Header() {
    return (
        <div className='relative border-b border-slate-800 bg-slate-900/95'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 lg:py-6'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0'>
                    {/* Left Section - Logo & Title */}
                    <div className='flex items-center space-x-3 lg:space-x-4'>
                        <div className='w-12 h-12 lg:w-16 lg:h-16 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center flex-shrink-0'>
                            <img
                                src='/logo.jpg'
                                alt='RustAR'
                                className='rounded-lg'
                            />
                        </div>
                        <div className='min-w-0 flex-1'>
                            <h1 className='text-lg sm:text-xl lg:text-2xl font-bold text-slate-100 font-mono tracking-wide truncate'>
                                RUSTAR GROUND STATION
                            </h1>
                            <p className='text-xs sm:text-sm text-slate-500 font-mono truncate'>
                                SATELLITE TELEMETRY & COMMUNICATIONS SYSTEM
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Status & Controls */}
                    <div className='flex items-center justify-between lg:justify-end space-x-3 lg:space-x-6'>
                        {/* System Status */}
                        <div className='flex items-center space-x-2 lg:space-x-3'>
                            <div className='flex items-center space-x-2'>
                                <div className='w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full'></div>
                                <span className='text-xs lg:text-sm font-mono text-green-400'>
                                    OPERATIONAL
                                </span>
                            </div>
                            <div className='hidden sm:block w-px h-4 bg-slate-700'></div>
                            <div className='hidden sm:block text-xs font-mono text-slate-500'>
                                SYNC: {new Date().toLocaleTimeString()}
                            </div>
                        </div>

                        {/* Control Panel */}
                        <div className='flex items-center space-x-1 lg:space-x-2'>
                            <button className='w-8 h-8 bg-slate-800 border border-slate-700 rounded flex items-center justify-center text-slate-400 hover:text-slate-300 hover:bg-slate-700 transition-colors'>
                                <svg
                                    className='w-4 h-4'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='1.5'
                                        d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                                    />
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='1.5'
                                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
