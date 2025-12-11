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
    {
        id: 'ASTAR-003',
        name: 'ASTAR-003',
        tle: '1 40967U 15052B   24345.51782528  .00000456  00000-0  23456-4 0  9992\n2 40967  97.4321 234.5678 0002345  67.8901  23.4567 14.98765432234567',
        downlink_frequency: 436.75,
        uplink_frequency: 145.95,
        last_contact: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
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
    endTime: number
) => {
    const passes = [];
    const duration = endTime - startTime;
    const numPasses = 3;

    for (let i = 0; i < numPasses; i++) {
        const aos =
            startTime +
            (duration / numPasses) * i +
            Math.random() * (duration / numPasses / 2);
        const los = aos + 5 * 60 * 1000 + Math.random() * (10 * 60 * 1000); // 5-15 minute passes

        passes.push({
            id: `pass-${satelliteId}-${i}`,
            groundStationId: String((i % 3) + 1),
            groundStationName:
                MOCK_GROUND_STATIONS[i % 3]?.name || 'Unknown Station',
            aos,
            los,
            maxElevation: 30 + Math.random() * 60, // 30-90 degrees
        });
    }

    return passes;
};

export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
