import type {
    Satellite,
    GroundStation,
    TelemetryResponse,
    AvailableCommand,
    Command,
} from '~/types/api';

export const MOCK_SATELLITES: Satellite[] = [
    {
        id: 'ASTAR-001',
        name: 'ASTAR-001',
        tle: '1 25544U 98067A   24345.51782528  .00016717  00000-0  10270-3 0  9005\n2 25544  51.6412 247.4627 0006703 130.5360 325.0288 15.48908950314314',
        downlink_frequency: 437.425,
        uplink_frequency: 145.825,
        last_contact: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
        id: 'ASTAR-002',
        name: 'ASTAR-002',
        tle: '1 43013U 17073A   24345.51782528  .00000123  00000-0  12345-4 0  9991\n2 43013  98.2123 123.4567 0001234  45.6789  12.3456 14.19876543123456',
        downlink_frequency: 437.5,
        uplink_frequency: 145.9,
        last_contact: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
];

export const MOCK_GROUND_STATIONS: GroundStation[] = [
    {
        id: 'GS_BSAS_01',
        name: 'Buenos Aires',
        latitude: -34.6037,
        longitude: -58.3816,
        altitude: 25,
    },
    {
        id: 'GS_CBA_01',
        name: 'Córdoba',
        latitude: -31.4201,
        longitude: -64.1888,
        altitude: 390,
    },
    {
        id: 'GS_MZA_01',
        name: 'Mendoza',
        latitude: -32.8895,
        longitude: -68.8458,
        altitude: 760,
    },
    {
        id: 'GS_USH_01',
        name: 'Ushuaia',
        latitude: -54.8019,
        longitude: -68.303,
        altitude: 30,
    },
];

export const MOCK_TELEMETRY: TelemetryResponse[] = Array.from(
    { length: 20 },
    (_, i) => ({
        id: 20 - i,
        timestamp: Math.floor(Date.now() / 1000) - i * 300, // 5 minute intervals
        temperature: 20 + Math.random() * 10 - 5,
        voltage: 12 + Math.random() * 2 - 1,
        current: 2 + Math.random() * 0.5 - 0.25,
        battery_level: 85 + Math.random() * 10 - 5, // 80-90%
    })
);

export const MOCK_COMMANDS: AvailableCommand[] = [
    {
        id: '1',
        name: 'Power On',
        description: 'Turn on satellite subsystem',
        category: 'control',
        requiresConfirmation: false,
    },
    {
        id: '2',
        name: 'Power Off',
        description: 'Turn off satellite subsystem',
        category: 'control',
        requiresConfirmation: true,
    },
    {
        id: '3',
        name: 'Reset',
        description: 'Reset satellite computer',
        category: 'system',
        requiresConfirmation: true,
    },
    {
        id: '4',
        name: 'Deploy Antenna',
        description: 'Deploy communication antenna',
        category: 'control',
        requiresConfirmation: true,
    },
    {
        id: '5',
        name: 'Camera Capture',
        description: 'Take a photo',
        category: 'telemetry',
        requiresConfirmation: false,
    },
];

export const MOCK_COMMAND_HISTORY: Command[] = [
    {
        id: '1',
        satellite: 'ASTAR-001',
        command: 'Power On',
        status: 'success',
        timestamp: new Date(Date.now() - 3600000),
    },
    {
        id: '2',
        satellite: 'ASTAR-001',
        command: 'Camera Capture',
        status: 'success',
        timestamp: new Date(Date.now() - 7200000),
    },
    {
        id: '3',
        satellite: 'ASTAR-001',
        command: 'Reset',
        status: 'failed',
        timestamp: new Date(Date.now() - 10800000),
        response: 'Connection timeout',
    },
];

export const MOCK_PASSES = (
    satelliteId: string,
    startTime: number,
    endTime: number,
    groundStations?: GroundStation[]
) => {
    const passes = [];
    const firstPassDelayMinutes = Number(process.env.FIRST_PASS_DELAY_MINUTES) || 2;
    const firstPassStartTime = startTime + (firstPassDelayMinutes * 60 * 1000);
    const duration = endTime - firstPassStartTime;
    const stations = groundStations || MOCK_GROUND_STATIONS;
    const numPasses = 8;

    for (let i = 0; i < numPasses; i++) {
        const aos =
            i === 0
                ? firstPassStartTime
                : firstPassStartTime +
                  (duration / numPasses) * i +
                  Math.random() * (duration / numPasses / 2);
        const los = aos + 5 * 60 * 1000 + Math.random() * (10 * 60 * 1000); // 5-15 minute passes

        passes.push({
            id: `pass-${satelliteId}-${i}`,
            groundStationId: stations[i % stations.length]?.id || 'Unknown Station',
            groundStationName:
                stations[i % stations.length]?.name || 'Unknown Station',
            aos,
            los,
            maxElevation: 30 + Math.random() * 60, // 30-90 degrees
        });
    }

    return passes;
};

export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
