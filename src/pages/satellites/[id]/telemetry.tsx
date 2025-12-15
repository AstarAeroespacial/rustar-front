import { type NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SatellitesLayout from '~/components/SatellitesLayout';
import { toISOStringGMT3, toLocaleStringGMT3 } from '~/utils/dateUtils';
import { api } from '~/utils/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    BarController,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getStats, formatNumber } from '~/utils/statistics';
import { saveAs } from 'file-saver';
import { Button } from '~/components/ui/Button';
import type { TelemetryResponse } from '~/types/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    BarController,
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

    const [updateInterval, setUpdateInterval] = useState(5);
    const [isReceiving, setIsReceiving] = useState(true);

    const { data: telemetryData, refetch } =
        api.satellite.getLatestTelemetry.useQuery(
            { satellite: satelliteId, amount: 20 },
            { enabled: !!satelliteId }
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

    // Reverse data to show oldest to newest
    const reversedData: TelemetryResponse[] = Array.isArray(telemetryData)
        ? [...telemetryData].reverse()
        : [];

    const lastTelemetry =
        reversedData.length > 0
            ? reversedData[reversedData.length - 1]
            : undefined;
    const lastTemp = lastTelemetry?.temperature;
    const lastVolt = lastTelemetry?.voltage;
    const lastCurr = lastTelemetry?.current;
    const lastBatt = lastTelemetry?.battery_level;

    // Statistics
    const tempStats = getStats(reversedData.map((d) => d.temperature));
    const voltStats = getStats(reversedData.map((d) => d.voltage));
    const currStats = getStats(reversedData.map((d) => d.current));
    const battStats = getStats(reversedData.map((d) => d.battery_level));

    // CSV export
    function exportCSV() {
        if (!reversedData.length) return;
        const header = 'timestamp,temperature,voltage,current,battery_level';
        const rows = reversedData.map(
            (d) =>
                `${d.timestamp},${d.temperature},${d.voltage},${d.current},${d.battery_level}`
        );
        const csv = [header, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        saveAs(blob, `telemetry_${satelliteId}.csv`);
    }

    // Ensure chart data is defined
    const temperatureData =
        reversedData.length > 0
            ? {
                  labels: reversedData.map((d) =>
                      new Date(d.timestamp * 1000).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                      })
                  ),
                  datasets: [
                      {
                          label: 'Temperature (°C)',
                          data: reversedData.map((d) => d.temperature),
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          tension: 0.4,
                      },
                  ],
              }
            : { labels: [], datasets: [] };

    const voltageData =
        reversedData.length > 0
            ? {
                  labels: reversedData.map((d) =>
                      new Date(d.timestamp * 1000).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                      })
                  ),
                  datasets: [
                      {
                          label: 'Voltage (V)',
                          data: reversedData.map((d) => d.voltage),
                          borderColor: 'rgb(16, 185, 129)',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          tension: 0.4,
                      },
                  ],
              }
            : { labels: [], datasets: [] };

    const currentData =
        reversedData.length > 0
            ? {
                  labels: reversedData.map((d) =>
                      new Date(d.timestamp * 1000).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                      })
                  ),
                  datasets: [
                      {
                          label: 'Current (A)',
                          data: reversedData.map((d) => d.current),
                          borderColor: 'rgb(251, 191, 36)',
                          backgroundColor: 'rgba(251, 191, 36, 0.1)',
                          tension: 0.4,
                      },
                  ],
              }
            : { labels: [], datasets: [] };

    const batteryData =
        reversedData.length > 0
            ? {
                  labels: reversedData.map((d) =>
                      new Date(d.timestamp * 1000).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                      })
                  ),
                  datasets: [
                      {
                          label: 'Battery Level (%)',
                          data: reversedData.map((d) => d.battery_level),
                          borderColor: 'rgb(168, 85, 247)',
                          backgroundColor: 'rgba(168, 85, 247, 0.1)',
                          tension: 0.4,
                      },
                  ],
              }
            : { labels: [], datasets: [] };

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
                            {/* Export CSV */}
                            <div className='flex flex-wrap gap-4 mb-4 justify-end'>
                                <Button
                                    variant='primary'
                                    onClick={exportCSV}
                                    className='text-sm font-medium'
                                >
                                    Export CSV
                                </Button>
                            </div>

                            {/* Real-time Charts mejorados */}
                            <div className='bg-[#141B23] rounded-lg border border-[#13181D] p-4 sm:p-6'>
                                <h2 className='text-lg font-semibold text-white mb-4'>
                                    Real-time Charts
                                </h2>

                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                    {/* Temperature */}
                                    <div>
                                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2'>
                                            <h3 className='text-white font-medium'>
                                                Temperature
                                            </h3>
                                            <span className='text-2xl font-bold text-blue-400'>
                                                {lastTemp !== undefined
                                                    ? formatNumber(lastTemp, 2)
                                                    : '--'}
                                                °C
                                            </span>
                                        </div>
                                        <div className='text-xs text-gray-400 mb-2'>
                                            Min:{' '}
                                            {formatNumber(tempStats.min, 2)}°C |
                                            Max:{' '}
                                            {formatNumber(tempStats.max, 2)}°C
                                        </div>
                                        <div style={{ height: '200px' }}>
                                            <Line
                                                data={temperatureData}
                                                options={chartOptions}
                                            />
                                        </div>
                                    </div>

                                    {/* Voltage */}
                                    <div>
                                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2'>
                                            <h3 className='text-white font-medium'>
                                                Voltage
                                            </h3>
                                            <span className='text-2xl font-bold text-green-400'>
                                                {lastVolt !== undefined
                                                    ? formatNumber(lastVolt, 2)
                                                    : '--'}
                                                V
                                            </span>
                                        </div>
                                        <div className='text-xs text-gray-400 mb-2'>
                                            Min:{' '}
                                            {formatNumber(voltStats.min, 2)}V |
                                            Max:{' '}
                                            {formatNumber(voltStats.max, 2)}V
                                        </div>
                                        <div style={{ height: '200px' }}>
                                            <Line
                                                data={voltageData}
                                                options={chartOptions}
                                            />
                                        </div>
                                    </div>

                                    {/* Current */}
                                    <div>
                                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2'>
                                            <h3 className='text-white font-medium'>
                                                Current
                                            </h3>
                                            <span className='text-2xl font-bold text-amber-400'>
                                                {lastCurr !== undefined
                                                    ? formatNumber(lastCurr, 3)
                                                    : '--'}
                                                A
                                            </span>
                                        </div>
                                        <div className='text-xs text-gray-400 mb-2'>
                                            Min:{' '}
                                            {formatNumber(currStats.min, 3)}A |
                                            Max:{' '}
                                            {formatNumber(currStats.max, 3)}A
                                        </div>
                                        <div style={{ height: '200px' }}>
                                            <Line
                                                data={currentData}
                                                options={chartOptions}
                                            />
                                        </div>
                                    </div>

                                    {/* Battery */}
                                    <div>
                                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2'>
                                            <h3 className='text-white font-medium'>
                                                Battery Level
                                            </h3>
                                            <span className='text-2xl font-bold text-purple-400'>
                                                {lastBatt !== undefined
                                                    ? formatNumber(lastBatt, 0)
                                                    : '--'}
                                                %
                                            </span>
                                        </div>
                                        <div className='text-xs text-gray-400 mb-2'>
                                            Min:{' '}
                                            {formatNumber(battStats.min, 0)}% |
                                            Max:{' '}
                                            {formatNumber(battStats.max, 0)}%
                                        </div>
                                        <div style={{ height: '200px' }}>
                                            <Line
                                                data={batteryData}
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
                                                {toISOStringGMT3(
                                                    data.timestamp * 1000
                                                )}{' '}
                                                | TEMP:{' '}
                                                {data.temperature?.toFixed(2)}°C
                                                | VOLT:{' '}
                                                {data.voltage?.toFixed(2)}V |
                                                CURR: {data.current?.toFixed(3)}
                                                A | BAT:{' '}
                                                {data.battery_level?.toFixed(0)}
                                                %
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
                                                                {toLocaleStringGMT3(
                                                                    data.timestamp *
                                                                        1000
                                                                )}
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
