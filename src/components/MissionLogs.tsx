export default function MissionLogs() {
    return (
        <div className='space-y-6'>
            <div className='bg-slate-900/95 border border-slate-700 rounded-lg p-8'>
                <div className='text-center'>
                    <div className='w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full border-2 border-slate-600 flex items-center justify-center'>
                        <span className='text-2xl'>📋</span>
                    </div>
                    <h2 className='text-xl font-mono text-slate-300 mb-2'>
                        MISSION LOGS
                    </h2>
                    <p className='text-sm text-slate-500 font-mono max-w-md mx-auto'>
                        Mission planning, execution logs, event history, and
                        operational reports will be displayed here.
                    </p>
                    <div className='mt-6 text-xs text-slate-600 font-mono'>
                        Coming soon...
                    </div>
                </div>
            </div>
        </div>
    );
}
