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
        name: "NOAA-18",
        status: "active" as const,
        lastContact: new Date(),
        position: {
          latitude: -34.0522,
          longitude: -118.2437,
          altitude: 500,
        },
        tle: {
          line1: "1 28654U 05018A   21001.00000000  .00000123  00000-0  62441-4 0  9990",
          line2: "2 28654  99.0090 161.3312 0013718  73.9446 286.4082 14.12501715804977"
        },
      },
      {
        id: "SAT-02B",
        name: "ISS (ZARYA)", 
        status: "active" as const,
        lastContact: new Date(),
        position: {
          latitude: 40.7128,
          longitude: -74.0060,
          altitude: 600,
        },
        tle: {
          line1: "1 25544U 98067A   21001.00000000  .00002182  00000-0  40864-4 0  9990",
          line2: "2 25544  51.6461 339.7939 0001882  83.2943 276.8623 15.48919103260532"
        },
      },
      {
        id: "SAT-03C",
        name: "METEOR-M2",
        status: "inactive" as const,
        lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        position: {
          latitude: 51.5074,
          longitude: -0.1278,
          altitude: 550,
        },
        tle: {
          line1: "1 40069U 14037A   21001.00000000  .00000045  00000-0  28493-4 0  9991",
          line2: "2 40069  98.5901 167.4296 0002467  95.8922 264.3564 14.20654800346094"
        },
      },
    ];
  }),

  // Get satellite by ID
  getSatelliteById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Mock implementation - would call actual API
      const satellites = [
        {
          id: "SAT-01A",
          name: "NOAA-18",
          status: "active" as const,
          lastContact: new Date(),
          position: {
            latitude: -34.0522,
            longitude: -118.2437,
            altitude: 500,
          },
          tle: {
            line1: "1 28654U 05018A   21001.00000000  .00000123  00000-0  62441-4 0  9990",
            line2: "2 28654  99.0090 161.3312 0013718  73.9446 286.4082 14.12501715804977"
          },
        },
        {
          id: "SAT-02B",
          name: "ISS (ZARYA)", 
          status: "active" as const,
          lastContact: new Date(),
          position: {
            latitude: 40.7128,
            longitude: -74.0060,
            altitude: 600,
          },
          tle: {
            line1: "1 25544U 98067A   21001.00000000  .00002182  00000-0  40864-4 0  9990",
            line2: "2 25544  51.6461 339.7939 0001882  83.2943 276.8623 15.48919103260532"
          },
        },
        {
          id: "SAT-03C",
          name: "METEOR-M2",
          status: "inactive" as const,
          lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000),
          position: {
            latitude: 51.5074,
            longitude: -0.1278,
            altitude: 550,
          },
          tle: {
            line1: "1 40069U 14037A   21001.00000000  .00000045  00000-0  28493-4 0  9991",
            line2: "2 40069  98.5901 167.4296 0002467  95.8922 264.3564 14.20654800346094"
          },
        },
      ];
      
      return satellites.find(sat => sat.id === input.id) || null;
    }),

  // Update satellite data
  updateSatellite: publicProcedure
    .input(z.object({
      id: z.string(),
      tle: z.object({
        line1: z.string(),
        line2: z.string(),
      }),
    }))
    .mutation(async ({ input }) => {
      // Mock implementation - would call actual API
      console.log(`Updating satellite ${input.id} with new TLE:`, input.tle);
      return { success: true };
    }),
});
