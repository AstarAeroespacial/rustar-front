import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { apiClient } from '~/lib/api';
import {
    MOCK_SATELLITES,
    MOCK_TELEMETRY,
    MOCK_COMMANDS,
    MOCK_PASSES,
    USE_MOCK_DATA,
} from '~/lib/mockData';
import {
    calculatePassesForMultipleStations,
    parseTLE,
} from '~/utils/passCalculator';

export const satelliteRouter = createTRPCRouter({
    // Get historic telemetry data
    getHistoricTelemetry: publicProcedure
        .input(
            z.object({
                satellite: z.string(),
                startTime: z.number().optional(),
                endTime: z.number().optional(),
            })
        )
        .query(async ({ input }) => {
            return apiClient.getHistoricTelemetry(input.satellite, {
                startTime: input.startTime,
                endTime: input.endTime,
            });
        }),

    // Get latest telemetry data
    getLatestTelemetry: publicProcedure
        .input(
            z.object({
                satellite: z.string(),
                amount: z.number().optional(),
            })
        )
        .query(async ({ input }) => {
            if (USE_MOCK_DATA) {
                const amount = input.amount ?? 20;
                return MOCK_TELEMETRY.slice(0, amount);
            }

            try {
                return await apiClient.getLatestTelemetry(input.satellite, {
                    amount: input.amount,
                });
            } catch (error) {
                console.warn('API unavailable, using mock data');
                const amount = input.amount ?? 20;
                return MOCK_TELEMETRY.slice(0, amount);
            }
        }),

    // Send command to satellite
    sendCommand: publicProcedure
        .input(
            z.object({
                number: z.number(),
                message: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            return apiClient.sendCommand(input);
        }),

    // Get configuration
    getConfig: publicProcedure.query(async () => {
        return apiClient.getConfig();
    }),

    // Get satellites from API
    getSatellites: publicProcedure.query(async () => {
        if (USE_MOCK_DATA) {
            return MOCK_SATELLITES;
        }

        try {
            return await apiClient.getSatellites();
        } catch (error) {
            console.warn('API unavailable, using mock data');
            return MOCK_SATELLITES;
        }
    }),

    getSatelliteById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            if (USE_MOCK_DATA) {
                return (
                    MOCK_SATELLITES.find((sat) => sat.id === input.id) ?? null
                );
            }

            try {
                return await apiClient.getSatelliteById(input.id);
            } catch (error) {
                console.warn('API unavailable, using mock data');
                return (
                    MOCK_SATELLITES.find((sat) => sat.id === input.id) ?? null
                );
            }
        }),

    // Update satellite data
    updateSatellite: publicProcedure
        .input(
            z.object({
                id: z.string(),
                tle: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            // Mock implementation - would call actual API
            console.log(
                `Updating satellite ${input.id} with new TLE:`,
                input.tle
            );
            return { success: true };
        }),

    // Get available commands
    getAvailableCommands: publicProcedure.query(async () => {
        if (USE_MOCK_DATA) {
            return MOCK_COMMANDS;
        }

        // Mock implementation - would call actual API endpoint
        return [
            {
                id: 'REBOOT',
                name: 'Restart System',
                description: "Restart the satellite's main computer",
                category: 'system' as const,
                requiresConfirmation: true,
            },
            {
                id: 'STATUS_CHECK',
                name: 'Status Check',
                description: 'Verify operational status of all systems',
                category: 'telemetry' as const,
                requiresConfirmation: false,
            },
            {
                id: 'UPDATE_SOFTWARE',
                name: 'Update Software',
                description: 'Fetch and apply the latest software patches',
                category: 'maintenance' as const,
                requiresConfirmation: true,
            },
            {
                id: 'ADJUST_POWER',
                name: 'Adjust Power',
                description: 'Modify power distribution settings',
                category: 'control' as const,
                requiresConfirmation: true,
            },
            {
                id: 'SIGNAL_TEST',
                name: 'Signal Test',
                description: 'Test communication signal strength',
                category: 'telemetry' as const,
                requiresConfirmation: false,
            },
            {
                id: 'ANTENNA_ADJUST',
                name: 'Antenna Adjustment',
                description: 'Adjust antenna orientation',
                category: 'control' as const,
                requiresConfirmation: true,
            },
        ];
    }),

    // Get satellite passes over ground stations
    getSatellitePasses: publicProcedure
        .input(
            z.object({
                satelliteId: z.string(),
                startTime: z.number(),
                endTime: z.number(),
                minElevation: z.number().optional().default(10),
            })
        )
        .query(async ({ input }) => {
            if (USE_MOCK_DATA || process.env.USE_MOCK_PASSES === 'true') {
                return MOCK_PASSES(
                    input.satelliteId,
                    input.startTime,
                    input.endTime
                );
            }

            try {
                // Fetch satellite data (with TLE)
                const satellite = await apiClient.getSatelliteById(
                    input.satelliteId
                );

                if (!satellite || !satellite.tle) {
                    throw new Error('Satellite or TLE not found');
                }

                // Parse TLE (handles 2 or 3 line format)
                const tleData = parseTLE(satellite.tle);
                if (!tleData) {
                    throw new Error('Invalid TLE format');
                }
                const { line1: tleLine1, line2: tleLine2 } = tleData;

                // Fetch all ground stations
                const groundStations = await apiClient.getGroundStations();

                const stations = groundStations.map((gs) => ({
                    id: gs.id,
                    name: gs.name,
                    latitude: gs.latitude,
                    longitude: gs.longitude,
                    altitude: gs.altitude,
                }));

                // Calculate passes using satellite.js
                const passes = calculatePassesForMultipleStations(
                    tleLine1!,
                    tleLine2!,
                    stations,
                    input.startTime,
                    input.endTime,
                    input.minElevation
                );

                return passes;
            } catch (error) {
                console.error('Error calculating satellite passes:', error);
                // Return empty array on error
                return [];
            }
        }),
});
