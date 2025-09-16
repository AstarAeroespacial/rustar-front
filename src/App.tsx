import { useState } from 'react';
import TelemetryDashboard from './components/TelemetryDashboard';
import OrbitalTracking from './components/OrbitalTracking';
import Communications from './components/Communications';
import MissionLogs from './components/MissionLogs';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

type ActiveView = 'telemetry' | 'communications' | 'orbital' | 'logs';

export default function App() {
    const [activeView, setActiveView] = useState<ActiveView>('telemetry');

    const renderView = () => {
        switch (activeView) {
            case 'telemetry':
                return <TelemetryDashboard />;
            case 'orbital':
                return <OrbitalTracking />;
            case 'communications':
                return <Communications />;
            case 'logs':
                return <MissionLogs />;
            default:
                return <TelemetryDashboard />;
        }
    };

    return (
        <div className='min-h-screen bg-slate-900'>
            <Header />
            <div className='border-b border-slate-800 bg-slate-900/95'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <Navbar
                        activeView={activeView}
                        onViewChange={setActiveView}
                    />
                </div>
            </div>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8'>
                {renderView()}
                <Footer />
            </div>
        </div>
    );
}
