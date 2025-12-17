import { z } from 'zod';
import { randomUUID } from 'crypto';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { apiClient } from '~/lib/api';
import {
    MOCK_GROUND_STATIONS,
    MOCK_SATELLITES,
    USE_MOCK_DATA,
} from '~/lib/mockData';
import { calculatePasses, parseTLE } from '~/utils/passCalculator';

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
                minElevation: z.number().optional().default(10),
            })
        )
        .query(async ({ input }) => {
            if (USE_MOCK_DATA || process.env.USE_MOCK_PASSES === 'true') {
                const timeRange = input.endTime - input.startTime;
                const passesPerSatellite = Math.ceil(
                    timeRange / (6 * 60 * 60 * 1000)
                ); // ~1 pass every 6 hours

                const firstPassDelayMinutes = Number(process.env.FIRST_PASS_DELAY_MINUTES) || 2;
                const firstPassStartTime = input.startTime + (firstPassDelayMinutes * 60 * 1000);

                const passes = MOCK_SATELLITES.flatMap(
                    (satellite, satIndex) => {
                        return Array.from(
                            { length: passesPerSatellite },
                            (_, passIndex) => {
                                const passOffset =
                                    (satIndex * 1.5 + passIndex * 6) *
                                    60 *
                                    60 *
                                    1000;
                                const aos = firstPassStartTime + passOffset;
                                const duration =
                                    (5 + Math.random() * 10) * 60 * 1000; // 5-15 minutes

                                return {
                                    id: `pass-${satellite.id}-${passIndex}`,
                                    satelliteId: satellite.id,
                                    satelliteName: satellite.name,
                                    aos: aos,
                                    los: aos + duration,
                                    maxElevation: 20 + Math.random() * 50, // 20-70 degrees
                                };
                            }
                        );
                    }
                ).filter(
                    (pass) =>
                        pass.aos < input.endTime && pass.los > input.startTime
                );

                return passes.sort((a, b) => a.aos - b.aos);
            }

            try {
                // Fetch ground station data
                const groundStation = await apiClient.getGroundStationById(
                    input.groundStationId
                );

                if (!groundStation) {
                    throw new Error('Ground station not found');
                }

                // Fetch all satellites
                const satellites = await apiClient.getSatellites();

                // Calculate passes for each satellite over this ground station
                const allPasses = [];

                for (const satellite of satellites) {
                    if (!satellite.tle) continue;

                    // Parse TLE (handles 2 or 3 line format)
                    const tleData = parseTLE(satellite.tle);
                    if (!tleData) continue;

                    const { line1: tleLine1, line2: tleLine2 } = tleData;

                    // Calculate passes for this satellite
                    const passes = calculatePasses(
                        tleLine1,
                        tleLine2,
                        {
                            id: groundStation.id,
                            name: groundStation.name,
                            latitude: groundStation.latitude,
                            longitude: groundStation.longitude,
                            altitude: groundStation.altitude,
                        },
                        input.startTime,
                        input.endTime,
                        input.minElevation
                    );

                    // Transform to ground station pass format (satelliteId instead of groundStationId)
                    const transformedPasses = passes.map((pass) => ({
                        id: randomUUID(),
                        satelliteId: satellite.id,
                        satelliteName: satellite.name,
                        aos: pass.aos,
                        los: pass.los,
                        maxElevation: pass.maxElevation,
                    }));

                    allPasses.push(...transformedPasses);
                }

                // Sort by AOS time
                return allPasses.sort((a, b) => a.aos - b.aos);
            } catch (error) {
                console.error(
                    'Error calculating ground station passes:',
                    error
                );
                return [];
            }
        }),
});
