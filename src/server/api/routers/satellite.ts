import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { apiClient } from "~/lib/api";

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
      return apiClient.getLatestTelemetry(input.satellite, {
        amount: input.amount,
      });
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

  // Mock satellite list for now (since API doesn't have this endpoint)
  getSatellites: publicProcedure.query(async () => {
    // This would ideally come from the API, but for now we'll mock it
    return [
      {
        id: "SAT-01A",
        name: "Satellite 1",
        status: "active" as const,
        lastContact: new Date(),
        position: {
          latitude: -34.0522,
          longitude: -118.2437,
          altitude: 500,
        },
      },
      {
        id: "SAT-02B",
        name: "Satellite 2", 
        status: "active" as const,
        lastContact: new Date(),
        position: {
          latitude: 40.7128,
          longitude: -74.0060,
          altitude: 600,
        },
      },
      {
        id: "SAT-03C",
        name: "Satellite 3",
        status: "inactive" as const,
        lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        position: {
          latitude: 51.5074,
          longitude: -0.1278,
          altitude: 550,
        },
      },
    ];
  }),
});
