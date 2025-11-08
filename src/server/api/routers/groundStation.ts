import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { apiClient } from '~/lib/api';
import { MOCK_GROUND_STATIONS, USE_MOCK_DATA } from '~/lib/mockData';

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
});
