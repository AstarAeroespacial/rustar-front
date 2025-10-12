import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const groundStationRouter = createTRPCRouter({
  // Get all ground stations
  getGroundStations: publicProcedure.query(async () => {
    // Mock data - this would come from your backend API
    return [
      {
        id: "GS-001",
        name: "Buenos Aires Ground Station",
        location: {
          latitude: -34.6037,
          longitude: -58.3816,
          altitude: 25,
        },
        status: "active" as const,
        trackingSatellite: {
          id: "SAT-01A",
          name: "Satellite 1",
          tle: {
            line1: "1 25544U 98067A   21001.00000000  .00002182  00000-0  40864-4 0  9990",
            line2: "2 25544  51.6461 339.7939 0001882  83.2943 276.8623 15.48919103260532",
          },
        },
        lastUpdate: new Date(),
      },
      {
        id: "GS-002", 
        name: "Córdoba Ground Station",
        location: {
          latitude: -31.4201,
          longitude: -64.1888,
          altitude: 390,
        },
        status: "active" as const,
        trackingSatellite: {
          id: "SAT-02B",
          name: "Satellite 2",
          tle: {
            line1: "1 25544U 98067A   21001.00000000  .00002182  00000-0  40864-4 0  9991",
            line2: "2 25544  51.6461 339.7939 0001882  83.2943 276.8623 15.48919103260533",
          },
        },
        lastUpdate: new Date(),
      },
      {
        id: "GS-003",
        name: "Mendoza Ground Station", 
        location: {
          latitude: -32.8895,
          longitude: -68.8458,
          altitude: 760,
        },
        status: "maintenance" as const,
        trackingSatellite: undefined,
        lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: "GS-004",
        name: "Ushuaia Ground Station",
        location: {
          latitude: -54.8019,
          longitude: -68.3030,
          altitude: 30,
        },
        status: "inactive" as const,
        trackingSatellite: undefined,
        lastUpdate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      },
    ];
  }),

  // Update ground station's tracking satellite TLE
  updateStationTLE: publicProcedure
    .input(
      z.object({
        stationId: z.string(),
        satelliteId: z.string(),
        satelliteName: z.string(),
        tle: z.object({
          line1: z.string(),
          line2: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      // This would update the ground station's tracking satellite in your backend
      // For now, we'll just return success
      console.log(`Updating station ${input.stationId} to track satellite ${input.satelliteId} with new TLE`);
      
      return {
        success: true,
        message: `Ground station ${input.stationId} updated to track ${input.satelliteName}`,
      };
    }),

  // Get a specific ground station
  getGroundStation: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // This would fetch a specific ground station from your backend
      // For now, we'll return mock data for the first station
      return {
        id: input.id,
        name: "Ground Station " + input.id,
        location: {
          latitude: -34.6037,
          longitude: -58.3816,
          altitude: 25,
        },
        status: "active" as const,
        trackingSatellite: {
          id: "SAT-01A",
          name: "Satellite 1",
          tle: {
            line1: "1 25544U 98067A   21001.00000000  .00002182  00000-0  40864-4 0  9990",
            line2: "2 25544  51.6461 339.7939 0001882  83.2943 276.8623 15.48919103260532",
          },
        },
        lastUpdate: new Date(),
      };
    }),
});
