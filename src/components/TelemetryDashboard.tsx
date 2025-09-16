import { useState } from 'react';

interface DashboardPanel {
    id: string;
    title: string;
    url: string;
    description: string;
    icon: string;
}

export default function TelemetryDashboard() {
    const [loadingPanels, setLoadingPanels] = useState<Set<string>>(
        new Set(['panel1', 'panel2', 'panel3', 'panel4', 'panel5'])
    );

    const panels: DashboardPanel[] = [
        {
            id: 'panel1',
            title: 'Satellite Telemetry',
            url: 'http://localhost:3000/d-solo/969ec7ae-42e2-4c86-a870-ac1a207ea9bf/rustar?orgId=1&from=1757960828850&to=1758047228850&timezone=browser&refresh=5m&panelId=1&__feature.dashboardSceneSolo=true',
            description: 'Real-time satellite health monitoring',
            icon: '🛰️',
        },
        {
            id: 'panel2',
            title: 'Thermal & Power Metrics',
            url: 'http://localhost:3000/d-solo/969ec7ae-42e2-4c86-a870-ac1a207ea9bf/rustar?orgId=1&from=1757960828850&to=1758047228850&timezone=browser&refresh=5m&panelId=2&__feature.dashboardSceneSolo=true',
            description: 'Temperature, voltage, current and battery trends',
            icon: '🌡️',
        },
        {
            id: 'panel3',
            title: 'Power Systems',
            url: 'http://localhost:3000/d-solo/969ec7ae-42e2-4c86-a870-ac1a207ea9bf/rustar?orgId=1&from=1757960828850&to=1758047228850&timezone=browser&refresh=5m&panelId=4&__feature.dashboardSceneSolo=true',
            description: 'Voltage, current and power consumption metrics',
            icon: '⚡',
        },
        {
            id: 'panel4',
            title: 'Battery Status',
            url: 'http://localhost:3000/d-solo/969ec7ae-42e2-4c86-a870-ac1a207ea9bf/rustar?orgId=1&from=1757960828850&to=1758047228850&timezone=browser&refresh=5m&panelId=3&__feature.dashboardSceneSolo=true',
            description: 'Battery health, charge level and status monitoring',
            icon: '🔋',
        },
        {
            id: 'panel5',
            title: 'Temperature Monitoring',
            url: 'http://localhost:3000/d-solo/969ec7ae-42e2-4c86-a870-ac1a207ea9bf/rustar?orgId=1&from=1757962852774&to=1758049252774&timezone=browser&refresh=5m&panelId=5&__feature.dashboardSceneSolo=true',
            description: 'Real-time temperature sensors and thermal analysis',
            icon: '🌡️',
        },
    ];

    const handlePanelLoad = (panelId: string) => {
        setLoadingPanels((prev) => {
            const newSet = new Set(prev);
            newSet.delete(panelId);
            return newSet;
        });
    };

    const handlePanelError = (panelId: string) => {
        setLoadingPanels((prev) => {
            const newSet = new Set(prev);
            newSet.delete(panelId);
            return newSet;
        });
    };

    return (
        <div className='space-y-6 lg:space-y-8'>
            {/* Primary Panel - Full Width Priority */}
            <div>
                {panels
                    .filter((panel) => panel.id === 'panel1')
                    .map((panel) => (
                        <div
                            key={panel.id}
                            className='group relative overflow-hidden rounded-lg bg-slate-900/90 border-2 border-slate-700 shadow-lg transition-all duration-200 hover:border-slate-600'
                        >
                            {/* Panel Header*/}
                            <div className='relative z-10 flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-6 bg-slate-800/95 border-b border-slate-600 space-y-3 sm:space-y-0'>
                                <div className='flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1'>
                                    <div className='w-8 h-8 lg:w-10 lg:h-10 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600 flex-shrink-0'>
                                        <span className='text-lg lg:text-xl'>
                                            {panel.icon}
                                        </span>
                                    </div>
                                    <div className='min-w-0 flex-1'>
                                        <div className='flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 mb-1'>
                                            <h3 className='text-base lg:text-lg font-semibold text-slate-100 truncate'>
                                                {panel.title}
                                            </h3>
                                        </div>
                                        <p className='text-xs lg:text-sm text-slate-400 font-mono truncate'>
                                            {panel.description}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    {loadingPanels.has(panel.id) && (
                                        <div className='h-4 w-4 animate-spin rounded border border-slate-600 border-t-slate-400'></div>
                                    )}
                                    <div className='flex items-center space-x-2 text-xs font-mono text-slate-400'>
                                        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                        <span>ACTIVE</span>
                                    </div>
                                </div>
                            </div>

                            {/* Panel Content - Primary Telemetry */}
                            <div className='relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-slate-900'>
                                {loadingPanels.has(panel.id) && (
                                    <div className='absolute inset-0 z-20 flex items-center justify-center bg-slate-900/95'>
                                        <div className='text-center'>
                                            <div className='mb-3 h-8 w-8 animate-spin rounded border-2 border-slate-700 border-t-slate-400 mx-auto'></div>
                                            <p className='text-sm font-mono text-slate-400'>
                                                INITIALIZING TELEMETRY SYSTEMS
                                            </p>
                                            <div className='mt-2 text-xs text-slate-500 font-mono'>
                                                Establishing satellite link...
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <iframe
                                    src={panel.url}
                                    title={panel.title}
                                    className='h-full w-full border-0 rounded-b-2xl'
                                    onLoad={() => handlePanelLoad(panel.id)}
                                    onError={() => handlePanelError(panel.id)}
                                    sandbox='allow-same-origin allow-scripts'
                                    loading='lazy'
                                />
                            </div>
                        </div>
                    ))}
            </div>

            {/* Secondary Panels - Responsive Grid Layout */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6'>
                {panels
                    .filter((panel) => panel.id !== 'panel1')
                    .map((panel) => (
                        <div
                            key={panel.id}
                            className='group relative overflow-hidden rounded-lg bg-slate-900/90 border border-slate-700 shadow-lg transition-all duration-200 hover:border-slate-600'
                        >
                            {/* Panel Header */}
                            <div className='relative z-10 flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-5 bg-slate-800/95 border-b border-slate-700 space-y-2 sm:space-y-0'>
                                <div className='flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1'>
                                    <div className='w-8 h-8 lg:w-10 lg:h-10 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600 flex-shrink-0'>
                                        <span className='text-base lg:text-lg'>
                                            {panel.icon}
                                        </span>
                                    </div>
                                    <div className='min-w-0 flex-1'>
                                        <h3 className='text-sm lg:text-base font-semibold text-slate-100 truncate'>
                                            {panel.title}
                                        </h3>
                                        <p className='text-xs lg:text-sm text-slate-400 font-mono truncate'>
                                            {panel.description}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center space-x-2 lg:space-x-3'>
                                    {loadingPanels.has(panel.id) && (
                                        <div className='h-3 w-3 lg:h-4 lg:w-4 animate-spin rounded border border-slate-600 border-t-slate-400'></div>
                                    )}
                                    <div className='flex items-center space-x-1 lg:space-x-2 text-xs font-mono text-slate-400'>
                                        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                        <span className='hidden sm:inline'>
                                            ACTIVE
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Panel Content */}
                            <div className='relative h-64 sm:h-72 lg:h-80 overflow-hidden bg-slate-900'>
                                {loadingPanels.has(panel.id) && (
                                    <div className='absolute inset-0 z-20 flex items-center justify-center bg-slate-900/95'>
                                        <div className='text-center px-4'>
                                            <div className='mb-2 h-5 w-5 lg:h-6 lg:w-6 animate-spin rounded border border-slate-700 border-t-slate-400 mx-auto'></div>
                                            <p className='text-xs lg:text-sm font-mono text-slate-500'>
                                                LOADING SUBSYSTEM
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <iframe
                                    src={panel.url}
                                    title={panel.title}
                                    className='h-full w-full border-0 rounded-b-2xl'
                                    onLoad={() => handlePanelLoad(panel.id)}
                                    onError={() => handlePanelError(panel.id)}
                                    sandbox='allow-same-origin allow-scripts'
                                    loading='lazy'
                                />
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
