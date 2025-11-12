import { type NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SatellitesLayout from '~/components/SatellitesLayout';
import { api } from '~/utils/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SatellitesMonitoring: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const satelliteId = id as string;

    // Fetch satellite data
    const { data: selectedSatData } = api.satellite.getSatelliteById.useQuery(
        { id: satelliteId },
        { enabled: !!satelliteId }
    );

    const [selectedSatellite, setSelectedSatellite] = useState('ASTAR-001');
    const [telemetryType, setTelemetryType] = useState('Housekeeping');
    const [updateInterval, setUpdateInterval] = useState(5);
    const [isReceiving, setIsReceiving] = useState(true);

    const { data: telemetryData, refetch } =
        api.satellite.getLatestTelemetry.useQuery(
            { satellite: selectedSatellite, amount: 20 },
            { enabled: !!selectedSatellite }
        );

    // Auto-refresh telemetry data
    useEffect(() => {
        if (!isReceiving) return;

        const interval = setInterval(() => {
            void refetch();
        }, updateInterval * 1000);

        return () => clearInterval(interval);
    }, [isReceiving, updateInterval, refetch]);

    // Prepare chart data
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#e2e8f0',
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#94a3b8',
                },
                grid: {
                    color: '#475569',
                },
            },
            y: {
                ticks: {
                    color: '#94a3b8',
                },
                grid: {
                    color: '#475569',
                },
            },
        },
    };

    const temperatureData = {
        labels:
            telemetryData?.map(
                (_, index) => `T-${telemetryData.length - index}`
            ) || [],
        datasets: [
            {
                label: 'Temperature (°C)',
                data: telemetryData?.map((d) => d.temperature) || [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const voltageData = {
        labels:
            telemetryData?.map(
                (_, index) => `T-${telemetryData.length - index}`
            ) || [],
        datasets: [
            {
                label: 'Voltage (V)',
                data: telemetryData?.map((d) => d.voltage) || [],
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const currentTelemetry = telemetryData?.[0];

    return (
        <>
            <Head>
                <title>
                    {selectedSatData?.name || 'Satellite'} - Telemetry
                </title>
                <meta
                    name='description'
                    content='Satellite telemetry monitoring'
                />
            </Head>
            <SatellitesLayout>
                <div className='py-6'>
                    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                        <h1 className='text-3xl font-bold text-white'>
                            Telemetry
                        </h1>
                    </div>

                    {/* Update Interval Controls */}
                    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8'>
                        <div className='bg-[#141B23] rounded-lg border border-[#13181D] p-4 mb-8'>
                            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                                <div className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-sm font-medium text-gray-300 whitespace-nowrap'>
                                            Update Interval:
                                        </span>
                                        <select
                                            value={updateInterval}
                                            onChange={(e) =>
                                                setUpdateInterval(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className='bg-[#0b0f14] border border-[#13181D] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm'
                                        >
                                            <option value={1}>1s</option>
                                            <option value={5}>5s</option>
                                            <option value={10}>10s</option>
                                            <option value={30}>30s</option>
                                        </select>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <span className='text-sm font-medium text-gray-300 whitespace-nowrap'>
                                            Status:
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded text-xs font-medium ${
                                                isReceiving
                                                    ? 'bg-green-900/50 text-green-400 border border-green-600'
                                                    : 'bg-red-900/50 text-red-400 border border-red-600'
                                            }`}
                                        >
                                            {isReceiving
                                                ? 'Receiving'
                                                : 'Stopped'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsReceiving(!isReceiving)}
                                    className={`px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                                        isReceiving
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    {isReceiving
                                        ? 'Stop Reception'
                                        : 'Start Reception'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                        <div className='space-y-6'>
                            {/* Real-time Charts */}
                            <div className='bg-[#141B23] rounded-lg border border-[#13181D] p-4 sm:p-6'>
                                <h2 className='text-lg font-semibold text-white mb-4'>
                                    Real-time Charts
                                </h2>

                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                    <div>
                                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2'>
                                            <h3 className='text-white font-medium'>
                                                Temperature
                                            </h3>
                                            <span className='text-2xl font-bold text-blue-400'>
                                                {currentTelemetry?.temperature.toFixed(
                                                    1
                                                ) || '--'}
                                                °C
                                            </span>
                                        </div>
                                        <div className='text-sm text-gray-400 mb-4'>
                                            Last 30 minutes • +4.1%
                                        </div>
                                        <div style={{ height: '200px' }}>
                                            <Line
                                                data={temperatureData}
                                                options={chartOptions}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2'>
                                            <h3 className='text-white font-medium'>
                                                Voltage
                                            </h3>
                                            <span className='text-2xl font-bold text-green-400'>
                                                {currentTelemetry?.voltage.toFixed(
                                                    1
                                                ) || '--'}
                                                V
                                            </span>
                                        </div>
                                        <div className='text-sm text-gray-400 mb-4'>
                                            Last 30 minutes • -0.2%
                                        </div>
                                        <div style={{ height: '200px' }}>
                                            <Line
                                                data={voltageData}
                                                options={chartOptions}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Raw Telemetry Data */}
                            <div className='bg-[#141B23] rounded-lg border border-[#13181D] p-4 sm:p-6'>
                                <h2 className='text-lg font-semibold text-white mb-4'>
                                    Raw Telemetry Data
                                </h2>

                                <div className='bg-[#0B0F14] rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm text-green-400 max-h-40 overflow-y-auto overflow-x-auto'>
                                    {telemetryData
                                        ?.slice(0, 5)
                                        .map((data, index) => (
                                            <div
                                                key={index}
                                                className='mb-1 whitespace-nowrap'
                                            >
                                                {new Date(
                                                    data.timestamp * 1000
                                                ).toISOString()}{' '}
                                                | PKT_ID: {index + 1} |
                                                DATA_SIZE: 128 bytes
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Received Telemetry Packets */}
                            <div className='bg-[#141B23] rounded-lg border border-[#13181D] p-4 sm:p-6'>
                                <h2 className='text-lg font-semibold text-white mb-4'>
                                    Received Telemetry Packets
                                </h2>

                                <div className='overflow-x-auto -mx-4 sm:mx-0'>
                                    <div className='inline-block min-w-full align-middle'>
                                        <table className='min-w-full divide-y divide-[#13181D]'>
                                            <thead>
                                                <tr>
                                                    <th className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                                                        Timestamp
                                                    </th>
                                                    <th className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                                                        Packet ID
                                                    </th>
                                                    <th className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                                                        Size
                                                    </th>
                                                    <th className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className='divide-y divide-[#13181D]'>
                                                {telemetryData
                                                    ?.slice(0, 5)
                                                    .map((data, index) => (
                                                        <tr key={index}>
                                                            <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-white'>
                                                                {new Date(
                                                                    data.timestamp *
                                                                        1000
                                                                ).toLocaleString()}
                                                            </td>
                                                            <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                                                {index + 1}
                                                            </td>
                                                            <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                                                128 bytes
                                                            </td>
                                                            <td className='px-4 sm:px-6 py-4 whitespace-nowrap'>
                                                                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-900/50 text-green-400 border border-green-600'>
                                                                    Received
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SatellitesLayout>
        </>
    );
};

export default SatellitesMonitoring;
