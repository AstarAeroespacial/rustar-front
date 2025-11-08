import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { apiClient } from '~/lib/api';
import { MOCK_GROUND_STATIONS, MOCK_SATELLITES, USE_MOCK_DATA } from '~/lib/mockData';

export const groundStationRouter = createTRPCRouter({
    getGroundStations: publicProcedure.query(async () => {
        if (USE_MOCK_DATA) {
            return MOCK_GROUND_STATIONS;
        }

        try {
            return await apiClient.getGroundStations();
        } catch (error) {
            console.warn('API unavailable, using mock data');
            return MOCK_GROUND_STATIONS;
        }
    }),

    getGroundStationById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            if (USE_MOCK_DATA) {
                return (
                    MOCK_GROUND_STATIONS.find((gs) => gs.id === input.id) ??
                    null
                );
            }

            try {
                return await apiClient.getGroundStationById(input.id);
            } catch (error) {
                console.warn('API unavailable, using mock data');
                return (
                    MOCK_GROUND_STATIONS.find((gs) => gs.id === input.id) ??
                    null
                );
            }
        }),

    getGroundStationPasses: publicProcedure
        .input(
            z.object({
                groundStationId: z.string(),
                startTime: z.number(),
                endTime: z.number(),
            })
        )
        .query(async ({ input }) => {
            // Mock implementation - returns passes for all satellites over this ground station
            const timeRange = input.endTime - input.startTime;
            const passesPerSatellite = Math.ceil(timeRange / (6 * 60 * 60 * 1000)); // ~1 pass every 6 hours

            const passes = MOCK_SATELLITES.flatMap((satellite, satIndex) => {
                return Array.from({ length: passesPerSatellite }, (_, passIndex) => {
                    const passOffset = (satIndex * 1.5 + passIndex * 6) * 60 * 60 * 1000;
                    const aos = input.startTime + passOffset;
                    const duration = (5 + Math.random() * 10) * 60 * 1000; // 5-15 minutes

                    return {
                        id: `pass-${satellite.id}-${passIndex}`,
                        satelliteId: satellite.id,
                        satelliteName: satellite.name,
                        aos: aos,
                        los: aos + duration,
                        maxElevation: 20 + Math.random() * 50, // 20-70 degrees
                    };
                });
            }).filter(pass => pass.aos < input.endTime && pass.los > input.startTime);

            return passes.sort((a, b) => a.aos - b.aos);
        }),
});

