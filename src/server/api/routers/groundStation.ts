import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { apiClient } from "~/lib/api";

export const groundStationRouter = createTRPCRouter({
  getGroundStations: publicProcedure.query(async () => {
    return apiClient.getGroundStations();
  }),

  getGroundStationById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return apiClient.getGroundStationById(input.id);
    }),
});

