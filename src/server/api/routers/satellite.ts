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
            })
        )
        .query(async ({ input }) => {
            if (USE_MOCK_DATA) {
                return MOCK_PASSES(
                    input.satelliteId,
                    input.startTime,
                    input.endTime
                );
            }

            // Mock implementation - would calculate actual passes using satellite.js
            const now = Date.now();

            return [
                {
                    id: 'pass-1',
                    groundStationId: 'GS_BSAS_01',
                    groundStationName: 'Buenos Aires',
                    aos: now + 2 * 60 * 60 * 1000, // 2 hours from now
                    los: now + 2.15 * 60 * 60 * 1000, // 9 minutes later
                    maxElevation: 45.2,
                },
                {
                    id: 'pass-2',
                    groundStationId: 'GS_CBA_01',
                    groundStationName: 'Córdoba',
                    aos: now + 5 * 60 * 60 * 1000, // 5 hours from now
                    los: now + 5.12 * 60 * 60 * 1000, // 7 minutes later
                    maxElevation: 38.5,
                },
                {
                    id: 'pass-3',
                    groundStationId: 'GS_BSAS_01',
                    groundStationName: 'Buenos Aires',
                    aos: now + 8 * 60 * 60 * 1000, // 8 hours from now
                    los: now + 8.18 * 60 * 60 * 1000, // 11 minutes later
                    maxElevation: 52.1,
                },
                {
                    id: 'pass-4',
                    groundStationId: 'GS_MZA_01',
                    groundStationName: 'Mendoza',
                    aos: now + 10 * 60 * 60 * 1000, // 10 hours from now
                    los: now + 10.1 * 60 * 60 * 1000, // 6 minutes later
                    maxElevation: 31.8,
                },
            ];
        }),
});
