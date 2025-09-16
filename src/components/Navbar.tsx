type ActiveView = 'telemetry' | 'communications' | 'orbital' | 'logs';

interface NavbarProps {
    activeView: ActiveView;
    onViewChange: (view: ActiveView) => void;
}

export default function Navbar({ activeView, onViewChange }: NavbarProps) {
    const navigationItems: { id: ActiveView; label: string }[] = [
        { id: 'telemetry', label: 'TELEMETRY' },
        { id: 'orbital', label: 'ORBITAL TRACKING' },
        { id: 'communications', label: 'COMMUNICATIONS' },
        { id: 'logs', label: 'MISSION LOGS' },
    ];

    return (
        <div className='py-3 lg:py-4'>
            <div className='flex items-center space-x-4 lg:space-x-8 overflow-x-auto'>
                {navigationItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`text-xs lg:text-sm font-mono pb-2 cursor-pointer whitespace-nowrap transition-colors ${
                            activeView === item.id
                                ? 'text-slate-300 border-b-2 border-green-500'
                                : 'text-slate-500 hover:text-slate-400'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
