export default function Footer() {
    return (
        <div className='mt-8 rounded-lg bg-slate-900/95 border border-slate-700 p-4'>
            <div className='flex flex-col items-start justify-between space-y-3 md:flex-row md:items-center md:space-y-0'>
                <div className='flex items-center space-x-4 text-xs font-mono text-slate-400'>
                    <div className='flex items-center space-x-2'>
                        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                        <span>SYSTEM OPERATIONAL</span>
                    </div>
                    <div className='w-px h-3 bg-slate-600'></div>
                    <span>SYNC: {new Date().toLocaleTimeString()}</span>
                    <div className='w-px h-3 bg-slate-600'></div>
                    <span>REFRESH: 5MIN</span>
                </div>
                <div className='flex items-center space-x-4 text-xs font-mono text-slate-500'>
                    <span>GRAFANA TELEMETRY</span>
                    <div className='w-px h-3 bg-slate-600'></div>
                    <span>RUSTAR-AEROSPACE-2025</span>
                </div>
            </div>
        </div>
    );
}
